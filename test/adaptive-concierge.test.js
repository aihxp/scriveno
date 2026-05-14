const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const constraints = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'CONSTRAINTS.json'), 'utf8'));

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function scenarioRecommendation(state) {
  if (!state.hasProject) {
    return {
      intent: 'start',
      recommended: 'new-work',
      alternatives: ['demo', 'import', 'profile-writer']
    };
  }

  if (state.failedCommand || state.stateDrift || state.missingRequiredContext) {
    return {
      intent: 'repair',
      recommended: 'scan',
      alternatives: ['health', 'validate', 'troubleshoot']
    };
  }

  if (state.revisionTrackMetadata || state.collaborationRequest) {
    return {
      intent: 'collaborate',
      recommended: 'track',
      alternatives: ['editor-review', 'compare']
    };
  }

  if (state.translationConfigured || state.translationWorkExists) {
    return {
      intent: 'translate',
      recommended: 'translate',
      alternatives: ['translation-glossary', 'back-translate', 'multi-publish']
    };
  }

  if (state.completeDraft) {
    return {
      intent: 'publish',
      recommended: 'publish',
      alternatives: ['export', 'beta-reader', 'front-matter']
    };
  }

  if (state.draftedUnits > state.reviewedUnits) {
    return {
      intent: 'revise',
      recommended: 'editor-review',
      alternatives: ['voice-check', 'continuity-check', 'line-edit']
    };
  }

  if (state.plannedUnits > state.draftedUnits) {
    return {
      intent: 'draft',
      recommended: 'draft',
      alternatives: ['discuss', 'plan', 'voice-test']
    };
  }

  return {
    intent: 'draft',
    recommended: 'discuss',
    alternatives: ['plan', 'voice-test', 'quick-write']
  };
}

const SCENARIOS = [
  {
    name: 'no project',
    state: { hasProject: false },
    expected: { intent: 'start', recommended: 'new-work' },
    forbiddenPrimary: ['publish', 'export', 'translate', 'multi-publish']
  },
  {
    name: 'fresh project with no drafted work',
    state: { hasProject: true, plannedUnits: 0, draftedUnits: 0, reviewedUnits: 0 },
    expected: { intent: 'draft', recommended: 'discuss' },
    forbiddenPrimary: ['publish', 'export', 'translate', 'multi-publish']
  },
  {
    name: 'planned unit not yet drafted',
    state: { hasProject: true, plannedUnits: 1, draftedUnits: 0, reviewedUnits: 0 },
    expected: { intent: 'draft', recommended: 'draft' },
    forbiddenPrimary: ['publish', 'export', 'translate', 'multi-publish']
  },
  {
    name: 'drafted unit not yet reviewed',
    state: { hasProject: true, plannedUnits: 1, draftedUnits: 1, reviewedUnits: 0 },
    expected: { intent: 'revise', recommended: 'editor-review' },
    forbiddenPrimary: ['publish', 'export', 'translate', 'multi-publish']
  },
  {
    name: 'complete draft ready for publishing choices',
    state: { hasProject: true, plannedUnits: 8, draftedUnits: 8, reviewedUnits: 8, completeDraft: true },
    expected: { intent: 'publish', recommended: 'publish' }
  },
  {
    name: 'state drift or missing required context',
    state: { hasProject: true, stateDrift: true, plannedUnits: 2, draftedUnits: 1, reviewedUnits: 1 },
    expected: { intent: 'repair', recommended: 'scan' },
    forbiddenPrimary: ['publish', 'export', 'translate', 'multi-publish']
  },
  {
    name: 'translation work is already active',
    state: { hasProject: true, translationConfigured: true, plannedUnits: 8, draftedUnits: 8, reviewedUnits: 8 },
    expected: { intent: 'translate', recommended: 'translate' }
  },
  {
    name: 'revision track workflow is active',
    state: { hasProject: true, revisionTrackMetadata: true, plannedUnits: 3, draftedUnits: 3, reviewedUnits: 2 },
    expected: { intent: 'collaborate', recommended: 'track' },
    forbiddenPrimary: ['save', 'history', 'versions']
  }
];

