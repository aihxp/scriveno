# Feature Landscape

**Domain:** CLI installer hardening (atomic writes, config preservation, schema validation, frontmatter parsing, cross-runtime command-ref rewriting)
**Researched:** 2026-04-16

## Table Stakes

Features that are expected for a reliable installer. Missing = users hit data loss, broken configs, or silent failures.

| Feature | Why Expected | Complexity | Dependencies | Notes |
|---------|--------------|------------|--------------|-------|
| Atomic file writes (write-then-rename) | Ctrl+C during install currently leaves half-written files. Any installer that writes config/settings files must survive interrupts. | Low | `writeSharedAssets`, `copyDir`, `writeInstalledCommandManifest`, `writeCodexSkillManifest`, all `fs.writeFileSync` call sites | Pattern: write to `target.tmp.PID.random`, then `fs.renameSync` to final path. Wrap in try/catch to clean up temp on failure. Pure Node stdlib, no npm dep needed. |
| Frontmatter colon handling | `readFrontmatterValue` regex `^key:\s*(.+)$` works but is fragile. Values like `description: "Scriveno: a writing tool"` parse correctly because `.+` is greedy. The real bug is values where the colon is unquoted in YAML-style frontmatter and a proper YAML parser would split differently. Current regex actually captures the full line after `key: `, so the immediate colon bug may be about edge cases with quoted/multi-part values. | Low | `readFrontmatterValue` function (line 292), called by `collectCommandEntries` for `description` and `argument-hint` fields | Test actual failing cases first. If only colons matter, the fix may be trivial (the current regex is greedy). If multiline/arrays matter, use gray-matter or a targeted YAML subset parser. |
| Frontmatter multiline value support | Multiline `description` or `argument-hint` values in command markdown files silently lose all lines after the first. | Medium | `readFrontmatterValue` function | Current regex only matches a single line. Need to detect YAML multiline indicators (`|`, `>`) and read continuation lines. Consider replacing with proper frontmatter block extraction + a small YAML parser for the extracted block. |
| Frontmatter array value support | YAML arrays in frontmatter (e.g., `tags: [foo, bar]` or flow-style `tags:\n  - foo\n  - bar`) are not parseable by the current single-line regex. | Medium | `readFrontmatterValue` function | Only needed if command frontmatter actually uses arrays. Verify whether any `.md` file in `commands/scr/` uses array-valued frontmatter before building this. If none do today and none are planned, defer. |
| Settings preservation on reinstall | `writeSharedAssets` calls `removePathIfExists` on templates and data dirs, wiping everything including `settings.json` user edits. Reinstalling via `npx scriveno@latest` destroys any manual config changes. | Medium | `writeSharedAssets` function (line 922), `copyDir` function (line 648) | Three-layer strategy: (1) read existing settings before overwrite, (2) merge user-set fields over new defaults, (3) write merged result. User fields to preserve: any key not in the installer-generated schema (future custom keys). |
| Template preservation on reinstall | Templates dir is nuked and recopied. Users who customized templates lose their work. | Medium | `writeSharedAssets` function, `copyDir` function | Strategy: only overwrite files that match the package version's content. If a user has modified a template (content differs from both old and new package versions), skip it and warn. Can use content hash comparison or mtime-based heuristic. |
| Settings schema validation | `readJsonIfExists` silently swallows parse errors and returns `null`. No validation that settings.json contains required fields or correct types. A typo in settings causes silent misbehavior, not a clear error. | Low | New function needed; consumed wherever settings are read | Define expected schema inline (no Ajv dependency needed for a simple flat object). Validate required fields, types, and known enum values. Return structured errors. |
| Command-ref rewriting for all runtimes | Only Claude Code rewrites `/scr:help` to `/scr-help`. Cursor, Gemini, Windsurf, etc. install command files with raw `/scr:` references that may not match those runtimes' invocation syntax. | Medium | `rewriteInstalledCommandRefs` (line 439), `installCommandRuntime` (line 821), each runtime's install function | Each runtime needs a transform function. Most colon-based runtimes (Cursor, Gemini, etc.) may use `/scr:` natively. Codex already has `commandRefToCodexInvocation`. Map which runtimes need rewriting and which don't. |

## Differentiators

Features that set the installer apart from typical CLI tool installers. Not expected, but valued.

| Feature | Value Proposition | Complexity | Dependencies | Notes |
|---------|-------------------|------------|--------------|-------|
| Rollback on failed install | If any write fails mid-install, undo all changes made so far. Most CLI installers don't do this. | High | All install functions, requires transaction log of changes made | Nice to have but complex. Would need to track every file written/deleted and reverse on failure. Defer unless atomic writes alone prove insufficient. |
| Settings migration across versions | When settings schema changes between versions, automatically migrate old settings to new schema with clear warnings about deprecated or renamed fields. | Medium | `writeSharedAssets`, settings schema definition | Useful for long-term maintenance. Add a `schema_version` field to settings.json. On load, if schema_version < current, run migration logic. |
| Dry-run mode (`--dry-run`) | Show what would be installed/overwritten without making changes. Builds user trust before destructive operations. | Low | All install functions need a `dryRun` flag | Valuable for debugging reinstall issues. Log all file operations that would happen. |
| Template diff on reinstall | When a user-modified template conflicts with a new version, show the diff and let the user choose. | High | Template preservation logic | Overkill for a silent installer. A warning message pointing to the conflicting file is sufficient. |
| Backup before reinstall | Create a timestamped backup of `.scriveno/` before any reinstall operation. | Low | `writeSharedAssets` function | Simple `copyDir` of existing `.scriveno` to `.scriveno.backup.TIMESTAMP` before starting. Low cost, high safety. |

