# Architecture Patterns

**Domain:** Installer hardening for a single-file Node.js CLI installer
**Researched:** 2026-04-16
**Confidence:** HIGH (all patterns are well-understood Node.js filesystem operations applied to known code)

---

## Current Architecture Summary

`bin/install.js` is a single 1035-line Node.js file with zero npm dependencies. It:

1. Parses CLI args or runs interactive prompts to select runtime(s), scope, and mode
2. Dispatches to runtime-specific install functions (`installClaudeCommandRuntime`, `installCodexRuntime`, `installCommandRuntime`, `installManifestSkillRuntime`, `installGuidedRuntime`)
3. Calls `writeSharedAssets()` to copy templates, data files, and write `settings.json`
4. All file I/O uses `fs.writeFileSync`, `fs.copyFileSync`, `fs.rmSync`, and `fs.mkdirSync`

**Key functions affected by hardening:**

| Function | Lines | Role | Hardening Features Affected |
|----------|-------|------|-----------------------------|
| `readFrontmatterValue()` | 292-295 | Parses YAML frontmatter via regex | Frontmatter parsing |
| `writeSharedAssets()` | 922-943 | Copies templates/data, writes settings.json | Atomic writes, settings preservation |
| `copyDir()` | 648-663 | Recursive directory copy | Atomic writes |
| `rewriteInstalledCommandRefs()` | 439-441 | Replaces `/scr:` refs in installed command content | Multi-runtime command-ref rewriting |
| `generateClaudeCommandContent()` | 448-451 | Rewrites content for Claude Code only | Multi-runtime command-ref rewriting |
| `installCommandRuntime()` | 821-830 | Generic runtime install (Cursor, Gemini, etc.) | Multi-runtime rewriting, atomic writes |
| `removePathIfExists()` | 422-425 | Destructive delete before copy | Settings preservation |
| `writeInstalledCommandManifest()` | 499-509 | Writes `.scriveno-installed.json` | Atomic writes |
| `writeCodexSkillManifest()` | 720-729 | Writes Codex skill manifest | Atomic writes |

---

## Recommended Architecture: Integration Plan for 5 Hardening Features

All 5 features are modifications to existing functions in `bin/install.js`. No new files are needed. The installer remains a single file with zero dependencies.

### Component Boundaries (Post-Hardening)

| Component | Responsibility | Changed By |
|-----------|---------------|------------|
| **Utility layer** (top of file) | `atomicWriteFileSync()`, `parseFrontmatter()`, `validateSettings()` | Features 1, 2, 5 |
| **Command-ref transform registry** | Maps runtime keys to transform functions | Feature 4 |
| **Settings merge logic** | Reads existing settings, merges with new, validates | Features 3, 5 |
| **Install dispatch functions** | Runtime-specific install logic | Features 1, 3, 4 |
| **Shared assets writer** | `writeSharedAssets()` with preservation | Features 1, 3, 5 |

---

## Feature 1: Atomic File Writes

### Problem

Every `fs.writeFileSync()` call (9 total) writes directly to the target path. If the process is interrupted mid-write (Ctrl-C, power loss, disk full), the file is left truncated or empty. For manifest files (`.scriveno-installed.json`) and settings (`settings.json`), this means a corrupted install state that the installer cannot recover from.

### Integration

**New function:** `atomicWriteFileSync(targetPath, content)`

```javascript
function atomicWriteFileSync(targetPath, content) {
  const tmpPath = `${targetPath}.tmp.${process.pid}`;
  fs.writeFileSync(tmpPath, content);
  fs.renameSync(tmpPath, targetPath);
}
```

**Why `rename` is atomic:** On POSIX filesystems (macOS, Linux), `rename()` within the same directory is an atomic kernel operation. The target path either has the old content or the new content, never a partial write. On Windows NTFS, `rename` is also atomic for same-volume renames.

