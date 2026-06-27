const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const has = (content, substr, label) =>
  assert.ok(content.includes(substr), `${label}: expected to find ${JSON.stringify(substr)}`);
const hasNot = (content, substr, label) =>
  assert.ok(!content.includes(substr), `${label}: did not expect ${JSON.stringify(substr)}`);

// These tests lock in the multi-book / series / naming contract introduced for
// file structure, export, and cover art. They assert the durable tokens (paths,
// filenames, citations), not prose wording, so they survive rewording but catch
// a regression that drops the behavior.

describe('naming-conventions spec is the single source of truth', () => {
  const spec = read('docs/naming-conventions.md');

  it('documents the deliverable filename grammar', () => {
    has(spec, '{slug}[-{lang}][-{platform}][-v{n}].{ext}', 'spec grammar');
  });

  it('points at the canonical slug helper', () => {
    has(spec, 'lib/slug.js', 'spec slug helper');
    has(spec, 'sanitizeSlug', 'spec sanitizeSlug');
  });

  it('defines the series store path and derived index', () => {
    has(spec, '~/.scriveno/series/<series_slug>/', 'spec series store');
    has(spec, 'books.json', 'spec books index');
  });

  it('defines the optional book identity keys', () => {
    for (const key of ['title', 'subtitle', 'author', 'slug', 'series', 'book_number']) {
      has(spec, `\`${key}\``, `spec identity key ${key}`);
    }
  });

  it('states the canonical-literal-default backward-compat rule', () => {
    has(spec, 'canonical', 'spec canonical default');
  });
});

describe('slug helper (lib/slug.js) exports the generic API', () => {
  const slug = require('../lib/slug.js');
  it('exports sanitizeSlug and buildDeliverableName', () => {
    assert.equal(typeof slug.sanitizeSlug, 'function');
    assert.equal(typeof slug.buildDeliverableName, 'function');
  });
  it('composes a deliverable name per the documented grammar', () => {
    assert.equal(
      slug.buildDeliverableName({ slug: 'the-long-war', lang: 'fr', platform: 'kdp', version: 2, ext: 'epub' }),
      'the-long-war-fr-kdp-v2.epub'
    );
  });
});

describe('book identity lives in config', () => {
  it('templates/config.json carries the optional identity keys', () => {
    const cfg = JSON.parse(read('templates/config.json'));
    for (const key of ['title', 'subtitle', 'author', 'slug', 'series', 'book_number']) {
      assert.ok(Object.prototype.hasOwnProperty.call(cfg, key), `template config missing key ${key}`);
    }
  });

  it('the demo project models a real identity including a slug', () => {
    const cfg = JSON.parse(read('data/demo/.manuscript/config.json'));
    assert.equal(cfg.slug, 'the-watchmakers-daughter');
    assert.ok(Object.prototype.hasOwnProperty.call(cfg, 'series'));
    assert.ok(Object.prototype.hasOwnProperty.call(cfg, 'book_number'));
  });

  it('new-work writes identity and derives the slug deterministically', () => {
    const nw = read('commands/scr/new-work.md');
    has(nw, '"slug"', 'new-work slug key');
    has(nw, '"book_number"', 'new-work book_number key');
    has(nw, 'lib/slug.js', 'new-work slug helper');
    has(nw, 'docs/naming-conventions.md', 'new-work spec citation');
  });

  it('import populates identity using the shared helper', () => {
    const imp = read('commands/scr/import.md');
    has(imp, 'lib/slug.js', 'import slug helper');
    has(imp, 'docs/naming-conventions.md', 'import spec citation');
  });
});

describe('series store is slug-sanitized and indexed', () => {
  const sb = read('commands/scr/series-bible.md');

  it('uses a sanitized series_slug for the store path', () => {
    has(sb, '~/.scriveno/series/{series_slug}/SERIES-BIBLE.md', 'series store path');
    has(sb, 'lib/slug.js', 'series slug helper');
    hasNot(sb, '~/.scriveno/series/{series_name}/SERIES-BIBLE.md', 'old raw series store path');
  });

  it('carries a migration shim for the legacy raw-name path', () => {
    has(sb, 'migration shim', 'series migration shim');
    has(sb, '{raw name}', 'series legacy path');
  });

  it('maintains a derived books index and structured book_number', () => {
    has(sb, 'books.json', 'series books index');
    has(sb, '"book_number"', 'series book_number');
  });

  it('documents the optional series-tier shared surfaces', () => {
    for (const surface of ['STYLE-GUIDE.md', 'ART-DIRECTION.md', 'GLOSSARY.md', 'covers/']) {
      has(sb, surface, `series-tier surface ${surface}`);
    }
  });
});

