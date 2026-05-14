# Stack Research — Installer Hardening (v1.6)

**Domain:** Node.js CLI installer hardening — atomic writes, YAML frontmatter parsing, settings schema validation, template preservation
**Researched:** 2026-04-16
**Confidence:** HIGH

**Constraint:** Zero npm dependencies. Everything must use Node.js 20+ built-ins (`fs`, `path`, `os`, `crypto`).

---

## Recommended Stack

### Core Technologies (All Node.js Built-ins)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **`node:fs`** (writeFileSync + renameSync) | Node 20+ | Atomic file writes | POSIX `rename()` is atomic within the same filesystem. Write to a temp file in the same directory, then `fs.renameSync()` to the target. No npm package needed — `write-file-atomic` does the same thing but adds a dependency. |
| **`node:crypto`** (randomUUID) | Node 20+ | Unique temp file names | `crypto.randomUUID()` is available since Node 14.17. Generates collision-free temp file names like `.target.tmp.${uuid}`. No need for `mkdtempSync` since temp files should live in the same directory as the target (same-filesystem rename requirement). |
| **Custom frontmatter parser** | N/A | YAML frontmatter extraction | Node.js has no built-in YAML parser. But Scriveno's frontmatter is trivial (2-3 keys: `description`, `argument-hint`). A targeted regex-free line parser handles colon-in-value correctly where the current regex fails. No need for `gray-matter`, `js-yaml`, or any npm package. |
| **Custom schema validator** | N/A | Settings.json validation | Node.js has no built-in JSON Schema validator. Ajv is overkill for validating a 10-field settings object. A hand-written validator with explicit field checks, type assertions, and human-readable error messages is clearer, smaller, and dependency-free. |

### Supporting Patterns

| Pattern | Purpose | When to Use |
|---------|---------|-------------|
| **Write-to-temp-then-rename** | Atomic file creation | Every `fs.writeFileSync` call in the installer that writes to a user-facing path (settings.json, command files, manifests, SKILL.md) |
| **First-colon split** | Frontmatter value parsing | Replace `readFrontmatterValue` regex with a parser that splits only on the first colon, preserving colons in values like `"Generate a plan: outline your story's structure"` |
| **Merge-on-write settings** | Settings preservation across reinstalls | Read existing settings.json, deep-merge user-modified fields (like custom paths or preferences) with installer-written fields, write merged result |
| **File-hash comparison** | Template preservation | Before overwriting a template, compare SHA-256 hash of source vs installed. If installed differs from both current and previous source hashes, the user modified it — skip or back up. |

---

## Atomic File Writes

### The Problem

The current installer uses bare `fs.writeFileSync()` and `fs.copyFileSync()` everywhere (lines 509, 658, 849, 863-864, 889, 913-916, 942). If the process is interrupted (Ctrl+C, crash, disk full), files can be left half-written or empty, corrupting the installation.

### The Solution: Write-Temp-Rename

```javascript
const crypto = require('crypto');

function atomicWriteFileSync(targetPath, content, options) {
  const tmpPath = `${targetPath}.tmp.${crypto.randomUUID()}`;
  try {
    fs.writeFileSync(tmpPath, content, options);
    fs.renameSync(tmpPath, targetPath);
  } catch (err) {
    try { fs.unlinkSync(tmpPath); } catch {}
    throw err;
  }
}

function atomicCopyFileSync(srcPath, destPath) {
  const tmpPath = `${destPath}.tmp.${crypto.randomUUID()}`;
  try {
    fs.copyFileSync(srcPath, tmpPath);
    fs.renameSync(tmpPath, destPath);
  } catch (err) {
    try { fs.unlinkSync(tmpPath); } catch {}
    throw err;
  }
}
```

### Why This Works