**Modification points:** Replace all 9 `fs.writeFileSync()` calls with `atomicWriteFileSync()`:
- Line 508: `writeInstalledCommandManifest()` -- manifest JSON
- Line 728: `writeCodexSkillManifest()` -- manifest JSON
- Line 848: Claude command content in `installClaudeCommandRuntime()`
- Line 863: SKILL.md in `installManifestSkillRuntime()`
- Line 889: SKILL.md in `installCodexRuntime()`
- Line 914: SETUP.md in `installGuidedRuntime()`
- Line 915: connector-command.txt in `installGuidedRuntime()`
- Line 916: connector-command.current-project.txt in `installGuidedRuntime()`
- Line 941: settings.json in `writeSharedAssets()`

**`copyDir()` modification:** `copyDir()` uses `fs.copyFileSync()` which is not atomic. Replace with read-then-atomicWrite:

```javascript
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return 0;
  fs.mkdirSync(dest, { recursive: true });
  let count = 0;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      count += copyDir(srcPath, destPath);
    } else {
      atomicWriteFileSync(destPath, fs.readFileSync(srcPath));
      count++;
    }
  }
  return count;
}
```

**Export:** Add `atomicWriteFileSync` to `module.exports`.

**Test strategy:** Write file via `atomicWriteFileSync`, verify content. Verify `.tmp.{pid}` file does not persist after success. Verify target directory must exist (rename fails across mount points -- not a concern here since tmp is in same dir).

### What NOT to do

Do not introduce a rollback/transaction system. The installer is idempotent -- if it fails mid-run, the user runs it again. Atomic writes prevent corruption; they do not need to prevent incomplete installs.

---

## Feature 2: Robust Frontmatter Parsing

### Problem

`readFrontmatterValue()` uses regex `^key:\s*(.+)$` which:
1. Grabs everything after the first colon, including YAML values that themselves contain colons (e.g., `description: "Run quality gate (voice-check + continuity-check)."` works, but `description: "Phase 1: Setup"` would also work because `.+` is greedy)
2. Actually, the current regex works for values with colons because `.+` matches the rest of the line. The real bug is that it does NOT handle YAML multiline values, and it does NOT properly handle quoted strings containing the key pattern on a later line.

Wait -- re-reading the milestone requirements: "Fix frontmatter parsing that breaks on values containing colons." Let me verify the actual bug.

The regex is `^${key}:\s*(.+)$` with flag `m`. The `.+` is greedy and matches the rest of the line including colons. So `description: Run full pipeline: draft, edit, publish` would capture `Run full pipeline: draft, edit, publish`. This is correct.

But `stripWrappingQuotes()` is called on the result. If the value is `"Run: pipeline"`, it strips quotes correctly. The actual breakage would be if a YAML value is split across keys or if the regex matches a non-frontmatter line. However, since it uses `m` flag and searches the entire content (not just frontmatter), it could match a line inside the command body like `description: something` in a markdown table or instruction.

**The real fix:** Parse only within the `---` frontmatter block, not the entire file content.

### Integration

**Replace `readFrontmatterValue()`:**

```javascript
function parseFrontmatter(content) {
  if (!content.startsWith('---\n') && !content.startsWith('---\r\n')) return {};
  const endMarker = content.indexOf('\n---', 4);
  if (endMarker === -1) return {};
  const frontmatterBlock = content.slice(4, endMarker);
  const result = {};
  for (const line of frontmatterBlock.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim();
    result[key] = stripWrappingQuotes(value);
  }
  return result;
}
```

**Modification points:**
- Line 333: `readFrontmatterValue(content, 'description')` becomes `parseFrontmatter(content).description`
- Line 334: `readFrontmatterValue(content, 'argument-hint')` becomes `parseFrontmatter(content)['argument-hint']`
- Both calls are in `collectCommandEntries()`. Parse once, use twice:

```javascript
const frontmatter = parseFrontmatter(content);
const description = frontmatter.description || commandTail.replace(/[:\-]/g, ' ');
const argumentHint = frontmatter['argument-hint'] || '';
```

