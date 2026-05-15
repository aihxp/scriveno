# Pitfalls Research

**Domain:** Installer hardening for Node.js CLI (atomic writes, YAML parsing, config preservation, command-ref rewriting, schema validation)
**Researched:** 2026-04-16
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Frontmatter regex matches body content, not just the frontmatter block

**What goes wrong:**
`readFrontmatterValue` (line 292) uses `content.match(new RegExp('^${key}:\\s*(.+)$', 'm'))` against the *entire* file content, not just the YAML frontmatter block. A command markdown file that mentions `description:` in its body text (instructions, examples, code blocks) could return that body match instead of the frontmatter value. This is currently latent because no command body lines happen to start with `description:` at column zero, but it will break as content grows or if future commands include YAML examples.

**Why it happens:**
The regex approach skips proper frontmatter boundary detection. `insertMarkerComment` (line 429) correctly finds the `---\n...\n---` boundaries, but `readFrontmatterValue` does not. The two functions were written independently and never reconciled.

**How to avoid:**
Extract the frontmatter block first (between opening `---\n` and closing `\n---\n`), then apply the key-value regex only within that extracted block. Reuse the boundary logic already present in `insertMarkerComment`. A shared `extractFrontmatter(content)` function used by both paths eliminates the divergence.

**Warning signs:**
- A command file with `description:` or `argument-hint:` appearing in its body text at column zero
- Test assertions on `description` returning body text instead of the frontmatter metadata
- Codex skill descriptions containing long prose instead of a short description string

**Phase to address:**
Phase 1 (frontmatter parsing hardening). This is the foundation that command-ref rewriting and skill generation depend on. Every downstream consumer of parsed frontmatter inherits this bug.

---

### Pitfall 2: Colon handling is a generation bug, not just a parsing bug

**What goes wrong:**
While the current regex `(.+)` does capture everything after `key:\s*` correctly for most values, the real colon problem surfaces in *generated* YAML output. `generateCodexSkill` (line 361) emits `description: "${value.replace(/"/g, '\\"')}"` -- but this escaping is incomplete. Values containing backslashes, newlines, or YAML flow indicators (`{`, `[`, `>`, `|`) can produce malformed YAML in the generated SKILL.md. Additionally, if a description contains a literal `\"` sequence, the double-escaping produces `\\\\"` which renders incorrectly.

**Why it happens:**
Hand-rolled YAML generation without a proper escaping function. The `readFrontmatterValue` + `stripWrappingQuotes` pipeline handles simple cases but the read and write escaping rules are different. Reading strips quotes; writing must add them with correct internal escaping. These two paths were built separately.

**How to avoid:**
1. For *reading*: extract the frontmatter block, then parse key-value pairs aware of YAML quoting rules. Do NOT add a full YAML library (violates zero-dependency constraint). A focused parser covering the three value forms Scriveno actually uses (plain scalars, single-quoted, double-quoted) is sufficient and can be under 40 lines.
2. For *writing*: build a single `yamlQuote(value)` utility that always double-quotes and properly escapes `\`, `"`, and newlines within the value. Use this in `generateCodexSkill` and `markInstalledCommand`.
3. Fix both read and write paths together so the round-trip is tested end-to-end.

**Warning signs:**
- Codex skill SKILL.md files with unbalanced quotes in frontmatter
- `npm pack --dry-run` reveals SKILL.md files that a YAML parser rejects
- Descriptions containing colons or quotes render incorrectly in skill discovery

**Phase to address:**
Phase 1 (frontmatter parsing hardening). Must fix both read and write paths together since they share escaping assumptions.

---

### Pitfall 3: Settings overwrite destroys user customizations on every reinstall

**What goes wrong:**
`writeSharedAssets` (line 922) does `removePathIfExists(path.join(dataDir, 'templates'))` and `removePathIfExists(path.join(dataDir, 'data'))` followed by a fresh copy. Then it writes `settings.json` with a fresh object (lines 931-942). If a user has customized templates, added their own files to the data directory, or modified settings.json with personal preferences, all of it is destroyed on every reinstall or upgrade.

