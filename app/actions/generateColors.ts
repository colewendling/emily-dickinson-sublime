'use server';

import fs from 'fs/promises';
import path from 'path';
import { positions } from '@/app/data/positions';

/**
 * Predefined vibrant color palette.
 */
const poemColorPalette = [
  '#FF5733', // bright orange/red
  '#FFC300', // bright yellow
  '#DAF7A6', // light green
  '#FF33FF', // magenta
  '#33FFF6', // aqua
  '#FF8C00', // dark orange
  '#FF0055', // hot pink
  '#00FF7F', // spring green
  '#00FFFF', // cyan
  '#FFFF00', // yellow
];

/**
 * Utility to map a value from [oldMin, oldMax] => [0, 1] range
 * to produce a normalized (clamped) value in 0..1
 */
function normalize(value: number, oldMin: number, oldMax: number): number {
  if (oldMin === oldMax) return 0.5; // Avoid divide-by-zero
  const clamped = Math.min(Math.max(value, oldMin), oldMax);
  return (clamped - oldMin) / (oldMax - oldMin);
}

/**
 * Helper function to slightly alter a hex color.
 * This function will add a small random variation to the RGB components.
 * The variation is deterministic based on the position to ensure consistency.
 */
function alterColor(hex: string, seed: number): string {
  // Convert hex to RGB
  const bigint = parseInt(hex.slice(1), 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  // Simple deterministic pseudo-random based on seed
  const random = (num: number) => {
    const x = Math.sin(seed + num) * 10000;
    return x - Math.floor(x);
  };

  // Apply small variation (-10 to +10)
  const variation = 10;
  r = Math.min(
    255,
    Math.max(0, r + Math.floor((random(1) - 0.5) * variation * 2))
  );
  g = Math.min(
    255,
    Math.max(0, g + Math.floor((random(2) - 0.5) * variation * 2))
  );
  b = Math.min(
    255,
    Math.max(0, b + Math.floor((random(3) - 0.5) * variation * 2))
  );

  // Convert back to hex
  const newHex =
    '#' +
    r.toString(16).padStart(2, '0') +
    g.toString(16).padStart(2, '0') +
    b.toString(16).padStart(2, '0');
  return newHex.toUpperCase();
}

/**
 * Assign colors to poems based on their positions and the predefined palette.
 */
function assignColorsToPoems(): Record<number, string> {
  const poemColors: Record<number, string> = {};

  const paletteLength = poemColorPalette.length;

  for (const [poemIdStr, pos] of Object.entries(positions)) {
    const poemId = parseInt(poemIdStr, 10);
    const { x, y, z } = pos;

    // Normalize x to select a base color from the palette
    const MIN_VAL = -0.05;
    const MAX_VAL = 0.05;
    const nx = normalize(x, MIN_VAL, MAX_VAL);

    const baseColorIndex = Math.floor(nx * paletteLength) % paletteLength;
    const baseColor = poemColorPalette[baseColorIndex];

    // Create a seed based on poemId to ensure deterministic variation
    const seed = poemId;

    // Alter the base color slightly
    const alteredColor = alterColor(baseColor, seed);

    poemColors[poemId] = alteredColor;
  }

  return poemColors;
}

/**
 * Write a new file colors.ts that exports a Record<number, string>
 * of the form { poemId: "#FF5733" }.
 */
async function writeColorsFile(poemColors: Record<number, string>) {
  const colorsFilePath = path.join(process.cwd(), 'app', 'data', 'colors.ts');
  const colorsJson = JSON.stringify(poemColors, null, 2);

  const newFileContent = `// THIS FILE IS AUTO-GENERATED. Edits may be overwritten.
// If you need to add custom logic or comments, consider using a database or a separate JSON file.

export const poemColors: Record<number, string> = ${colorsJson};
`;

  await fs.writeFile(colorsFilePath, newFileContent, 'utf-8');
  console.log(`✅ colors.ts has been generated/updated!`);
}

/**
 * The main server action that:
 * 1) Assigns colors to poems
 * 2) Writes a new file colors.ts with the assignments
 */
export async function generateColorsAndUpdateFile() {
  const poemColors = assignColorsToPoems();

  // Write or overwrite colors.ts
  await writeColorsFile(poemColors);
  return poemColors;
}
