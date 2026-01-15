import React, { useState } from "react";
import { Wallet, ChevronDown, ChevronUp, Info } from "lucide-react";

interface BudgetFilterProps {
  onBudgetChange: (value: number) => void;
}

const BudgetFilter: React.FC<BudgetFilterProps> = ({ onBudgetChange }) => {
  const [value, setValue] = useState<number>(1500);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBudget = parseInt(e.target.value);
    setValue(newBudget);
    onBudgetChange(newBudget);
  };

  return (
    <div
      className={`absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 transition-all duration-300 ease-in-out ${
        isMinimized ? "w-48 p-3" : "w-80 p-5"
      }`}
    >
      {/* Header - Always Visible */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-2 rounded-xl shrink-0">
            <Wallet className="text-white w-4 h-4" />
          </div>
          {/* Only show full text if not minimized */}
          {!isMinimized && (
            <div>
              <h3 className="text-[#1A365D] font-black text-sm leading-tight">
                Your Budget
              </h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                OAU ChowFinder
              </p>
            </div>
          )}
          {isMinimized && (
            <span className="text-[#1A365D] font-black text-sm">
              Budget: ₦{value}
            </span>
          )}
        </div>

        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
        >
          {isMinimized ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
      </div>

      {/* Collapsible Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isMinimized ? "max-h-0 opacity-0 mt-0" : "max-h-96 opacity-100 mt-4"
        }`}
      >
        {/* Current Value Display */}
        <div className="flex justify-center mb-4">
          <div className="bg-[#1A365D] text-white px-6 py-2 rounded-2xl font-black text-2xl shadow-lg">
            ₦{value}
          </div>
        </div>

        {/* Slider */}
        <div className="relative mb-6">
          <input
            type="range"
            min="200"
            max="3000"
            step="50"
            value={value}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between mt-2 px-1">
            <span className="text-[10px] font-bold text-gray-400">₦200</span>
            <span className="text-[10px] font-bold text-gray-400">₦3000+</span>
          </div>
        </div>

        {/* Quick Select Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[1000, 1500, 2000, 3000].map((amt) => (
            <button
              key={amt}
              onClick={() => {
                setValue(amt);
                onBudgetChange(amt);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                value === amt
                  ? "bg-[#1A365D] text-white border-[#1A365D]"
                  : "bg-white text-gray-500 border-gray-100 hover:border-orange-200"
              }`}
            >
              ₦{amt}
            </button>
          ))}
        </div>

        {/* Helper Footer */}
        <div className="flex items-center gap-2 text-[10px] text-gray-400 bg-gray-50 p-2 rounded-lg">
          <Info size={12} className="text-[#889E73]" />
          <p>Filtering canteens by avg. price</p>
        </div>
      </div>
    </div>
  );
};

export default BudgetFilter;
