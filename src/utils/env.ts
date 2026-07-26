import * as fs from 'fs';
import * as path from 'path';

export function loadEnvFile(filePath: string = path.resolve(__dirname, '../../env/local.QA.env')): void {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  for (const line of fileContents.split(/\r?\n/)) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

export function getEnvValue(keys: string | string[], fallback: string = ''): string {
  const candidateKeys = Array.isArray(keys) ? keys : [keys];

  for (const key of candidateKeys) {
    const value = process.env[key];
    if (typeof value === 'string' && value.trim() !== '') {
      return value;
    }
  }

  return fallback;
}