describe('export deliverables are collision-safe', () => {
  it('build-ebook platform-encodes the canonical EPUB (no bare ebook.epub)', () => {
    const be = read('commands/scr/build-ebook.md');
    has(be, 'ebook-{platform}.epub', 'build-ebook platform-encoded output');
    hasNot(be, 'output/ebook.epub', 'build-ebook old colliding name');
    has(be, '.manuscript/build/ebook-cover.jpg', 'build-ebook canonical cover preserved');
  });

  it('export adds a slugged deliverable copy without dropping the canonical file', () => {
    const ex = read('commands/scr/export.md');
    has(ex, 'STEP 4.9', 'export slugged step');
    has(ex, '{slug}.epub', 'export slugged epub');
    has(ex, 'manuscript.epub', 'export canonical epub preserved');
    has(ex, 'docs/naming-conventions.md', 'export spec citation');
  });

  it('build-print keeps the canonical interior and adds a slugged copy', () => {
    const bp = read('commands/scr/build-print.md');
    has(bp, 'print-{platform}.pdf', 'build-print canonical interior');
    has(bp, 'docs/naming-conventions.md', 'build-print spec citation');
    has(bp, '{slug}', 'build-print slugged copy');
  });

  it('multi-publish encodes language in deliverables and covers', () => {
    const mp = read('commands/scr/multi-publish.md');
    has(mp, '{slug}-{lang}', 'multi-publish slugged per-language name');
    has(mp, '.manuscript/build/{lang}/ebook-cover.jpg', 'multi-publish per-language cover');
  });
});

describe('cover art supports series consistency and editions', () => {
  const ca = read('commands/scr/cover-art.md');

  it('reads series-tier art direction from the series store first', () => {
    has(ca, '~/.scriveno/series/{series_slug}/ART-DIRECTION.md', 'cover-art series store read');
    has(ca, '.manuscript/illustrations/ART-DIRECTION.md', 'cover-art project fallback');
  });

  it('keeps the three canonical cover files and adds slugged copies', () => {
    has(ca, '.manuscript/build/ebook-cover.jpg', 'cover-art canonical ebook cover');
    has(ca, '.manuscript/build/paperback-cover.pdf', 'cover-art canonical paperback cover');
    has(ca, '.manuscript/build/hardcover-cover.pdf', 'cover-art canonical hardcover cover');
    has(ca, '{slug}-ebook-cover.jpg', 'cover-art slugged ebook cover');
  });

  it('defines per-language and per-edition cover slots', () => {
    has(ca, '.manuscript/build/{lang}/ebook-cover.jpg', 'cover-art per-language slot');
    has(ca, '.manuscript/build/editions/{edition}/', 'cover-art per-edition slot');
  });
});

describe('multi-book ergonomics and hygiene', () => {
  it('manager --switch is honest about cwd-based resolution', () => {
    const mg = read('commands/scr/manager.md');
    has(mg, 'cd <path-to-the-target-project-directory>', 'manager cd command');
    has(mg, 'no stored active-project pointer', 'manager no-persistence statement');
    hasNot(mg, 'Switched to [Project Name]', 'manager old false-persistence confirmation');
  });

  it('reorder-units warns about orphaned illustration and header prompts', () => {
    const ru = read('commands/scr/reorder-units.md');
    has(ru, 'illustration-prompt', 'reorder orphan illustration prompt');
    has(ru, 'orphaned', 'reorder orphan wording');
  });
});

describe('series-tier voice and terminology propagate into the agents', () => {
  it('drafter loads the series voice baseline with project override', () => {
    const dr = read('agents/drafter.md');
    has(dr, '~/.scriveno/series/{series_slug}/STYLE-GUIDE.md', 'drafter series style guide');
  });

  it('translator reads the series glossary for cross-book term consistency', () => {
    const tr = read('agents/translator.md');
    has(tr, '~/.scriveno/series/{series_slug}/GLOSSARY.md', 'translator series glossary');
  });
});

describe('front and back matter prefer config identity', () => {
  it('front-matter resolves series membership from config', () => {
    const fm = read('commands/scr/front-matter.md');
    has(fm, 'docs/naming-conventions.md', 'front-matter spec citation');
    has(fm, 'book_number', 'front-matter book_number');
  });

  it('back-matter cites the identity contract', () => {
    const bm = read('commands/scr/back-matter.md');
    has(bm, 'docs/naming-conventions.md', 'back-matter spec citation');
  });
});