- **POSIX guarantee:** `rename()` within the same filesystem is atomic. The temp file is in the same directory as the target, so it is on the same filesystem.
- **Failure safety:** If `writeFileSync` fails (disk full, permissions), the temp file is cleaned up and the original file is untouched.
- **Interrupt safety:** If the process is killed between write and rename, only a `.tmp.{uuid}` file is left behind — the target is untouched. Stale temp files can be cleaned on next install.
- **No cross-device risk:** Temp file is adjacent to target (`${targetPath}.tmp.{uuid}`), never in `/tmp` or `os.tmpdir()`. This avoids the EXDEV error that occurs when renaming across filesystems.

### Where to Apply

Replace every `fs.writeFileSync` and `fs.copyFileSync` in the installer with the atomic versions. The `copyDir` function (line 648) should use `atomicCopyFileSync` internally.

---

## Frontmatter Parsing Fix

### The Problem

The current `readFrontmatterValue` function (line 292-295) uses a regex:

```javascript
const match = content.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
return match ? stripWrappingQuotes(match[1]) : '';
```

This works for simple values but **truncates values containing colons** because `(.+)` captures everything after the first colon correctly — the actual bug is likely in how values with colons interact with `stripWrappingQuotes` or in edge cases with multi-line values. The regex itself captures the full line after `key:`, but if the YAML value is quoted and contains colons, the parsing can fail.

### The Solution: Line-Based Frontmatter Parser

```javascript
function parseFrontmatter(content) {
  if (!content.startsWith('---\n')) return {};
  const endIndex = content.indexOf('\n---', 4);
  if (endIndex === -1) return {};

  const frontmatterBlock = content.slice(4, endIndex);
  const result = {};

  for (const line of frontmatterBlock.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    const rawValue = line.slice(colonIndex + 1).trim();
    result[key] = stripWrappingQuotes(rawValue);
  }

  return result;
}
```

### Why This Approach

- **First-colon split:** `line.indexOf(':')` finds the first colon only. Everything after it is the value, regardless of how many colons appear in the value.
- **No regex:** Simpler to reason about, no backtracking edge cases.
- **Returns all fields at once:** Parse frontmatter once per file, access fields by key. More efficient than running a regex per field.
- **Handles the actual bug:** A description like `"Generate a plan: outline structure"` is correctly preserved because we split on the first colon only.

### Migration Path

Replace `readFrontmatterValue(content, key)` calls (line 333-334) with:
```javascript
const meta = parseFrontmatter(content);
const description = meta.description || commandTail.replace(/[:\-]/g, ' ');
const argumentHint = meta['argument-hint'] || '';
```

---

## Settings Schema Validation

### The Problem

The current installer writes `settings.json` (line 931-943) but never validates it on read. If a user manually edits settings.json with invalid values (wrong types, missing required fields, unknown keys), the installer silently proceeds with bad state.

### The Solution: Hand-Written Validator

```javascript
const SETTINGS_SCHEMA = {
  version: { type: 'string', required: true },
  runtime: { type: 'string', required: true, enum: Object.keys(RUNTIMES) },
  runtimes: { type: 'array', required: true, itemType: 'string' },
  scope: { type: 'string', required: true, enum: ['global', 'project'] },
  developer_mode: { type: 'boolean', required: true },
  data_dir: { type: 'string', required: true },
  install_mode: { type: 'string', required: false },
  installed_at: { type: 'string', required: true },
};

function validateSettings(settings) {
  const errors = [];
  if (!settings || typeof settings !== 'object') {
    return { valid: false, errors: ['Settings must be a JSON object'] };
  }

  for (const [key, rule] of Object.entries(SETTINGS_SCHEMA)) {
    const value = settings[key];
    if (value === undefined || value === null) {
      if (rule.required) errors.push(`Missing required field: "${key}"`);
      continue;
    }
    if (rule.type === 'array') {
      if (!Array.isArray(value)) {
        errors.push(`"${key}" must be an array, got ${typeof value}`);
      } else if (rule.itemType) {
        for (let i = 0; i < value.length; i++) {
          if (typeof value[i] !== rule.itemType) {
            errors.push(`"${key}[${i}]" must be ${rule.itemType}, got ${typeof value[i]}`);
          }
        }
      }
    } else if (typeof value !== rule.type) {
      errors.push(`"${key}" must be ${rule.type}, got ${typeof value}`);
    }
    if (rule.enum && !rule.enum.includes(value)) {
      errors.push(`"${key}" must be one of [${rule.enum.join(', ')}], got "${value}"`);
    }
  }

  return { valid: errors.length === 0, errors };
}
```