describe('adaptive concierge command surfacing', () => {
  it('defines writer intent groups that point only at real commands', () => {
    const intents = constraints.command_intents;
    assert.ok(intents && typeof intents === 'object', 'CONSTRAINTS.json must define command_intents');

    for (const intent of ['start', 'draft', 'revise', 'navigate', 'publish', 'translate', 'collaborate', 'repair']) {
      assert.ok(Array.isArray(intents[intent]), `command_intents.${intent} must be an array`);
      assert.ok(intents[intent].length >= 3, `command_intents.${intent} should expose useful choices`);
      for (const command of intents[intent]) {
        assert.ok(
          constraints.commands[command],
          `command_intents.${intent} references unknown command "${command}"`
        );
      }
    }
  });

  it('keeps /scr:help focused on inferred intent before the full catalog', () => {
    const help = read('commands/scr/help.md');

    assert.match(help, /Load `command_intents` from CONSTRAINTS\.json/);
    assert.match(help, /Infer the likely intent before showing commands/);
    assert.match(help, /Likely next area: Draft/);
    assert.match(help, /Keep the primary list to 3-6 commands/);
    assert.match(help, /the default view should never feel like a catalog dump/);
    assert.match(help, /fresh project should not show publishing as the likely next area/);
    assert.match(help, /should not appear as a primary path until drafted work exists or translation configuration exists/);
  });

  it('keeps the no-project help view to a small start menu', () => {
    const help = read('commands/scr/help.md');
    const match = help.match(/## The "getting started" view[\s\S]*?```([\s\S]*?)```/);
    assert.ok(match, 'help.md must include a fenced getting started menu');

    const commandRefs = Array.from(match[1].matchAll(/\/scr:[a-z-]+/g), (m) => m[0]);
    assert.deepStrictEqual(
      commandRefs,
      ['/scr:new-work', '/scr:demo', '/scr:import', '/scr:profile-writer', '/scr:next'],
      'no-project help should expose only start commands plus the universal next fallback'
    );
  });

  it('makes /scr:next recommend one action with a few contextual alternatives', () => {
    const next = read('commands/scr/next.md');

    assert.match(next, /Load `command_intents` from CONSTRAINTS\.json/);
    assert.match(next, /Act like an adaptive concierge, not a catalog/);
    assert.match(next, /State the recommended command in one sentence/);
    assert.match(next, /Offer 2-3 alternatives from the matching intent or a closely related intent/);
    assert.match(next, /No drafted work -> keep publish and translate out of the primary choices/);
    assert.match(next, /Drafted work but no review -> recommend revise commands before publish commands/);
    assert.match(next, /Failed command, state mismatch, or missing required context -> surface repair commands first/);
    assert.match(next, /Revision-track metadata or collaboration request -> surface `\/scr:track` and keep save-history commands separate/);
  });

  it('models representative project states with compact recommendation fixtures', () => {
    for (const scenario of SCENARIOS) {
      const result = scenarioRecommendation(scenario.state);
      const primaryChoices = [result.recommended, ...result.alternatives];

      assert.equal(result.intent, scenario.expected.intent, `${scenario.name} intent`);
      assert.equal(result.recommended, scenario.expected.recommended, `${scenario.name} recommendation`);
      assert.ok(primaryChoices.length >= 1 && primaryChoices.length <= 4, `${scenario.name} should expose 1-4 primary choices`);

      for (const command of primaryChoices) {
        assert.ok(constraints.commands[command], `${scenario.name} references unknown command "${command}"`);
      }
      for (const forbidden of scenario.forbiddenPrimary || []) {
        assert.ok(
          !primaryChoices.includes(forbidden),
          `${scenario.name} should not surface "${forbidden}" as a primary choice`
        );
      }
    }
  });

  it('keeps fixture recommendations aligned with the intent map', () => {
    const intents = constraints.command_intents;
    const allowedNearbyCommands = {
      publish: ['beta-reader'],
      collaborate: ['editor-review', 'compare']
    };

    for (const scenario of SCENARIOS) {
      const result = scenarioRecommendation(scenario.state);
      const allowed = new Set([
        ...intents[result.intent],
        ...(allowedNearbyCommands[result.intent] || [])
      ]);

      for (const command of [result.recommended, ...result.alternatives]) {
        assert.ok(
          allowed.has(command),
          `${scenario.name} surfaces "${command}" outside the ${result.intent} intent`
        );
      }
    }
  });
});