**Key improvement:** Uses `indexOf(':')` for first-colon splitting instead of regex. A value like `"Phase 1: Setup: Details"` correctly captures `Phase 1: Setup: Details` as the value.

**Backward compatibility:** `readFrontmatterValue()` is exported (currently used in tests). Keep it as a deprecated wrapper or update tests to use `parseFrontmatter()`.

**Export:** Add `parseFrontmatter` to `module.exports`. Remove or deprecate `readFrontmatterValue`.

**Test cases:**
- Value with colons: `description: "Phase 1: Setup"` -> `Phase 1: Setup`
- Value with quotes: `description: "quoted value"` -> `quoted value`
- Value without quotes: `description: plain value` -> `plain value`
- Body line matching key pattern should NOT be returned (only frontmatter block parsed)
- Missing frontmatter returns empty object
- Empty value: `description:` -> `''`

---

## Feature 3: Settings and Template Preservation on Reinstall

### Problem

`writeSharedAssets()` (line 922-943) does `removePathIfExists(path.join(dataDir, 'templates'))` then `copyDir()`. This nukes any user-customized templates. Similarly, `settings.json` is overwritten with fresh defaults, losing user preferences.

The same pattern exists in runtime-specific installers: `removePathIfExists(commandsDir)` in `installCommandRuntime()` (line 824) and `installManifestSkillRuntime()` (line 860) destroy everything before copying.

### Integration

**Settings preservation in `writeSharedAssets()`:**

```javascript
function writeSharedAssets(dataDir, runtimeKeys, isGlobal, developerMode, installMode, log) {
  // Preserve existing settings before overwriting
  const settingsPath = path.join(dataDir, 'settings.json');
  const existingSettings = readJsonIfExists(settingsPath);
  
  // Templates and data: overwrite Scriveno-owned files, but preserve user additions
  // Instead of removePathIfExists, use selective copy that only overwrites source-owned files
  fs.mkdirSync(path.join(dataDir, 'templates'), { recursive: true });
  fs.mkdirSync(path.join(dataDir, 'data'), { recursive: true });
  const templateCount = copyDir(path.join(PKG_ROOT, 'templates'), path.join(dataDir, 'templates'));
  const dataCount = copyDir(path.join(PKG_ROOT, 'data'), path.join(dataDir, 'data'));
  log(`  ${c('green', '[x]')} ${templateCount} templates + ${dataCount} data files -> ${c('dim', dataDir)}`);

  // Merge settings: installer-managed fields are overwritten, user fields are preserved
  const installerFields = {
    version: VERSION,
    runtime: runtimeKeys[0],
    runtimes: runtimeKeys,
    scope: isGlobal ? 'global' : 'project',
    developer_mode: developerMode,
    data_dir: dataDir,
    install_mode: installMode,
    installed_at: new Date().toISOString(),
  };
  const mergedSettings = existingSettings
    ? { ...existingSettings, ...installerFields }
    : installerFields;
  
  atomicWriteFileSync(settingsPath, JSON.stringify(mergedSettings, null, 2));
  log(`  ${c('green', '[x]')} settings.json -> ${c('dim', settingsPath)}`);
}
```

**Key change:** Remove the two `removePathIfExists()` calls for `templates/` and `data/`. Instead, `copyDir()` overwrites files that exist in the source package and leaves user-added files untouched. This is safe because `copyDir()` already creates directories and writes files -- it just needs to not delete first.

**Template preservation detail:** If a user has customized `templates/WORK.md`, the reinstall will overwrite it with the package version. To prevent this, we would need a manifest of user-modified files. For v1.6, the simpler approach is: remove the `removePathIfExists()` calls so user-added files survive, but accept that Scriveno-shipped templates get refreshed. This matches the command file behavior (Scriveno-owned files are refreshed, non-Scriveno files are preserved).

