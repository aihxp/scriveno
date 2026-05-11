const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');

const {
  SETTINGS_SCHEMA,
  validateSettings,
  migrateSettings,
  readSettings,
} = require('../bin/install.js');

function validSettings(overrides = {}) {
  return {
    version: '1.5.1',
    runtime: 'claude-code',
    runtimes: ['claude-code'],
    scope: 'global',
    developer_mode: false,
    data_dir: '/tmp/.scriven',
    install_mode: 'interactive',
    installed_at: '2026-04-16T00:00:00.000Z',
    ...overrides,
  };
}

function mkTmp(label) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `scriven-schema-${label}-`));
}

describe('SETTINGS_SCHEMA', () => {
  it('is exported and contains all canonical fields', () => {
    assert.ok(Array.isArray(SETTINGS_SCHEMA) || typeof SETTINGS_SCHEMA === 'object');
    const names = Array.isArray(SETTINGS_SCHEMA)
      ? SETTINGS_SCHEMA.map((f) => f.name)
      : Object.keys(SETTINGS_SCHEMA);
    for (const expected of ['version', 'runtime', 'runtimes', 'scope', 'developer_mode', 'data_dir', 'install_mode', 'installed_at']) {
      assert.ok(names.includes(expected), `expected ${expected} in SETTINGS_SCHEMA`);
    }
  });
});

describe('validateSettings', () => {
  it('Test 1: valid settings pass validation without errors', () => {
    const result = validateSettings(validSettings());
    assert.equal(result.valid, true);
    assert.deepEqual(result.errors, []);
  });

  it('Test 2: missing required field (version) fails with field-named error', () => {
    const settings = validSettings();
    delete settings.version;
    const result = validateSettings(settings);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((e) => /version.*required/i.test(e)), `errors: ${JSON.stringify(result.errors)}`);
  });

  it('Test 3: wrong-typed field names expected and received types', () => {
    const result = validateSettings(validSettings({ developer_mode: 'yes' }));
    assert.equal(result.valid, false);
    assert.ok(
      result.errors.some((e) => /developer_mode.*expected boolean.*received string/i.test(e)),
      `errors: ${JSON.stringify(result.errors)}`
    );
  });

  it('Test 4: unknown field produces warning but remains valid', () => {
    const result = validateSettings(validSettings({ my_custom_key: true }));
    assert.equal(result.valid, true);
    assert.ok(
      result.errors.some((e) => /my_custom_key.*warning/i.test(e)),
      `errors: ${JSON.stringify(result.errors)}`
    );
  });

  it('Test 5: enum violation names allowed values and received value', () => {
    const result = validateSettings(validSettings({ scope: 'team' }));
    assert.equal(result.valid, false);
    assert.ok(
      result.errors.some((e) => /scope.*one of.*received.*team/i.test(e)),
      `errors: ${JSON.stringify(result.errors)}`
    );
  });

  it('rejects non-object settings input', () => {
    const result = validateSettings('not-an-object');
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((e) => /settings.*expected object.*received string/i.test(e)));
  });

  it('rejects null settings input', () => {
    const result = validateSettings(null);
    assert.equal(result.valid, false);
    assert.ok(result.errors.length > 0);
  });

  it('allows empty string for runtime (allow_empty=true)', () => {
    const result = validateSettings(validSettings({ runtime: '' }));
    assert.equal(result.valid, true);
  });

  it('flags empty string for a non-allow_empty string field', () => {
    const result = validateSettings(validSettings({ version: '' }));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((e) => /version/i.test(e)));
  });

  it('flags array-of-string when element is wrong type', () => {
    const result = validateSettings(validSettings({ runtimes: ['ok', 42] }));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((e) => /runtimes/i.test(e)));
  });

  it('flags install_mode enum violation', () => {
    const result = validateSettings(validSettings({ install_mode: 'automatic' }));
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((e) => /install_mode.*one of.*automatic/i.test(e)));
  });
});

