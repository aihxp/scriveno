const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function expectContains(file, pattern, message) {
  assert.match(read(file), pattern, message || `${file} should match ${pattern}`);
}

describe('Phase 45: Creative Context pilot docs', () => {
  const doc = read('docs/creative-context.md');

  it('documents the core writing loop pilot scope', () => {
    assert.match(doc, /discuss -> plan -> draft -> editor-review -> next/);
    assert.match(doc, /pilot/i);
    assert.match(doc, /Existing projects without metadata continue to work/);
  });

  it('keeps STYLE-GUIDE.md sovereign', () => {
    assert.match(doc, /STYLE-GUIDE\.md` is sovereign/);
    assert.match(doc, /always loads first/i);
  });

  it('defines writer-native craft note labels', () => {
    for (const label of ['CHOICE', 'HUNCH', 'QUESTION', 'WATCHPOINT']) {
      assert.match(doc, new RegExp(label), `Creative Context doc should define ${label}`);
    }
    assert.match(doc, /Drafted prose never receives craft labels/);
  });
});

describe('Phase 45: Creative Context template metadata', () => {
  const expected = {
    'templates/STYLE-GUIDE.md': ['creative_pillar: voice', 'authority: sovereign'],
    'templates/WORK.md': ['creative_pillar: work'],
    'templates/OUTLINE.md': ['creative_pillar: structure'],
    'templates/RECORD.md': ['creative_pillar: record', 'authority: established'],
    'templates/BRIEF.md': ['creative_pillar: work'],
    'templates/CHARACTERS.md': ['creative_pillar: cast'],
    'templates/WORLD.md': ['creative_pillar: world'],
    'templates/THEMES.md': ['creative_pillar: themes'],
    'templates/STATE.md': ['creative_pillar: continuity'],
    'templates/CONTEXT.md': ['creative_pillar: continuity'],
  };

  for (const [file, fragments] of Object.entries(expected)) {
    it(`${file} declares additive Creative Context metadata`, () => {
      const content = read(file);
      assert.ok(content.startsWith('---\n'), `${file} should start with YAML frontmatter`);
      for (const fragment of fragments) {
        assert.ok(content.includes(fragment), `${file} should include ${fragment}`);
      }
    });
  }
});

describe('Phase 45: core loop carries craft notes', () => {
  it('discuss captures craft notes in the context handoff', () => {
    const discuss = read('commands/scr/discuss.md');
    assert.match(discuss, /## Craft Notes/);
    assert.match(discuss, /CHOICE/);
    assert.match(discuss, /HUNCH/);
    assert.match(discuss, /QUESTION/);
    assert.match(discuss, /WATCHPOINT/);
    assert.match(discuss, /Do not add them to drafted prose/);
  });

  it('plan carries craft notes into canonical plan files', () => {
    const plan = read('commands/scr/plan.md');
    assert.match(plan, /extract `CHOICE`, `HUNCH`, `QUESTION`, and `WATCHPOINT`/);
    assert.match(plan, /Blocking questions must be resolved before drafting/);
    assert.match(plan, /Each plan file must include a `## Craft Notes` section/);
    assert.match(plan, /\.manuscript\/plans\/\{N\}-\{A\}-PLAN\.md/);
  });

  it('draft blocks only blocking questions and passes craft notes to the drafter', () => {
    const draft = read('commands/scr/draft.md');
    assert.match(draft, /QUESTION: Blocking/);
    assert.match(draft, /Non-blocking questions and watchpoints may proceed into drafting/);
    assert.match(draft, /The plan's `## Craft Notes` section/);
  });

  it('editor-review writes craft note follow-up into review reports', () => {
    const review = read('commands/scr/editor-review.md');
    assert.match(review, /craft_note_followup/);
    assert.match(review, /craft_notes_follow_up/);
    assert.match(review, /Do not add labels to manuscript prose/);
    assert.match(review, /\.manuscript\/reviews\/\{N\}-REVIEW\.md/);
  });

  it('next routes around blocking craft questions without blocking non-blocking watchpoints', () => {
    const next = read('commands/scr/next.md');
    assert.match(next, /seed -> voice -> outline -> discuss -> plan -> draft -> review -> revise -> publish -> translate/);
    assert.match(next, /QUESTION: Blocking/);
    assert.match(next, /QUESTION: Non-blocking/);
    assert.match(next, /WATCHPOINT/);
  });
});

describe('Phase 45: agents preserve voice and avoid prose labels', () => {
  it('drafter receives craft notes but keeps labels out of prose', () => {
    const drafter = read('agents/drafter.md');
    assert.match(drafter, /STYLE-GUIDE\.md/);
    assert.match(drafter, /Craft notes from the plan/);
    assert.match(drafter, /Craft labels guide drafting but never appear in the prose/);
    assert.match(drafter, /QUESTION: Blocking/);
  });

  it('plan-checker treats craft notes as optional for older projects', () => {
    const checker = read('agents/plan-checker.md');
    assert.match(checker, /CHOICE, HUNCH, QUESTION, and WATCHPOINT/);
    assert.match(checker, /Absence is not a failure by itself/);
    assert.match(checker, /Blocking questions make the plan NEEDS REVISION/);
  });
});

describe('Phase 45: character persona and relationship interactions', () => {
  it('character templates include pressure behavior and pairwise interaction sections', () => {
    const characters = read('templates/CHARACTERS.md');
    assert.match(characters, /### Persona under pressure/);
    assert.match(characters, /When afraid/);
    assert.match(characters, /When lying or avoiding truth/);
    assert.match(characters, /### Relationship-specific interactions/);
    assert.match(characters, /Trust posture/);
    assert.match(characters, /Conflict pattern/);
    assert.match(characters, /Speech shift/);

    const figures = read('templates/sacred/FIGURES.md');
    assert.match(figures, /### Persona under pressure/);
    assert.match(figures, /### Relationship-specific interactions/);
  });

  it('new-character captures persona under pressure and relationship-specific speech shifts', () => {
    const newCharacter = read('commands/scr/new-character.md');
    assert.match(newCharacter, /persona_under_pressure/);
    assert.match(newCharacter, /What do they do when afraid/);
    assert.match(newCharacter, /How do they lie, deflect, or avoid the truth/);
    assert.match(newCharacter, /How do they speak differently with someone they trust versus someone they fear/);
    assert.match(newCharacter, /Relationship-Specific Interactions/);
  });

  it('core loop routes character persona notes through discuss, plan, draft, and review', () => {
    assert.match(read('commands/scr/discuss.md'), /Character Persona Notes/);
    assert.match(read('commands/scr/plan.md'), /## Character Persona Notes/);
    assert.match(read('commands/scr/draft.md'), /The plan's `## Character Persona Notes` section/);
    assert.match(read('commands/scr/editor-review.md'), /character_persona_followup/);
    assert.match(read('commands/scr/editor-review.md'), /relationship_interaction_follow_up/);
  });

  it('drafter and plan-checker treat persona as behavior and pairwise interaction', () => {
    const drafter = read('agents/drafter.md');
    assert.match(drafter, /Persona becomes behavior/);
    assert.match(drafter, /Relationships change the voice/);
    assert.match(drafter, /relationship-specific interactions/);

    const checker = read('agents/plan-checker.md');
    assert.match(checker, /Character persona notes/);
    assert.match(checker, /persona under pressure/);
    assert.match(checker, /relationship-specific interaction notes/);
  });

  it('character-touch and relationship-map update pairwise interaction state', () => {
    const touch = read('commands/scr/character-touch.md');
    assert.match(touch, /Relationship-specific interaction/);
    assert.match(touch, /speech shift, trust posture, conflict pattern, hidden agenda or fear/);

    const map = read('commands/scr/relationship-map.md');
    assert.match(map, /Relationship-Specific Interactions/);
    assert.match(map, /Interaction notes/);
    assert.match(map, /Edit interaction dynamic/);
  });
});

describe('Phase 45: subject dynamics for non-character work', () => {
  it('templates describe subject movement and reader-state shifts', () => {
    const themes = read('templates/THEMES.md');
    assert.match(themes, /## Subject dynamics/);
    assert.match(themes, /Reader starts here/);
    assert.match(themes, /Pressure or friction/);
    assert.match(themes, /Interaction pattern/);

    const brief = read('templates/BRIEF.md');
    assert.match(brief, /## Subject movement/);
    assert.match(brief, /What the reader is trying to understand or do/);

    const docBrief = read('templates/technical/DOC-BRIEF.md');
    assert.match(docBrief, /## Subject movement/);
    assert.match(docBrief, /step vs\. failure mode/);
  });

  it('core loop routes Subject Dynamics Notes through discuss, plan, draft, and review', () => {
    assert.match(read('commands/scr/discuss.md'), /Subject Dynamics Notes/);
    assert.match(read('commands/scr/discuss.md'), /claim vs\. counterclaim/);
    assert.match(read('commands/scr/plan.md'), /## Subject Dynamics Notes/);
    assert.match(read('commands/scr/draft.md'), /The plan's `## Subject Dynamics Notes` section/);
    assert.match(read('commands/scr/editor-review.md'), /subject_dynamics_followup/);
    assert.match(read('commands/scr/editor-review.md'), /subject_dynamics_follow_up/);
  });

  it('drafter and plan-checker treat subject dynamics as reader movement', () => {
    const drafter = read('agents/drafter.md');
    assert.match(drafter, /Subject Dynamics Notes from the plan/);
    assert.match(drafter, /Subjects have dynamics too/);
    assert.match(drafter, /Reader movement replaces character movement/);

    const checker = read('agents/plan-checker.md');
    assert.match(checker, /Subject dynamics notes/);
    assert.match(checker, /Subject integrity/);
    assert.match(checker, /reader should land/);
  });

  it('allows character persona and subject dynamics to layer in the same unit', () => {
    const doc = read('docs/creative-context.md');
    assert.match(doc, /use both sections when both layers matter/);
    assert.match(doc, /Character Persona Notes` answers how people behave/);
    assert.match(doc, /Subject Dynamics Notes` answers how meaning/);

    const discuss = read('commands/scr/discuss.md');
    assert.match(discuss, /whether or not named characters are present/);
    assert.match(discuss, /may both appear in the same context file/);

    const plan = read('commands/scr/plan.md');
    assert.match(plan, /sit beside `## Character Persona Notes`/);
    assert.match(plan, /character notes govern behavior/);
    assert.match(plan, /subject dynamics govern meaning/);

    const review = read('commands/scr/editor-review.md');
    assert.match(review, /even in character-based scenes/);
    assert.match(review, /reinforced each other or fought for focus/);
  });

  it('adds subject-touch as the living update surface for subject movement', () => {
    const command = read('commands/scr/subject-touch.md');
    assert.match(command, /Update Subject Movement/);
    assert.match(command, /Reader state/);
    assert.match(command, /Pressure or friction/);
    assert.match(command, /Interaction pattern/);
    assert.match(command, /scr:subject-touch/);

    const constraints = JSON.parse(read('data/CONSTRAINTS.json'));
    assert.ok(constraints.commands['subject-touch']);
    assert.equal(constraints.commands['subject-touch'].category, 'structure');
    assert.match(read('commands/scr/draft.md'), /SUBJECT DYNAMICS NUDGE/);
    assert.match(read('agents/drafter.md'), /Subject movement nudge/);
  });

  it('review and plan contracts detect missing subject movement', () => {
    assert.match(read('commands/scr/discuss.md'), /does this unit change what the reader understands/);
    assert.match(read('commands/scr/plan.md'), /before omitting subject dynamics/);
    assert.match(read('commands/scr/editor-review.md'), /obvious missing layer/);
    assert.match(read('agents/plan-checker.md'), /missing subject layer/);
  });

  it('ships academic-native subject dynamics templates', () => {
    for (const file of [
      'templates/academic/CONCEPTS.md',
      'templates/academic/QUESTIONS.md',
      'templates/academic/ARGUMENT-MAP.md',
      'templates/academic/PROPOSAL.md',
      'templates/academic/CONTEXT.md',
    ]) {
      const content = read(file);
      assert.ok(content.startsWith('---\n'), `${file} should declare Creative Context metadata`);
      assert.match(content, /Subject dynamics|Subject Dynamics|Reader starts|Reader Journey/);
    }

    assert.match(read('commands/scr/new-work.md'), /templates\/academic/);
  });

  it('documents blended proof and help visibility', () => {
    assert.match(read('data/proof/creative-context/README.md'), /Blended character and subject artifact/);
    assert.match(read('data/proof/creative-context/README.md'), /the forged letter/);
    assert.match(read('docs/proof-artifacts.md'), /character behavior, and subject movement/);
    assert.match(read('commands/scr/help.md'), /Scriven tracks what moves/);
  });
});

describe('Phase 45: proof and user-facing language', () => {
  it('wires Creative Context into proof artifacts', () => {
    expectContains('docs/proof-artifacts.md', /Creative Context/);
    expectContains('docs/proof-artifacts.md', /data\/proof\/creative-context\/README\.md/);
    expectContains('data/proof/creative-context/README.md', /does not include `CHOICE`, `HUNCH`, `QUESTION`, or `WATCHPOINT` labels in the prose/);
  });

  it('keeps core-loop commands free of development-process vocabulary', () => {
    const files = [
      'commands/scr/discuss.md',
      'commands/scr/plan.md',
      'commands/scr/draft.md',
      'commands/scr/editor-review.md',
      'commands/scr/next.md',
    ];
    const forbidden = /\b(have-nots|artifact compliance|TDD enforcement|tier gate|tiers)\b/i;

    for (const file of files) {
      assert.doesNotMatch(read(file), forbidden, `${file} should stay writer-native`);
    }
  });
});