**Settings merge rule:** The installer owns these fields and always overwrites them: `version`, `runtime`, `runtimes`, `scope`, `developer_mode`, `data_dir`, `install_mode`, `installed_at`. Any other keys in the existing settings (user customizations) are preserved via spread.

### What about runtime-specific install functions?

- `installCommandRuntime()` line 824: `removePathIfExists(commandsDir)` -- this is the Scriveno-owned commands subdirectory (e.g., `.cursor/commands/scr/`). The `scr/` suffix scopes it to Scriveno content only. This is safe to keep as-is.
- `installManifestSkillRuntime()` line 860: `removePathIfExists(skillsDir)` -- this removes `~/.scriveno/skills/` or `~/.manus/skills/scriveno/`. Again, Scriveno-scoped. Safe.
- `installCodexRuntime()` line 878: `removePathIfExists(commandsDir)` -- Scriveno-scoped. Safe.
- `installGuidedRuntime()` line 912: `removePathIfExists(guideDir)` -- Scriveno-scoped. Safe.

The preservation problem is specifically in `writeSharedAssets()` where `removePathIfExists(path.join(dataDir, 'templates'))` removes ALL templates including user-added ones, and settings.json is fully overwritten.

---

## Feature 4: Multi-Runtime Command-Ref Rewriting

### Problem

`rewriteInstalledCommandRefs()` is only called from `generateClaudeCommandContent()` (line 449) with the Claude-specific transform `commandRefToClaudeInvocation`. The function itself is generic -- it takes any transform function. But only Claude Code uses it.

Non-Claude runtimes copy command files verbatim via `copyDir()` (lines 826, 864, 882), leaving `/scr:help` references intact. This means:
- **Cursor/Gemini/Windsurf/OpenCode/Copilot/Antigravity** users see `/scr:help` in installed commands, which works because those runtimes use the `/scr:` prefix natively (commands are in a `scr/` subdirectory).
- **Codex** generates skill wrappers that tell the agent to rewrite `/scr:` to `$scr-` (line 373-375 in `generateCodexSkill()`), but the underlying command files in `.codex/commands/scr/` still contain raw `/scr:` references.

So the actual gap is:
1. **Codex command files** (`.codex/commands/scr/*.md`) are copied raw without rewriting. The SKILL.md wrapper tells the agent to rewrite, but the source-of-truth command file has wrong invocations.
2. **Manus/Generic skill runtimes** copy raw command files that reference `/scr:` which may not be the correct invocation surface.

### Integration

**Add transform functions for each runtime type:**

```javascript
function commandRefToDirectInvocation(commandRef) {
  // For Cursor, Gemini, Windsurf, OpenCode, Copilot, Antigravity
  // /scr:help stays as /scr:help (these runtimes use subdirectory-based command discovery)
  return commandRef;
}
```

The existing transforms cover Claude and Codex. For subdirectory runtimes, `/scr:` is already correct. The gap is specifically in Codex's command files.

**Modify `installCodexRuntime()`:** After `copyDir()` copies command files to `.codex/commands/scr/`, walk those files and rewrite `/scr:` references to `$scr-` using `rewriteInstalledCommandRefs()` with `commandRefToCodexInvocation`:

```javascript
function installCodexRuntime(runtime, isGlobal, log) {
  // ... existing setup ...
  const commandCount = copyDir(path.join(PKG_ROOT, 'commands', 'scr'), commandsDir);
  
  // Rewrite command refs in all installed command files
  rewriteCommandFilesInDir(commandsDir, commandRefToCodexInvocation);
  
  // ... rest of function ...
}

function rewriteCommandFilesInDir(dir, transform) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      rewriteCommandFilesInDir(fullPath, transform);
    } else if (entry.name.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const rewritten = rewriteInstalledCommandRefs(content, transform);
      if (rewritten !== content) {
        atomicWriteFileSync(fullPath, rewritten);
      }
    }
  }
}
```

