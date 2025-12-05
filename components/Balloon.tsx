import React from 'react';
import { BalloonData, BalloonStatus } from '../types';

interface BalloonProps {
  data: BalloonData;
  onClick: (id: string) => void;
}

const Balloon: React.FC<BalloonProps> = ({ data, onClick }) => {
  const { x, y, text, status, color, floatDelay, floatDuration } = data;
  const colorObj = JSON.parse(color);

  if (status === BalloonStatus.POPPED) return null;

  const isSelected = status === BalloonStatus.SELECTED;
  const isMismatch = status === BalloonStatus.MISMATCH;
  const isMatched = status === BalloonStatus.MATCHED;

  // Determine animation classes
  let animationClass = "animate-float";
  if (isMatched) animationClass = "animate-pop pointer-events-none";
  else if (isMismatch) animationClass = "animate-shake";
  
  // Base transforms
  const style: React.CSSProperties = {
    top: `${y}%`,
    left: `${x}%`,
    animationDelay: isMatched || isMismatch ? '0s' : `-${floatDelay}s`,
    animationDuration: isMatched ? '0.3s' : isMismatch ? '0.4s' : `${floatDuration}s`,
  };

  return (
    <div
      onClick={() => status === BalloonStatus.NORMAL ? onClick(data.id) : null}
      className={`absolute w-24 h-28 sm:w-32 sm:h-36 flex flex-col items-center justify-center 
        transition-all cursor-pointer transform hover:scale-105 active:scale-95
        ${animationClass} z-10 select-none`}
      style={style}
    >
      {/* Balloon Shape */}
      <div 
        className={`w-full h-full rounded-full relative flex items-center justify-center
          ${colorObj.bg} 
          ${isSelected ? 'ring-4 ring-white ring-opacity-80 scale-110' : ''}
          ${isMismatch ? 'ring-4 ring-red-500 ring-opacity-80' : ''}
          shadow-lg ${colorObj.shadow}
        `}
        style={{
          boxShadow: 'inset -10px -10px 20px rgba(0,0,0,0.1), inset 10px 10px 20px rgba(255,255,255,0.3)'
        }}
      >
        {/* Shine reflection */}
        <div className="absolute top-4 left-4 w-4 h-8 bg-white opacity-30 rounded-full rotate-45 transform origin-center"></div>
        
        {/* String */}
        <div className="absolute -bottom-4 left-1/2 w-0.5 h-8 bg-white opacity-60 origin-top transform -translate-x-1/2 rotate-6"></div>

        {/* Text */}
        <span className={`text-center font-display font-bold text-lg sm:text-xl leading-tight px-2 break-words ${colorObj.text} drop-shadow-md`}>
          {text}
        </span>
      </div>
      
      {/* Explosion particles (only visible when popping) */}
      {isMatched && (
         <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
            {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className={`absolute w-3 h-3 rounded-full ${colorObj.bg}`}
                  style={{
                      transform: `rotate(${i * 60}deg) translate(50px)`,
                      opacity: 0,
                      animation: `pop 0.4s ease-out forwards` 
                  }} 
                />
            ))}
         </div>
      )}
    </div>
  );
};

export default React.memo(Balloon);