### Why Not Ajv or JSON Schema

- **Zero dependencies:** Ajv is 150 KB+ and brings transitive dependencies. The settings object has 8 fields.
- **Human-readable errors:** A hand-written validator produces messages like `"scope" must be one of [global, project], got "both"` — clearer than JSON Schema validation errors.
- **Exact fit:** The validator checks exactly what Scriveno needs. No unused spec surface area.

### When to Validate

1. **On read:** When the installer reads an existing settings.json to preserve user settings during reinstall.
2. **On write:** Before writing the merged settings object, validate it to catch bugs in the merge logic.
3. **Fail loudly:** Print validation errors with `c('yellow', ...)` warnings and describe what will be reset to defaults.

---

## Template and Settings Preservation

### The Problem

The current `writeSharedAssets` function (line 922-943) does `removePathIfExists` on the templates and data directories, then copies fresh versions. This wipes any user customizations to templates. Settings.json is overwritten entirely.

### The Solution: Hash-Based Template Preservation

```javascript
function fileHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function safeCopyFile(srcPath, destPath) {
  if (!fs.existsSync(destPath)) {
    atomicCopyFileSync(srcPath, destPath);
    return 'created';
  }

  const srcHash = fileHash(srcPath);
  const destHash = fileHash(destPath);

  if (srcHash === destHash) {
    return 'unchanged';  // Already up to date
  }

  // Destination differs from source — user may have customized it
  // Back up and replace
  const backupPath = `${destPath}.backup.${Date.now()}`;
  fs.copyFileSync(destPath, backupPath);
  atomicCopyFileSync(srcPath, destPath);
  return 'updated-with-backup';
}
```

### Settings Merge Strategy

```javascript
function mergeSettings(existing, incoming) {
  // Installer-controlled fields: always overwrite
  const merged = {
    ...incoming,
  };

  // User-controlled fields: preserve from existing if present
  const USER_FIELDS = ['developer_mode'];
  for (const field of USER_FIELDS) {
    if (existing && existing[field] !== undefined) {
      merged[field] = existing[field];
    }
  }

  return merged;
}
```

### Which Fields Are User-Controlled

| Field | Owner | Rationale |
|-------|-------|-----------|
| `version` | Installer | Must match installed version |
| `runtime` | Installer | Set at install time |
| `runtimes` | Installer | Set at install time |
| `scope` | Installer | Set at install time |
| `developer_mode` | **User** | User preference, survive reinstall |
| `data_dir` | Installer | Derived from scope |
| `install_mode` | Installer | Set at install time |
| `installed_at` | Installer | Timestamp of current install |

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Hand-rolled atomic write | `write-file-atomic` (npm) | Never — it does the same temp+rename but adds a dependency. Scriveno's zero-dep constraint rules it out. |
| Line-based frontmatter parser | `gray-matter` (npm) | Never — gray-matter pulls in `js-yaml` which is 60 KB. Scriveno's frontmatter is 2-3 simple key-value pairs. |
| Hand-rolled schema validator | Ajv (npm) | Never — 150 KB+ with transitive deps. Settings has 8 fields. |
| `crypto.randomUUID()` | `Date.now()` for temp file names | Never — `Date.now()` can collide if two installs run in the same millisecond. UUID is collision-proof. |
| Same-directory temp files | `os.tmpdir()` temp files | Never — `rename()` across filesystems fails with EXDEV. Same-directory guarantees same filesystem. |
| Hash-based template preservation | Timestamp-based comparison | Never — timestamps are unreliable across git clones, npm installs, and different filesystems. Content hash is the only reliable comparison. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **`write-file-atomic` (npm)** | Adds a runtime dependency to a zero-dependency project | `writeFileSync` + `renameSync` in same directory |
| **`gray-matter` / `js-yaml` (npm)** | 60 KB+ dependency for parsing 2 YAML fields | Line-based first-colon-split parser (20 lines of code) |
| **Ajv / `jsonschema` (npm)** | 150 KB+ for validating an 8-field object | Hand-written validator with human-readable errors |
| **`os.tmpdir()` for temp files** | Cross-filesystem rename fails with EXDEV | Temp files adjacent to target: `${targetPath}.tmp.${uuid}` |
| **`fs.mkdtempSync()`** | Creates temp directories in system temp dir (cross-filesystem risk) | UUID-named temp files in the target directory |
| **Full YAML parser** | Scriveno frontmatter is `key: value` pairs only — no arrays, nesting, or anchors | Simple line parser with first-colon split |
| **JSON Schema (the spec)** | Spec is complex, implementations are heavy, error messages are cryptic | Imperative validation with explicit field checks |