**Why it happens:**
The current installer treats every install as a clean install. There is no concept of "Scriveno-owned files" vs "user-owned files" in the templates and data directories. The settings.json is always overwritten wholesale with no merge logic.

**How to avoid:**
1. **Templates and data**: Use the same manifest-based ownership tracking already implemented for commands (`.scriveno-installed.json`). Before replacing the templates directory, compare against the manifest. Files not in the manifest are user-owned and must be preserved. Files in the manifest can be safely updated.
2. **Settings**: Read the existing settings.json first, deep-merge Scriveno-managed keys (`version`, `runtime`, `runtimes`, `scope`, `install_mode`, `installed_at`) while preserving any user-added keys. Never delete keys that Scriveno did not create.
3. **Defensive merge**: Use a whitelist of Scriveno-owned keys rather than a blacklist of user keys. New Scriveno keys get added; unknown keys pass through untouched.

**Warning signs:**
- Users reporting lost customizations after running `npx scriveno@latest`
- Settings reverting to defaults after upgrade
- Custom templates disappearing after reinstall

**Phase to address:**
Phase 3 (settings preservation). But the manifest pattern must be designed in Phase 2 alongside atomic writes, since both need file-ownership tracking to work correctly.

---

### Pitfall 4: Schema validation rejects valid old configs on upgrade

**What goes wrong:**
Adding strict schema validation to settings.json means that settings files written by older Scriveno versions (which lack newly added fields, or have fields in old formats) fail validation on read. The user upgrades Scriveno from v1.5 to v1.6, and their existing installation breaks because the old settings.json does not conform to the new schema.

**Why it happens:**
Validation is implemented as "reject if schema does not match" rather than "migrate then validate." The schema is treated as a gate rather than a contract with versioned evolution.

**How to avoid:**
1. Schema validation must include a migration step that runs *before* validation. Read the `version` field from settings.json, apply migrations for each version gap, then validate the migrated result.
2. New fields must have defaults. Validation should add missing fields with defaults rather than rejecting their absence.
3. Unknown fields must be preserved (open schema), not rejected (closed schema). Users may add custom keys.
4. Validation errors should be warnings that fall back to defaults, not hard failures that prevent installation. A corrupted settings.json should not block a fresh install.

**Warning signs:**
- Upgrade from v1.5 to v1.6 causes "invalid settings" errors
- `--detected` reinstalls break on machines with older Scriveno data
- CI pipelines installing Scriveno over an existing installation fail unexpectedly

**Phase to address:**
Phase 4 (schema validation). Must be implemented after settings preservation (Phase 3) since the migration logic depends on understanding what fields are Scriveno-owned vs user-added.

---

### Pitfall 5: Atomic write with orphaned temp files on crash

**What goes wrong:**
The standard atomic-write pattern is: write to a temp file in the same directory, then `fs.renameSync` to the target path. If the process is killed between creating the temp file and renaming it, the temp file persists. On repeated installs, these accumulate as orphan files in user-visible directories like `~/.claude/commands/` or `~/.scriveno/`.

**Why it happens:**
`fs.renameSync` is atomic on the same filesystem, but nothing cleans up temp files from prior failed runs. The current installer (line 658) uses bare `fs.copyFileSync` and `fs.writeFileSync` with no temp-file intermediary, so adding atomic writes introduces a new failure mode that did not previously exist.

**How to avoid:**
1. Use a deterministic temp file naming scheme based on target path (e.g., `${targetPath}.scriveno-tmp`) so the next install run can detect and clean orphans before writing.
2. Add a cleanup step at the start of each install function that removes any `*.scriveno-tmp` files in the target directory.
3. Use `try/finally` around the write+rename to clean up on caught exceptions (does not help with SIGKILL, but covers most cases).
4. The cleanup-on-next-run pattern handles the SIGKILL case.

