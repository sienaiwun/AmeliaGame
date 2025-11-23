
export const BOARD_SIZE = 100;

export const PLAYERS_CONFIG = [
  { id: 'mum', name: 'Mum', color: '#9b59b6', isAI: false }, // Purple - Human
  { id: 'dad', name: 'Dad', color: '#f1c40f', isAI: false }, // Yellow - Human
  { id: 'max', name: 'Max', color: '#3498db', isAI: true },  // Blue - AI Player
  { id: 'amelia', name: 'Amelia', color: '#e91e63', isAI: false }, // Pink - Human
];

export const ITEM_TYPES = {
  BOMB: 'bomb',
  YAKULT: 'yakult',
  TREASURE: 'treasure',
};

export function generateItems() {
  const items = {};
  const occupied = new Set([0, 100]); // Start and End shouldn't have items

  const getRandomPos = () => {
    let pos;
    do {
      pos = Math.floor(Math.random() * (BOARD_SIZE - 2)) + 2; // 2 to 99
    } while (occupied.has(pos));
    occupied.add(pos);
    return pos;
  };

  // 1-5 Bombs
  const bombCount = Math.floor(Math.random() * 5) + 1;
  for (let i = 0; i < bombCount; i++) {
    items[getRandomPos()] = { type: ITEM_TYPES.BOMB, visible: true };
  }

  // 1-3 Yakults
  const yakultCount = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < yakultCount; i++) {
    items[getRandomPos()] = { type: ITEM_TYPES.YAKULT, visible: true };
  }

  // 1-4 Treasure Boxes
  const treasureCount = Math.floor(Math.random() * 4) + 1;
  for (let i = 0; i < treasureCount; i++) {
    items[getRandomPos()] = { type: ITEM_TYPES.TREASURE, visible: false }; // Hidden
  }

  return items;
}

export function rollDice() {
  return Math.floor(Math.random() * 7) + 1; // 1-7
}
