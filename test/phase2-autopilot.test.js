const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const autopilotPath = path.join(ROOT, 'commands', 'scr', 'autopilot.md');

describe('Autopilot command structure', () => {
  let content;

  it('file exists', () => {
    assert.ok(fs.existsSync(autopilotPath), 'autopilot.md should exist');
  });

  it('has YAML frontmatter with description field', () => {
    content = fs.readFileSync(autopilotPath, 'utf8');
    const fm = content.match(/^---\n([\s\S]*?)\n---/);
    assert.ok(fm, 'autopilot.md missing YAML frontmatter');
    assert.ok(fm[1].includes('description:'),
      'autopilot.md frontmatter missing description field');
  });

  it('has argument-hint with --profile and --resume', () => {
    content = fs.readFileSync(autopilotPath, 'utf8');
    const fm = content.match(/^---\n([\s\S]*?)\n---/);
    assert.ok(fm, 'autopilot.md missing frontmatter');
    assert.ok(fm[1].includes('argument-hint:'),
      'autopilot.md frontmatter missing argument-hint field');
    assert.ok(fm[1].includes('--profile'),
      'argument-hint should contain --profile');
    assert.ok(fm[1].includes('--resume'),
      'argument-hint should contain --resume');
    assert.ok(fm[1].includes('--matter'),
      'argument-hint should contain --matter');
  });

  it('has "# Autopilot" heading', () => {
    content = fs.readFileSync(autopilotPath, 'utf8');
    assert.match(content, /^# Autopilot$/m);
  });
});

describe('Autopilot profiles', () => {
  let content;

  it('contains "guided" profile name', () => {
    content = fs.readFileSync(autopilotPath, 'utf8');
    assert.match(content, /guided/);
  });

  it('contains "supervised" profile name', () => {
    content = fs.readFileSync(autopilotPath, 'utf8');
    assert.match(content, /supervised/);
  });

  it('contains "full-auto" profile name', () => {
    content = fs.readFileSync(autopilotPath, 'utf8');
    assert.match(content, /full-auto/);
  });

  it('contains approve, revise, and stop options for guided review (D-01)', () => {
    content = fs.readFileSync(autopilotPath, 'utf8');
    assert.match(content, /approve/);
    assert.match(content, /revise/);
    assert.match(content, /stop/);
  });

  it('contains "200 words" reference for guided review (D-01)', () => {
    content = fs.readFileSync(autopilotPath, 'utf8');
    assert.ok(
      content.includes('200 words') || content.includes('last 200'),
      'autopilot.md should reference "200 words" or "last 200" for guided profile'
    );
  });

  it('contains structural unit or mid level for supervised batching (D-04)', () => {
    content = fs.readFileSync(autopilotPath, 'utf8');
    assert.ok(
      content.includes('structural unit') || content.includes('mid'),
      'autopilot.md should reference structural unit boundary or mid level'
    );
  });

  it('contains custom_checkpoints for full-auto (D-02)', () => {
    content = fs.readFileSync(autopilotPath, 'utf8');
    assert.match(content, /custom_checkpoints/);
  });
});

describe('Autopilot pause conditions', () => {
  let content;

  it('contains "continuity" pause condition', () => {
    content = fs.readFileSync(autopilotPath, 'utf8');
    assert.match(content, /[Cc]ontinuity/);
  });

  it('contains "voice drift" or "drift" pause condition', () => {
    content = fs.readFileSync(autopilotPath, 'utf8');
    assert.ok(
      content.includes('voice drift') || content.includes('Voice drift') || content.includes('drift'),
      'autopilot.md should reference voice drift as a pause condition'
    );
  });

  it('contains "plot hole" pause condition', () => {
    content = fs.readFileSync(autopilotPath, 'utf8');
    assert.ok(
      content.toLowerCase().includes('plot hole'),
      'autopilot.md should reference plot hole as a pause condition'
    );
  });

  it('contains "missing" and "information" pause condition', () => {
    content = fs.readFileSync(autopilotPath, 'utf8');
    assert.match(content, /[Mm]issing/);
    assert.ok(
      content.includes('information') || content.includes('info'),
      'autopilot.md should reference missing information as a pause condition'
    );
  });
});

describe('Autopilot resume', () => {
  let content;

  it('contains --resume flag reference (D-03)', () => {
    content = fs.readFileSync(autopilotPath, 'utf8');
    assert.match(content, /--resume/);
  });

  it('reads STATE.md for resume context', () => {
    content = fs.readFileSync(autopilotPath, 'utf8');
    assert.match(content, /STATE\.md/);
  });

  it('contains one-sentence explanation or picking up context (D-03)', () => {
    content = fs.readFileSync(autopilotPath, 'utf8');
    assert.ok(
      content.includes('one sentence') || content.includes('ONE sentence') ||
      content.includes('where it left off') || content.includes('Picking up') ||
      content.includes('picking up'),
      'autopilot.md should describe one-sentence resume explanation'
    );
  });
});

describe('Autopilot state management', () => {
  let content;

  it('contains mandatory STATE.md update instruction', () => {
    content = fs.readFileSync(autopilotPath, 'utf8');
    assert.ok(
      content.includes('Update STATE.md') || content.includes('update STATE.md'),
      'autopilot.md should instruct to update STATE.md'
    );
  });

  it('references OUTLINE.md for unit enumeration', () => {
    content = fs.readFileSync(autopilotPath, 'utf8');
    assert.match(content, /OUTLINE\.md/);
  });

  it('references config.json for autopilot settings', () => {
    content = fs.readFileSync(autopilotPath, 'utf8');
    assert.ok(
      content.includes('config.json') || content.includes('config'),
      'autopilot.md should reference config.json or config for settings'
    );
  });

  it('runs dedicated matter commands after a full manuscript run', () => {
    content = fs.readFileSync(autopilotPath, 'utf8');
    assert.match(content, /\/scr:front-matter --level \{resolved-matter-level\}/);
    assert.match(content, /\/scr:back-matter --level \{resolved-matter-level\}/);
    assert.match(content, /Do not overwrite writer-authored front or back matter silently/);
  });
});