## Anti-Features

Features to explicitly NOT build.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Full YAML parser as npm dependency | Scriveno is zero-dependency. Adding `js-yaml` or `gray-matter` as a runtime dep breaks the architecture constraint. | Write a targeted frontmatter parser that handles the specific patterns in Scriveno's command files: single-line values (including colons), quoted values, and optionally multiline (`\|`, `>`) indicators. The frontmatter surface is small and controlled by Scriveno itself. |
| JSON Schema validation library (Ajv) | Same zero-dependency constraint. Ajv is 180KB+ and massive overkill for validating a 10-field settings object. | Hand-written validation function with clear error messages. The settings schema is small, flat, and controlled by the installer. |
| Interactive merge conflict resolution | The installer runs via `npx` in terminal or non-interactively via `--silent`. Asking merge questions during install breaks both modes. | Preserve user changes silently with a deterministic merge strategy. Log warnings about skipped overwrites. |
| Git-based config versioning | Tracking settings changes via git adds complexity for non-developer users (the default audience). | Use simple file-level preservation: backup + merge on reinstall. |
| Full transaction/rollback system | Adds significant complexity for a failure mode (mid-install crash) that atomic writes already mitigate. | Atomic writes per file are sufficient. If the whole install fails, the user reruns it. Individual files won't be corrupted. |
| write-file-atomic npm dependency | The pattern is simple enough to implement in ~15 lines of Node stdlib. Adding a dependency for this is unnecessary. | Implement `writeFileAtomic(filePath, content)` as a local utility: `writeFileSync(tmp)` then `renameSync(tmp, target)` with cleanup in catch. |

## Feature Dependencies

```
Atomic file writes        (standalone, no deps on other features)
        |
        v
Settings schema validation (uses atomic writes when writing validated settings)
        |
        v
Settings preservation     (depends on schema validation to merge correctly)
        |
        v
Template preservation      (same pattern as settings preservation)

Frontmatter colon fix      (standalone, no deps on other features)
        |
        v
Frontmatter multiline      (extends the same parser)

Command-ref rewriting      (standalone per runtime, depends on knowing each runtime's invocation format)
```

## MVP Recommendation

Prioritize in this order:

1. **Atomic file writes** - Foundational safety net. Every other write operation benefits from this. ~15 lines of utility code, pure Node stdlib. Wrap all `writeFileSync` and `writeInstalledCommandManifest`/`writeCodexSkillManifest` calls.

2. **Frontmatter colon handling** - Verify the actual bug first. The current regex may already handle simple colon cases (`.+` is greedy). Test with real command files to identify what actually breaks. Fix may be trivial or may require a small parser rewrite.

3. **Settings schema validation** - Define the expected shape of `settings.json`, validate on read, fail loudly with actionable error messages. Small, self-contained.

4. **Settings/template preservation on reinstall** - Read existing settings before overwrite, merge user values over new defaults, skip user-modified templates with a warning. This is the most user-visible improvement.

5. **Command-ref rewriting for all runtimes** - Audit which runtimes actually need ref rewriting (some may use `/scr:` natively). Implement transforms only for runtimes that need them.

Defer:
- **Frontmatter array support**: Only build if command files actually use arrays today. Verify first.
- **Frontmatter multiline support**: Only build if command files actually use multiline values today. Verify first.
- **Rollback on failed install**: Atomic writes handle the critical case (file corruption). Full rollback is overengineered for this context.
- **Dry-run mode**: Useful but not part of the hardening scope.
- **Backup before reinstall**: Low cost but can be added later without architectural impact.

## Existing Function Inventory (Hardening Targets)

| Function | Location | Hardening Need |
|----------|----------|---------------|
| `readFrontmatterValue` | line 292 | Colon handling, multiline, arrays |
| `copyDir` | line 648 | Atomic writes (each file copy should be atomic) |
| `writeSharedAssets` | line 922 | Settings/template preservation, atomic writes |
| `writeInstalledCommandManifest` | line 499 | Atomic writes |
| `writeCodexSkillManifest` | line 720 | Atomic writes |
| `readJsonIfExists` | line 665 | Schema validation integration point |
| `rewriteInstalledCommandRefs` | line 439 | Cross-runtime support (already exists, needs wider use) |
| `generateClaudeCommandContent` | line 448 | Reference implementation for runtime-specific rewriting |
| `installCommandRuntime` | line 821 | Needs to use rewriteInstalledCommandRefs with runtime-appropriate transform |

## Sources

- [write-file-atomic (npm)](https://www.npmjs.com/package/write-file-atomic) -- Reference implementation for atomic write pattern
- [gray-matter (GitHub)](https://github.com/jonschlinkert/gray-matter) -- Battle-tested frontmatter parser (not recommended as dependency, but useful as reference)
- [YAML frontmatter quoting guidelines](https://icicity.com/articles/code/markdown/yaml-frontmatter-quoting-guidelines) -- Edge cases with colons and special characters
- [Ajv JSON schema validator](https://ajv.js.org/) -- Reference for schema validation patterns (not recommended as dependency)
- [npm/write-file-atomic (GitHub)](https://github.com/npm/write-file-atomic) -- Source code showing write-then-rename pattern
- [Escaping Characters in YAML Front Matter](https://inspirnathan.com/posts/134-escape-characters-in-yaml-frontmatter/) -- YAML frontmatter edge cases
- [IBM: Preservation of custom configuration files after install/upgrade](https://www.ibm.com/support/pages/preservation-custom-configuration-files-after-installupgrade-operations) -- Enterprise config preservation patterns
