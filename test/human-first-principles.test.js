const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

describe('human-first prose principles', () => {
  it('WRITING-RULES preserves human-first text and factual integrity', () => {
    const rules = read('templates/WRITING-RULES.md');

    assert.match(rules, /### Human-first restraint/);
    assert.match(rules, /Do not over-correct prose that already sounds like the writer/);
    assert.match(rules, /Isolated signals are not enough/);
    assert.match(rules, /### Factual integrity and content preservation/);
    assert.match(rules, /Do not invent facts, names, numbers, sources, quotes, dates, prices, examples, locations, or claims/);
    assert.match(rules, /Do not truncate, skip paragraphs, compress away obligations, or replace concrete content with a prettier generalization/);
  });

  it('WRITING-RULES covers register restraint, artifact cleanup, and durable docs', () => {
    const rules = read('templates/WRITING-RULES.md');

    assert.match(rules, /### Register-aware restraint/);
    assert.match(rules, /Academic, technical, legal, sacred, journalistic, and quoted material should not be casualized/);
    assert.match(rules, /### Chat artifacts and placeholder contamination/);
    assert.match(rules, /Remove chatbot wrapper text/);
    assert.match(rules, /### Diff-anchored explanation/);
    assert.match(rules, /describe what is true now, not what changed from an older version/);
  });

  it('WRITING-RULES captures scriveno-humanizer variance and stance principles', () => {
    const rules = read('templates/WRITING-RULES.md');

    assert.match(rules, /### Variance over substitution/);
    assert.match(rules, /Do not fix AI-sounding prose by swapping one suspect word for another everywhere/);
    assert.match(rules, /Do not install a new humanizer signature/);
    assert.match(rules, /Audit soft inference as carefully as hard facts/);
    assert.match(rules, /### Stance discipline/);
    assert.match(rules, /Stance may react to content already present/);
    assert.match(rules, /name one to three things deliberately left alone/);
  });

  it('drafter refuses unsupported detail and required-content loss', () => {
    const drafter = read('agents/drafter.md');

    assert.match(drafter, /\*\*Factual integrity\.\*\*/);
    assert.match(drafter, /Do not add facts, names, dates, numbers, citations, prices, historical details, technical behavior, doctrinal claims, or examples/);
    assert.match(drafter, /Did you preserve every required beat from the plan without truncating, skipping, or replacing concrete content/);
    assert.match(drafter, /\*\*Stance stays sourced\.\*\*/);
    assert.match(drafter, /\*\*Variance over substitution\.\*\*/);
    assert.match(drafter, /Did you avoid adding soft inferences/);
    assert.match(drafter, /\*\*Never invent support\.\*\*/);
    assert.match(drafter, /\*\*Never truncate the required content\.\*\*/);
  });

  it('voice checker distinguishes clustered AI tells from human markers', () => {
    const checker = read('agents/voice-checker.md');

    assert.match(checker, /Use density, not isolated tells/);
    assert.match(checker, /If the passage contains strong human markers/);
    assert.match(checker, /humanizer signature/);
    assert.match(checker, /### Content integrity/);
    assert.match(checker, /\*\*No invented support\.\*\*/);
    assert.match(checker, /\*\*No soft-inference drift\.\*\*/);
    assert.match(checker, /\*\*No truncation\.\*\*/);
    assert.match(checker, /\*\*Register restraint\.\*\*/);
    assert.match(checker, /\*\*Stance discipline\.\*\*/);
  });

  it('line-edit uses edit pressure before rewriting', () => {
    const lineEdit = read('commands/scr/line-edit.md');

    assert.match(lineEdit, /### STEP 2: CHOOSE EDIT PRESSURE/);
    assert.match(lineEdit, /\*\*Light:\*\* The prose already sounds like the writer/);
    assert.match(lineEdit, /\*\*Mixed:\*\*/);
    assert.match(lineEdit, /\*\*Full:\*\*/);
    assert.match(lineEdit, /Do not over-correct fragments, mixed feelings, self-corrections, uneven rhythm, or writer-specific tics/);
    assert.match(lineEdit, /deliberately left alone/);
    assert.match(lineEdit, /Verify that suggestions preserve all meaning in the original passage/);
    assert.match(lineEdit, /Check soft inference/);
    assert.match(lineEdit, /humanized.*cadence/);
  });

  it('polish reports restraint and meaning checks', () => {
    const polish = read('commands/scr/polish.md');

    assert.match(polish, /choose polish pressure: light, mixed, or full/);
    assert.match(polish, /name what you deliberately left alone/);
    assert.match(polish, /Flag humanizer signatures/);
    assert.match(polish, /\*\*Deliberately Left Alone\*\*/);
    assert.match(polish, /\*\*Meaning Check\*\*/);
    assert.match(polish, /soft-inference drift/);
  });

  it('copy-edit enforces Scriveno dash policy instead of normalizing em dashes', () => {
    const copyEdit = read('commands/scr/copy-edit.md');

    assert.match(copyEdit, /\*\*Dash policy\*\*/);
    assert.match(copyEdit, /Flag em dashes and en dashes as prohibited by Scriveno writing policy/);
    assert.doesNotMatch(copyEdit, /Check consistency of em-dash style/);
  });
});
