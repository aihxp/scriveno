const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const CMDDIR = path.join(ROOT, 'commands', 'scr');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

// Build the soft suggestion graph from the command files: for each command,
// which other commands reference it (via any /scr:<name> mention). This is the
// connectivity that /scr:help, the Next-commands contract, and the writer's flow
// rely on, and it is not otherwise machine-validated. The lock below keeps the
// craft layer wired in so a future surface cannot quietly become an island.
function buildInbound() {
  const names = new Set();
  for (const f of fs.readdirSync(CMDDIR)) {
    if (f.endsWith('.md')) names.add(f.replace('.md', ''));
  }
  const sacredDir = path.join(CMDDIR, 'sacred');
  if (fs.existsSync(sacredDir)) {
    for (const f of fs.readdirSync(sacredDir)) {
      if (f.endsWith('.md')) names.add('sacred:' + f.replace('.md', ''));
    }
  }
  const inbound = new Map();
  for (const n of names) inbound.set(n, new Set());
  const scan = (file, src) => {
    const text = fs.readFileSync(file, 'utf8');
    const refs = new Set();
    for (const m of text.matchAll(/\/scr:([a-z0-9-]+(?::[a-z0-9-]+)?)/g)) refs.add(m[1]);
    for (const r of refs) if (names.has(r) && r !== src) inbound.get(r).add(src);
  };
  for (const f of fs.readdirSync(CMDDIR)) {
    if (f.endsWith('.md')) scan(path.join(CMDDIR, f), f.replace('.md', ''));
  }
  if (fs.existsSync(sacredDir)) {
    for (const f of fs.readdirSync(sacredDir)) {
      if (f.endsWith('.md')) scan(path.join(sacredDir, f), 'sacred:' + f.replace('.md', ''));
    }
  }
  return inbound;
}

describe('connectivity: no orphan craft surfaces', () => {
  const inbound = buildInbound();

  it('no command sits on an island (every command is reachable or explicitly self-serve)', () => {
    // Auto-detects ANY island, so a NEW command cannot be silently orphaned. A command
    // is reachable if another command suggests it (inbound), or it is in command_intents,
    // or it is in a command_families hub group, or in the core workflow chain, or it is
    // an entry point, or it is explicitly marked self-serve below. A new command that is
    // none of these fails this test: route a predecessor to it, add it to an intent or
    // family, or add it to selfServe with a reason.
    const constraints = JSON.parse(read('data/CONSTRAINTS.json'));
    const intent = new Set(Object.values(constraints.command_intents).flat());
    const family = new Set(Object.values(constraints.command_families || {}).flatMap((spec) => spec.commands || []));
    const core = new Set(constraints.dependencies.core_chain.map((s) => s.command));

    // Entry points: a writer reaches these without another command suggesting them.
    const entryPoints = new Set([
      'new-work', 'first-run', 'demo', 'import', 'help', 'next', 'do', 'manager', 'fast',
      'profile-writer', 'autopilot', 'autopilot-publish', 'autopilot-translate', 'surface', 'settings',
    ]);
    // Self-serve: invoked deliberately (via /scr:help, by design), not workflow-routed.
    // Adding a command here is a conscious exception; everything else must be routed to.
    const selfServe = new Set([
      'book-proposal',                                              // nonfiction submission, on demand
      'chapter-header', 'panel-layout', 'storyboard',              // illustration / layout specialists
      'dialogue-audit', 'sensitivity-review', 'originality-check', // on-demand reviews
      'sacred-numbering-format', 'sacred:genealogy', 'sacred:verse-numbering', // sacred specialists
      'check-notes', 'proof-unit', 'series-bible',                 // utility / proof / series
    ]);

    const reachable = (n) =>
      (inbound.get(n) && inbound.get(n).size > 0) ||
      intent.has(n) || family.has(n) || core.has(n) || entryPoints.has(n) || selfServe.has(n);

    const islands = Array.from(inbound.keys()).filter((n) => !reachable(n)).sort();
    assert.deepEqual(
      islands,
      [],
      `Island command(s) found (nothing routes to them, not in an intent/family/chain, not marked self-serve): ${islands.join(', ')}. Route a predecessor, add an intent or family, or add to the selfServe allowlist with a reason.`
    );
  });

  it('climax is routed to by its craft predecessors', () => {
    const climax = inbound.get('climax');
    for (const pred of ['plot-graph', 'outline', 'plan', 'pacing-analysis', 'editor-review']) {
      assert.ok(climax.has(pred), `/scr:climax should be suggested by /scr:${pred}`);
    }
  });

  it('relationship-map is routed to by its character predecessors', () => {
    const rm = inbound.get('relationship-map');
    for (const pred of ['new-character', 'character-touch', 'cast-list']) {
      assert.ok(rm.has(pred), `/scr:relationship-map should be suggested by /scr:${pred}`);
    }
  });
});

describe('connectivity: producer-consumer loops are closed', () => {
  it('discuss reads SEEDS.md so plant-seed has a consumer', () => {
    assert.match(read('commands/scr/discuss.md'), /SEEDS\.md/);
  });

  it('the conflict map is read (plan loads it, relationship-map --conflicts views it)', () => {
    assert.match(read('commands/scr/plan.md'), /CONFLICTS\.md/);
    assert.match(read('commands/scr/relationship-map.md'), /--conflicts/);
    assert.match(read('commands/scr/relationship-map.md'), /CONFLICTS\.md/);
  });

  it('the drafter receives the plan Causal Anchor', () => {
    assert.match(read('commands/scr/draft.md'), /Causal Anchor/);
  });
});

describe('connectivity: state changes carry their derived files', () => {
  it('climax regenerates CONFLICTS.md', () => {
    assert.match(read('commands/scr/climax.md'), /Regenerate `\.manuscript\/CONFLICTS\.md`/);
  });

  it('structure-management commands regenerate PROGRESS.md', () => {
    for (const f of ['add-unit', 'remove-unit', 'reorder-units', 'split-unit', 'merge-units']) {
      assert.match(
        read(`commands/scr/${f}.md`),
        /Regenerate `\.manuscript\/PROGRESS\.md`/,
        `${f} should regenerate PROGRESS.md`
      );
    }
  });

  it('prose-quality and continuity-check nudge character-touch on relationship drift', () => {
    for (const f of ['line-edit', 'copy-edit', 'polish', 'continuity-check']) {
      assert.match(
        read(`commands/scr/${f}.md`),
        /scr:character-touch/,
        `${f} should nudge /scr:character-touch`
      );
    }
  });
});

describe('connectivity: craft surfaces are in command_intents', () => {
  it('climax, relationship-map, subplot-map, theme-tracker are routed by intent', () => {
    const ci = JSON.parse(read('data/CONSTRAINTS.json')).command_intents;
    const all = new Set(Object.values(ci).flat());
    for (const cmd of ['climax', 'relationship-map', 'subplot-map', 'theme-tracker']) {
      assert.ok(all.has(cmd), `${cmd} should be listed in some command_intent`);
    }
  });
});
