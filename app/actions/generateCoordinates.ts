// app/_actions/generateCoordinates.ts

'use server';

import fs from 'fs/promises';
import path from 'path';
import { poems, Poem } from '@/app/data/poems';
import { positions, Position } from '@/app/data/positions';

// Access the environment variable
const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;
if (!HF_API_KEY) {
  throw new Error('HUGGING_FACE_API_KEY is not defined in .env.local');
}

const HF_URL =
  'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2';

/**
 * Flatten the stanzas into a single array of lines.
 */
function flattenStanzas(stanzas: Poem['stanzas']): string[] {
  const lines: string[] = [];

  stanzas.forEach((stanza) => {
    if (Array.isArray(stanza)) {
      lines.push(...stanza);
    } else {
      lines.push(stanza);
    }
  });

  return lines;
}

/**
 * Read existing positions from positions.ts.
 */
async function readPositions(): Promise<Record<number, Position>> {
  const positionsFilePath = path.join(
    process.cwd(),
    'app',
    'data',
    'positions.ts'
  );
  try {
    const fileContent = await fs.readFile(positionsFilePath, 'utf-8');
    // Extract the positions object
    const match = fileContent.match(
      /export const positions: Record<number, Position> = ([\s\S]*);/
    );
    if (match && match[1]) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const positionsData = eval(`(${match[1]})`);
      return positionsData;
    } else {
      return {};
    }
  } catch (error) {
    console.error('Error reading positions.ts:', error);
    return {};
  }
}

/**
 * Write updated positions to positions.ts.
 */
async function writePositions(updatedPositions: Record<number, Position>) {
  const positionsFilePath = path.join(
    process.cwd(),
    'app',
    'data',
    'positions.ts'
  );
  const positionsJson = JSON.stringify(updatedPositions, null, 2);

  const newFileContent = `// THIS FILE IS AUTO-GENERATED. Edits may be overwritten.
// If you need to add custom logic or comments, consider using a database or a separate JSON file.

export interface Position {
  x: number;
  y: number;
  z: number;
}

export const positions: Record<number, Position> = ${positionsJson};
`;

  await fs.writeFile(positionsFilePath, newFileContent, 'utf-8');
  console.log(`✅ positions.ts has been updated with new coordinates.`);
}

/**
 * Generate coordinates for poems and update positions.ts.
 */
export async function generateCoordinates() {
  const existingPositions = await readPositions();
  const updatedPositions = { ...existingPositions };
  let updated = false;

  let skippedCount = 0; // Counter for skipped poems
  let generatedCount = 0; // Counter for generated positions

  for (const poem of poems) {
    if (existingPositions[poem.id]) {
      // Skip if position already exists
      console.log(`Skipping poem ID ${poem.id}, position already exists.`);
      skippedCount++;
      continue;
    }

    // Flatten stanzas
    const lines = flattenStanzas(poem.stanzas);

    // Skip if no lines
    if (lines.length === 0) {
      console.log(`Skipping poem ID ${poem.id}, no lines.`);
      skippedCount++;
      continue;
    }

    try {
      // Fetch embeddings from Hugging Face
      const response = await fetch(HF_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: lines }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          `Failed to fetch embedding for poem ID ${poem.id}: ${errorData.error}`
        );
        skippedCount++;
        continue; // Skip this poem and proceed with others
      }

      const data = await response.json();

      // Validate response
      if (!Array.isArray(data) || !Array.isArray(data[0])) {
        console.error(`Unexpected response format for poem ID ${poem.id}.`);
        skippedCount++;
        continue; // Skip this poem
      }

      const embeddings = data as number[][];
      const embeddingLength = embeddings[0].length;

      // Ensure all embeddings have the same length
      if (!embeddings.every((e) => e.length === embeddingLength)) {
        console.error(`Inconsistent embedding lengths for poem ID ${poem.id}.`);
        skippedCount++;
        continue; // Skip this poem
      }

      // Calculate the average embedding
      const averagedEmbedding: number[] = [];
      for (let i = 0; i < embeddingLength; i++) {
        let sum = 0;
        for (const emb of embeddings) {
          sum += emb[i];
        }
        averagedEmbedding.push(sum / embeddings.length);
      }

      if (averagedEmbedding.length < 3) {
        console.error(`Averaged embedding too short for poem ID ${poem.id}.`);
        skippedCount++;
        continue; // Skip this poem
      }

      // Extract first three dimensions as x, y, z
      const [x, y, z] = averagedEmbedding.slice(0, 3);
      updatedPositions[poem.id] = { x, y, z };
      console.log(
        `✅ Poem ID ${poem.id} => (x=${x.toFixed(6)}, y=${y.toFixed(
          6
        )}, z=${z.toFixed(6)})`
      );
      updated = true;
      generatedCount++;
    } catch (error) {
      console.error(`Error processing poem ID ${poem.id}:`, error);
      skippedCount++;
      continue; // Skip this poem
    }
  }

  if (updated) {
    await writePositions(updatedPositions);
    console.log('All updates have been written to positions.ts.');
  } else {
    console.log('No updates were made to positions.ts.');
  }

  // Log counts
  console.log(
    `📝 Summary: ${skippedCount} poems skipped, ${generatedCount} positions generated.`
  );

  return updatedPositions;
}
