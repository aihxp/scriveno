const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FRONT_MATTER_PATH = path.join(ROOT, 'commands', 'scr', 'front-matter.md');
const EXPORT_PATH = path.join(ROOT, 'commands', 'scr', 'export.md');
const PUBLISH_PATH = path.join(ROOT, 'commands', 'scr', 'publish.md');
const AUTOPILOT_PUBLISH_PATH = path.join(ROOT, 'commands', 'scr', 'autopilot-publish.md');
const BUILD_EBOOK_PATH = path.join(ROOT, 'commands', 'scr', 'build-ebook.md');
const BUILD_PRINT_PATH = path.join(ROOT, 'commands', 'scr', 'build-print.md');
const BUILD_SMASHWORDS_PATH = path.join(ROOT, 'commands', 'scr', 'build-smashwords.md');

/**
 * Read a file and return its content, or null if it doesn't exist.
 * Tests that need the file content will fail with a descriptive message
 * when the file is missing, rather than crashing the whole suite.
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (_) {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FM-01: GENERATE elements (01, 03, 04, 07) produce no [Fill in] placeholders
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 31: FM-01 GENERATE elements (01, 03, 04, 07) have no [Fill in] placeholders', () => {
  it('GENERATE element sections (01, 03, 04, 07) must not contain [Fill in] placeholders -- FM-01', () => {
    const content = readFile(FRONT_MATTER_PATH);
    assert.ok(
      content !== null,
      'commands/scr/front-matter.md could not be read'
    );

    // Split on #### Element headers to isolate individual element sections
    const sections = content.split(/(?=#### Element \d+:)/);

    // Extract sections for GENERATE elements: 01, 03, 04, 07
    const generateElementNumbers = ['Element 1:', 'Element 3:', 'Element 4:', 'Element 7:'];
    const generateSections = sections.filter(section =>
      generateElementNumbers.some(num => section.startsWith(`#### ${num}`))
    );

    assert.ok(
      generateSections.length > 0,
      'front-matter.md must contain GENERATE element sections (01, 03, 04, 07) -- FM-01'
    );

    for (const section of generateSections) {
      // Find just the content up to the Save-to line to scope the check tightly
      const saveToIndex = section.indexOf('Save to');
      const sectionContent = saveToIndex !== -1 ? section.slice(0, saveToIndex) : section;
      assert.ok(
        !sectionContent.includes('[Fill in'),
        `GENERATE element sections (01, 03, 04, 07) must not contain [Fill in] placeholders -- FM-01. Found in section starting with: ${section.slice(0, 60)}`
      );
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// FM-02: front-matter.md adds scaffold: true YAML to 5 personalization elements
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 31: FM-02 front-matter.md adds scaffold: true YAML to 5 scaffold elements', () => {
  it('FM-02: front-matter.md must contain scaffold: true text at least once', () => {
    const content = readFile(FRONT_MATTER_PATH);
    assert.ok(content !== null, 'commands/scr/front-matter.md could not be read');
    assert.ok(
      content.includes('scaffold: true'),
      'FM-02: front-matter.md must contain scaffold: true -- the 5 personalization elements need scaffold YAML frontmatter'
    );
  });

  it('FM-02: dedication scaffold YAML must specify element name', () => {
    const content = readFile(FRONT_MATTER_PATH);
    assert.ok(content !== null, 'commands/scr/front-matter.md could not be read');
    assert.ok(
      content.includes('element: dedication'),
      'FM-02: front-matter.md must contain "element: dedication" in the dedication element output YAML -- the agent writes scaffold: true + element name to 05-dedication.md'
    );
  });

  it('FM-02: epigraph scaffold YAML must specify element name', () => {
    const content = readFile(FRONT_MATTER_PATH);
    assert.ok(content !== null, 'commands/scr/front-matter.md could not be read');
    assert.ok(
      content.includes('element: epigraph'),
      'FM-02: front-matter.md must contain "element: epigraph" in the epigraph element output YAML -- the agent writes scaffold: true + element name to 06-epigraph.md'
    );
  });

  it('FM-02: foreword scaffold YAML must specify element name', () => {
    const content = readFile(FRONT_MATTER_PATH);
    assert.ok(content !== null, 'commands/scr/front-matter.md could not be read');
    assert.ok(
      content.includes('element: foreword'),
      'FM-02: front-matter.md must contain "element: foreword" in the foreword element output YAML -- the agent writes scaffold: true + element name to 11-foreword.md'
    );
  });

  it('FM-02: preface scaffold YAML must specify element name', () => {
    const content = readFile(FRONT_MATTER_PATH);
    assert.ok(content !== null, 'commands/scr/front-matter.md could not be read');
    assert.ok(
      content.includes('element: preface'),
      'FM-02: front-matter.md must contain "element: preface" in the preface element output YAML -- the agent writes scaffold: true + element name to 12-preface.md'
    );
  });

  it('FM-02: acknowledgments scaffold YAML must specify element name', () => {
    const content = readFile(FRONT_MATTER_PATH);
    assert.ok(content !== null, 'commands/scr/front-matter.md could not be read');
    assert.ok(
      content.includes('element: acknowledgments'),
      'FM-02: front-matter.md must contain "element: acknowledgments" in the acknowledgments element output YAML -- the agent writes scaffold: true + element name to 13-acknowledgments.md'
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// FM-03: STEP 1.6 scaffold exclusion exists in export.md and publish.md,
//         and STEP 3b references the exclusion list
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 31: FM-03 export.md and publish.md have STEP 1.6 scaffold exclusion gate', () => {
  it('FM-03: export.md must have a STEP 1.6 scaffold gate', () => {
    const content = readFile(EXPORT_PATH);
    assert.ok(content !== null, 'commands/scr/export.md could not be read');
    assert.ok(
      content.includes('STEP 1.6'),
      'FM-03: export.md must contain STEP 1.6 -- the front-matter scaffold exclusion gate'
    );
  });

  it('FM-03: STEP 1.6 must come after STEP 1.5 in export.md', () => {
    const content = readFile(EXPORT_PATH);
    assert.ok(content !== null, 'commands/scr/export.md could not be read');
    const step15Pos = content.indexOf('STEP 1.5');
    const step16Pos = content.indexOf('STEP 1.6');
    assert.ok(step15Pos !== -1, 'export.md must contain STEP 1.5 (validate gate) -- FM-03 ordering check requires it');
    assert.ok(step16Pos !== -1, 'export.md must contain STEP 1.6 -- FM-03 scaffold gate');
    assert.ok(
      step15Pos < step16Pos,
      'FM-03: STEP 1.6 must appear after STEP 1.5 in export.md -- scaffold gate follows validate gate'
    );
  });

  it('FM-03: STEP 1.6 must come before STEP 2 in export.md', () => {
    const content = readFile(EXPORT_PATH);
    assert.ok(content !== null, 'commands/scr/export.md could not be read');
    const step16Pos = content.indexOf('STEP 1.6');
    // Use the section heading to avoid matching inline "Proceed to STEP 2." references in STEP 1.5
    const step2Pos = content.indexOf('### STEP 2:');
    assert.ok(step16Pos !== -1, 'export.md must contain STEP 1.6 -- FM-03 scaffold gate');
    assert.ok(step2Pos !== -1, 'export.md must contain ### STEP 2: (CHECK PREREQUISITES) -- FM-03 ordering check requires it');
    assert.ok(
      step16Pos < step2Pos,
      'FM-03: STEP 1.6 must appear before STEP 2 in export.md -- front-matter gate must run before prerequisite checks'
    );
  });

  it('FM-03: publish.md must have a STEP 1.6 scaffold gate', () => {
    const content = readFile(PUBLISH_PATH);
    assert.ok(content !== null, 'commands/scr/publish.md could not be read');
    assert.ok(
      content.includes('STEP 1.6'),
      'FM-03: publish.md must contain STEP 1.6 -- the front-matter scaffold exclusion gate'
    );
  });

  it('FM-03: STEP 1.6 must come after STEP 1.5 in publish.md', () => {
    const content = readFile(PUBLISH_PATH);
    assert.ok(content !== null, 'commands/scr/publish.md could not be read');
    const step15Pos = content.indexOf('STEP 1.5');
    const step16Pos = content.indexOf('STEP 1.6');
    assert.ok(step15Pos !== -1, 'publish.md must contain STEP 1.5 (validate gate) -- FM-03 ordering check requires it');
    assert.ok(step16Pos !== -1, 'publish.md must contain STEP 1.6 -- FM-03 scaffold gate');
    assert.ok(
      step15Pos < step16Pos,
      'FM-03: STEP 1.6 must appear after STEP 1.5 in publish.md -- scaffold gate follows validate gate'
    );
  });

  it('FM-03: STEP 1.6 must come before STEP 2 in publish.md', () => {
    const content = readFile(PUBLISH_PATH);
    assert.ok(content !== null, 'commands/scr/publish.md could not be read');
    const step16Pos = content.indexOf('STEP 1.6');
    // Use the section heading to avoid matching inline "Proceed to STEP 2." references in STEP 1.5
    const step2Pos = content.indexOf('### STEP 2:');
    assert.ok(step16Pos !== -1, 'publish.md must contain STEP 1.6 -- FM-03 scaffold gate');
    assert.ok(step2Pos !== -1, 'publish.md must contain ### STEP 2: (ROUTE) -- FM-03 ordering check requires it');
    assert.ok(
      step16Pos < step2Pos,
      'FM-03: STEP 1.6 must appear before STEP 2 in publish.md -- front-matter gate must run before preset routing'
    );
  });

  it('FM-03: export.md STEP 3b must reference the STEP 1.6 scaffold exclusion list (Pitfall 1)', () => {
    const content = readFile(EXPORT_PATH);
    assert.ok(content !== null, 'commands/scr/export.md could not be read');

    // Find the STEP 3b section
    const step3bIndex = content.indexOf('3b.');
    assert.ok(
      step3bIndex !== -1,
      'export.md must contain a 3b. assembly step -- FM-03 exclusion list application check'
    );

    // Get the text from 3b onwards (up to 3c or next step)
    const step3bSection = content.slice(step3bIndex, step3bIndex + 2000);
    const referencesExclusion =
      step3bSection.includes('scaffold exclusion') ||
      step3bSection.includes('exclusion list') ||
      step3bSection.includes('1.6');
    assert.ok(
      referencesExclusion,
      'FM-03: export.md STEP 3b must reference the STEP 1.6 scaffold exclusion list -- scaffold files must be skipped during assembly (Pitfall 1). STEP 3b must say "scaffold exclusion", "exclusion list", or reference "1.6"'
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// FM-04: export.md STEP 1.6 warns on stale generated matter without regenerating
// ─────────────────────────────────────────────────────────────────────────────

describe('Phase 31: FM-04 export.md STEP 1.6 keeps front-matter generation dedicated', () => {
  it('FM-04: STEP 1.6 must reference WORK.md for timestamp comparison', () => {
    const content = readFile(EXPORT_PATH);
    assert.ok(content !== null, 'commands/scr/export.md could not be read');

    // WORK.md must appear within the STEP 1.6 section (not just anywhere in the file)
    const step16Index = content.indexOf('STEP 1.6');
    assert.ok(step16Index !== -1, 'FM-04: export.md must contain STEP 1.6 (freshness gate)');

    // Get text from STEP 1.6 to the ### STEP 2: heading to scope the check
    const step2Index = content.indexOf('### STEP 2:', step16Index);
    const step16Section = step2Index !== -1
      ? content.slice(step16Index, step2Index)
      : content.slice(step16Index, step16Index + 3000);

    assert.ok(
      step16Section.includes('WORK.md'),
      'FM-04: STEP 1.6 section in export.md must reference "WORK.md" -- freshness check compares WORK.md modification timestamp against generated front-matter files'
    );
  });

  it('FM-04: freshness check targets must name all 4 generated files explicitly', () => {
    const content = readFile(EXPORT_PATH);
    assert.ok(content !== null, 'commands/scr/export.md could not be read');
    assert.ok(
      content.includes('01-half-title.md'),
      'FM-04: export.md must explicitly name "01-half-title.md" as a freshness target -- FM-04'
    );
    assert.ok(
      content.includes('03-title-page.md'),
      'FM-04: export.md must explicitly name "03-title-page.md" as a freshness target -- FM-04'
    );
    assert.ok(
      content.includes('04-copyright.md'),
      'FM-04: export.md must explicitly name "04-copyright.md" as a freshness target -- FM-04'
    );
    assert.ok(
      content.includes('07-toc.md'),
      'FM-04: export.md must explicitly name "07-toc.md" as a freshness target -- FM-04'
    );
  });

  it('FM-04: export must not regenerate front matter during export', () => {
    const content = readFile(EXPORT_PATH);
    assert.ok(content !== null, 'commands/scr/export.md could not be read');
    assert.ok(
      content.includes('Export will not generate or refresh front matter'),
      'FM-04: export.md must warn instead of regenerating front matter'
    );
    assert.ok(
      content.includes('It must not create, refresh, or rewrite front-matter or back-matter files'),
      'FM-04: export.md must keep front/back matter generation in dedicated commands'
    );
    assert.ok(
      !content.includes('Re-run the GENERATE step from `/scr:front-matter`'),
      'FM-04: export.md must not call the front-matter GENERATE step'
    );
  });

  it('FM-04: export and build commands keep matter generation in dedicated commands', () => {
    const files = [
      ['export.md', EXPORT_PATH],
      ['publish.md', PUBLISH_PATH],
      ['build-ebook.md', BUILD_EBOOK_PATH],
      ['build-print.md', BUILD_PRINT_PATH],
      ['build-smashwords.md', BUILD_SMASHWORDS_PATH],
    ];

    for (const [label, filePath] of files) {
      const content = readFile(filePath);
      assert.ok(content !== null, `${label} could not be read`);
      assert.ok(
        !content.includes('Re-run the GENERATE step from `/scr:front-matter`'),
        `${label} must not call the front-matter GENERATE step`
      );
      assert.ok(
        !content.includes('GENERATE auto-refresh'),
        `${label} must not describe front-matter auto-refresh`
      );
    }
  });

  it('FM-04: publish pipelines do not auto-chain front or back matter', () => {
    const files = [
      ['publish.md', PUBLISH_PATH],
      ['autopilot-publish.md', AUTOPILOT_PUBLISH_PATH],
    ];

    for (const [label, filePath] of files) {
      const content = readFile(filePath);
      assert.ok(content !== null, `${label} could not be read`);
      assert.ok(
        !content.includes('/scr:front-matter --level {front-level}'),
        `${label} must not chain front-matter from preset tables`
      );
      assert.ok(
        !content.includes('/scr:back-matter --level {back-level}'),
        `${label} must not chain back-matter from preset tables`
      );
      assert.ok(
        !content.includes('--front-level'),
        `${label} must not expose front-level routing flags`
      );
      assert.ok(
        !content.includes('--back-level'),
        `${label} must not expose back-level routing flags`
      );
    }
  });
});
