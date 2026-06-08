---
description: Build a Smashwords/D2D-compliant DOCX from the manuscript.
argument-hint: "[--skip-validate]"
---

# /scr:build-smashwords -- Smashwords/D2D DOCX Build Pipeline

Assemble the manuscript and produce a Smashwords Style Guide-compliant DOCX for submission to Draft2Digital (D2D) or direct Smashwords upload. Uses `scriveno-smashwords.docx` as a Pandoc reference document to enforce no-tabs, first-line-indent-via-style, and auto-TOC rules.

## Usage

```
/scr:build-smashwords [--skip-validate]
```

**Flags:**
  `--skip-validate`    Skip the scaffold marker pre-flight check (not recommended).

## Instruction

You are a **manuscript build specialist** for Smashwords/D2D DOCX output.

---

### STEP 1: LOAD CONTEXT

Load the following project files:

- `.manuscript/config.json` -- to get `work_type`, title, author, language, and project settings
- Scriveno's installed/shared `CONSTRAINTS.json` -- to check `exports` section for format availability

**Check format availability:**

Look up `build-smashwords` in `CONSTRAINTS.json` under the `commands` section. Check if the work type group is in the `available` list: `["prose", "visual"]`.

If not available:
> This command is not available for [work_type] projects. The Smashwords DOCX build is available for: prose and visual work types. Poets should use `/scr:build-poetry-submission` instead.

Then **stop**.

---

### STEP 1.5: VALIDATE MANUSCRIPT

**Check for scaffold markers in `.manuscript/drafts/`.**

Scan all `.md` files in `.manuscript/drafts/` for:
- Lines containing `[Fill in`
- Lines containing `[Delete if not applicable:]`
- Lines containing `Alternate 1:` or `Alternate 2:`
- Files with more than one `# ` (top-level H1) heading

**If `--skip-validate` was passed:**
> **Warning: Validate gate skipped (`--skip-validate`). Your manuscript may contain unresolved scaffold markers.**

Proceed to STEP 2.

**If markers are found:**
> **Build blocked: unresolved scaffold markers found.**
>
> [list each as: `path/to/file.md:LINE_NUMBER: marker text`]
>
> **Fix:** Run `/scr:cleanup --apply` to remove scaffold markers, then re-run this build command.

Then **stop**.

---

### STEP 1.6: FRONT-MATTER GATE

Follow /scr:build-ebook STEP 1.6a-1.6b (scaffold exclusion and existing front-matter freshness warning). Do not generate or refresh front matter from this command.
Use the resulting scaffold exclusion list in STEP 3 assembly.

---

### STEP 2: CHECK PREREQUISITES

Check for Pandoc:
```bash
command -v pandoc >/dev/null 2>&1
```

If not found:
> **Pandoc is required for Smashwords DOCX build but is not installed.**
> - macOS: `brew install pandoc`
> - Linux: `sudo apt install pandoc`
> - Windows: `choco install pandoc`

Then **stop**.

Check that the reference document exists:

If `data/export-templates/scriveno-smashwords.docx` does not exist:
> **Smashwords reference document missing at `data/export-templates/scriveno-smashwords.docx`.**
> Re-install Scriveno or restore the file from the repository.

Then **stop**.

---

### STEP 3: ASSEMBLE MANUSCRIPT

Follow the same assembly steps as `/scr:build-ebook` STEP 3a-3e:
- Read OUTLINE.md for document order
- Scan front matter (scaffold-excluded)
- Read body drafts in OUTLINE.md order
- Scan back matter
- Concatenate to `.manuscript/output/assembled-manuscript.md`
- Generate `.manuscript/output/metadata.yaml`

---

### STEP 4: BUILD SMASHWORDS DOCX

```bash
pandoc .manuscript/output/assembled-manuscript.md \
  -o .manuscript/output/smashwords.docx \
  --reference-doc=data/export-templates/scriveno-smashwords.docx \
  --metadata-file=.manuscript/output/metadata.yaml \
  --toc \
  --toc-depth=2
```

**Smashwords compliance notes applied automatically by the reference doc:**
- First-line indent comes from the Normal paragraph style (not tabs or spaces)
- No custom headers/footers -- removed by reference doc style
- Auto-generated TOC field (Word-compatible) via `--toc`

**Post-build reminder:**
> **Smashwords submission checklist:**
> 1. Open `smashwords.docx` and verify no tab characters (Find/Replace `^t` -- result should be zero matches)
> 2. Confirm all body text uses the Normal paragraph style with first-line indent
> 3. Confirm the auto-TOC updates when you open the document (Word: right-click TOC -> Update Field)
> 4. Submit via https://www.smashwords.com/upload or Draft2Digital upload portal

---

### STEP 5: REPORT

Show:
```
OK Smashwords DOCX built -> .manuscript/output/smashwords.docx ({file_size})
```

Get file size with:
```bash
ls -lh .manuscript/output/smashwords.docx | awk '{print $5}'
```

## Response Contract

Every writer-facing response must end with one to four next-command suggestions. Each suggestion must include a short explanation of what that path will do.

The final visible section of every writer-facing response must be the `Next commands:` block. This applies to successful completion, partial completion, blocked, stopped, validation-failed, and prerequisite-missing responses. Do not end with only a summary, report, checklist, external action, upload instruction, or prose-only options.

Use the invocation style for the active runtime when writing command suggestions. Source command IDs use `/scr:*`; Claude Code installed commands use `/scr-*`; Codex installed skills use `$scr-*`. Suggest only runnable Scriveno commands that exist in the installed command surface. Do not invent adjacent workflow names.

Use this format:

```markdown
Next commands:
- `/scr:...`: One short sentence explaining what this path will do.
- `/scr:...`: One short sentence explaining what this alternate path will do.
```

If exactly one path is clearly best, provide one suggestion. If two, three, or four useful paths exist, show them as alternatives. Do not force a linear path when the writer has a real choice.

If the writer seems unsure or no specific next command is obvious, include this default option:

```markdown
Next commands:
- `/scr:next`: Inspect the project state and choose the right next step.
```

If the command stops because a prerequisite is missing, suggest the command that fixes the prerequisite. Keep every explanation practical and writer-facing.