**Modification points:**
- Add `rewriteCommandFilesInDir()` utility function
- Modify `installCodexRuntime()` to call it after `copyDir()`
- Consider whether `installCommandRuntime()` needs it -- for subdirectory runtimes, `/scr:` is already correct, so no transform needed
- For `installManifestSkillRuntime()` (Manus/Generic), the commands are inside the skills directory. These should also get rewritten if the runtime has a different invocation surface. Currently Manus/Generic don't define a transform, so this is a future consideration.

**Export:** Add `rewriteCommandFilesInDir` to `module.exports`.

**Test strategy:** Install Codex runtime to temp dir, verify command files contain `$scr-` instead of `/scr:`. Verify subdirectory runtimes still contain `/scr:`.

---

## Feature 5: Settings Schema Validation

### Problem

`settings.json` is read by `readJsonIfExists()` which silently returns `null` on parse errors. No validation of field types or required fields. A misconfigured settings file (wrong types, missing fields, extra fields from a future version) is silently accepted or silently ignored.

### Integration

**New function:** `validateSettings(settings)`

```javascript
const SETTINGS_SCHEMA = {
  required: ['version', 'runtime', 'runtimes', 'scope', 'developer_mode', 'data_dir', 'install_mode', 'installed_at'],
  types: {
    version: 'string',
    runtime: 'string',
    runtimes: 'array',
    scope: 'string',
    developer_mode: 'boolean',
    data_dir: 'string',
    install_mode: 'string',
    installed_at: 'string',
  },
  enums: {
    scope: ['global', 'project'],
    install_mode: ['interactive', 'non-interactive'],
  },
  arrayItemTypes: {
    runtimes: 'string',
  },
};

function validateSettings(settings) {
  const errors = [];
  if (!settings || typeof settings !== 'object') {
    return { valid: false, errors: ['Settings must be a non-null object'] };
  }
  for (const field of SETTINGS_SCHEMA.required) {
    if (!(field in settings)) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  for (const [field, expectedType] of Object.entries(SETTINGS_SCHEMA.types)) {
    if (field in settings) {
      const value = settings[field];
      if (expectedType === 'array') {
        if (!Array.isArray(value)) {
          errors.push(`Field "${field}" must be an array, got ${typeof value}`);
        } else if (SETTINGS_SCHEMA.arrayItemTypes[field]) {
          const itemType = SETTINGS_SCHEMA.arrayItemTypes[field];
          for (let i = 0; i < value.length; i++) {
            if (typeof value[i] !== itemType) {
              errors.push(`Field "${field}[${i}]" must be ${itemType}, got ${typeof value[i]}`);
            }
          }
        }
      } else if (typeof value !== expectedType) {
        errors.push(`Field "${field}" must be ${expectedType}, got ${typeof value}`);
      }
    }
  }
  for (const [field, allowed] of Object.entries(SETTINGS_SCHEMA.enums)) {
    if (field in settings && !allowed.includes(settings[field])) {
      errors.push(`Field "${field}" must be one of [${allowed.join(', ')}], got "${settings[field]}"`);
    }
  }
  // Validate runtime keys
  if (Array.isArray(settings.runtimes)) {
    for (const rt of settings.runtimes) {
      if (typeof rt === 'string' && !Object.prototype.hasOwnProperty.call(RUNTIMES, rt)) {
        errors.push(`Unknown runtime in runtimes array: "${rt}"`);
      }
    }
  }
  return { valid: errors.length === 0, errors };
}
```

**Integration points:**

1. **After writing settings** (in `writeSharedAssets()`): Validate the merged settings before writing. If validation fails, log warnings but still write (the installer should not refuse to install because of a schema issue in user-preserved fields).

2. **When reading existing settings** (in the preservation flow from Feature 3): Validate before merging. If existing settings are invalid, log a warning and start fresh instead of merging garbage.