describe('migrateSettings', () => {
  it('Test 6: migrates runtime -> runtimes when runtimes missing', () => {
    const raw = {
      version: '1.0.0',
      runtime: 'claude-code',
      developer_mode: false,
      data_dir: '/tmp/.scriven',
      installed_at: '2026-01-01T00:00:00Z',
    };
    const migrated = migrateSettings(raw);
    assert.deepEqual(migrated.runtimes, ['claude-code']);
  });

  it('defaults runtimes to [] when runtime is missing/empty', () => {
    const raw = { version: '1.0.0' };
    const migrated = migrateSettings(raw);
    assert.deepEqual(migrated.runtimes, []);
  });

  it('defaults runtimes to [] when runtime is an empty string', () => {
    const raw = { version: '1.0.0', runtime: '' };
    const migrated = migrateSettings(raw);
    assert.deepEqual(migrated.runtimes, []);
  });

  it('Test 7: fills in default scope and install_mode when missing', () => {
    const raw = { version: '1.0.0', runtime: 'claude-code' };
    const migrated = migrateSettings(raw);
    assert.equal(migrated.scope, 'global');
    assert.equal(migrated.install_mode, 'interactive');
  });

  it('does not mutate the caller input', () => {
    const raw = { version: '1.0.0', runtime: 'claude-code' };
    const snapshot = JSON.parse(JSON.stringify(raw));
    migrateSettings(raw);
    assert.deepEqual(raw, snapshot);
  });

  it('returns null when input is null', () => {
    assert.equal(migrateSettings(null), null);
  });

  it('returns null when input is undefined', () => {
    assert.equal(migrateSettings(undefined), null);
  });

  it('does not invent version, data_dir, or installed_at', () => {
    const raw = { runtime: 'claude-code' };
    const migrated = migrateSettings(raw);
    assert.equal(migrated.version, undefined);
    assert.equal(migrated.data_dir, undefined);
    assert.equal(migrated.installed_at, undefined);
  });

  it('preserves existing runtimes if already present', () => {
    const raw = { runtime: 'claude-code', runtimes: ['codex'] };
    const migrated = migrateSettings(raw);
    assert.deepEqual(migrated.runtimes, ['codex']);
  });

  it('Test 8: old-format settings migrate + validate cleanly', () => {
    const raw = {
      version: '1.0.0',
      runtime: 'claude-code',
      developer_mode: false,
      data_dir: '/tmp/.scriven',
      installed_at: '2026-01-01T00:00:00Z',
    };
    const migrated = migrateSettings(raw);
    const result = validateSettings(migrated);
    assert.equal(result.valid, true, `errors: ${JSON.stringify(result.errors)}`);
  });
});

describe('readSettings', () => {
  it('Test 9: happy path returns parsed+migrated object', () => {
    const tmpDir = mkTmp('happy');
    try {
      const settings = validSettings({ data_dir: tmpDir });
      fs.writeFileSync(path.join(tmpDir, 'settings.json'), JSON.stringify(settings, null, 2));
      const result = readSettings(tmpDir);
      assert.equal(result.version, settings.version);
      assert.equal(result.runtime, settings.runtime);
      assert.deepEqual(result.runtimes, settings.runtimes);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('Test 10: invalid settings throw with failing field name in message', () => {
    const tmpDir = mkTmp('invalid');
    try {
      const settings = validSettings({ data_dir: tmpDir, developer_mode: 'yes' });
      fs.writeFileSync(path.join(tmpDir, 'settings.json'), JSON.stringify(settings, null, 2));
      assert.throws(
        () => readSettings(tmpDir),
        (err) => /developer_mode/i.test(err.message),
      );
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('Test 11: missing file throws with "not found" in message', () => {
    const tmpDir = mkTmp('missing');
    try {
      assert.throws(
        () => readSettings(tmpDir),
        (err) => /not found/i.test(err.message),
      );
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('Test 12: migration precedes validation -- old-format file succeeds', () => {
    const tmpDir = mkTmp('oldfmt');
    try {
      // Old-format settings: no runtimes array, no scope, no install_mode
      const oldFormat = {
        version: '1.0.0',
        runtime: 'claude-code',
        developer_mode: false,
        data_dir: tmpDir,
        installed_at: '2026-01-01T00:00:00Z',
      };
      fs.writeFileSync(path.join(tmpDir, 'settings.json'), JSON.stringify(oldFormat, null, 2));
      const result = readSettings(tmpDir);
      assert.deepEqual(result.runtimes, ['claude-code']);
      assert.equal(result.scope, 'global');
      assert.equal(result.install_mode, 'interactive');
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('thrown error message does not include "(warning)" lines', () => {
    const tmpDir = mkTmp('nowarn');
    try {
      // Invalid type plus an unknown field. Error message should cite only the real failure.
      const settings = validSettings({ data_dir: tmpDir, developer_mode: 'yes', my_unknown_key: 1 });
      fs.writeFileSync(path.join(tmpDir, 'settings.json'), JSON.stringify(settings, null, 2));
      try {
        readSettings(tmpDir);
        assert.fail('expected throw');
      } catch (err) {
        assert.ok(!/warning/i.test(err.message), `message leaked warning: ${err.message}`);
        assert.ok(/developer_mode/i.test(err.message));
      }
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
