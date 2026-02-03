import React, { useState } from "react";
import Image from "next/image";
import logo from "../public/transparent-logo.png";
import { Info, X } from "lucide-react";

const AppHeader: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <header
      className={`absolute bottom-4 left-4 z-[1001] transition-all duration-500 ease-in-out cursor-pointer
        ${
          isCollapsed
            ? "w-14 h-14 rounded-full shadow-lg p-0"
            : "w-[90%] max-w-md h-16 rounded-3xl px-4 shadow-2xl"
        } 
        bg-white/90 backdrop-blur-md border border-white/20 flex items-center justify-center overflow-hidden`}
      onClick={() => isCollapsed && setIsCollapsed(false)}
    >
      {/* Logo Section - Always visible, becomes the center of the circle when collapsed */}
      <div
        className={`flex items-center shrink-0 transition-all duration-500 ${
          isCollapsed ? "mx-auto" : "mr-0"
        }`}
      >
        <div className="relative w-10 h-10 p-1 bg-white rounded-xl shadow-sm border border-gray-100">
          <Image
            src={logo}
            alt="Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
      </div>

      {/* Expanded Content - Fades in/out */}
      <div
        className={`flex flex-1 items-center justify-between transition-opacity duration-300 ${
          isCollapsed ? "opacity-0 hidden w-0" : "opacity-100 visible w-full"
        }`}
      >
        <div className="flex flex-col ml-1">
          <h1 className="text-sm font-black text-[#1A365D] whitespace-nowrap ">
            OAU <span className="text-[#F26522]">ChowFinder</span>
          </h1>
          <p className="text-[8px] font-bold text-[#889E73] uppercase tracking-tighter">
            Powered by ElvistheSaint
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full text-[#1A365D]">
            <Info size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCollapsed(true);
            }}
            className="p-2 bg-gray-50 hover:bg-gray-200 rounded-full text-gray-400"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </header>
  );
  // return (
  //   <header className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001] w-[92%] max-w-lg">
  //     <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-3 px-5 shadow-[0_8px_32px_0_rgba(26,54,93,0.15)] flex items-center justify-between">
  //       {/* Logo & Brand Section */}
  //       <div className="flex items-center gap-3">
  //         <div className="relative w-10 h-10 p-1 bg-white rounded-xl shadow-inner border border-gray-50">
  //           <Image
  //             src={logo} // Path to your logo
  //             alt="OAU ChowFinder Logo"
  //             width={40}
  //             height={40}
  //             className="object-contain"
  //           />
  //         </div>

  //         <div>
  //           <h1 className="text-lg font-black tracking-tight flex items-center gap-1.5">
  //             <span className="text-[#1A365D]">OAU</span>
  //             <span className="text-[#F26522]">ChowFinder</span>
  //           </h1>
  //           <p className="text-[10px] font-bold text-[#889E73] uppercase tracking-widest leading-none">
  //             Powered by Saint
  //           </p>
  //         </div>
  //       </div>

  //       {/* Action Button (e.g., Profile or Info) */}
  //       <button className="w-10 h-10 flex items-center justify-center bg-[#1A365D]/5 hover:bg-[#1A365D]/10 rounded-full transition-colors">
  //         <svg
  //           className="w-5 h-5 text-[#1A365D]"
  //           fill="none"
  //           stroke="currentColor"
  //           viewBox="0 0 24 24"
  //         >
  //           <path
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //             strokeWidth="2.5"
  //             d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
  //           />
  //         </svg>
  //       </button>
  //     </div>
  //   </header>
  // );
};

export default AppHeader;
