const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

describe('Phase 40: save / undo state integrity', () => {
  it('save updates STATE.md before the checkpoint commit', () => {
    const save = read('commands/scr/save.md');
    // Step numbers may grow as new write-side steps land (CONTEXT.md regeneration,
    // HISTORY.log append). The invariant is ordering: STATE.md update precedes the
    // commit, and CONTEXT.md / HISTORY.log (when present) sit between them so the
    // commit captures all three writes.
    const stateStep = save.search(/^\s*\d+\.\s+\*\*Update STATE\.md\*\* "Last actions" table/m);
    const executeStep = save.search(/^\s*\d+\.\s+\*\*Execute the save:\*\*/m);

    assert.notEqual(stateStep, -1, 'save.md should include the STATE.md update step');
    assert.notEqual(executeStep, -1, 'save.md should include the checkpoint execution step');
    assert.ok(
      stateStep < executeStep,
      'save.md should update STATE.md before executing the checkpoint commit'
    );

    assert.match(
      save,
      /git add \.manuscript\/[\s\S]*git commit -m "\{generated message\}"/,
      'save.md should still stage and commit the manuscript tree after the state update'
    );
  });

  it('undo targets an explicit manuscript commit instead of assuming HEAD', () => {
    const undo = read('commands/scr/undo.md');

    assert.match(
      undo,
      /git log -1 --format="%H\|%s" --grep="\^\(Saved\|Initial save\)" --extended-regexp \.manuscript\//,
      'undo.md should capture the explicit target commit hash from filtered save history'
    );

    assert.match(
      undo,
      /This must be the most recent actual save, not merely the most recent commit that touched `\.manuscript\/`\./,
      'undo.md should clarify that admin manuscript commits are not valid undo targets'
    );

    assert.doesNotMatch(
      undo,
      /git revert HEAD --no-edit/,
      'undo.md should not assume HEAD is the manuscript checkpoint to revert'
    );

    assert.match(
      undo,
      /git revert \{target hash\} --no-commit/,
      'undo.md should use a no-commit revert for the explicit target hash'
    );
  });

  it('undo commits the revert and STATE.md update together', () => {
    const undo = read('commands/scr/undo.md');

    assert.match(
      undo,
      /git revert \{target hash\} --no-commit[\s\S]*?Update STATE\.md[\s\S]*?git add \.manuscript\/[\s\S]*?git commit -m "Undid save: \{writer-friendly description\}"/,
      'undo.md should create one final undo commit that includes the revert and the state update'
    );
  });
});