**Warning signs:**
- `.scriveno-tmp` files appearing in command directories after interrupted installs
- Users reporting "extra files" in their `.claude/commands/` directory
- Disk space accumulation in `.scriveno/` from repeated failed installs

**Phase to address:**
Phase 2 (atomic file writes). Orphan cleanup must be part of the atomic write implementation, not a separate phase.

---

### Pitfall 6: Atomic rename fails across filesystem boundaries

**What goes wrong:**
`fs.renameSync` fails with `EXDEV` when source and target are on different filesystems. This is rare on macOS but common on Linux where `/tmp` is often a tmpfs mount. If the temp file is written to `os.tmpdir()` instead of the target directory, the rename will throw.

**Why it happens:**
Developers test on macOS where `/tmp` is a symlink to `/private/tmp` on the same volume. They write temp files to `os.tmpdir()` for "cleanliness" without realizing it breaks cross-filesystem rename.

**How to avoid:**
Always write the temp file in the *same directory* as the target file. Never use `os.tmpdir()` for atomic-write temp files. The temp file path should be `path.join(path.dirname(targetPath), '.scriveno-tmp-' + path.basename(targetPath))`.

**Warning signs:**
- `EXDEV: cross-device link not permitted` errors in CI or on Linux
- Tests pass on macOS, fail on Linux Docker containers

**Phase to address:**
Phase 2 (atomic file writes). Bake into the atomic write utility from the start.

---

### Pitfall 7: Command-ref rewriting is too greedy across content boundaries

**What goes wrong:**
`rewriteInstalledCommandRefs` (line 439) uses `/\/scr:[a-z0-9:-]+/gi` to find command references and rewrites every match. This regex has two problems:
1. **Rewrites inside code blocks and examples**: A command file that documents "the original command is `/scr:help`" in a fenced code block would have that reference rewritten, making documentation about the canonical command format incorrect.
2. **Case-insensitive flag**: The `gi` flag means it would match `/SCR:HELP` which is not a valid command reference.

For multi-runtime rewriting (extending beyond Claude Code to Cursor, Gemini, Codex), each runtime has a different invocation style. A single-pass rewrite works, but applying the wrong transform produces commands the user cannot execute.

**Why it happens:**
The regex was written for the Claude Code case where all `/scr:` references become `/scr-` references. It worked because the transformation was structurally similar. Extending to Codex (`$scr-help`) or preserving the original format for Cursor (`/scr:help`) requires context-awareness the regex approach does not have.

**How to avoid:**
1. Remove the case-insensitive flag. Command references are lowercase by convention.
2. Consider whether references inside fenced code blocks (triple backtick sections) should be rewritten. If a code block demonstrates the runtime-specific invocation, it should be rewritten. If it documents the canonical format, it should not. The safest default is to rewrite everywhere but add an escape hatch (e.g., `\\/scr:help` is not rewritten).
3. The existing `commandRefToClaudeInvocation` and `commandRefToCodexInvocation` pattern is correct. Extend it to Cursor/Gemini/etc. with per-runtime transforms. The key is ensuring the correct transform is applied for the target runtime.

**Warning signs:**
- Command help text shows wrong invocation syntax for the installed runtime
- Users copy command references from help text and they do not work
- Codex skills suggest `/scr-help` (Claude format) instead of `$scr-help` (Codex format)

**Phase to address:**
Phase 3 (command-ref rewriting). After frontmatter parsing is solid, since command-ref rewriting reads frontmatter to determine which commands exist.

---

### Pitfall 8: Migration-validation bootstrap deadlock

**What goes wrong:**
If the installer reads settings.json to determine install behavior (e.g., preserving user preferences from a previous install), and the schema validator rejects the old settings before migration runs, the installer cannot read the data it needs to perform the migration. You need valid settings to run, but you need to run to make settings valid.

**Why it happens:**
Validation is added as a middleware on the read path without thinking about the bootstrap case where the file exists but predates the current schema.

