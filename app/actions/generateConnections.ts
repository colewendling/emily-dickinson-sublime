// app/_actions/generateConnectionsAndUpdateFile.ts

'use server';

import fs from 'fs/promises';
import path from 'path';
import { positions } from '@/app/data/positions';
import { poemThemes } from '@/app/data/themes';
import { poemMotifs } from '@/app/data/motifs';

/**
 * Interface for Position
 */
export interface Position {
  x: number;
  y: number;
  z: number;
}

/**
 * Basic 3D distance calculation
 */
function distance3D(a: Position, b: Position): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Write the adjacency list to connections.ts
 */
async function writeConnectionsFile(connections: Record<number, number[]>) {
  const filePath = path.join(process.cwd(), 'app', 'data', 'connections.ts');
  const connectionsJson = JSON.stringify(connections, null, 2);

  const newFileContent = `// THIS FILE IS AUTO-GENERATED. Edits may be overwritten.
// If you need to add custom logic or comments, consider using a database or a separate JSON file.

export const poemConnections: Record<number, number[]> = ${connectionsJson};
`;

  await fs.writeFile(filePath, newFileContent, 'utf-8');
  console.log(`✅ connections.ts has been generated/updated!`);
}

/**
 * Compute intersection size of two arrays (e.g., shared themes or motifs).
 */
function countIntersection(arr1: string[], arr2: string[]): number {
  const setA = new Set(arr1);
  let count = 0;
  for (const item of arr2) {
    if (setA.has(item)) {
      count++;
    }
  }
  return count;
}

/**
 * Compute a similarity score based on shared themes and motifs.
 * Shared Themes: weight=3
 * Shared Motifs: weight=2
 */
function computeSimilarityScore(idA: number, idB: number): number {
  // Get shared themes
  const themesA = poemThemes[idA] || [];
  const themesB = poemThemes[idB] || [];
  const sharedThemesCount = countIntersection(themesA, themesB);

  // Get shared motifs
  const motifsA = poemMotifs[idA] || [];
  const motifsB = poemMotifs[idB] || [];
  const sharedMotifsCount = countIntersection(motifsA, motifsB);

  // Weighted sum
  const themeWeight = 3;
  const motifWeight = 2;

  return themeWeight * sharedThemesCount + motifWeight * sharedMotifsCount;
}

/**
 * Server action to generate connections based on shared themes/motifs and closest neighbors.
 * Ensures each poem has between kMin and kMax connections.
 */
export async function generateConnectionsAndUpdateFile(
  kMin: number = 2,
  kMax: number = 15
): Promise<Record<number, number[]>> {
  const poemIds = Object.keys(poemThemes).map((idStr) => parseInt(idStr, 10));
  const poemConnections: Record<number, Set<number>> = {};

  // Initialize connections as sets to avoid duplicates
  for (const pid of poemIds) {
    poemConnections[pid] = new Set<number>();
  }

  // Step 1: Connect based on shared themes/motifs
  for (const idA of poemIds) {
    for (const idB of poemIds) {
      if (idB === idA) continue;

      const score = computeSimilarityScore(idA, idB);
      if (score > 0) {
        poemConnections[idA].add(idB);
      }
    }
  }

  // Step 2: Connect to two closest neighbors
  for (const idA of poemIds) {
    // Calculate distances to other poems
    const distances: Array<{ id: number; dist: number }> = [];

    for (const idB of poemIds) {
      if (idB === idA) continue;
      const dist = distance3D(positions[idA], positions[idB]);
      distances.push({ id: idB, dist });
    }

    // Sort by ascending distance
    distances.sort((a, b) => a.dist - b.dist);

    // Take the two closest neighbors
    const closestNeighbors = distances.slice(0, 2).map((item) => item.id);

    // Add to connections
    for (const neighborId of closestNeighbors) {
      poemConnections[idA].add(neighborId);
    }
  }

  // Step 3: Convert sets to arrays and enforce kMax
  for (const id of poemIds) {
    if (poemConnections[id].size > kMax) {
      // Convert to array, sort by similarity score descending
      const sortedConnections = Array.from(poemConnections[id]).sort((a, b) => {
        return computeSimilarityScore(id, b) - computeSimilarityScore(id, a);
      });
      // Trim to kMax
      poemConnections[id] = new Set(sortedConnections.slice(0, kMax));
    }
  }

  // Step 4: Ensure bidirectional connections
  for (const idA of poemIds) {
    for (const idB of poemConnections[idA]) {
      if (!poemConnections[idB].has(idA)) {
        // Only add if not exceeding kMax
        if (poemConnections[idB].size < kMax) {
          poemConnections[idB].add(idA);
        }
      }
    }
  }

  // Step 5: Ensure each poem has at least kMin connections
  for (const idA of poemIds) {
    while (poemConnections[idA].size < kMin) {
      // Find the next best connection based on similarity
      const sortedSimilarities = poemIds
        .filter((idB) => idB !== idA && !poemConnections[idA].has(idB))
        .sort(
          (a, b) =>
            computeSimilarityScore(idA, b) - computeSimilarityScore(idA, a)
        );

      if (sortedSimilarities.length === 0) break; // No more poems to connect

      const nextBest = sortedSimilarities[0];
      poemConnections[idA].add(nextBest);

      // Also add the reverse connection if possible
      if (poemConnections[nextBest].size < kMax) {
        poemConnections[nextBest].add(idA);
      }
    }
  }

  // Step 6: Convert sets to arrays for the final output
  const finalConnections: Record<number, number[]> = {};
  for (const id of poemIds) {
    finalConnections[id] = Array.from(poemConnections[id]);
  }

  // Write to connections.ts
  await writeConnectionsFile(finalConnections);
  return finalConnections;
}
