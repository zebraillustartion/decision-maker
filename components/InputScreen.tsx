import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, SkipForward } from 'lucide-react';
import { OptionItem, getRandomColorClass } from '../types';
import { audioService } from '../services/audioService';

interface InputScreenProps {
  question: string;
  totalCount: number;
  onNext: (options: OptionItem[]) => void;
}

const InputScreen: React.FC<InputScreenProps> = ({ question, totalCount, onNext }) => {
  const [inputs, setInputs] = useState<string[]>(Array(totalCount).fill(''));
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const generateDefaultOptions = () => {
    return inputs.map((val, idx) => ({
      id: `opt-${idx}`,
      text: val.trim() === '' ? `${idx + 1}` : val,
      color: getRandomColorClass(idx),
    }));
  };

  const handleSkip = () => {
    audioService.playTick();
    const defaults = Array(totalCount).fill('').map((_, i) => ({
        id: `opt-${i}`,
        text: `${i + 1}`,
        color: getRandomColorClass(i),
    }));
    onNext(defaults);
  };

  const handleConfirm = () => {
    audioService.playTick();
    onNext(generateDefaultOptions());
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto p-6">
      <div className="mb-6 shrink-0">
        <div className="text-zinc-400 font-bold text-sm mb-1 uppercase tracking-wider">Current Question:</div>
        <h2 className="text-3xl font-black text-pop-green leading-tight tracking-tight break-words" style={{ textShadow: '2px 2px 0 #000' }}>
          {question}
        </h2>
      </div>

      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-4 pb-8 px-2">
        {inputs.map((val, idx) => {
            // Cyclical vibrant border colors for inputs
            const borderColors = ['border-pop-yellow', 'border-pop-pink', 'border-pop-blue', 'border-pop-orange'];
            const borderColor = borderColors[idx % borderColors.length];
            return (
              <div key={idx} className="flex items-center gap-3 transform hover:-translate-y-1 transition-transform">
                <span className={`w-10 h-10 border-2 border-black rounded-lg flex items-center justify-center font-black text-lg shrink-0 shadow-[3px_3px_0_0_#000] ${getRandomColorClass(idx)}`}>
                    {idx + 1}
                </span>
                <input
                  type="text"
                  value={val}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  className={`flex-1 bg-white border-4 border-black rounded-lg p-3 text-xl font-bold text-black outline-none focus:${borderColor} shadow-[4px_4px_0_0_#000] transition-colors`}
                  placeholder={`选项 ${idx + 1}`}
                />
              </div>
            );
        })}
      </div>

      <div className="pt-4 space-y-3 shrink-0 bg-pop-black relative z-10">
        <button
          onClick={handleConfirm}
          className="w-full bg-pop-green text-black border-4 border-black text-2xl font-black py-4 rounded-xl shadow-[6px_6px_0_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[2px_2px_0_0_#000] transition-all flex items-center justify-center gap-2"
        >
          确定 <ArrowRight size={28} strokeWidth={4} />
        </button>
        
        <button
          onClick={handleSkip}
          className="w-full bg-zinc-800 text-white border-4 border-black text-lg font-bold py-4 rounded-xl shadow-[6px_6px_0_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[2px_2px_0_0_#000] transition-all flex items-center justify-center gap-2"
        >
          跳过 (使用数字) <SkipForward size={24} />
        </button>
      </div>
    </div>
  );
};

export default InputScreen;