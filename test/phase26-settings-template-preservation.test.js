const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');

const {
  sha256File,
  copyDirWithPreservation,
  mergeSettings,
  INSTALLER_OWNED_FIELDS,
} = require('../bin/install.js');

function mkTmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'scriveno-p26-'));
}

function cleanup(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function walkFiles(dir) {
  const found = [];
  if (!fs.existsSync(dir)) return found;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...walkFiles(full));
    } else {
      found.push(full);
    }
  }
  return found;
}

test('sha256File returns null for missing file', () => {
  const tmp = mkTmp();
  try {
    const missing = path.join(tmp, 'does-not-exist.txt');
    assert.equal(sha256File(missing), null);
  } finally {
    cleanup(tmp);
  }
});

test('sha256File returns stable hex digest for existing file', () => {
  const tmp = mkTmp();
  try {
    const a = path.join(tmp, 'a.txt');
    const b = path.join(tmp, 'b.txt');
    fs.writeFileSync(a, 'identical content');
    fs.writeFileSync(b, 'identical content');
    const ha = sha256File(a);
    const hb = sha256File(b);
    assert.equal(ha, hb);
    assert.equal(typeof ha, 'string');
    assert.equal(ha.length, 64);
    assert.match(ha, /^[0-9a-f]{64}$/);
  } finally {
    cleanup(tmp);
  }
});

test('copyDirWithPreservation: fresh install copies everything', () => {
  const tmp = mkTmp();
  try {
    const src = path.join(tmp, 'src');
    const dest = path.join(tmp, 'dest');
    fs.mkdirSync(src, { recursive: true });
    fs.mkdirSync(path.join(src, 'sub'), { recursive: true });
    fs.writeFileSync(path.join(src, 'a.txt'), 'A');
    fs.writeFileSync(path.join(src, 'b.txt'), 'B');
    fs.writeFileSync(path.join(src, 'sub', 'c.txt'), 'C');

    const result = copyDirWithPreservation(src, dest);
    assert.deepEqual(result, { fresh: 3, replaced: 0, backedUp: 0 });
    assert.equal(fs.readFileSync(path.join(dest, 'a.txt'), 'utf8'), 'A');
    assert.equal(fs.readFileSync(path.join(dest, 'b.txt'), 'utf8'), 'B');
    assert.equal(fs.readFileSync(path.join(dest, 'sub', 'c.txt'), 'utf8'), 'C');
  } finally {
    cleanup(tmp);
  }
});

test('copyDirWithPreservation: unmodified files replaced silently', () => {
  const tmp = mkTmp();
  try {
    const src = path.join(tmp, 'src');
    const dest = path.join(tmp, 'dest');
    fs.mkdirSync(src, { recursive: true });
    fs.mkdirSync(path.join(src, 'sub'), { recursive: true });
    fs.writeFileSync(path.join(src, 'a.txt'), 'A');
    fs.writeFileSync(path.join(src, 'b.txt'), 'B');
    fs.writeFileSync(path.join(src, 'sub', 'c.txt'), 'C');

    copyDirWithPreservation(src, dest);
    const second = copyDirWithPreservation(src, dest);
    assert.deepEqual(second, { fresh: 0, replaced: 3, backedUp: 0 });
    const backups = walkFiles(dest).filter((f) => /\.backup\./.test(f));
    assert.deepEqual(backups, []);
  } finally {
    cleanup(tmp);
  }
});

test('copyDirWithPreservation: modified file is backed up with timestamp', () => {
  const tmp = mkTmp();
  try {
    const src = path.join(tmp, 'src');
    const dest = path.join(tmp, 'dest');
    fs.mkdirSync(src, { recursive: true });
    fs.writeFileSync(path.join(src, 'a.txt'), 'SHIPPED-A');
    fs.writeFileSync(path.join(src, 'b.txt'), 'SHIPPED-B');

    copyDirWithPreservation(src, dest);
    // User edits one file
    fs.writeFileSync(path.join(dest, 'a.txt'), 'USER EDIT');

    const result = copyDirWithPreservation(src, dest, { timestamp: '2026-04-16T12-34-56-789Z' });
    assert.equal(result.backedUp, 1);
    assert.equal(result.replaced, 1); // b.txt was unchanged

    const backupPath = path.join(dest, 'a.txt.backup.2026-04-16T12-34-56-789Z');
    assert.ok(fs.existsSync(backupPath), 'backup file should exist');
    assert.equal(fs.readFileSync(backupPath, 'utf8'), 'USER EDIT');
    assert.equal(fs.readFileSync(path.join(dest, 'a.txt'), 'utf8'), 'SHIPPED-A');
  } finally {
    cleanup(tmp);
  }
});

test('mergeSettings: developer_mode preserved, version updated', () => {
  const existing = { version: '1.0.0', developer_mode: true, runtime: 'old' };
  const incoming = { version: '2.0.0', developer_mode: false, runtime: 'new', installed_at: 'now' };
  const merged = mergeSettings(existing, incoming);
  assert.equal(merged.developer_mode, true);
  assert.equal(merged.version, '2.0.0');
  assert.equal(merged.runtime, 'new');
  assert.equal(merged.installed_at, 'now');
});

test('mergeSettings: unknown user fields preserved', () => {
  const existing = { my_custom_key: 'keep', another: 42 };
  const incoming = { version: '2.0.0' };
  const merged = mergeSettings(existing, incoming);
  assert.equal(merged.my_custom_key, 'keep');
  assert.equal(merged.another, 42);
  assert.equal(merged.version, '2.0.0');
});

test('mergeSettings: null or undefined existing returns incoming', () => {
  assert.deepEqual(mergeSettings(null, { a: 1 }), { a: 1 });
  assert.deepEqual(mergeSettings(undefined, { a: 1 }), { a: 1 });
});

test('mergeSettings: does not mutate inputs', () => {
  const existing = Object.freeze({ developer_mode: true, my_custom: 'x' });
  const incoming = Object.freeze({ version: '2.0.0', developer_mode: false });
  assert.doesNotThrow(() => mergeSettings(existing, incoming));
  const merged = mergeSettings(existing, incoming);
  assert.equal(merged.developer_mode, true);
  assert.equal(merged.version, '2.0.0');
  assert.equal(merged.my_custom, 'x');
});

test('mergeSettings: every INSTALLER_OWNED_FIELDS value comes from incoming', () => {
  for (const field of INSTALLER_OWNED_FIELDS) {
    const existing = { [field]: 'EXISTING' };
    const incoming = { [field]: 'INCOMING' };
    const merged = mergeSettings(existing, incoming);
    assert.equal(merged[field], 'INCOMING', `field ${field} should come from incoming`);
  }
});
