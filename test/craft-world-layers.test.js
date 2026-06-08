const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

describe('craft layer: world place, geography, and research surfaces', () => {
  it('ships authored places, derived geography, and neutral advisory research templates', () => {
    const places = read('templates/PLACES.md');
    assert.ok(places.startsWith('---\n'));
    assert.match(places, /creative_pillar: world/);
    assert.match(places, /authority: project/);
    assert.match(places, /Do not treat detected mentions as canon/);
    assert.match(places, /\/scr:new-place/);
    assert.match(places, /\/scr:place-touch/);

    const geography = read('templates/GEOGRAPHY.md');
    assert.ok(geography.startsWith('---\n'));
    assert.match(geography, /authority: derived/);
    assert.match(geography, /Derived from `PLACES\.md` plus the adapted world surface/);
    assert.match(geography, /docs\/world-layers-protocol\.md/);

    const research = read('templates/RESEARCH.md');
    assert.ok(research.startsWith('---\n'));
    assert.match(research, /creative_pillar: research/);
    assert.match(research, /authority: advisory/);
    assert.match(research, /not canon/);
    assert.match(research, /craft, genre, historical-period/);
    assert.match(research, /Do not invent sources/);
  });

  it('documents writer-owned world layer behavior without inboxes', () => {
    const protocol = read('docs/world-layers-protocol.md');
    assert.match(protocol, /# World Layers Protocol/);
    assert.match(protocol, /No Inbox Rule/);
    assert.match(protocol, /must not silently add them to canon/);
    assert.match(protocol, /\/scr:new-place/);
    assert.match(protocol, /\/scr:place-touch/);
    assert.match(protocol, /\/scr:geography-map/);
    assert.match(protocol, /\/scr:scan --fix/);
    assert.match(protocol, /Places may consult neutral research notes/);
    assert.match(protocol, /docs\/research-protocol\.md/);
    assert.match(protocol, /`PLACES\.md` is authored/);
  });

  it('registers the new commands in constraints and the command reference', () => {
    const constraints = JSON.parse(read('data/CONSTRAINTS.json'));
    const commandReference = read('docs/command-reference.md');

    for (const command of ['new-place', 'place-touch', 'geography-map']) {
      assert.equal(constraints.commands[command].category, 'character_world');
      assert.ok(constraints.commands[command].available.includes('sacred'));
      assert.ok(constraints.commands[command].hidden.includes('poetry'));
      assert.ok(constraints.commands[command].hidden.includes('speech_song'));
      assert.match(commandReference, new RegExp(`### \`/scr:${command}\``));
    }

    assert.equal(constraints.commands.research.category, 'utility');
    assert.deepEqual(constraints.commands.research.available, ['all']);
    assert.match(constraints.commands.research.description, /any topic/);
    assert.ok(constraints.command_intents.navigate.includes('new-place'));
    assert.ok(constraints.command_intents.navigate.includes('place-touch'));
    assert.ok(constraints.command_intents.navigate.includes('geography-map'));
    assert.ok(constraints.command_intents.navigate.includes('research'));
    assert.match(commandReference, /### `\/scr:research`/);
    assert.match(commandReference, /nothing becomes project canon until the writer accepts it/);
  });

  it('keeps command contracts explicit and non-promotional', () => {
    const newPlace = read('commands/scr/new-place.md');
    assert.match(newPlace, /prepare it from `templates\/PLACES\.md`/);
    assert.match(newPlace, /canonical `WORLD\.md` is `not_applicable`/);
    assert.match(newPlace, /Append one complete `### <name>` profile/);
    assert.match(newPlace, /Do not auto-fill factual claims/);
    assert.match(newPlace, /regenerate `\.manuscript\/GEOGRAPHY\.md`/);

    const placeTouch = read('commands/scr/place-touch.md');
    assert.match(placeTouch, /If `PLACES\.md` is missing or has no matching entry/);
    assert.match(placeTouch, /Apply these updates\? \(yes \/ no \/ edit\)/);
    assert.match(placeTouch, /Never overwrite an existing place fact without showing the delta/);
    assert.match(placeTouch, /regenerate `\.manuscript\/GEOGRAPHY\.md`/);

    const geographyMap = read('commands/scr/geography-map.md');
    assert.match(geographyMap, /Default mode is read-only/);
    assert.match(geographyMap, /With `--fix`, write `\.manuscript\/GEOGRAPHY\.md`/);
    assert.match(geographyMap, /Do not invent geography to fill blanks/);

    const research = read('commands/scr/research.md');
    assert.match(research, /docs\/research-protocol\.md/);
    assert.match(research, /agents\/researcher\.md/);
    assert.doesNotMatch(research, /docs\/world-layers-protocol\.md/);
    assert.match(research, /not project canon/);
    assert.match(research, /genre and craft/);
    assert.match(research, /academic and scholarly sources/);
    assert.match(research, /do not invent facts or citations/);
    assert.match(research, /do not update `PLACES\.md` directly/);
    assert.match(research, /\/scr:place-touch <name>/);
    assert.match(research, /\/scr:subject-touch <subject>/);
  });

  it('documents research as project-wide advisory work, not a world sublayer', () => {
    const protocol = read('docs/research-protocol.md');
    assert.match(protocol, /# Research Protocol/);
    assert.match(protocol, /project-wide advisory surface/);
    assert.match(protocol, /agents\/researcher\.md/);
    assert.match(protocol, /genre and craft conventions/);
    assert.match(protocol, /technical accuracy/);
    assert.match(protocol, /academic literature/);
    assert.match(protocol, /Places and geography may use research, but they do not own research/);
    assert.match(protocol, /Do not update drafts/);
    assert.match(protocol, /\/scr:subject-touch <subject>/);
  });

  it('integrates world layers into scan, save, planning, drafting, and continuity workflows', () => {
    const scan = read('commands/scr/scan.md');
    assert.match(scan, /CHECK 15: PLACES\.md candidate detection/);
    assert.match(scan, /Do not auto-append candidates and do not create an inbox/);
    assert.match(scan, /CHECK 18: GEOGRAPHY\.md derived map staleness/);
    assert.match(scan, /\/scr:geography-map --fix/);

    const save = read('commands/scr/save.md');
    assert.match(save, /Regenerate `\.manuscript\/GEOGRAPHY\.md`/);
    assert.match(save, /GEOGRAPHY\.md regenerated: yes\/no/);

    const newWork = read('commands/scr/new-work.md');
    assert.match(newWork, /Create `PLACES\.md` from `templates\/PLACES\.md`/);
    assert.match(newWork, /Do not create `GEOGRAPHY\.md` at new-work/);
    assert.match(newWork, /Do not create `RESEARCH\.md` at new-work/);

    const plan = read('commands/scr/plan.md');
    assert.match(plan, /PLACES\.md \(confirmed place registry/);
    assert.match(plan, /GEOGRAPHY\.md \(derived spatial map/);
    assert.match(plan, /RESEARCH\.md \(advisory factual notes/);

    const draft = read('commands/scr/draft.md');
    assert.match(draft, /`PLACES\.md` and `GEOGRAPHY\.md`/);
    assert.match(draft, /`RESEARCH\.md` when present and relevant, as advisory/);
    assert.match(draft, /PLACE STATE NUDGE/);

    const drafter = read('agents/drafter.md');
    assert.match(drafter, /Place and Geography Notes/);
    assert.match(drafter, /### Step 8: Place state nudge/);

    const continuity = read('commands/scr/continuity-check.md');
    assert.match(continuity, /`PLACES\.md` when present/);
    assert.match(continuity, /`GEOGRAPHY\.md` when present/);
    assert.match(continuity, /`RESEARCH\.md` when present and relevant/);

    const checker = read('agents/continuity-checker.md');
    assert.match(checker, /Place and geography continuity/);
    assert.match(checker, /Suggest \/scr:place-touch <name>/);
  });

  it('inventories world layers in shipped assets and creative context docs', () => {
    const shipped = read('docs/shipped-assets.md');
    assert.match(shipped, /templates\/PLACES\.md/);
    assert.match(shipped, /templates\/GEOGRAPHY\.md/);
    assert.match(shipped, /templates\/RESEARCH\.md/);
    assert.match(shipped, /docs\/world-layers-protocol\.md/);
    assert.match(shipped, /docs\/research-protocol\.md/);

    const creativeContext = read('docs/creative-context.md');
    assert.match(creativeContext, /`world` \| `WORLD\.md`, `COSMOLOGY\.md`, `SYSTEM\.md`, `PLACES\.md`, `GEOGRAPHY\.md`/);
    assert.match(creativeContext, /`research` \| `RESEARCH\.md`/);
    assert.match(creativeContext, /world\/place\/geography/);
    assert.match(creativeContext, /RESEARCH\.md is a neutral advisory surface, not a world file/);
    assert.match(creativeContext, /Confirmed places are a world sublayer/);

    const surfaceResolution = read('docs/surface-resolution-protocol.md');
    assert.match(surfaceResolution, /`PLACES\.md` is an authored project file/);
    assert.match(surfaceResolution, /`GEOGRAPHY\.md` is derived/);
    assert.match(surfaceResolution, /`RESEARCH\.md` is a neutral advisory research surface, not a world surface/);
  });
});
