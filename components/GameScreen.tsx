import React, { useState, useEffect, useCallback } from 'react';
import { BalloonData, BalloonStatus, WordPair } from '../types';
import { generateLayout, repositionBalloons } from '../utils/gameUtils';
import Balloon from './Balloon';

interface GameScreenProps {
  words: WordPair[];
  onVictory: () => void;
  onBack: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ words, onVictory, onBack }) => {
  const [balloons, setBalloons] = useState<BalloonData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize layout
  useEffect(() => {
    const initialBalloons = generateLayout(words);
    setBalloons(initialBalloons);
  }, [words]);

  // Check victory condition
  useEffect(() => {
    if (balloons.length > 0 && balloons.every(b => b.status === BalloonStatus.POPPED)) {
      const timer = setTimeout(() => {
        onVictory();
      }, 1000); // Small delay to let final pop finish
      return () => clearTimeout(timer);
    }
  }, [balloons, onVictory]);

  const handleShuffle = () => {
    setBalloons(prev => repositionBalloons(prev));
  };

  const handleBalloonClick = useCallback((id: string) => {
    if (isProcessing) return;

    setBalloons(prev => {
      const clickedBalloon = prev.find(b => b.id === id);
      if (!clickedBalloon) return prev;

      // 1. If nothing selected, select this one
      if (!selectedId) {
        setSelectedId(id);
        return prev.map(b => b.id === id ? { ...b, status: BalloonStatus.SELECTED } : b);
      }

      // 2. If clicking the already selected one, deselect
      if (selectedId === id) {
        setSelectedId(null);
        return prev.map(b => b.id === id ? { ...b, status: BalloonStatus.NORMAL } : b);
      }

      const previouslySelected = prev.find(b => b.id === selectedId);
      if (!previouslySelected) return prev; // Should not happen

      // 3. If same type (e.g. English + English), switch selection
      if (previouslySelected.type === clickedBalloon.type) {
        setSelectedId(id);
        return prev.map(b => {
          if (b.id === selectedId) return { ...b, status: BalloonStatus.NORMAL };
          if (b.id === id) return { ...b, status: BalloonStatus.SELECTED };
          return b;
        });
      }

      // 4. Different types - Check match
      const isMatch = previouslySelected.matchId === clickedBalloon.matchId;

      if (isMatch) {
        // MATCH!
        setIsProcessing(true); // Block input briefly
        setSelectedId(null);
        
        // Play pop sound (optional, visually handled by animation for now)
        
        // Mark both as MATCHED (triggers animation), then POPPED after delay
        const nextState = prev.map(b => {
            if (b.id === selectedId || b.id === id) {
                return { ...b, status: BalloonStatus.MATCHED };
            }
            return b;
        });
        
        setTimeout(() => {
             setBalloons(current => current.map(b => {
                 if (b.id === selectedId || b.id === id) {
                     return { ...b, status: BalloonStatus.POPPED };
                 }
                 return b;
             }));
             setIsProcessing(false);
        }, 400); // Wait for pop animation

        return nextState;
      } else {
        // MISMATCH!
        setIsProcessing(true);
        // Shake both
        const nextState = prev.map(b => {
            if (b.id === selectedId || b.id === id) {
                return { ...b, status: BalloonStatus.MISMATCH };
            }
            return b;
        });

        setTimeout(() => {
             setBalloons(current => current.map(b => {
                 if (b.id === selectedId || b.id === id) {
                     return { ...b, status: BalloonStatus.NORMAL };
                 }
                 return b;
             }));
             setSelectedId(null);
             setIsProcessing(false);
        }, 500); // Wait for shake animation

        return nextState;
      }
    });
  }, [selectedId, isProcessing]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-10 left-10 text-white opacity-40 animate-[drift_60s_linear_infinite]">
        <CloudIcon size={260} />
      </div>
      <div className="absolute top-40 left-[80%] text-white opacity-30 animate-[drift_80s_linear_infinite]">
        <CloudIcon size={180} />
      </div>
      <div className="absolute top-[60%] left-[20%] text-white opacity-50 animate-[drift_50s_linear_infinite]">
        <CloudIcon size={320} />
      </div>

      {/* Header Buttons */}
      <div className="absolute top-4 left-4 right-4 z-50 flex justify-between">
        <button 
          onClick={onBack}
          className="bg-white/80 hover:bg-white text-sky-600 rounded-full p-2 px-4 shadow font-bold transition-all transform hover:scale-105"
        >
          ← Exit
        </button>

        <button 
          onClick={handleShuffle}
          className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-full p-2 px-6 shadow font-bold transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <span>🔄</span> Shuffle
        </button>
      </div>

      {/* Balloons Container */}
      <div className="absolute inset-0 z-10 p-4 pointer-events-none">
        {/* We use pointer-events-none on container so clicks pass through to balloons, 
            but balloons need pointer-events-auto */}
        {balloons.map(b => (
          <div key={b.id} className="pointer-events-auto contents">
             <Balloon data={b} onClick={handleBalloonClick} />
          </div>
        ))}
      </div>
    </div>
  );
};

const CloudIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.5,19c-0.83,0-1.5-0.67-1.5-1.5c0-0.83,0.67-1.5,1.5-1.5c0.83,0,1.5,0.67,1.5,1.5C19,18.33,18.33,19,17.5,19z M19,8.5 c-3.03,0-5.5,2.47-5.5,5.5c0,0.51,0.08,1,0.21,1.47C13.23,15.15,12.63,15,12,15c-1.66,0-3,1.34-3,3s1.34,3,3,3s3-1.34,3-3 c0-0.34-0.07-0.66-0.18-0.96C15.93,18.39,17.91,19,20,19c2.21,0,4-1.79,4-4S22.21,11,20,11C19.68,11,19.37,11.04,19.08,11.11 C19.04,9.65,18.17,8.5,19,8.5z M6,12c-2.21,0-4,1.79-4,4s1.79,4,4,4s4-1.79,4-4S8.21,12,6,12z" />
  </svg>
);

export default GameScreen;