```javascript
const existingSettings = readJsonIfExists(settingsPath);
if (existingSettings) {
  const { valid, errors } = validateSettings(existingSettings);
  if (!valid) {
    log(`  ${c('yellow', '!')} Existing settings.json has issues: ${errors.join(', ')}`);
    log(`  ${c('yellow', '!')} User customizations in settings.json will be reset.`);
    // Don't merge invalid settings -- use fresh
  }
}
```

3. **Post-write verification**: After writing merged settings, validate the result. This catches bugs in the merge logic itself.

**Export:** Add `validateSettings` and `SETTINGS_SCHEMA` to `module.exports`.

**Test strategy:**
- Valid settings object passes validation
- Missing required field detected
- Wrong type detected
- Invalid enum value detected
- Unknown runtime key detected
- Extra user fields (not in schema) do NOT cause validation failure (forward compatibility)

---

## Data Flow Changes

### Before Hardening

```
Source package files
  |
  v
removePathIfExists(target)  <-- destructive, total wipe
  |
  v
copyDir / writeFileSync     <-- non-atomic, corruptible
  |
  v
settings.json overwritten   <-- user prefs lost
  |
  v
/scr: refs left raw         <-- wrong invocations for Codex
```

### After Hardening

```
Source package files
  |
  v
Read existing settings.json
  |
  v
validateSettings(existing)  <-- catch corruption early
  |
  v
copyDir (NO pre-delete)     <-- overwrites Scriveno files, preserves user additions
  |
  v
atomicWriteFileSync()       <-- write-to-tmp + rename
  |
  v
Merge installer fields + user fields into settings
  |
  v
validateSettings(merged)    <-- verify merge correctness
  |
  v
atomicWriteFileSync(settings.json)
  |
  v
rewriteCommandFilesInDir()  <-- runtime-appropriate invocations
  |
  v
parseFrontmatter()          <-- correct colon handling, scoped to frontmatter block
```

---

## Suggested Build Order

Features have dependencies that constrain the order.

### Phase 1: Atomic Writes (build first)

**Why first:** Every other feature writes files. If atomic writes exist first, all subsequent features automatically get atomic safety. Building atomic writes last means retrofitting every write call added by other features.

**Scope:**
- Add `atomicWriteFileSync()` function
- Replace all 9 `fs.writeFileSync()` calls
- Modify `copyDir()` to use atomic writes
- Add tests for atomic write behavior
- Export the function

**No dependencies on other features.** Self-contained.

### Phase 2: Frontmatter Parsing (build second)

**Why second:** Independent of other features, but should land early because it changes a function signature (`readFrontmatterValue` -> `parseFrontmatter`) that tests depend on. Getting this merged early avoids test conflicts with later phases.

**Scope:**
- Add `parseFrontmatter()` function
- Update `collectCommandEntries()` to use it
- Update or deprecate `readFrontmatterValue()`
- Update `module.exports`
- Add tests for colon-containing values, quoted values, body-line false matches

**No dependencies on other features.** Self-contained.

### Phase 3: Settings Schema Validation (build third)

**Why third:** Feature 5 (schema validation) must exist before Feature 3 (settings preservation) because the preservation logic needs to validate existing settings before deciding whether to merge them. Building validation first gives preservation a clean integration point.

**Scope:**
- Add `SETTINGS_SCHEMA` constant
- Add `validateSettings()` function
- Wire into `writeSharedAssets()` for post-write verification
- Export schema and validator
- Add tests for each validation rule

**Depends on:** Phase 1 (atomic writes) for the settings write path.

### Phase 4: Settings Preservation (build fourth)

**Why fourth:** Depends on both atomic writes (Phase 1) and schema validation (Phase 3). The merge logic reads existing settings, validates them, merges, validates again, and writes atomically.

**Scope:**
- Remove `removePathIfExists()` calls for `templates/` and `data/` in `writeSharedAssets()`
- Add settings merge logic (read existing -> validate -> merge -> validate -> atomic write)
- Add warning output for invalid existing settings
- Add tests: fresh install, reinstall with user customizations, reinstall with corrupted settings

