const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CLEANUP_PATH = path.join(ROOT, 'commands', 'scr', 'cleanup.md');
const VALIDATE_PATH = path.join(ROOT, 'commands', 'scr', 'validate.md');
const EXPORT_PATH = path.join(ROOT, 'commands', 'scr', 'export.md');
const PUBLISH_PATH = path.join(ROOT, 'commands', 'scr', 'publish.md');

/**
 * Read a file and return its content, or null if it doesn't exist.
 * Tests that need the file content will fail with a descriptive message
 * when the file is missing, rather than crashing the whole suite.
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (_) {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CLEAN-01: /scr:cleanup command exists with correct structure and flags
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 30: CLEAN-01 cleanup.md exists and is structurally valid', () => {
  it('cleanup.md exists at commands/scr/cleanup.md', () => {
    assert.ok(
      fs.existsSync(CLEANUP_PATH),
      'commands/scr/cleanup.md must exist -- CLEAN-01 requires a /scr:cleanup command'
    );
  });

  it('cleanup.md content contains YAML frontmatter and description: field', () => {
    const content = readFile(CLEANUP_PATH);
    assert.ok(content !== null, 'commands/scr/cleanup.md could not be read');
    assert.match(
      content,
      /^---\n[\s\S]*?\n---/,
      'cleanup.md must have YAML frontmatter (--- block)'
    );
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    assert.ok(frontmatterMatch, 'cleanup.md has no frontmatter to check');
    assert.ok(
      frontmatterMatch[1].includes('description:'),
      'cleanup.md frontmatter must include a description: field'
    );
  });

  it('cleanup.md content includes --apply flag mention', () => {
    const content = readFile(CLEANUP_PATH);
    assert.ok(content !== null, 'commands/scr/cleanup.md could not be read');
    assert.ok(
      content.includes('--apply'),
      'cleanup.md must mention the --apply flag (CLEAN-01: dry-run by default, --apply to execute)'
    );
  });

  it('cleanup.md scopes to .manuscript/drafts/ (not a broader glob)', () => {
    const content = readFile(CLEANUP_PATH);
    assert.ok(content !== null, 'commands/scr/cleanup.md could not be read');
    assert.ok(
      content.includes('.manuscript/drafts/'),
      'cleanup.md must explicitly scope to .manuscript/drafts/ to avoid stripping front-matter scaffold (CLEAN-01 + Pitfall 2)'
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CLEAN-02: /scr:cleanup reports a diff summary after --apply
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 30: CLEAN-02 cleanup.md includes diff summary language', () => {
  it('cleanup.md content includes Summary and removed/cleaned marker count language', () => {
    const content = readFile(CLEANUP_PATH);
    assert.ok(content !== null, 'commands/scr/cleanup.md could not be read');
    assert.ok(
      content.includes('Summary'),
      'cleanup.md must include "Summary" -- CLEAN-02 requires a diff summary showing what was changed'
    );
    const hasRemovedLanguage =
      content.includes('bracket markers') ||
      content.includes('Alternate block') ||
      content.includes('removed') ||
      content.includes('Removed');
    assert.ok(
      hasRemovedLanguage,
      'cleanup.md must mention removed/cleaned marker counts (bracket markers, Alternate block, or removed) -- CLEAN-02 diff summary'
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// VALID-01: /scr:validate command exists with correct structure
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 30: VALID-01 validate.md exists and is structurally valid', () => {
  it('validate.md exists at commands/scr/validate.md', () => {
    assert.ok(
      fs.existsSync(VALIDATE_PATH),
      'commands/scr/validate.md must exist -- VALID-01 requires a /scr:validate command'
    );
  });

  it('validate.md content contains YAML frontmatter and description: field', () => {
    const content = readFile(VALIDATE_PATH);
    assert.ok(content !== null, 'commands/scr/validate.md could not be read');
    assert.match(
      content,
      /^---\n[\s\S]*?\n---/,
      'validate.md must have YAML frontmatter (--- block)'
    );
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    assert.ok(frontmatterMatch, 'validate.md has no frontmatter to check');
    assert.ok(
      frontmatterMatch[1].includes('description:'),
      'validate.md frontmatter must include a description: field'
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// VALID-02: /scr:validate blocks with non-zero exit on dirty manuscript
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 30: VALID-02 validate.md blocks on marker detection', () => {
  it('validate.md mentions non-zero exit / stop on marker detection', () => {
    const content = readFile(VALIDATE_PATH);
    assert.ok(content !== null, 'commands/scr/validate.md could not be read');
    const hasStopLanguage = content.includes('stop') || content.includes('Stop');
    const hasBlockingLanguage =
      content.includes('non-zero') ||
      content.includes('fail') ||
      content.includes('Fail') ||
      content.includes('blocked') ||
      content.includes('Blocked');
    assert.ok(
      hasStopLanguage,
      'validate.md must include "stop" instruction -- VALID-02 requires blocking behavior on marker detection'
    );
    assert.ok(
      hasBlockingLanguage,
      'validate.md must indicate blocking behavior (non-zero, fail, or blocked) -- VALID-02'
    );
  });

  it('validate.md failure examples use the canonical body draft naming contract', () => {
    const content = readFile(VALIDATE_PATH);
    assert.ok(content !== null, 'commands/scr/validate.md could not be read');
    assert.match(
      content,
      /\.manuscript\/drafts\/body\/1-opening-image-DRAFT\.md:3:/,
      'validate.md should show failure examples using the canonical *-DRAFT.md body file contract'
    );
  });

  it('validate.md references file:line output format', () => {
    const content = readFile(VALIDATE_PATH);
    assert.ok(content !== null, 'commands/scr/validate.md could not be read');
    const hasFileLineFormat =
      /\.md:/.test(content) ||
      content.includes('file:line') ||
      content.includes('LINE_NUMBER') ||
      content.includes(':LINE') ||
      /:\d/.test(content.match(/\.md:\d/) ? content.match(/\.md:\d/)[0] : '');
    // More robust: look for the pattern describing file:line output
    const hasLineRef =
      content.includes('.md:') ||
      content.includes('file:line') ||
      content.includes('LINE_NUMBER') ||
      content.includes('line number') ||
      content.includes(':LINE');
    assert.ok(
      hasLineRef,
      'validate.md must reference file:line output format -- VALID-02 requires per-file, per-line marker reporting'
    );
  });

  it('validate.md mentions pass confirmation message', () => {
    const content = readFile(VALIDATE_PATH);
    assert.ok(content !== null, 'commands/scr/validate.md could not be read');
    const hasPassConfirmation =
      content.includes('Manuscript clean') ||
      content.includes('no scaffold markers found') ||
      content.includes('manuscript clean') ||
      content.includes('No scaffold markers');
    assert.ok(
      hasPassConfirmation,
      'validate.md must include an explicit clean pass confirmation message ("Manuscript clean" or "no scaffold markers found") -- VALID-02 / SC4'
    );
  });
});

describe('Phase 34: poetry submission assembly reads canonical body draft files', () => {
  it('build-poetry-submission.md reads poem units from *-DRAFT.md files', () => {
    const poetryBuildPath = path.join(ROOT, 'commands', 'scr', 'build-poetry-submission.md');
    const content = readFile(poetryBuildPath);
    assert.ok(content !== null, 'commands/scr/build-poetry-submission.md could not be read');
    assert.match(
      content,
      /\.manuscript\/drafts\/body\/\[poem-file\]-DRAFT\.md/,
      'build-poetry-submission.md should assemble poems from canonical *-DRAFT.md body files'
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// VALID-03: export.md and publish.md contain validate gate (STEP 1.5)
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 30: VALID-03 export.md has validate gate before prerequisites step', () => {
  it('export.md contains STEP 1.5 validate gate and it appears before STEP 2', () => {
    const content = readFile(EXPORT_PATH);
    assert.ok(content !== null, 'commands/scr/export.md could not be read');
    const step15Pos = content.indexOf('STEP 1.5');
    const step2Pos = content.indexOf('STEP 2');
    assert.ok(step15Pos !== -1, 'export.md must contain STEP 1.5 validate gate -- VALID-03');
    assert.ok(step2Pos !== -1, 'export.md must contain STEP 2 (CHECK PREREQUISITES)');
    assert.ok(
      step15Pos < step2Pos,
      'STEP 1.5 must appear before STEP 2 in export.md -- gate must run before tool detection (Pitfall 1)'
    );
  });

  it('export.md gate block mentions --skip-validate bypass', () => {
    const content = readFile(EXPORT_PATH);
    assert.ok(content !== null, 'commands/scr/export.md could not be read');
    assert.ok(
      content.includes('--skip-validate'),
      'export.md gate must mention --skip-validate bypass flag -- VALID-03 escape hatch'
    );
  });

  it('export.md gate block mentions /scr:cleanup --apply as resolution path', () => {
    const content = readFile(EXPORT_PATH);
    assert.ok(content !== null, 'commands/scr/export.md could not be read');
    assert.ok(
      content.includes('/scr:cleanup --apply'),
      'export.md gate must mention "/scr:cleanup --apply" as the actionable resolution -- VALID-03 / SC3'
    );
  });
});

describe('Phase 30: VALID-03 publish.md has validate gate before STEP 2 routing', () => {
  it('publish.md contains STEP 1.5 validate gate and it appears before STEP 2', () => {
    const content = readFile(PUBLISH_PATH);
    assert.ok(content !== null, 'commands/scr/publish.md could not be read');
    const step15Pos = content.indexOf('STEP 1.5');
    const step2Pos = content.indexOf('STEP 2');
    assert.ok(step15Pos !== -1, 'publish.md must contain STEP 1.5 validate gate -- VALID-03');
    assert.ok(step2Pos !== -1, 'publish.md must contain STEP 2 (ROUTE)');
    assert.ok(
      step15Pos < step2Pos,
      'STEP 1.5 must appear before STEP 2 in publish.md -- gate must run before preset routing'
    );
  });

  it('publish.md gate mentions --skip-validate with visible warning language', () => {
    const content = readFile(PUBLISH_PATH);
    assert.ok(content !== null, 'commands/scr/publish.md could not be read');
    assert.ok(
      content.includes('--skip-validate'),
      'publish.md gate must mention --skip-validate bypass flag -- VALID-03 escape hatch (Pitfall 5)'
    );
    const hasWarningLanguage =
      content.includes('Warning') ||
      content.includes('warning') ||
      content.includes('**Warning') ||
      content.includes('> **Warning');
    assert.ok(
      hasWarningLanguage,
      'publish.md --skip-validate bypass must include visible warning language -- silent bypass is forbidden (Pitfall 5)'
    );
  });
});
