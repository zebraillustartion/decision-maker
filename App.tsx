import React, { useState } from 'react';
import SetupScreen from './components/SetupScreen';
import InputScreen from './components/InputScreen';
import SlotMachine from './components/SlotMachine';
import { AppState, ScreenState, OptionItem } from './types';

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('SETUP');
  const [appState, setAppState] = useState<AppState>({
    question: '',
    totalOptions: 3,
    pickCount: 1,
    options: [],
    selectedResults: [],
  });

  const handleSetupComplete = (question: string, total: number, pick: number) => {
    setAppState(prev => ({ ...prev, question, totalOptions: total, pickCount: pick }));
    setScreen('INPUT');
  };

  const handleInputComplete = (options: OptionItem[]) => {
    setAppState(prev => ({ ...prev, options }));
    setScreen('MACHINE');
  };

  const handleReset = () => {
    setScreen('SETUP');
    setAppState({
      question: '',
      totalOptions: 3,
      pickCount: 1,
      options: [],
      selectedResults: [],
    });
  };

  const handleSpinAgain = () => {
     // Just triggers internal reset in component
  };

  return (
    <div className="min-h-screen bg-pop-black text-white font-sans selection:bg-pop-pink selection:text-white overflow-hidden">
      <main className="h-[100dvh] w-full relative flex flex-col">
        {/* Solid background only */}
        <div className="flex-1 w-full relative z-10 flex flex-col overflow-hidden">
          {screen === 'SETUP' && (
            <SetupScreen onNext={handleSetupComplete} />
          )}

          {screen === 'INPUT' && (
            <InputScreen 
                question={appState.question}
                totalCount={appState.totalOptions} 
                onNext={handleInputComplete} 
            />
          )}

          {screen === 'MACHINE' && (
            <SlotMachine 
                question={appState.question}
                options={appState.options}
                pickCount={appState.pickCount}
                onComplete={() => {}} 
                onReset={handleReset}
                onSpinAgain={handleSpinAgain}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;