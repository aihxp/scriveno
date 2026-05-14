const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const packageJson = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')
);

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

describe('configuration trust surface', () => {
  it('configuration guide tracks the current new-work config version', () => {
    const configDoc = read('docs/configuration.md');

    assert.match(
      configDoc,
      new RegExp(`"scriveno_version": "${packageJson.version.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}"`),
      'docs/configuration.md should show the current package/new-work scriveno_version'
    );
    assert.doesNotMatch(
      configDoc,
      /"scriveno_version": "1\.5\.1"/,
      'docs/configuration.md should not keep the stale 1.5.1 project config example'
    );
  });

  it('configuration guide avoids hard-coded command-registration counts', () => {
    const configDoc = read('docs/configuration.md');

    assert.match(
      configDoc,
      /all shipped command registrations/i,
      'docs/configuration.md should describe the command registry without a brittle hard-coded count'
    );
    assert.doesNotMatch(
      configDoc,
      /all \d+ command registrations/i,
      'docs/configuration.md should not hard-code a command count that can drift from the live surface'
    );
  });
});
