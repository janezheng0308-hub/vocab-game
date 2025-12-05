import { BalloonData, BalloonStatus, WordPair } from "../types";

export const BALLOON_COLORS = [
  { bg: 'bg-red-400', shadow: 'shadow-red-600', text: 'text-white' },
  { bg: 'bg-orange-400', shadow: 'shadow-orange-600', text: 'text-white' },
  { bg: 'bg-amber-400', shadow: 'shadow-amber-600', text: 'text-amber-900' },
  { bg: 'bg-green-400', shadow: 'shadow-green-600', text: 'text-white' },
  { bg: 'bg-emerald-400', shadow: 'shadow-emerald-600', text: 'text-white' },
  { bg: 'bg-teal-400', shadow: 'shadow-teal-600', text: 'text-white' },
  { bg: 'bg-cyan-400', shadow: 'shadow-cyan-600', text: 'text-cyan-900' },
  { bg: 'bg-sky-400', shadow: 'shadow-sky-600', text: 'text-white' },
  { bg: 'bg-blue-400', shadow: 'shadow-blue-600', text: 'text-white' },
  { bg: 'bg-indigo-400', shadow: 'shadow-indigo-600', text: 'text-white' },
  { bg: 'bg-violet-400', shadow: 'shadow-violet-600', text: 'text-white' },
  { bg: 'bg-purple-400', shadow: 'shadow-purple-600', text: 'text-white' },
  { bg: 'bg-fuchsia-400', shadow: 'shadow-fuchsia-600', text: 'text-white' },
  { bg: 'bg-pink-400', shadow: 'shadow-pink-600', text: 'text-white' },
  { bg: 'bg-rose-400', shadow: 'shadow-rose-600', text: 'text-white' },
];

export const getRandomColor = () => {
  return BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
};

// Generate random positions where English and Chinese are mixed together
export const generateLayout = (pairs: WordPair[]): BalloonData[] => {
  const englishItems = pairs.map((p, i) => ({ text: p.english, pairId: `pair-${i}`, type: 'english' as const }));
  const chineseItems = pairs.map((p, i) => ({ text: p.chinese, pairId: `pair-${i}`, type: 'chinese' as const }));

  // Combine and shuffle all items to mix types
  const allItems = [...englishItems, ...chineseItems];
  for (let i = allItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
  }

  // Generate vertical slots to ensure they don't all clump in one Y-area,
  // but random X ensures they are scattered.
  const itemCount = allItems.length;
  const verticalSlots = Array.from({ length: itemCount }, (_, i) => i);
  // Shuffle slots
  for (let i = verticalSlots.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [verticalSlots[i], verticalSlots[j]] = [verticalSlots[j], verticalSlots[i]];
  }

  return allItems.map((item, index) => {
      const slotIndex = verticalSlots[index];
      const sectorHeight = 85 / itemCount; // Use 85% of height
      
      // Random Y within the slot
      const yBase = 10 + (slotIndex * sectorHeight); 
      const yJitter = Math.random() * (sectorHeight * 0.6); 
      const y = yBase + yJitter;

      // Random X across the screen (5% to 80%)
      const x = 5 + Math.random() * 75;

      const balloonData: BalloonData = {
        id: `${item.type}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        text: item.text,
        type: item.type,
        matchId: item.pairId,
        status: BalloonStatus.NORMAL,
        x,
        y,
        color: JSON.stringify(getRandomColor()),
        floatDelay: Math.random() * 5,
        floatDuration: 4 + Math.random() * 4,
      };
      return balloonData;
  });
};

// Reshuffles positions of existing balloons randomly
export const repositionBalloons = (balloons: BalloonData[]): BalloonData[] => {
  const itemCount = balloons.length;
  const verticalSlots = Array.from({ length: itemCount }, (_, i) => i);
  
  // Shuffle vertical slots
  for (let i = verticalSlots.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [verticalSlots[i], verticalSlots[j]] = [verticalSlots[j], verticalSlots[i]];
  }

  return balloons.map((b, index) => {
    const slotIndex = verticalSlots[index];
    const sectorHeight = 85 / itemCount;
    
    const yBase = 10 + (slotIndex * sectorHeight);
    const yJitter = Math.random() * (sectorHeight * 0.6);
    const y = yBase + yJitter;

    // Random X across the screen
    const x = 5 + Math.random() * 75;

    return { ...b, x, y };
  });
};