**How to avoid:**
Separate "raw read" from "validated read." The migration path should:
1. Raw-read settings.json (`JSON.parse` only, no schema check)
2. Check the `version` field
3. Apply migrations for each version gap
4. Validate the migrated result
5. Write back the migrated settings if anything changed

The existing `readJsonIfExists` function (line 665) already does a raw read with a catch. This is the right foundation. Do NOT add validation inside `readJsonIfExists`. Add a separate `readAndMigrateSettings` function that calls `readJsonIfExists` then applies migration then validation.

**Warning signs:**
- Installer crashes on first run after upgrade with "invalid settings" before it can fix them
- Settings migration code is unreachable because validation throws first
- Test suite does not test the upgrade path (fresh install only)

**Phase to address:**
Phase 4 (schema validation). Design the read pipeline so migration always precedes validation.

---

### Pitfall 9: removePathIfExists + copyDir creates a visibility gap

**What goes wrong:**
The current installer pattern is: `removePathIfExists(dir)` then `copyDir(src, dir)`. Between these two calls, the directory does not exist. If a concurrent reader (the AI agent runtime reading command files) accesses the directory during this window, it gets `ENOENT` and shows the user an error or missing commands. The window is typically milliseconds, but on slow I/O or large command sets, it can be noticeable.

**Why it happens:**
The delete-then-recreate pattern is the simplest way to ensure a clean state. It works for single-process batch operations but fails when readers are concurrent (which they always are -- the AI agent is running while the user reinstalls Scriveno).

**How to avoid:**
Two options:
1. **Atomic directory swap**: Write new files to a temp directory in the same parent, then rename the temp directory to the target name (after renaming the old directory to a backup name first). This is the clean approach but more complex.
2. **Overwrite in place**: Instead of deleting the directory, walk the source and overwrite files individually, then delete files that exist in the target but not in the source (stale files). This is what `cleanFlatCommandFiles` already does for Claude commands -- extend this pattern to other install functions.

The existing `cleanFlatCommandFiles` + individual `writeFileSync` pattern used in `installClaudeCommandRuntime` (line 833) is already better than the `removePathIfExists` + `copyDir` pattern used in `installCommandRuntime` (line 822). Standardize on the better pattern.

**Warning signs:**
- Brief flashes of "command not found" during reinstall
- Race conditions in tests that install and then immediately read commands
- The fact that `installClaudeCommandRuntime` already avoids this problem while other install functions do not

**Phase to address:**
Phase 2 (atomic file writes). This is a natural consequence of making writes atomic -- the directory-level operation needs the same treatment as individual files.

---

### Pitfall 10: Manifest drift between code and disk

**What goes wrong:**
The `.scriveno-installed.json` manifest tracks which files Scriveno owns. If a bug in the installer writes a file but fails to record it in the manifest, that file becomes an orphan that no future install will clean up. Conversely, if the manifest lists a file that was never written (crash between manifest write and file write), the cleanup logic will try to delete a nonexistent file (harmless) but will also skip cleaning up the actual stale file (harmful).

**Why it happens:**
The manifest is written as a separate step from the file writes. The order matters: if the manifest is written first (before files), a crash leaves a manifest claiming files that do not exist. If files are written first (before manifest), a crash leaves files that no future manifest will track.

**How to avoid:**
1. Write all files first, manifest last. This ensures that a crash before manifest write means the next install sees no manifest, treats all Scriveno-marker files as candidates for cleanup (the `isScrivenoInstalledCommandFile` check already handles this), and writes a fresh manifest.
2. On read, treat manifest entries for missing files as stale (silently ignore), not as errors.
3. The existing code already does this correctly for Claude commands (writes files, then calls `writeInstalledCommandManifest`). Ensure all new manifest-tracked directories follow the same order.

**Warning signs:**
- Stale files accumulating across upgrades that are never cleaned up
- Manifest listing files that do not exist on disk
- Orphan files in runtime directories that do not have the `scriveno-cli-installed-command` marker

