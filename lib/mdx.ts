import fs from 'fs';

export const getMDXSource = (filePath: string) => fs.readFileSync(filePath, 'utf-8');