---

## Version Compatibility

| API | Available Since | Notes |
|-----|-----------------|-------|
| `crypto.randomUUID()` | Node 14.17 / 19.0 (stable) | Safe for Node 20+ baseline. Synchronous, no callback needed. |
| `fs.renameSync()` | Node 0.x | Stable since forever. POSIX atomic on macOS/Linux. |
| `fs.copyFileSync()` | Node 8.5 | Used in `atomicCopyFileSync`. |
| `crypto.createHash('sha256')` | Node 0.x | For file content hashing in template preservation. |
| `fs.rmSync()` | Node 14.14 | Already used in the installer. |

All APIs are well within the Node 20+ baseline. No version risk.

---

## Integration Points with Existing Installer

| Current Function | Change Needed | Impact |
|------------------|---------------|--------|
| `copyDir()` (line 648) | Use `atomicCopyFileSync` internally instead of `fs.copyFileSync` | All runtime installers get atomic writes automatically |
| `readFrontmatterValue()` (line 292) | Replace with `parseFrontmatter()` returning all fields | `collectCommandEntries()` calls this — update to use parsed object |
| `writeSharedAssets()` (line 922) | Add settings merge logic and template preservation | Existing settings and user-modified templates survive reinstall |
| `writeInstalledCommandManifest()` (line 499) | Use `atomicWriteFileSync` | Manifest corruption on interrupt is prevented |
| `writeCodexSkillManifest()` (line 720) | Use `atomicWriteFileSync` | Same |
| `installClaudeCommandRuntime()` (line 833) | Use `atomicWriteFileSync` for each command file | Partial command file writes are prevented |
| `generateClaudeCommandContent()` (line 448) | No change — this generates content, doesn't write | N/A |
| `rewriteInstalledCommandRefs()` (line 439) | Extend to support all runtime invocation styles, not just Claude | Command-ref rewriting becomes runtime-aware |

---

## Sources

- [Node.js fs documentation](https://nodejs.org/api/fs.html) — renameSync, writeFileSync, copyFileSync APIs
- [POSIX rename() specification](https://pubs.opengroup.org/onlinepubs/9699919799/functions/rename.html) — atomic rename guarantee within same filesystem
- [write-file-atomic (npm)](https://github.com/npm/write-file-atomic) — reference implementation of the same temp+rename pattern Scriveno should use natively
- [Node.js crypto.randomUUID](https://nodejs.org/api/crypto.html#cryptorandomuuidoptions) — available since Node 14.17
- [gray-matter](https://github.com/jonschlinkert/gray-matter) — evaluated and rejected due to dependency chain
- [Ajv](https://ajv.js.org/) — evaluated and rejected due to size and zero-dep constraint

---
*Stack research for: Scriveno v1.6 Installer Hardening*
*Researched: 2026-04-16*