**Phase to address:**
Phase 3 (settings preservation). The manifest pattern is extended to templates and data in this phase; getting the write order right is critical.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hand-rolled YAML parser for 3 value forms only | Zero dependencies, small code surface | Every YAML edge case not covered is a potential bug (multiline values, comments, anchors) | Acceptable permanently if the parser explicitly rejects unsupported forms rather than silently mishandling them |
| Overwriting settings.json wholesale | Simple code, no merge logic needed | Users lose customizations every upgrade; erodes trust in the upgrade path | Never acceptable once users start customizing settings (must fix in v1.6) |
| Regex-based command-ref rewriting without markdown AST | Works for simple files, fast, no dependency | Rewrites inside code blocks, URLs, and documentation strings where rewriting is incorrect | Acceptable if code-block exclusion logic is added |
| No lockfile for concurrent installs | Simpler code, no lock management | Rare but possible data corruption on concurrent runs | Acceptable for v1.6 if documented; consider for v1.7 |
| `removePathIfExists` + `copyDir` instead of in-place update | Simple, guarantees clean state | Creates visibility gap for concurrent readers | Should be replaced in v1.6 as part of atomic writes work |

## Integration Gotchas

| Integration Point | Common Mistake | Correct Approach |
|-------------------|----------------|------------------|
| `readFrontmatterValue` to `generateCodexSkill` | Assuming the parsed value is safe to embed in YAML without re-escaping | Always re-escape when generating YAML output; the read and write escaping rules differ |
| `cleanFlatCommandFiles` to `writeInstalledCommandManifest` | Writing the manifest before writing all files, so a crash leaves a manifest claiming files that do not exist | Write all files first, manifest last. On read, silently ignore manifest entries for missing files |
| `removePathIfExists` to `copyDir` | Nuking the entire directory then re-copying, creating a window where the directory does not exist | Write new files alongside old ones, then remove stale files (the Claude install path already does this correctly) |
| Settings read to schema validation to install behavior | Validation rejecting old settings before migration can run | Raw read then migrate then validate then use. Never validate before migrating |
| Atomic write temp files to directory cleanup | Cleanup logic treating `.scriveno-tmp-*` files as real content | Exclude temp file name patterns from all directory-walking and cleanup functions |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Silent schema validation failure | User installs, it appears to succeed, but settings are invalid and commands behave unexpectedly | Validation errors should print a clear warning with the specific field and value that failed, and the default being used instead |
| Destroying user templates without warning | User customized templates, reinstalls, customizations vanish with no notice | Before overwriting user-modified files, print a count of preserved vs updated files so the user knows their work was respected |
| Atomic write errors surfacing as cryptic Node.js messages | User sees `EXDEV: cross-device link not permitted` and has no idea what happened | Catch known atomic-write errors and surface them as "Installation interrupted. Run the installer again to retry." |
| Schema migration silently changing user-set values | User set `developer_mode: true`, upgrade migration resets it to `false` | Migration must only add or transform fields whose schema shape changed between versions. Never touch fields whose schema did not change |

## "Looks Done But Isn't" Checklist

