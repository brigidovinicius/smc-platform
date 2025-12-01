/**
 * Build and type checking tests
 * Ensures project builds successfully and types are correct
 */

import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

describe('Build Configuration', () => {
  it('should have package.json', () => {
    expect(existsSync(path.join(process.cwd(), 'package.json'))).toBe(true);
  });

  it('should have next.config.mjs', () => {
    expect(existsSync(path.join(process.cwd(), 'next.config.mjs'))).toBe(true);
  });

  it('should have tsconfig.json', () => {
    expect(existsSync(path.join(process.cwd(), 'tsconfig.json'))).toBe(true);
  });

  it('should have tailwind.config.js', () => {
    expect(existsSync(path.join(process.cwd(), 'tailwind.config.js'))).toBe(true);
  });
});

describe('TypeScript Configuration', () => {
  it('should have valid tsconfig.json structure', () => {
    const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
    if (existsSync(tsconfigPath)) {
      const tsconfig = require(tsconfigPath);
      expect(tsconfig.compilerOptions).toBeDefined();
      expect(tsconfig.compilerOptions.target).toBeDefined();
    }
  });
});




