const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function collectCommandCount(dir) {
  let count = 0;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      count += collectCommandCount(fullPath);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      count += 1;
    }
  }

  return count;
}

describe('collaboration trust surfaces', () => {
  const gettingStarted = read('docs/getting-started.md');
  const commandReference = read('docs/command-reference.md');
  const readme = read('README.md');
  const sessionReport = read('commands/scr/session-report.md');
  const commandCount = collectCommandCount(path.join(ROOT, 'commands', 'scr'));

  it('keeps launch docs aligned to the live command inventory count', () => {
    assert.match(
      readme,
      new RegExp(`${commandCount} writing commands`),
      'README.md should keep its headline command count aligned to the live command tree'
    );
    assert.match(
      readme,
      new RegExp(`All ${commandCount} commands`),
      'README.md should keep its command-reference pointer aligned to the live command tree'
    );
  });

  it('keeps onboarding collaboration centered on /scr-track and versions distinct', () => {
    assert.match(
      gettingStarted,
      /\*\*World and research\*\* -- `\/scr-build-world`, `\/scr-new-place`, `\/scr-geography-map`, `\/scr-research`/,
      'docs/getting-started.md should expose the world and research journey after the core loop'
    );
    assert.match(
      gettingStarted,
      /\*\*Publishing\*\* -- `\/scr-front-matter`, `\/scr-back-matter`, `\/scr-prepublish-review`, `\/scr-publish`, `\/scr-export`, `\/scr-cover-art`, `\/scr-blurb`/,
      'docs/getting-started.md should keep the current publishing journey visible'
    );
    assert.match(
      gettingStarted,
      /\*\*Collaboration\*\* -- `\/scr-track` for revision tracks \(`create`, `compare`, `merge`, `propose`\)/,
      'docs/getting-started.md should teach /scr-track as the collaboration entrypoint'
    );
    assert.match(
      gettingStarted,
      /\*\*Versions\*\* -- `\/scr-save`, `\/scr-history`, `\/scr-versions`, `\/scr-compare`/,
      'docs/getting-started.md should keep save-history commands in a separate versions bucket'
    );
    assert.doesNotMatch(
      gettingStarted,
      /\*\*Collaboration\*\* -- `\/scr-save`, `\/scr-history`, `\/scr-compare`/,
      'docs/getting-started.md should not present save-history commands as the collaboration surface'
    );
  });

  it('keeps the public collaboration reference on the canon-manuscript model', () => {
    assert.match(
      commandReference,
      /Revision tracks and their collaboration subcommands/,
      'docs/command-reference.md should describe collaboration as a track-centered surface'
    );
    assert.match(
      commandReference,
      /- `merge` -- Merge a track into the canon manuscript/,
      'docs/command-reference.md should use canon-manuscript terminology for track merge'
    );
    assert.match(
      commandReference,
      /without affecting your canon manuscript\./,
      'docs/command-reference.md examples should use canon-manuscript terminology'
    );
    assert.doesNotMatch(
      commandReference,
      /main draft/,
      'docs/command-reference.md should not revert to the older main-draft terminology'
    );
  });

  it('keeps session and version reference text aligned to the live command contracts', () => {
    assert.match(
      commandReference,
      /Use `--all` when you want the complete save-version list without the default 10-version cap\./,
      'docs/command-reference.md should describe versions output as save history, not archived drafts'
    );
    assert.doesNotMatch(
      commandReference,
      /Draft 1 \(archived\), Draft 2 \(current\)/,
      'docs/command-reference.md should not imply an archived-draft model for versions'
    );
    assert.match(
      commandReference,
      /- `--force` -- Skip the unsaved-changes warning, but still require confirmation before undoing/,
      'docs/command-reference.md should describe undo --force the same way as the live command contract'
    );
    assert.match(
      commandReference,
      /still asks for confirmation, even with `--force`\./,
      'docs/command-reference.md should not imply that undo --force bypasses confirmation'
    );
  });

  it('keeps session-report duration fallback on save commits only', () => {
    assert.match(
      sessionReport,
      /git log --format="%ai\|%s" --grep="\^\(Saved\|Initial save\)" --extended-regexp \.manuscript\//,
      'session-report.md should estimate duration from save commits only'
    );
    assert.match(
      sessionReport,
      /Do not use administrative manuscript commits such as revision-track creation, proposals, or merges for session timing\./,
      'session-report.md should explicitly exclude admin commits from duration estimation'
    );
    assert.match(
      sessionReport,
      /Prefer `Session metrics` start time from `STATE\.md`; if present, restrict the save history lookup to save commits at or after that timestamp\./,
      'session-report.md should scope fallback timestamps to the current session when Session metrics are available'
    );
    assert.match(
      sessionReport,
      /last recorded `\/scr:pause-work` or `\/scr:resume-work` marker in the Last actions table/i,
      'session-report.md should tie save-history fallback to recorded pause/resume markers'
    );
    assert.match(
      sessionReport,
      /If you cannot isolate the current session from save history with confidence, omit the Duration line and note: "Duration not available \(session boundary timestamps unavailable\)\."/,
      'session-report.md should refuse to overstate duration when it cannot isolate the current session boundary'
    );
  });
});
