const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT              = path.join(__dirname, '..');
const TEMPLATES_DIR     = path.join(ROOT, 'data', 'export-templates');
const BUILD_PRINT_PATH  = path.join(ROOT, 'commands', 'scr', 'build-print.md');
const CONSTRAINTS_PATH  = path.join(ROOT, 'data', 'CONSTRAINTS.json');

/**
 * Read a file and return its content, or null if it doesn't exist.
 * Tests that need the file content will fail with a descriptive message
 * when the file is missing, rather than crashing the whole suite.
 */
function readFile(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); }
  catch (_) { return null; }
}

// ─────────────────────────────────────────────────────────────────────────────
// TPL-07: scriveno-ieee.latex (IEEE Transactions / Conference)
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 35: TPL-07 scriveno-ieee.latex exists with IEEEtran class', () => {
  const TPLFILE = path.join(TEMPLATES_DIR, 'scriveno-ieee.latex');

  it('scriveno-ieee.latex exists -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'data/export-templates/scriveno-ieee.latex must exist -- TPL-07');
  });

  it('scriveno-ieee.latex contains \\documentclass with IEEEtran -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'scriveno-ieee.latex must exist -- TPL-07');
    assert.ok(
      content.includes('\\documentclass') && content.includes('IEEEtran'),
      'scriveno-ieee.latex must contain \\documentclass with IEEEtran -- TPL-07'
    );
  });

  it('scriveno-ieee.latex contains \\providecommand{\\tightlist} -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'scriveno-ieee.latex must exist -- TPL-07');
    assert.ok(
      content.includes('\\providecommand{\\tightlist}'),
      'scriveno-ieee.latex must contain \\providecommand{\\tightlist} -- TPL-07'
    );
  });

  it('scriveno-ieee.latex contains $body$ variable -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'scriveno-ieee.latex must exist -- TPL-07');
    assert.ok(
      content.includes('$body$'),
      'scriveno-ieee.latex must contain $body$ Pandoc variable -- TPL-07'
    );
  });

  it('scriveno-ieee.latex contains $if(abstract)$ block -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'scriveno-ieee.latex must exist -- TPL-07');
    assert.ok(
      content.includes('$if(abstract)$'),
      'scriveno-ieee.latex must contain $if(abstract)$ block -- TPL-07'
    );
  });

  it('scriveno-ieee.latex contains CSL reference environment -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'scriveno-ieee.latex must exist -- TPL-07');
    assert.ok(
      content.includes('CSLReferences'),
      'scriveno-ieee.latex must contain CSLReferences environment -- TPL-07'
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TPL-07: scriveno-acm.latex (ACM Conference / Journal)
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 35: TPL-07 scriveno-acm.latex exists with acmart class', () => {
  const TPLFILE = path.join(TEMPLATES_DIR, 'scriveno-acm.latex');

  it('scriveno-acm.latex exists -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'data/export-templates/scriveno-acm.latex must exist -- TPL-07');
  });

  it('scriveno-acm.latex contains \\documentclass with acmart -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'scriveno-acm.latex must exist -- TPL-07');
    assert.ok(
      content.includes('\\documentclass') && content.includes('acmart'),
      'scriveno-acm.latex must contain \\documentclass with acmart -- TPL-07'
    );
  });

  it('scriveno-acm.latex contains \\providecommand{\\tightlist} -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'scriveno-acm.latex must exist -- TPL-07');
    assert.ok(
      content.includes('\\providecommand{\\tightlist}'),
      'scriveno-acm.latex must contain \\providecommand{\\tightlist} -- TPL-07'
    );
  });

  it('scriveno-acm.latex contains $body$ variable -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'scriveno-acm.latex must exist -- TPL-07');
    assert.ok(
      content.includes('$body$'),
      'scriveno-acm.latex must contain $body$ Pandoc variable -- TPL-07'
    );
  });

  it('scriveno-acm.latex contains $if(abstract)$ block -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'scriveno-acm.latex must exist -- TPL-07');
    assert.ok(
      content.includes('$if(abstract)$'),
      'scriveno-acm.latex must contain $if(abstract)$ block -- TPL-07'
    );
  });

  it('scriveno-acm.latex contains CSL reference environment -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'scriveno-acm.latex must exist -- TPL-07');
    assert.ok(
      content.includes('CSLReferences'),
      'scriveno-acm.latex must contain CSLReferences environment -- TPL-07'
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TPL-07: scriveno-lncs.latex (Springer Lecture Notes in Computer Science)
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 35: TPL-07 scriveno-lncs.latex exists with llncs class', () => {
  const TPLFILE = path.join(TEMPLATES_DIR, 'scriveno-lncs.latex');

  it('scriveno-lncs.latex exists -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'data/export-templates/scriveno-lncs.latex must exist -- TPL-07');
  });

  it('scriveno-lncs.latex contains \\documentclass with llncs -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'scriveno-lncs.latex must exist -- TPL-07');
    assert.ok(
      content.includes('\\documentclass') && content.includes('llncs'),
      'scriveno-lncs.latex must contain \\documentclass with llncs -- TPL-07'
    );
  });

  it('scriveno-lncs.latex contains \\providecommand{\\tightlist} -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'scriveno-lncs.latex must exist -- TPL-07');
    assert.ok(
      content.includes('\\providecommand{\\tightlist}'),
      'scriveno-lncs.latex must contain \\providecommand{\\tightlist} -- TPL-07'
    );
  });

  it('scriveno-lncs.latex contains $body$ variable -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'scriveno-lncs.latex must exist -- TPL-07');
    assert.ok(
      content.includes('$body$'),
      'scriveno-lncs.latex must contain $body$ Pandoc variable -- TPL-07'
    );
  });

  it('scriveno-lncs.latex contains $if(abstract)$ block -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'scriveno-lncs.latex must exist -- TPL-07');
    assert.ok(
      content.includes('$if(abstract)$'),
      'scriveno-lncs.latex must contain $if(abstract)$ block -- TPL-07'
    );
  });

  it('scriveno-lncs.latex contains CSL reference environment -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'scriveno-lncs.latex must exist -- TPL-07');
    assert.ok(
      content.includes('CSLReferences'),
      'scriveno-lncs.latex must contain CSLReferences environment -- TPL-07'
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TPL-07: scriveno-elsevier.latex (Elsevier journals)
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 35: TPL-07 scriveno-elsevier.latex exists with elsarticle class', () => {
  const TPLFILE = path.join(TEMPLATES_DIR, 'scriveno-elsevier.latex');

  it('scriveno-elsevier.latex exists -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'data/export-templates/scriveno-elsevier.latex must exist -- TPL-07');
  });

  it('scriveno-elsevier.latex contains \\documentclass with elsarticle -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'scriveno-elsevier.latex must exist -- TPL-07');
    assert.ok(
      content.includes('\\documentclass') && content.includes('elsarticle'),
      'scriveno-elsevier.latex must contain \\documentclass with elsarticle -- TPL-07'
    );
  });

  it('scriveno-elsevier.latex contains \\providecommand{\\tightlist} -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'scriveno-elsevier.latex must exist -- TPL-07');
    assert.ok(
      content.includes('\\providecommand{\\tightlist}'),
      'scriveno-elsevier.latex must contain \\providecommand{\\tightlist} -- TPL-07'
    );
  });

  it('scriveno-elsevier.latex contains $body$ variable -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'scriveno-elsevier.latex must exist -- TPL-07');
    assert.ok(
      content.includes('$body$'),
      'scriveno-elsevier.latex must contain $body$ Pandoc variable -- TPL-07'
    );
  });

  it('scriveno-elsevier.latex contains $if(abstract)$ block -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'scriveno-elsevier.latex must exist -- TPL-07');
    assert.ok(
      content.includes('$if(abstract)$'),
      'scriveno-elsevier.latex must contain $if(abstract)$ block -- TPL-07'
    );
  });

  it('scriveno-elsevier.latex contains CSL reference environment -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'scriveno-elsevier.latex must exist -- TPL-07');
    assert.ok(
      content.includes('CSLReferences'),
      'scriveno-elsevier.latex must contain CSLReferences environment -- TPL-07'
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TPL-07: scriveno-apa7.latex (APA 7th edition)
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 35: TPL-07 scriveno-apa7.latex exists with apa7 class', () => {
  const TPLFILE = path.join(TEMPLATES_DIR, 'scriveno-apa7.latex');

  it('scriveno-apa7.latex exists -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'data/export-templates/scriveno-apa7.latex must exist -- TPL-07');
  });

  it('scriveno-apa7.latex contains \\documentclass with apa7 -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'scriveno-apa7.latex must exist -- TPL-07');
    assert.ok(
      content.includes('\\documentclass') && content.includes('apa7'),
      'scriveno-apa7.latex must contain \\documentclass with apa7 -- TPL-07'
    );
  });

  it('scriveno-apa7.latex contains \\providecommand{\\tightlist} -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'scriveno-apa7.latex must exist -- TPL-07');
    assert.ok(
      content.includes('\\providecommand{\\tightlist}'),
      'scriveno-apa7.latex must contain \\providecommand{\\tightlist} -- TPL-07'
    );
  });

  it('scriveno-apa7.latex contains $body$ variable -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'scriveno-apa7.latex must exist -- TPL-07');
    assert.ok(
      content.includes('$body$'),
      'scriveno-apa7.latex must contain $body$ Pandoc variable -- TPL-07'
    );
  });

  it('scriveno-apa7.latex contains $if(abstract)$ block -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'scriveno-apa7.latex must exist -- TPL-07');
    assert.ok(
      content.includes('$if(abstract)$'),
      'scriveno-apa7.latex must contain $if(abstract)$ block -- TPL-07'
    );
  });

  it('scriveno-apa7.latex contains CSL reference environment -- TPL-07', () => {
    const content = readFile(TPLFILE);
    assert.ok(content !== null, 'scriveno-apa7.latex must exist -- TPL-07');
    assert.ok(
      content.includes('CSLReferences'),
      'scriveno-apa7.latex must contain CSLReferences environment -- TPL-07'
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TPL-07: build-print.md academic LaTeX route checks
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 35: TPL-07 build-print.md contains academic LaTeX route', () => {
  it('build-print.md references kpsewhich -- TPL-07', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md must be readable -- TPL-07');
    assert.ok(content.includes('kpsewhich'), 'build-print.md must reference kpsewhich -- TPL-07');
  });

  it('build-print.md contains ieee as valid platform value -- TPL-07', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md must be readable -- TPL-07');
    assert.ok(content.includes('ieee'), 'build-print.md must contain ieee as a platform value -- TPL-07');
  });

  it('build-print.md contains acm as valid platform value -- TPL-07', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md must be readable -- TPL-07');
    assert.ok(content.includes('acm'), 'build-print.md must contain acm as a platform value -- TPL-07');
  });

  it('build-print.md contains lncs as valid platform value -- TPL-07', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md must be readable -- TPL-07');
    assert.ok(content.includes('lncs'), 'build-print.md must contain lncs as a platform value -- TPL-07');
  });

  it('build-print.md contains elsevier as valid platform value -- TPL-07', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md must be readable -- TPL-07');
    assert.ok(content.includes('elsevier'), 'build-print.md must contain elsevier as a platform value -- TPL-07');
  });

  it('build-print.md contains apa7 as valid platform value -- TPL-07', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md must be readable -- TPL-07');
    assert.ok(content.includes('apa7'), 'build-print.md must contain apa7 as a platform value -- TPL-07');
  });

  it('build-print.md contains paper- output naming pattern -- TPL-07', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md must be readable -- TPL-07');
    assert.ok(content.includes('paper-'), 'build-print.md must contain paper-{platform} output naming -- TPL-07');
  });

  it('build-print.md contains tlmgr install guidance -- TPL-07', () => {
    const content = readFile(BUILD_PRINT_PATH);
    assert.ok(content !== null, 'commands/scr/build-print.md must be readable -- TPL-07');
    assert.ok(
      content.includes('tlmgr install'),
      'build-print.md must contain tlmgr install guidance for missing classes -- TPL-07'
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TPL-07: CONSTRAINTS.json exports.build_print.available includes "academic"
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 35: TPL-07 CONSTRAINTS.json exports.build_print.available includes academic', () => {
  it('data/CONSTRAINTS.json exports.build_print.available includes "academic" -- TPL-07', () => {
    const raw = readFile(CONSTRAINTS_PATH);
    assert.ok(raw !== null, 'data/CONSTRAINTS.json must be readable -- TPL-07');
    const constraints = JSON.parse(raw);
    assert.ok(
      Array.isArray(constraints.exports.build_print.available) &&
      constraints.exports.build_print.available.includes('academic'),
      'CONSTRAINTS.json exports.build_print.available must include "academic" -- TPL-07'
    );
  });
});
