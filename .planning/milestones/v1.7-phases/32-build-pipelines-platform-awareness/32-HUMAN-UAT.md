---
status: partial
phase: 32-build-pipelines-platform-awareness
source: [32-VERIFICATION.md]
started: 2026-04-17T00:00:00.000Z
updated: 2026-04-17T00:00:00.000Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. EPUB output passes EPUBCheck
expected: Running `/scr:build-ebook` on a manuscript with Pandoc installed produces an EPUB file that passes `epubcheck` validation with zero errors - accessibility attributes (lang tags, alt text pre-check, semantic nav) are structurally present
result: [pending]

### 2. PDF produced with correct trim dimensions
expected: Running `/scr:build-print --platform kdp` on a manuscript with Pandoc + Typst installed produces a PDF where the page dimensions match the selected trim size (e.g., 6x9 -> 6.0 × 9.0 inches as reported by `pdfinfo` or Adobe Acrobat)
result: [pending]

## Summary

total: 2
passed: 0
issues: 0
pending: 2
skipped: 0
blocked: 0

## Gaps