- [ ] **Frontmatter parsing:** Parses only the YAML frontmatter block, not body content -- verify with a command file that has `description:` in its body text at column zero
- [ ] **Frontmatter colon handling:** Correctly reads `description: "Voice profiling: 15+ dimensions"` -- verify with a value containing a colon after the key's colon
- [ ] **YAML generation round-trip:** A description read from frontmatter and written into a Codex SKILL.md produces valid YAML -- verify by parsing the generated SKILL.md with a YAML parser
- [ ] **Atomic writes:** Cleans up orphaned temp files from prior crashed installs -- verify by creating a `.scriveno-tmp-*` file in target dir and running install
- [ ] **Atomic writes:** Temp files are written in the same directory as the target, not in `os.tmpdir()` -- verify by checking the temp file path construction
- [ ] **Settings preservation:** Preserves user-added keys in settings.json -- verify by adding a custom key, reinstalling, and checking it survives
- [ ] **Settings preservation:** Preserves user-modified templates -- verify by modifying a template, reinstalling, and checking the modification survives
- [ ] **Schema validation:** Accepts settings.json from the previous Scriveno version without error -- verify by writing a v1.5-era settings.json and running v1.6 install over it
- [ ] **Schema validation:** Preserves unknown keys (open schema) -- verify by adding `"my_custom_key": true` to settings.json and checking it survives validation
- [ ] **Schema validation:** Migration runs before validation, not after -- verify by checking the function call order in the read pipeline
- [ ] **Command-ref rewriting:** Produces correct invocations for each runtime -- verify by installing to Claude Code, Codex, Cursor, and Gemini CLI and checking help output
- [ ] **No visibility gap:** Install does not delete command directories before recreating them -- verify that concurrent reads during install do not get ENOENT

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Orphaned temp files | LOW | Add a cleanup sweep at install start that removes `*.scriveno-tmp` files from all target directories |
| Corrupted settings.json | LOW | Delete settings.json and re-run installer; it regenerates fresh settings |
| Lost user customizations | HIGH | No automatic recovery. User must redo customizations from memory or version control. Prevention is the only strategy |
| Malformed Codex SKILL.md | MEDIUM | Re-run installer; all SKILL.md files are regenerated. But users may not realize the skill is broken until they try to use it |
| Wrong command-ref invocations | LOW | Re-run installer with the correct `--runtimes` flag; all command files are regenerated |
| Schema validation blocking install | LOW | If designed correctly (warnings not errors), user can proceed. If designed incorrectly (hard errors), user must manually delete settings.json |
| Manifest drift (orphan files) | LOW | Re-run installer; cleanup logic detects Scriveno-marker files even without a manifest |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Frontmatter regex matches body | Phase 1: Frontmatter hardening | Test with command file containing `description:` in body text |
| Colon/quote escaping in YAML generation | Phase 1: Frontmatter hardening | Round-trip test: read frontmatter, generate SKILL.md, parse generated YAML |
| Orphaned temp files on crash | Phase 2: Atomic writes | Kill installer mid-write, verify no orphans after next install |
| Cross-filesystem rename failure (EXDEV) | Phase 2: Atomic writes | Verify temp files are in same directory as target, not in os.tmpdir() |
| Visibility gap from delete+recreate | Phase 2: Atomic writes | Verify in-place update pattern, not delete-then-copy |
| Settings overwrite destroying customizations | Phase 3: Settings preservation | Add custom key to settings.json, reinstall, verify it persists |
| Template destruction on reinstall | Phase 3: Settings preservation | Modify a template, reinstall, verify modification persists |
| Manifest drift between code and disk | Phase 3: Settings preservation | Write files then manifest (never reverse), handle missing files gracefully |
| Command-ref rewriting too greedy | Phase 3: Command-ref rewriting | Install to each runtime, verify invocation syntax in help text |
| Schema rejects old config on upgrade | Phase 4: Schema validation | Write v1.5 settings.json, run v1.6 install, verify no errors |
| Migration-validation bootstrap deadlock | Phase 4: Schema validation | Remove `version` key from settings.json, verify graceful handling |

## Sources

- Direct analysis of `bin/install.js` (1036 lines, current Scriveno codebase)
- `.planning/PROJECT.md` v1.6 milestone requirements and active bugs list
- Node.js `fs.renameSync` documentation: EXDEV behavior is POSIX-specified, occurs when source and target are on different mount points
- Node.js `fs.writeFileSync` with `{ flag: 'wx' }`: exclusive-create semantics for lockfile patterns
- YAML 1.2 specification: colon-space as mapping indicator, quoting rules for special characters in scalar values
- Existing installer patterns: `cleanFlatCommandFiles` (line 459) and `installClaudeCommandRuntime` (line 833) demonstrate the correct in-place update pattern already used for Claude Code but not yet applied to other runtimes

---
*Pitfalls research for: Scriveno v1.6 installer hardening*
*Researched: 2026-04-16*
