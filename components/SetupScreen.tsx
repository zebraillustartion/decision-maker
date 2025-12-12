import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { audioService } from '../services/audioService';

interface SetupScreenProps {
  onNext: (question: string, total: number, pick: number) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onNext }) => {
  const [question, setQuestion] = useState<string>('');
  const [total, setTotal] = useState<number | string>(3);
  const [pick, setPick] = useState<number | string>(1);

  const handleNext = () => {
    const t = Number(total);
    const p = Number(pick);

    if (!question.trim()) {
        alert("请输入你的问题");
        return;
    }
    if (!t || t < 2) {
      alert("至少需要2个选项");
      return;
    }
    if (!p || p < 1) {
      alert("至少需要选择1个");
      return;
    }
    if (p > t) {
      alert("选择数量不能大于选项总数");
      return;
    }
    
    audioService.init();
    audioService.playTick();
    onNext(question, t, p);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto p-6 justify-center animate-fade-in overflow-y-auto no-scrollbar">
      <div className="mb-6 text-center relative z-10 shrink-0">
        <div className="relative inline-block">
            {/* Clashing shadow layer */}
            <div className="absolute inset-0 bg-neon-purple translate-x-3 translate-y-3 rounded-2xl border-4 border-black"></div>
            
            {/* Main Title Card */}
            <div className="relative bg-white border-4 border-black rounded-2xl p-4 transform -rotate-2 hover:rotate-0 transition-transform duration-300 cursor-default">
                <h1 className="text-5xl font-black leading-none tracking-tighter" style={{ textShadow: '3px 3px 0 #000' }}>
                    <div className="flex justify-center gap-1 mb-2">
                        <span className="text-pop-pink inline-block hover:-translate-y-2 transition-transform duration-200">命</span>
                        <span className="text-pop-green inline-block hover:-translate-y-2 transition-transform duration-200 delay-75">运</span>
                    </div>
                    <div className="flex justify-center gap-1">
                        <span className="text-pop-yellow inline-block hover:-translate-y-2 transition-transform duration-200 delay-100">老</span>
                        <span className="text-pop-blue inline-block hover:-translate-y-2 transition-transform duration-200 delay-150">虎</span>
                        <span className="text-pop-orange inline-block hover:-translate-y-2 transition-transform duration-200 delay-200">机</span>
                    </div>
                </h1>
            </div>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Question Input */}
        <div className="space-y-2 relative">
          <label className="text-2xl font-black text-pop-blue block transform rotate-1" style={{ textShadow: '2px 2px 0 #000' }}>
            你的问题是什么?
          </label>
          <div className="relative">
             <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full bg-white border-4 border-black rounded-xl p-4 text-2xl font-bold text-black outline-none shadow-[6px_6px_0_0_#60a5fa] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[4px_4px_0_0_#60a5fa] transition-all placeholder:text-zinc-300"
                placeholder="例如：今晚吃什么？"
            />
          </div>
        </div>

        {/* Options Count */}
        <div className="space-y-2 relative">
          <label className="text-2xl font-black text-pop-yellow block transform -rotate-1" style={{ textShadow: '2px 2px 0 #000' }}>
            有几个选项?
          </label>
          <div className="relative">
             <input
                type="number"
                min="2"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                className="w-full bg-white border-4 border-black rounded-xl p-4 text-3xl font-black text-black outline-none text-center shadow-[6px_6px_0_0_#4ade80] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[4px_4px_0_0_#4ade80] transition-all"
                placeholder="3"
            />
          </div>
        </div>

        {/* Pick Count */}
        <div className="space-y-2 relative">
          <label className="text-2xl font-black text-pop-pink block transform rotate-1" style={{ textShadow: '2px 2px 0 #000' }}>
            选几个?
          </label>
          <div className="relative">
             <input
                type="number"
                min="1"
                max={Number(total)}
                value={pick}
                onChange={(e) => setPick(e.target.value)}
                className="w-full bg-white border-4 border-black rounded-xl p-4 text-3xl font-black text-black outline-none text-center shadow-[6px_6px_0_0_#f472b6] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[4px_4px_0_0_#f472b6] transition-all"
                placeholder="1"
            />
          </div>
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-pop-green border-4 border-black text-black text-2xl font-black py-4 rounded-2xl mt-4 shadow-[6px_6px_0_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[2px_2px_0_0_#000] hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
        >
          下一步 <ArrowRight size={32} strokeWidth={4} />
        </button>
      </div>
    </div>
  );
};

export default SetupScreen;