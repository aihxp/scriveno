#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const ROOT = path.join(__dirname, '..');
const BINARY_EXTENSIONS = new Set([
  '.docx',
  '.gif',
  '.ico',
  '.jpeg',
  '.jpg',
  '.pdf',
  '.png',
  '.tgz',
  '.zip',
]);

function trackedFiles() {
  const output = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' }).trim();
  return output ? output.split(/\n/) : [];
}

function isBinaryPath(relativePath) {
  return BINARY_EXTENSIONS.has(path.extname(relativePath).toLowerCase());
}

function lineNumberFor(source, index) {
  return source.slice(0, index).split('\n').length;
}

function shouldFlag(codePoint, char) {
  return codePoint === 0x2013
    || codePoint === 0x2014
    || /\p{Extended_Pictographic}/u.test(char);
}

function scan() {
  const findings = [];

  for (const relativePath of trackedFiles()) {
    if (isBinaryPath(relativePath)) {
      continue;
    }

    const absolutePath = path.join(ROOT, relativePath);
    const buffer = fs.readFileSync(absolutePath);
    if (buffer.includes(0)) {
      continue;
    }

    const source = buffer.toString('utf8');
    for (let index = 0; index < source.length; index += 1) {
      const codePoint = source.codePointAt(index);
      const char = String.fromCodePoint(codePoint);
      if (shouldFlag(codePoint, char)) {
        findings.push({
          codePoint,
          line: lineNumberFor(source, index),
          relativePath,
        });
      }

      if (codePoint > 0xffff) {
        index += 1;
      }
    }
  }

  return findings;
}

const findings = scan();

for (const finding of findings) {
  const hex = finding.codePoint.toString(16).toUpperCase().padStart(4, '0');
  console.error(`${finding.relativePath}:${finding.line}: forbidden U+${hex}`);
}

if (findings.length > 0) {
  console.error(`Writing policy scan failed: ${findings.length} forbidden marker(s).`);
  process.exit(1);
}

console.log('Writing policy scan passed.');
