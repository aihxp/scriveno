// lib/slug.js
// Canonical, dependency-free slug + deliverable-name derivation for Scriveno.
//
// This is the single generic helper for turning any human-typed label (a book
// title, a series name, an edition label) into a filesystem- and shell-safe
// slug, and for composing publication deliverable filenames from that slug plus
// optional language, platform, and version tokens.
//
// The slug algorithm itself is the same one shipped for /scr:track. It lives in
// lib/track-safety.js (its original home, where the injection-safety tests
// exercise it) and is re-exported here under a generic name so series
// directories, book identity, cover files, and export deliverables can all
// derive names from one source of truth instead of each command reinventing it.
//
// The installer copies lib/ into the writer's data dir, so this ships as
// <data-dir>/lib/slug.js and a runtime can derive a guaranteed-safe slug
// deterministically instead of asking the model to apply the rules by hand:
//
//   node <data-dir>/lib/slug.js "The Long War"
//   -> {"slug":"the-long-war"}
//
//   node <data-dir>/lib/slug.js --name slug=the-long-war lang=fr platform=kdp v=2 ext=epub
//   -> the-long-war-fr-kdp-v2.epub
//
// Safety property: a sanitized slug contains only [a-z0-9-]. It can never carry
// a shell metacharacter, quote, whitespace, path separator, or command
// substitution, so interpolating it into a path or command line is safe. This
// is what makes `~/.scriveno/series/<slug>/` safe to build from a writer-typed
// series name (see commands/scr/series-bible.md and docs/naming-conventions.md).

'use strict';

const {
  sanitizeTrackSlug,
  isShellSafeSlug,
  FALLBACK_SLUG,
} = require('./track-safety.js');

// Generic alias for the canonical slug algorithm. Identical behavior to
// sanitizeTrackSlug; named without the track-specific connotation so other
// surfaces (series dirs, book/edition slugs, deliverable stems) can use it.
function sanitizeSlug(label) {
  return sanitizeTrackSlug(label);
}

// Compose a deliverable filename from a slug and optional tokens, per the
// grammar documented in docs/naming-conventions.md:
//
//   {slug}[-{lang}][-{platform}][-v{n}].{ext}
//
// Every token is run back through sanitizeSlug so the composed name is itself
// shell- and path-safe. `version` accepts a number or string; a leading "v" is
// stripped before the canonical "v{n}" token is appended. `ext` may be passed
// with or without a leading dot. Falsy tokens are omitted, so the minimal call
// buildDeliverableName({ slug, ext }) yields "{slug}.{ext}".
function buildDeliverableName(parts) {
  const opts = parts || {};
  const segments = [sanitizeSlug(opts.slug)];

  if (opts.lang) {
    segments.push(sanitizeSlug(opts.lang));
  }
  if (opts.platform) {
    segments.push(sanitizeSlug(opts.platform));
  }
  if (opts.version !== undefined && opts.version !== null && opts.version !== '') {
    const raw = String(opts.version).replace(/^v/i, '');
    const v = sanitizeSlug(raw);
    if (v && v !== FALLBACK_SLUG) {
      segments.push(`v${v}`);
    }
  }

  const stem = segments.join('-');
  const ext = String(opts.ext == null ? '' : opts.ext)
    .replace(/^\.+/, '')
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '');
  return ext ? `${stem}.${ext}` : stem;
}

module.exports = {
  sanitizeSlug,
  isShellSafeSlug,
  buildDeliverableName,
  FALLBACK_SLUG,
};

if (require.main === module) {
  const argv = process.argv.slice(2);
  if (argv[0] === '--name') {
    const kv = {};
    for (const token of argv.slice(1)) {
      const eq = token.indexOf('=');
      if (eq > 0) {
        kv[token.slice(0, eq)] = token.slice(eq + 1);
      }
    }
    process.stdout.write(
      buildDeliverableName({
        slug: kv.slug,
        lang: kv.lang,
        platform: kv.platform,
        version: kv.v || kv.version,
        ext: kv.ext,
      }) + '\n'
    );
  } else {
    process.stdout.write(JSON.stringify({ slug: sanitizeSlug(argv[0] || '') }) + '\n');
  }
}
