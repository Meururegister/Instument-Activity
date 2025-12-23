
import React from 'react';

interface LoadingBarProps {
  progress: number;
  isVisible: boolean;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ progress, isVisible }) => {
  if (!isVisible && progress >= 100) return null;

  return (
    <div className={`fixed top-0 left-0 w-full z-[100] transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="h-1.5 w-full bg-indigo-100 overflow-hidden">
        <div 
          className="h-full bg-indigo-600 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(79,70,229,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="absolute top-2 right-4 bg-white/80 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-bold text-indigo-600 border border-indigo-100 shadow-sm">
        {Math.round(progress)}%
      </div>
    </div>
  );
};

export default LoadingBar;
