import { Zap, Battery, Home, Sun, UtilityPole } from "lucide-react";
import { cn } from "./ui/utils";

interface SystemTopologyProps {
    solarPower: number; // kW
    batteryPower: number; // kW, negative = charging, positive = discharging
    gridPower: number; // kW, negative = export, positive = import
    homeConsumption: number; // kW
    batterySoc: number; // %
}

export function SystemTopology({
    solarPower,
    batteryPower,
    gridPower,
    homeConsumption,
    batterySoc,
}: SystemTopologyProps) {
    // Determine flow directions and speeds
    // Arrows should move from source to destination

    const isCharging = batteryPower < 0;
    const isExporting = gridPower < 0;

    // Helper to format power
    const fmt = (n: number) => `${Math.abs(n).toFixed(2)} kW`;

    return (
        <div className="relative w-full h-[350px] flex items-center justify-center bg-white rounded-lg p-4 select-none">

            {/* Center - Inverter */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                <div className="w-16 h-20 bg-gray-600 rounded-lg flex items-center justify-center shadow-lg border-2 border-gray-700 relative">
                    <div className="text-white font-bold text-xs absolute top-2">DC/AC</div>
                    <Zap className="w-8 h-8 text-yellow-400 fill-current" />
                </div>
            </div>

            {/* Top - Solar */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10">
                <div className="w-14 h-14 bg-blue-50 border-2 border-blue-200 rounded-lg flex items-center justify-center shadow-sm mb-1">
                    <Sun className="w-8 h-8 text-blue-500" />
                </div>
                <div className="text-sm font-bold text-gray-700">{fmt(solarPower)}</div>
            </div>

            {/* Left - Battery */}
            <div className="absolute left-8 top-1/2 transform -translate-y-1/2 flex flex-col items-center z-10">
                <div className="text-xs font-semibold text-gray-500 mb-1">SOC: {batterySoc}%</div>
                <div className="w-14 h-14 bg-green-50 border-2 border-green-200 rounded-lg flex items-center justify-center shadow-sm mb-1">
                    <Battery className={cn("w-8 h-8", batterySoc > 20 ? "text-green-500" : "text-red-500")} />
                </div>
                <div className="text-sm font-bold text-gray-700">{fmt(Math.abs(batteryPower))}</div>
            </div>

            {/* Right - Grid */}
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex flex-col items-center z-10">
                <div className="w-14 h-14 bg-gray-50 border-2 border-gray-200 rounded-lg flex items-center justify-center shadow-sm mb-1">
                    <UtilityPole className="w-8 h-8 text-gray-500" />
                </div>
                <div className="text-sm font-bold text-gray-700">{fmt(Math.abs(gridPower))}</div>
                <div className="text-xs text-gray-400 mt-1">{isExporting ? "Exporting" : "Importing"}</div>
            </div>

            {/* Bottom - Home */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10">
                <div className="w-14 h-14 bg-red-50 border-2 border-red-200 rounded-lg flex items-center justify-center shadow-sm mt-1">
                    <Home className="w-8 h-8 text-red-500" />
                </div>
                <div className="text-sm font-bold text-gray-700 mt-1">{fmt(homeConsumption)}</div>
            </div>

            {/* --- Flow Lines & Animations --- */}

            {/* Solar Flow (Top to Center) */}
            <div className="absolute top-[22%] left-1/2 h-[20%] w-px -ml-0.5">
                {/* Static Line */}
                <div className="w-1 h-full bg-blue-100 mx-auto rounded-full"></div>
                {/* Animated Flow */}
                {solarPower > 0 && (
                    <div className="absolute top-0 left-1/2 -ml-1 w-2 h-2 bg-blue-400 rounded-full animate-flow-down shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
                )}
            </div>

            {/* Battery Flow (Left <-> Center) */}
            <div className="absolute left-[18%] top-1/2 w-[24%] h-px -mt-0.5 flex items-center">
                {/* Static Line */}
                <div className="w-full h-1 bg-green-100 rounded-full"></div>
                {/* Animated Flow */}
                {batteryPower !== 0 && (
                    <div className={cn(
                        "absolute top-1/2 -mt-1 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]",
                        isCharging ? "animate-flow-left" : "animate-flow-right"
                    )}></div>
                )}
            </div>

            {/* Grid Flow (Right <-> Center) */}
            <div className="absolute right-[18%] top-1/2 w-[24%] h-px -mt-0.5 flex items-center">
                {/* Static Line */}
                <div className="w-full h-1 bg-gray-200 rounded-full"></div>
                {/* Animated Flow */}
                {gridPower !== 0 && (
                    <div className={cn(
                        "absolute top-1/2 -mt-1 w-2 h-2 bg-gray-400 rounded-full shadow-[0_0_8px_rgba(156,163,175,0.8)]",
                        isExporting ? "animate-flow-right" : "animate-flow-left"
                    )}></div>
                )}
            </div>

            {/* Home Flow (Center to Bottom) */}
            <div className="absolute bottom-[22%] left-1/2 h-[20%] w-px -ml-0.5">
                {/* Static Line */}
                <div className="w-1 h-full bg-red-100 mx-auto rounded-full"></div>
                {/* Animated Flow */}
                {homeConsumption > 0 && (
                    <div className="absolute top-0 left-1/2 -ml-1 w-2 h-2 bg-red-400 rounded-full animate-flow-down shadow-[0_0_8px_rgba(248,113,113,0.8)]"></div>
                )}
            </div>

            <style>{`
        @keyframes flow-down {
          0% { top: 0; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes flow-right {
          0% { left: 0; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes flow-left {
          0% { left: 100%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: 0; opacity: 0; }
        }
        .animate-flow-down {
          animation: flow-down 1.5s infinite linear;
        }
        .animate-flow-right {
          animation: flow-right 1.5s infinite linear;
        }
        .animate-flow-left {
          animation: flow-left 1.5s infinite linear;
        }
      `}</style>
        </div>
    );
}
