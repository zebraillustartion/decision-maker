import React, { useState, useRef, useEffect } from 'react';
import { OptionItem } from '../types';
import { audioService } from '../services/audioService';
import { 
  Heart, Star, Zap, Moon, Clover, Diamond, Crown, Sparkles, Cherry,
  Gem, Rocket, Sun, Anchor, Trophy, Gift, Ghost, Skull, RefreshCw, RotateCcw, Play, Octagon
} from 'lucide-react';

interface SlotMachineProps {
  question: string;
  options: OptionItem[];
  pickCount: number;
  onComplete: (results: OptionItem[]) => void;
  onReset: () => void;
  onSpinAgain: () => void;
}

const REEL_ICONS = [
  Heart, Star, Zap, Moon, Clover, Diamond, Crown, Sparkles, Cherry,
  Gem, Rocket, Sun, Anchor, Trophy, Gift, Ghost, Skull
];

const ICON_HEIGHT = 112; // h-28 is 7rem = 112px
const ICON_SET_HEIGHT = REEL_ICONS.length * ICON_HEIGHT;

const SlotMachine: React.FC<SlotMachineProps> = ({
  question,
  options,
  pickCount,
  onComplete,
  onReset,
  onSpinAgain,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isWaitingForStop, setIsWaitingForStop] = useState(false);
  const [handleAngle, setHandleAngle] = useState(0);
  const [results, setResults] = useState<OptionItem[] | null>(null);
  
  const spinSoundRef = useRef<{ stop: () => void } | null>(null);
  
  const reelsRef = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const animationFrameRef = useRef<number>(0);
  const reelOffsetsRef = useRef([-ICON_SET_HEIGHT, -ICON_SET_HEIGHT - 200, -ICON_SET_HEIGHT - 400]);

  useEffect(() => {
    reelsRef.forEach((ref) => {
        if (ref.current) {
            ref.current.style.transform = 'translateY(0px)';
        }
    });
  }, []);

  const generateResult = () => {
    const shuffled = [...options].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, pickCount);
  };

  const handlePull = () => {
    if (results) return;

    audioService.playLeverPull();

    setHandleAngle(45);
    setTimeout(() => setHandleAngle(0), 300);

    if (isSpinning) {
      stopSpinning();
    } else {
      startSpinning();
    }
  };

  const triggerSpinAgain = () => {
    setResults(null);
    onSpinAgain();
    // Immediate trigger with slight delay to ensure state update
    setTimeout(() => {
        handlePull();
    }, 50);
  };

  const startSpinning = () => {
    setIsSpinning(true);
    setIsWaitingForStop(true);
    
    spinSoundRef.current = audioService.playSpinLoop() || null;

    reelOffsetsRef.current = [
        -ICON_SET_HEIGHT * 2, 
        -ICON_SET_HEIGHT * 2 - 300, 
        -ICON_SET_HEIGHT * 2 - 600
    ];

    const targetSpeeds = [45, 55, 50]; 
    let speedFactor = 0;

    const loop = () => {
      if (speedFactor < 1) {
        speedFactor += 0.05;
      }

      reelsRef.forEach((ref, index) => {
        if (ref.current) {
          const currentSpeed = targetSpeeds[index] * speedFactor;
          reelOffsetsRef.current[index] += currentSpeed;
          
          if (reelOffsetsRef.current[index] > -ICON_SET_HEIGHT) {
             reelOffsetsRef.current[index] -= ICON_SET_HEIGHT;
          }
          
          ref.current.style.transform = `translateY(${reelOffsetsRef.current[index]}px)`;
        }
      });
      animationFrameRef.current = requestAnimationFrame(loop);
    };
    loop();
  };

  const stopSpinning = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (spinSoundRef.current) spinSoundRef.current.stop();

    setIsSpinning(false);
    setIsWaitingForStop(false);
    
    const finalResults = generateResult();
    setResults(finalResults);
    audioService.playWin();
    
    reelsRef.forEach((ref, index) => {
      if (ref.current) {
        let currentOffset = reelOffsetsRef.current[index];
        if (currentOffset > -ICON_SET_HEIGHT) {
            currentOffset -= ICON_SET_HEIGHT;
        }
        
        ref.current.style.transition = 'none';
        ref.current.style.transform = `translateY(${currentOffset}px)`;
        ref.current.offsetHeight; 

        ref.current.style.transition = 'transform 2.5s cubic-bezier(0.15, 1, 0.3, 1)'; 
        ref.current.style.transform = `translateY(0px)`;
      }
    });

    setTimeout(() => {
        reelsRef.forEach((ref) => {
            if (ref.current) ref.current.style.transition = 'none';
        });
        reelOffsetsRef.current = [0, 0, 0];
    }, 2500);
  };

  const reelStrip = [...REEL_ICONS, ...REEL_ICONS, ...REEL_ICONS, ...REEL_ICONS];

  const isLongQuestion = question.length > 8;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-xl mx-auto py-4 relative">
      
      {/* MACHINE CHASSIS */}
      <div className="relative bg-pop-pink p-6 rounded-[2rem] border-4 border-black shadow-[12px_12px_0_0_#000] w-full max-w-sm">
        
        {/* TOP MARQUEE (QUESTION) */}
        <div className="bg-pop-yellow border-4 border-black rounded-xl mb-4 relative overflow-hidden p-2">
            <div className="flex justify-between px-2 mb-1">
                {[...Array(6)].map((_, i) => (
                    <div key={`t-${i}`} className={`w-4 h-4 rounded-full border-2 border-black bg-white ${isSpinning ? 'bg-pop-orange' : ''}`} />
                ))}
            </div>
            
            <div className="bg-black py-2 transform -skew-x-6 mx-2 border-2 border-white overflow-hidden">
                {isLongQuestion ? (
                    <div className="whitespace-nowrap animate-marquee">
                         <span className="text-center font-black text-2xl text-pop-green tracking-[0.2em] inline-block px-4">
                            {question}
                         </span>
                         <span className="text-center font-black text-2xl text-pop-green tracking-[0.2em] inline-block px-4">
                            {question}
                         </span>
                    </div>
                ) : (
                    <h1 className="text-center font-black text-2xl text-pop-green tracking-[0.2em] truncate px-2">
                        {question}
                    </h1>
                )}
            </div>

            <div className="flex justify-between px-2 mt-1">
                {[...Array(6)].map((_, i) => (
                    <div key={`b-${i}`} className={`w-4 h-4 rounded-full border-2 border-black bg-white ${isSpinning ? 'bg-pop-orange' : ''}`} />
                ))}
            </div>
        </div>

        {/* MIDDLE: VISUAL REELS */}
        <div className="bg-white border-4 border-black rounded-xl p-2 mb-4 h-32 flex gap-2 overflow-hidden relative">
            {[0, 1, 2].map((reelIdx) => (
                <div key={reelIdx} className="flex-1 bg-zinc-100 rounded-lg overflow-hidden relative border-2 border-black shadow-inner">
                    <div 
                        ref={reelsRef[reelIdx]}
                        className={`flex flex-col items-center will-change-transform ${isSpinning ? 'blur-[1px]' : ''}`}
                        style={{ transform: 'translateY(0px)' }}
                    >
                        {reelStrip.map((Icon, idx) => (
                            <div key={idx} className="h-28 w-full flex items-center justify-center shrink-0">
                                <Icon size={40} className="text-black" strokeWidth={3} />
                            </div>
                        ))}
                    </div>
                    <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>
                    <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                </div>
            ))}
        </div>

        {/* BOTTOM: RESULT SCREEN (DISPLAY ONLY) */}
        <div className="bg-black border-4 border-black rounded-xl p-4 h-44 relative flex flex-col shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] mb-4">
            <div className="flex justify-between items-center mb-2 border-b-2 border-zinc-800 pb-1">
                <span className="text-xs text-pop-green font-mono uppercase">Output_v1.0</span>
                <div className={`w-3 h-3 rounded-full ${isSpinning ? 'bg-pop-green animate-pulse' : 'bg-red-500'}`}></div>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar relative">
                {isSpinning ? (
                     <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
                        <span className="text-pop-green font-mono text-xl font-bold animate-pulse">COMPUTING...</span>
                        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
                             <div className="h-full bg-pop-green animate-[width_1s_infinite]"></div>
                        </div>
                     </div>
                ) : results ? (
                    <div className="space-y-3 pt-1 pb-2">
                        <div className="text-zinc-500 text-xs text-center font-bold uppercase tracking-widest">The Universe Selected:</div>
                        {results.map((res, idx) => (
                            <div key={idx} className="animate-fade-in-up">
                                <div className={`p-4 rounded-lg font-black text-2xl text-center border-2 border-black shadow-[4px_4px_0_0_#000] ${res.color}`}>
                                    {res.text}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-50">
                        <span className="text-zinc-600 font-black text-2xl uppercase rotate-[-5deg]">Ready?</span>
                    </div>
                )}
            </div>
        </div>

        {/* INTEGRATED CONTROL DECK */}
        <div className="bg-zinc-800 rounded-xl p-3 border-4 border-black shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] flex items-center justify-center gap-4 min-h-[88px]">
            {/* STATE: IDLE (Start) */}
            {!isSpinning && !results && (
                 <button 
                    onClick={handlePull}
                    className="flex-1 bg-pop-green text-black border-4 border-black py-2 rounded-lg font-black text-xl shadow-[0_4px_0_0_#000] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 group animate-bounce-sm"
                 >
                    <Play size={24} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                    START
                 </button>
            )}

            {/* STATE: SPINNING (Stop) */}
            {isSpinning && (
                <button 
                   onClick={handlePull} // Pulling lever also stops it in current logic
                   className="flex-1 bg-pop-red bg-red-500 text-white border-4 border-black py-2 rounded-lg font-black text-xl shadow-[0_4px_0_0_#000] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2"
                >
                   <Octagon size={24} fill="currentColor" />
                   STOP
                </button>
            )}

            {/* STATE: RESULTS (Options) */}
            {results && !isSpinning && (
                <>
                    <button 
                        onClick={onReset}
                        className="flex-1 bg-white text-black border-4 border-black py-2 rounded-lg font-bold text-base shadow-[0_4px_0_0_#000] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-1 leading-none h-full"
                    >
                        <RotateCcw size={16} />
                        再问一次
                    </button>
                    <button 
                        onClick={triggerSpinAgain}
                        className="flex-[1.5] bg-pop-blue text-black border-4 border-black py-2 rounded-lg font-black text-lg shadow-[0_4px_0_0_#000] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 leading-none h-full"
                    >
                        <RefreshCw size={20} className="animate-spin-slow" style={{ animationDuration: '3s' }} />
                        再抽一次
                    </button>
                </>
            )}
        </div>

        {/* LEVER (Decorative mainly, but clickable) */}
        <div className="absolute top-24 -right-[40px] w-12 h-48 z-0">
             <div className="absolute top-12 left-0 w-6 h-12 bg-black rounded-r-lg"></div>
             <div 
                className="absolute top-16 left-3 w-4 h-32 bg-zinc-400 border-2 border-black rounded-full origin-top transition-transform duration-300 ease-out cursor-pointer hover:brightness-110"
                style={{ transform: `rotate(${handleAngle}deg)` }}
                onClick={handlePull}
                title="Pull Lever"
             >
                <div className="absolute -bottom-6 -left-4 w-12 h-12 bg-pop-red bg-red-500 border-4 border-black rounded-full shadow-lg"></div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;