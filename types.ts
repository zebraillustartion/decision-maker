export type ScreenState = 'SETUP' | 'INPUT' | 'MACHINE';

export interface OptionItem {
  id: string;
  text: string;
  color: string;
}

export interface AppState {
  question: string;
  totalOptions: number;
  pickCount: number;
  options: OptionItem[];
  selectedResults: OptionItem[];
}

// Updated with border-black and hard shadows will be applied in components or here
export const POP_COLORS = [
  'bg-yellow-400 text-black border-2 border-black',
  'bg-green-400 text-black border-2 border-black',
  'bg-pink-400 text-black border-2 border-black',
  'bg-blue-400 text-black border-2 border-black',
  'bg-orange-400 text-black border-2 border-black',
  'bg-purple-400 text-white border-2 border-black',
  'bg-red-500 text-white border-2 border-black',
  'bg-cyan-400 text-black border-2 border-black',
];

export const getRandomColorClass = (index: number) => {
  return POP_COLORS[index % POP_COLORS.length];
};