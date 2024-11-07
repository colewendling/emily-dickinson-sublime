// app/data/motifs.ts
// An interface for clarity
export interface PoemMotifs {
  [poemId: number]: string[];
}

export const poemMotifs: PoemMotifs = {
  1: ['Bee', 'Garden', 'Storm'],
  2: ['Garden', 'Bee'],
  3: ['Bee', 'Stars', 'Moonlight'],
  4: ['Storm', 'Path'],
  5: ['Birdsong', 'Butterfly'],
  6: ['Leaves', 'Path'],
  7: ['Birdsong', 'Snow', 'Stars'],
  8: ['Sword', 'Shadow'],
  9: ['Road', 'Wolf'],
  10: ['Wheel'],
  11: ['Treasure', 'Snake'],
  12: ['Leaves'],
  13: ['Veil'],
  14: ['Bee', 'Butterfly'],
  15: ['Color', 'Door'],
  16: ['Cup'],
  17: ['Garden'],
  18: ['Flowers', 'Butterfly'],
  19: ['Bee', 'Breeze', 'Flowers'],
  20: ['Butterfly', 'Bee'],
  21: ['Dice'],
  22: ['Flowers'],
  23: ['Robin', 'Stars'],
  24: ['Dance', 'Stars'],
  25: ['Tree'],
};
