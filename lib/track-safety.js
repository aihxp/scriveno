// lib/track-safety.js
// Canonical, dependency-free slug + branch derivation for /scr:track (D-01).
//
// The track.md prompt instructs the agent to slugify a writer-provided track
// label before it ever touches a git or shell command. This module is the
// single source of truth for that algorithm. The installer copies lib/ into the
// writer's data dir, so it ships as <data-dir>/lib/track-safety.js and a runtime
// can derive a guaranteed-safe slug deterministically instead of relying on the
// model to apply the rules by hand:
//
//   node <data-dir>/lib/track-safety.js "Editor's Suggestions"
//   -> {"slug":"editors-suggestions","branch":"track/editors-suggestions"}
//
// Safety property: a sanitized slug contains only [a-z0-9-]. It can never carry
// a shell metacharacter, quote, whitespace, path separator, or command
// substitution, so interpolating `track/<slug>` into a git command line is safe.

'use strict';

// A slug is shell-safe iff it is a non-empty run of lowercase alphanumerics and
// hyphens with no leading/trailing hyphen.
const SLUG_SAFE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const FALLBACK_SLUG = 'untitled';

// Apply the D-01 rules: lowercase, whitespace/underscores to hyphen, strip
// everything that is not [a-z0-9-], collapse hyphen runs, trim edge hyphens.
// Returns FALLBACK_SLUG when the label has no usable characters (e.g. "***",
// "日本", "") so the caller never produces an empty branch name.
function sanitizeTrackSlug(label) {
  const slug = String(label == null ? '' : label)
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug.length > 0 ? slug : FALLBACK_SLUG;
}

function isShellSafeSlug(slug) {
  return typeof slug === 'string' && SLUG_SAFE.test(slug);
}

// Resolve a collision-free branch name. `existingBranches` is the set of branch
// names already present in the repo (e.g. parsed from `git branch`). Mirrors
// track.md create-step 6: append -2, -3, ... to the slug until the branch name
// is free.
function resolveTrackBranch(label, existingBranches = []) {
  const taken = new Set(existingBranches);
  const baseSlug = sanitizeTrackSlug(label);
  let slug = baseSlug;
  let n = 2;
  while (taken.has(`track/${slug}`)) {
    slug = `${baseSlug}-${n}`;
    n += 1;
  }
  return { slug, branch: `track/${slug}` };
}

module.exports = {
  sanitizeTrackSlug,
  isShellSafeSlug,
  resolveTrackBranch,
  FALLBACK_SLUG,
};

if (require.main === module) {
  const label = process.argv[2] || '';
  const existing = process.argv[3]
    ? process.argv[3].split(',').map((s) => s.trim()).filter(Boolean)
    : [];
  process.stdout.write(JSON.stringify(resolveTrackBranch(label, existing)) + '\n');
}
