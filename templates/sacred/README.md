# Sacred Tradition Profiles

This directory is the drop-in extension point for sacred tradition profiles. Each subdirectory ships as a self-contained profile; Scriven's runtime reads the directory listing at load time -- no core-template edits are required to add a tradition.

## Adding a new tradition

1. Create `templates/sacred/<your-tradition-slug>/`.
2. Inside, add a `manifest.yaml` declaring: `tradition`, `label`, `book_order`, `approval_block`, `font_stack`, `rtl`, `numbering`, `script`, `status`. See any of the shipped manifests for the shape.
3. Set `status: active` once the manifest is populated. Profiles with `status: placeholder` are recognized by the validator but signal "schema present, content pending."
4. Optional: add sibling files alongside `manifest.yaml` (CSS, Typst snippets, font-stack fragments) as downstream phases define conventions.

## Currently shipped traditions

catholic, orthodox, tewahedo, protestant, jewish, islamic-hafs, islamic-warsh, pali, tibetan, sanskrit.

All 10 ship with `status: active` and populated manifest data (book order where fixed, approval blocks, font stacks, RTL flags, numbering macros, and script metadata).

## Co-located legacy files

The files `COSMOLOGY.md`, `DOCTRINES.md`, `FIGURES.md`, `FRAMEWORK.md`, `LINEAGES.md`, `THEOLOGICAL-ARC.md` in this directory are project-scaffold templates copied into new sacred-work-type projects (see `/scr:new-work`). They are unrelated to tradition profiles and are preserved as-is.
