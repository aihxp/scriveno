const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const {
  sanitizeSlug,
  isShellSafeSlug,
  buildDeliverableName,
  FALLBACK_SLUG,
} = require('../lib/slug.js');

// The dangerous characters a writer-typed title or series name could carry into
// a path like `~/.scriveno/series/<slug>/` or an export filename. A safe slug
// must contain none of them.
const DANGEROUS = ['"', "'", '`', '$', ';', '&', '|', '<', '>', '(', ')', ' ', '\t', '\n', '\\', '/', '*', '?', '~', '#', '!', '..'];

describe('sanitizeSlug (lib/slug.js)', () => {
  it('derives kebab-case slugs for ordinary labels', () => {
    assert.equal(sanitizeSlug('The Long War'), 'the-long-war');
    assert.equal(sanitizeSlug("The Watchmaker's Daughter"), 'the-watchmakers-daughter');
    assert.equal(sanitizeSlug('Book 2: The Reckoning'), 'book-2-the-reckoning');
  });

  it('is case- and punctuation-insensitive so near-identical names collapse together', () => {
    assert.equal(sanitizeSlug('The Long War'), sanitizeSlug('the long war!'));
    assert.equal(sanitizeSlug('A  B'), 'a-b');
    assert.equal(sanitizeSlug('a_b'), 'a-b');
  });

  it('neutralizes path-traversal and shell-injection payloads', () => {
    for (const payload of ['../../etc/passwd', '..\\..\\windows', 'series/../escape', '$(whoami)', '`id`', '"; rm -rf ~']) {
      const slug = sanitizeSlug(payload);
      assert.ok(isShellSafeSlug(slug), `not shell-safe: ${slug}`);
      for (const ch of DANGEROUS) {
        assert.ok(!slug.includes(ch), `slug ${slug} contains dangerous ${JSON.stringify(ch)}`);
      }
    }
  });

  it('falls back to a usable slug when nothing survives sanitization', () => {
    assert.equal(sanitizeSlug(''), FALLBACK_SLUG);
    assert.equal(sanitizeSlug('***'), FALLBACK_SLUG);
    assert.equal(sanitizeSlug(null), FALLBACK_SLUG);
    assert.equal(sanitizeSlug('日本'), FALLBACK_SLUG);
  });
});

describe('buildDeliverableName (lib/slug.js)', () => {
  it('builds the minimal {slug}.{ext} form', () => {
    assert.equal(buildDeliverableName({ slug: 'the-long-war', ext: 'epub' }), 'the-long-war.epub');
  });

  it('tolerates a leading dot on ext', () => {
    assert.equal(buildDeliverableName({ slug: 'the-long-war', ext: '.pdf' }), 'the-long-war.pdf');
  });

  it('appends language, platform, and version tokens in grammar order', () => {
    assert.equal(
      buildDeliverableName({ slug: 'the-long-war', lang: 'fr', platform: 'kdp', version: 2, ext: 'epub' }),
      'the-long-war-fr-kdp-v2.epub'
    );
  });

  it('omits falsy tokens and strips a redundant leading v on version', () => {
    assert.equal(buildDeliverableName({ slug: 'the-long-war', platform: 'ingram', ext: 'pdf' }), 'the-long-war-ingram.pdf');
    assert.equal(buildDeliverableName({ slug: 'the-long-war', version: 'v3', ext: 'pdf' }), 'the-long-war-v3.pdf');
    assert.equal(buildDeliverableName({ slug: 'the-long-war', version: '', ext: 'pdf' }), 'the-long-war.pdf');
  });

  it('re-sanitizes raw tokens so a composed name is itself path-safe', () => {
    const name = buildDeliverableName({ slug: 'The Long War', lang: 'FR', platform: 'KDP/print', ext: 'EPUB' });
    assert.equal(name, 'the-long-war-fr-kdpprint.epub');
    assert.ok(!name.includes('/'));
    assert.ok(!name.includes(' '));
  });
});
