const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const constraints = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'data', 'CONSTRAINTS.json'), 'utf8')
);

const TIERS = ['required', 'optional', 'not_applicable'];

describe('craft layer: surface_applicability decision tree', () => {
  const sa = constraints.surface_applicability;
  const canonical = Object.keys(constraints.file_adaptations.default);
  const groups = Object.keys(constraints.work_type_groups);
  const workTypes = Object.keys(constraints.work_types);

  it('exists with by_group and work_type_overrides', () => {
    assert.ok(sa && typeof sa === 'object', 'surface_applicability missing');
    assert.ok(sa.by_group && typeof sa.by_group === 'object', 'by_group missing');
    assert.ok(
      sa.work_type_overrides && typeof sa.work_type_overrides === 'object',
      'work_type_overrides missing'
    );
  });

  it('covers every work-type group exactly', () => {
    assert.deepEqual(new Set(Object.keys(sa.by_group)), new Set(groups));
  });

  it('every group entry has required/optional/not_applicable arrays', () => {
    for (const [g, entry] of Object.entries(sa.by_group)) {
      for (const tier of TIERS) {
        assert.ok(Array.isArray(entry[tier]), `group ${g} missing ${tier} array`);
      }
    }
  });

  it('group tiers are pairwise disjoint', () => {
    for (const [g, entry] of Object.entries(sa.by_group)) {
      const all = [...entry.required, ...entry.optional, ...entry.not_applicable];
      assert.equal(
        all.length,
        new Set(all).size,
        `group ${g} lists a surface in more than one tier`
      );
    }
  });

  it('only references canonical surfaces (keys of file_adaptations.default)', () => {
    const refs = [];
    for (const entry of Object.values(sa.by_group)) {
      for (const t of TIERS) refs.push(...entry[t]);
    }
    for (const ov of Object.values(sa.work_type_overrides)) {
      for (const t of TIERS) if (ov[t]) refs.push(...ov[t]);
    }
    for (const s of refs) {
      assert.ok(
        canonical.includes(s),
        `surface "${s}" is not a canonical surface in file_adaptations.default`
      );
    }
  });

  it('overrides key real work types and are internally disjoint', () => {
    for (const [wt, ov] of Object.entries(sa.work_type_overrides)) {
      assert.ok(workTypes.includes(wt), `override "${wt}" is not a real work_type`);
      const all = [];
      for (const t of TIERS) if (ov[t]) all.push(...ov[t]);
      assert.equal(
        all.length,
        new Set(all).size,
        `override ${wt} lists a surface in more than one tier`
      );
    }
  });

  it('BRIEF and THEMES stay core (never not_applicable at group level)', () => {
    for (const [g, entry] of Object.entries(sa.by_group)) {
      assert.ok(!entry.not_applicable.includes('BRIEF'), `BRIEF should not be not_applicable for ${g}`);
      assert.ok(!entry.not_applicable.includes('THEMES'), `THEMES should not be not_applicable for ${g}`);
    }
  });

  it('matches documented new-work behavior: poetry and speech skip characters/world/plot', () => {
    for (const g of ['poetry', 'speech_song']) {
      for (const s of ['CHARACTERS.md', 'WORLD.md', 'PLOT-GRAPH.md']) {
        assert.ok(
          sa.by_group[g].not_applicable.includes(s),
          `${g} should mark ${s} not_applicable`
        );
      }
    }
  });

  it('matches documented new-work behavior: academic skips relationships', () => {
    assert.ok(sa.by_group.academic.not_applicable.includes('RELATIONSHIPS.md'));
  });
});