**Depends on:** Phase 1 (atomic writes), Phase 3 (schema validation).

### Phase 5: Multi-Runtime Command-Ref Rewriting (build last)

**Why last:** This is the most runtime-specific change and touches the most install functions. It benefits from all prior changes being stable. It also has the narrowest bug surface (currently only Codex command files are wrong; subdirectory runtimes work correctly with `/scr:`).

**Scope:**
- Add `rewriteCommandFilesInDir()` utility
- Modify `installCodexRuntime()` to rewrite command files after copy
- Verify subdirectory runtimes don't need rewriting
- Add tests: Codex command files contain `$scr-`, Claude files contain `/scr-`, Cursor files contain `/scr:`

**Depends on:** Phase 1 (atomic writes, since rewritten files use `atomicWriteFileSync`).

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Transaction/Rollback System

**What:** Building a multi-file transaction system that rolls back all writes if any single write fails.

**Why bad:** The installer is idempotent. Running it again fixes any partial install. A rollback system adds hundreds of lines of complexity for a scenario (partial write failure) that atomic writes already handle at the single-file level.

**Instead:** Atomic writes per file. If the install fails, the user runs it again.

### Anti-Pattern 2: Deep-Merge Settings

**What:** Recursively merging nested objects in settings.json.

**Why bad:** Settings.json is flat (no nested objects today). Deep merge adds complexity for a structure that doesn't exist. If nested settings are added later, deep merge can silently merge incompatible sub-objects.

**Instead:** Shallow spread merge. Installer-owned top-level keys overwrite. User-added top-level keys survive. No nesting.

### Anti-Pattern 3: Full YAML Parser for Frontmatter

**What:** Adding a YAML parser dependency (e.g., `js-yaml`) for frontmatter parsing.

**Why bad:** Scriveno's architecture constraint is zero npm dependencies. The frontmatter is simple key-value pairs, never YAML sequences or nested objects.

**Instead:** First-colon split within the `---` block. Handles every frontmatter pattern actually used in Scriveno command files.

### Anti-Pattern 4: Runtime-Specific Install Files

**What:** Splitting each runtime's install logic into a separate file (e.g., `install-claude.js`, `install-codex.js`).

**Why bad:** The installer is deliberately a single file. Splitting increases the module surface, complicates the npm package, and adds `require()` chains for no benefit.

**Instead:** Keep everything in `bin/install.js`. Functions are already well-separated by runtime. The file grows from ~1035 to ~1150 lines -- still manageable.

### Anti-Pattern 5: Backup-Before-Overwrite for Templates

**What:** Creating `.bak` copies of templates before overwriting.

**Why bad:** Backup files accumulate. Users don't know they exist. Restore is manual. The `.scriveno/` directory fills with `.bak` debris.

**Instead:** Stop deleting the directory before copying. `copyDir()` already overwrites individual files. User-added files that don't exist in the source package survive naturally.

---

## Scalability Considerations

Not a concern for this milestone. The installer runs once per install/upgrade. Performance is not a bottleneck.

| Concern | Current (1035 lines) | Post-Hardening (~1150 lines) | Future |
|---------|---------------------|------|--------|
| File size | Manageable | Still manageable | Consider splitting at ~2000 lines |
| Test coverage | installer.test.js exists | Add tests for all 5 features | Maintain per-feature test blocks |
| Runtime count | 11 runtimes | Same 11 | New runtimes add ~20 lines each |
| Settings fields | 8 fields | Same 8 + user fields | Schema grows linearly |

---

## Sources

- [Node.js fs.renameSync](https://nodejs.org/api/fs.html#fsrenamesyncoldpath-newpath) -- Atomic rename semantics on POSIX
- Scriveno `bin/install.js` -- Primary source, 1035 lines analyzed line-by-line
- Scriveno `test/installer.test.js` -- Existing test patterns
- Scriveno `.planning/PROJECT.md` -- Milestone v1.6 requirements
