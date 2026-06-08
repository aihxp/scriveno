const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const commandsDir = path.join(ROOT, 'commands', 'scr');

describe('Config template schema', () => {
  const configPath = path.join(ROOT, 'templates', 'config.json');
  let config;

  it('is valid JSON', () => {
    const raw = fs.readFileSync(configPath, 'utf8');
    config = JSON.parse(raw);
    assert.equal(typeof config, 'object');
  });

  it('has developer_mode defaulting to false', () => {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    assert.equal(config.developer_mode, false);
  });

  it('has autopilot.custom_checkpoints as an array', () => {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    assert.ok(Array.isArray(config.autopilot.custom_checkpoints),
      'autopilot.custom_checkpoints should be an array');
  });

  it('has autopilot.profile defaulting to "guided"', () => {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    assert.equal(config.autopilot.profile, 'guided');
  });

  it('has autopilot.enabled defaulting to false', () => {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    assert.equal(config.autopilot.enabled, false);
  });

  it('has autopilot publication matter defaults', () => {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    assert.equal(config.autopilot.include_matter, true);
    assert.equal(config.autopilot.matter_level, 'balanced');
  });
});

describe('STATE.md template', () => {
  const statePath = path.join(ROOT, 'templates', 'STATE.md');
  let content;

  it('contains "## Session metrics" section', () => {
    content = fs.readFileSync(statePath, 'utf8');
    assert.match(content, /## Session metrics/);
  });

  it('contains "## Session handoff" section', () => {
    content = fs.readFileSync(statePath, 'utf8');
    assert.match(content, /## Session handoff/);
  });

  it('contains "## Last actions" section with table header', () => {
    content = fs.readFileSync(statePath, 'utf8');
    assert.match(content, /## Last actions/);
    assert.match(content, /\|\s*Timestamp\s*\|/);
  });

  it('contains "## Progress" section', () => {
    content = fs.readFileSync(statePath, 'utf8');
    assert.match(content, /## Progress/);
  });

  it('has SESSION_START, SESSION_WORDS, SESSION_UNITS placeholders', () => {
    content = fs.readFileSync(statePath, 'utf8');
    assert.match(content, /SESSION_START/);
    assert.match(content, /SESSION_WORDS/);
    assert.match(content, /SESSION_UNITS/);
  });
});

describe('Writer git commands content', () => {
  const gitCommands = ['save', 'history', 'compare', 'versions', 'undo'];

  for (const cmd of gitCommands) {
    describe(cmd + '.md', () => {
      const filePath = path.join(commandsDir, cmd + '.md');

      it('exists in commands/scr/', () => {
        assert.ok(fs.existsSync(filePath), `${cmd}.md should exist`);
      });

      it('has YAML frontmatter with description field', () => {
        const content = fs.readFileSync(filePath, 'utf8');
        const fm = content.match(/^---\n([\s\S]*?)\n---/);
        assert.ok(fm, `${cmd}.md missing YAML frontmatter`);
        assert.ok(fm[1].includes('description:'),
          `${cmd}.md frontmatter missing description field`);
      });

      it('references developer_mode or writer mode', () => {
        const content = fs.readFileSync(filePath, 'utf8');
        assert.ok(
          content.includes('developer_mode') || content.includes('writer mode') || content.includes('Writer mode'),
          `${cmd}.md should reference developer_mode or writer mode`
        );
      });
    });
  }

  it('save.md contains auto-generated message pattern', () => {
    const content = fs.readFileSync(path.join(commandsDir, 'save.md'), 'utf8');
    assert.match(content, /Saved after drafting/);
  });

  it('history.md contains Date, Action, Details table columns', () => {
    const content = fs.readFileSync(path.join(commandsDir, 'history.md'), 'utf8');
    assert.match(content, /Date/);
    assert.match(content, /Action/);
    assert.match(content, /Details/);
  });

  it('compare.md contains Before and After prose diff format', () => {
    const content = fs.readFileSync(path.join(commandsDir, 'compare.md'), 'utf8');
    assert.match(content, /Before/);
    assert.match(content, /After/);
  });

  it('compare.md contains anti-pattern instruction (NEVER show +/-/@@)', () => {
    const content = fs.readFileSync(path.join(commandsDir, 'compare.md'), 'utf8');
    assert.match(content, /NEVER/);
    assert.ok(
      content.includes('+') || content.includes('-') || content.includes('@@'),
      'compare.md should mention +, -, or @@ as anti-patterns'
    );
  });

  it('undo.md contains confirmation prompt with "will lose"', () => {
    const content = fs.readFileSync(path.join(commandsDir, 'undo.md'), 'utf8');
    assert.ok(
      content.includes("You'll lose") || content.includes('will lose'),
      'undo.md should contain "You\'ll lose" or "will lose"'
    );
  });

  it('undo.md contains unsaved/uncommitted safety check', () => {
    const content = fs.readFileSync(path.join(commandsDir, 'undo.md'), 'utf8');
    assert.ok(
      content.includes('unsaved') || content.includes('uncommitted'),
      'undo.md should reference unsaved or uncommitted changes'
    );
  });
});

describe('Session commands content', () => {
  const sessionCommands = ['pause-work', 'resume-work', 'session-report'];

  for (const cmd of sessionCommands) {
    describe(cmd + '.md', () => {
      const filePath = path.join(commandsDir, cmd + '.md');

      it('exists in commands/scr/', () => {
        assert.ok(fs.existsSync(filePath), `${cmd}.md should exist`);
      });

      it('has YAML frontmatter with description field', () => {
        const content = fs.readFileSync(filePath, 'utf8');
        const fm = content.match(/^---\n([\s\S]*?)\n---/);
        assert.ok(fm, `${cmd}.md missing YAML frontmatter`);
        assert.ok(fm[1].includes('description:'),
          `${cmd}.md frontmatter missing description field`);
      });
    });
  }

  it('pause-work.md contains notes and come back', () => {
    const content = fs.readFileSync(path.join(commandsDir, 'pause-work.md'), 'utf8');
    assert.match(content, /notes/i);
    assert.match(content, /come back/i);
  });

  it('pause-work.md records a pause marker in Last actions', () => {
    const content = fs.readFileSync(path.join(commandsDir, 'pause-work.md'), 'utf8');
    assert.match(
      content,
      /Append a row to the "Last actions" table[\s\S]*Command: `pause-work`[\s\S]*Outcome: `Paused session`/i
    );
  });

  it('pause-work.md checks for unsaved work before mutating STATE.md', () => {
    const content = fs.readFileSync(path.join(commandsDir, 'pause-work.md'), 'utf8');
    assert.match(content, /Check for pre-existing uncommitted manuscript changes before mutating STATE\.md/i);
    assert.match(content, /This check must happen before you update `STATE\.md`/i);
    assert.match(content, /Use the result from step 2, not a fresh post-update `git status` check\./i);
  });

  it('resume-work.md contains "Last time" or "last time"', () => {
    const content = fs.readFileSync(path.join(commandsDir, 'resume-work.md'), 'utf8');
    assert.ok(
      content.includes('Last time') || content.includes('last time'),
      'resume-work.md should contain "Last time" or "last time"'
    );
  });

  it('resume-work.md resets Session metrics and records a resume marker', () => {
    const content = fs.readFileSync(path.join(commandsDir, 'resume-work.md'), 'utf8');
    assert.match(content, /Set `## Session metrics` -> `Current session started` to the current timestamp\./);
    assert.match(content, /Units this session: 0/);
    assert.match(content, /Words this session: 0/);
    assert.match(content, /Quality passes: none yet/);
    assert.match(
      content,
      /Append a row to the "Last actions" table[\s\S]*Command: `resume-work`[\s\S]*Outcome: `Resumed session`/i
    );
  });

  it('session-report.md contains words and units metrics', () => {
    const content = fs.readFileSync(path.join(commandsDir, 'session-report.md'), 'utf8');
    assert.match(content, /words/i);
    assert.match(content, /units/i);
  });

  it('session-report.md anchors boundaries to Session metrics and recorded pause/resume markers', () => {
    const content = fs.readFileSync(path.join(commandsDir, 'session-report.md'), 'utf8');
    assert.match(content, /Read STATE\.md "Session metrics" section/i);
    assert.match(content, /last recorded `\/scr:pause-work` or `\/scr:resume-work` marker in the Last actions table/i);
  });
});

describe('CONSTRAINTS.json has session-report', () => {
  const constraintsPath = path.join(ROOT, 'data', 'CONSTRAINTS.json');

  it('parses as valid JSON', () => {
    const raw = fs.readFileSync(constraintsPath, 'utf8');
    const constraints = JSON.parse(raw);
    assert.equal(typeof constraints, 'object');
  });

  it('has session-report command entry', () => {
    const constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
    assert.ok(constraints.commands['session-report'],
      'CONSTRAINTS.json should have session-report command');
  });

  it('session-report has category "session"', () => {
    const constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
    assert.equal(constraints.commands['session-report'].category, 'session');
  });

  it('session-report is available for "all"', () => {
    const constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf8'));
    assert.ok(
      constraints.commands['session-report'].available.includes('all'),
      'session-report should be available for "all" work types'
    );
  });
});
