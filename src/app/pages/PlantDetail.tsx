import { PageHeader } from "@/app/components/PageHeader";
import { RoleBadge } from "@/app/components/RoleBadge";
import { HealthBadge } from "@/app/components/HealthBadge";
import { mockDevices, mockPrices } from "@/app/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { ArrowLeft, Building2, Settings, Activity, Leaf, DollarSign, TreeDeciduous, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import houseImage from "@/assets/house1.png";
import { sitesApi } from "@/app/api";
import { getDevices } from "@/app/api/devices.api"; // Import devices API
import { Site } from "@/app/types/api/Sites.types";
import { Device } from "@/app/types/api/Devices.types"; // Import Device type
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";

// Mock time series data for charts
const generatePowerData = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    data.push({
      time: `${i.toString().padStart(2, '0')}:00`,
      solar: Math.max(0, Math.sin((i - 6) * Math.PI / 12) * 8 + Math.random() * 2),
      consumption: 2 + Math.random() * 3,
      charge: Math.random() > 0.5 ? Math.random() * 3 : 0,
      discharge: Math.random() > 0.5 ? -(Math.random() * 2) : 0,
      toGrid: Math.random() > 0.6 ? Math.random() * 4 : 0,
      fromGrid: Math.random() > 0.7 ? Math.random() * 2 : 0,
    });
  }
  return data;
};

const generateSOCData = () => {
  const data = [];
  let soc = 50;
  for (let i = 0; i < 24; i++) {
    soc = Math.max(20, Math.min(95, soc + (Math.random() - 0.5) * 10));
    data.push({
      time: `${i.toString().padStart(2, '0')}:00`,
      soc: soc,
    });
  }
  return data;
};

import { SystemTopology } from "@/app/components/SystemTopology";
import { Devices } from "./Devices";
import { PlantInfo } from "@/app/components/PlantInfo";
import { useSearchParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export function PlantDetail() {
  const { id: plantId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "dashboard";

  const [loading, setLoading] = useState(true);
  const [plant, setPlant] = useState<Site | null>(null);
  const [devices, setDevices] = useState<Device[]>([]); // State for devices
  
  const [timePeriod, setTimePeriod] = useState<"day" | "month" | "year" | "total">("day");
  const [powerData] = useState(generatePowerData());
  const [socData] = useState(generateSOCData());

  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>({
    solar: true,
    fromGrid: true,
    discharge: true,
    consumption: true,
    toGrid: true,
    charge: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!plantId) return;
      setLoading(true);
      try {
        const [plantData, devicesData] = await Promise.all([
          sitesApi.getSite(plantId),
          getDevices({ site: plantId })
        ]);
        setPlant(plantData);
        setDevices(devicesData.results || []);
      } catch (error) {
        console.error("Failed to fetch plant details:", error);
        toast.error("Failed to load plant details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [plantId]);

  const handleLegendClick = (e: any) => {
    const { dataKey } = e;
    setVisibleSeries((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
  };

  const renderLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => {
          const { dataKey, value, color } = entry;
          const isVisible = visibleSeries[dataKey];
          
          return (
            <li 
              key={`item-${index}`}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleLegendClick({ dataKey })}
            >
              <div 
                className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${isVisible ? 'bg-white' : 'bg-gray-100'}`}
                style={{ borderColor: color }}
              >
                {isVisible && (
                  <div 
                    className="w-2.5 h-2.5 rounded-sm" 
                    style={{ backgroundColor: color }}
                  />
                )}
              </div>
              <span className={`text-sm ${isVisible ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                {value}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!plant) {
    return (
      <div>
        <PageHeader title="Plant Not Found" />
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">The plant you're looking for doesn't exist.</p>
            <Button className="mt-4" onClick={() => navigate("/plants")}>
              Back to Plants
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate current values from latest data point
  const latestPower = powerData[powerData.length - 1];
  const currentSolar = latestPower.solar;
  const currentConsumption = latestPower.consumption;

  // Calculate net flows for topology
  // Battery: Charging (neg) vs Discharging (pos)
  // Data has charge as positive value, discharge as negative value
  // We want: Charging = negative, Discharging = positive
  // charge=5 -> -5
  // discharge=-5 -> +5
  const netBattery = -latestPower.charge - latestPower.discharge;

  // Grid: Import (pos) vs Export (neg)
  // toGrid is export (pos in data?), fromGrid is import (pos in data?)
  // Let's check generation: toGrid is + val. fromGrid is + val.
  // We want: Export = negative, Import = positive
  const netGrid = latestPower.fromGrid - latestPower.toGrid;

  const currentSoc = socData[socData.length - 1].soc;

  const recentPrices = mockPrices
    .filter((p) => p.plant_id === plantId)
    .sort((a, b) => new Date(b.effective_at).getTime() - new Date(a.effective_at).getTime())
    .slice(0, 5);

  // Transform data for chart to have positive/negative values
  const chartData = powerData.map(d => ({
    ...d,
    consumption: -d.consumption, // Load is negative
    toGrid: -d.toGrid,           // Export is negative
    charge: -d.charge,           // Charging is negative (consuming)
    // solar, discharge, fromGrid remain positive
  }));

  // Custom tooltip to format negative values as positive absolute values with context
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
          <p className="text-sm font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}: </span>
              {Math.abs(entry.value).toFixed(2)} kW
            </div>
          ))}
        </div>
      );
    }
    return null;
  };



  return (
    <div>
      <PageHeader
        title={plant.name}
        description={`Timezone: ${plant.timezone} | Tariff Zone: ${plant.tariff_zone || "None"}`}
        action={
          <Button variant="outline" onClick={() => navigate("/plants")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Plants
          </Button>
        }
      />

      <Tabs value={currentTab} onValueChange={(val) => navigate(`?tab=${val}`)}>
        {/* Navigation is handled by PlantSidebar */}
        
        <TabsContent value="dashboard">
          {/* Metrics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* House Image Card */}
        <Card className="flex items-center justify-center p-4 bg-white overflow-hidden h-full relative">
             <div className="relative w-full h-full">
                <img src={houseImage} alt="House" className="w-full h-full object-cover rounded-lg" />
                
                {/* SVG Overlay for connecting lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-md">
                  {/* Solar Line - Points directly to Roof Panels */}
                  <line x1="10%" y1="18%" x2="40%" y2="49%" stroke="black" strokeWidth="1.5" strokeDasharray="4 2" />
                  <circle cx="40%" cy="49%" r="3" fill="black" />

                  {/* Consumption Line - Points to Window */}
                  <line x1="75%" y1="82%" x2="60%" y2="62%" stroke="black" strokeWidth="1.5" strokeDasharray="4 2" />
                  <circle cx="60%" cy="62%" r="3" fill="black" />

                  {/* Battery Line - Points to Battery Unit */}
                  <line x1="25%" y1="82%" x2="28%" y2="76%" stroke="black" strokeWidth="1.5" strokeDasharray="4 2" />
                  <circle cx="28%" cy="76%" r="3" fill="black" />

                  {/* Grid Line - Points to Middle of Pole */}
                  <line x1="55%" y1="18%" x2="78%" y2="45%" stroke="black" strokeWidth="1.5" strokeDasharray="4 2" />
                  <circle cx="78%" cy="45%" r="3" fill="black" />
                </svg>

                {/* Solar Production Overlay */}
                <div 
                  className="absolute bg-white/30 backdrop-blur-md border border-white/40 rounded-lg p-2 shadow-lg text-center min-w-[90px] transform transition-transform hover:scale-105 origin-bottom-left"
                  style={{ top: '18%', transform: 'translate(0, -100%)' }}
                >
                  <p className="text-[9px] font-bold text-gray-800 uppercase tracking-wide mb-0.5">Solar</p>
                  <div className="flex items-center justify-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_5px_rgba(250,204,21,0.6)]"></div>
                    <p className="text-sm font-bold text-gray-900">{currentSolar.toFixed(1)} kW</p>
                  </div>
                </div>

                {/* Consumption Overlay */}
                <div 
                  className="absolute bg-white/30 backdrop-blur-md border border-white/40 rounded-lg p-2 shadow-lg text-center min-w-[90px] transform transition-transform hover:scale-105 origin-top-left"
                  style={{ left: '75%', top: '82%' }}
                >
                  <p className="text-[9px] font-bold text-gray-800 uppercase tracking-wide mb-0.5">Load</p>
                  <div className="flex items-center justify-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.6)]"></div>
                    <p className="text-sm font-bold text-gray-900">{currentConsumption.toFixed(1)} kW</p>
                  </div>
                </div>

                {/* Battery Status Overlay */}
                <div 
                  className="absolute bg-white/30 backdrop-blur-md border border-white/40 rounded-lg p-2 shadow-lg text-center min-w-[90px] transform transition-transform hover:scale-105 origin-top"
                  style={{ left: '25%', top: '82%', transform: 'translate(-50%, 0)' }}
                >
                  <p className="text-[9px] font-bold text-gray-800 uppercase tracking-wide mb-0.5">Battery</p>
                  <div className="flex items-center justify-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${netBattery > 0 ? 'bg-green-500' : 'bg-indigo-500'} shadow-sm`}></div>
                    <p className={`text-sm font-bold ${netBattery > 0 ? 'text-green-700' : 'text-indigo-700'}`}>
                      {Math.abs(netBattery).toFixed(1)} kW
                    </p>
                  </div>
                  <p className="text-[8px] text-gray-700 mt-0.5 font-medium">{netBattery > 0 ? 'Discharging' : (netBattery < 0 ? 'Charging' : 'Idle')}</p>
                </div>

                {/* Grid Status Overlay */}
                <div 
                  className="absolute bg-white/30 backdrop-blur-md border border-white/40 rounded-lg p-2 shadow-lg text-center min-w-[90px] transform transition-transform hover:scale-105 origin-bottom-right"
                  style={{ left: '65%', top: '18%', transform: 'translate(-100%, -100%)' }}
                >
                  <p className="text-[9px] font-bold text-gray-800 uppercase tracking-wide mb-0.5">Grid</p>
                  <div className="flex items-center justify-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${netGrid < 0 ? 'bg-green-500' : 'bg-orange-500'} shadow-sm`}></div>
                    <p className="text-sm font-bold text-gray-900">{Math.abs(netGrid).toFixed(1)} kW</p>
                  </div>
                  <p className="text-[8px] text-gray-700 mt-0.5 font-medium">{netGrid < 0 ? 'Exporting' : (netGrid > 0 ? 'Importing' : 'Islanded')}</p>
                </div>
             </div>
        </Card>

        {/* Metrics Grid (2x2) */}
        <div className="hidden md:grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Solar Production</p>
                <p className="text-2xl font-bold text-gray-900">{currentSolar.toFixed(1)} kW</p>
                <p className="text-xs text-green-600">↑ 12% vs yesterday</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Consumption</p>
                <p className="text-2xl font-bold text-gray-900">{currentConsumption.toFixed(1)} kW</p>
                <p className="text-xs text-gray-500">Normal range</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Battery Status</p>
                <p className={`text-2xl font-bold ${netBattery > 0 ? 'text-green-600' : 'text-indigo-600'}`}>
                  {Math.abs(netBattery).toFixed(1)} kW
                </p>
                <p className="text-xs text-gray-500">{netBattery > 0 ? 'Discharging' : (netBattery < 0 ? 'Charging' : 'Idle')}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Grid Status</p>
                <p className="text-2xl font-bold text-gray-900">{Math.abs(netGrid).toFixed(1)} kW</p>
                <p className={`text-xs ${netGrid < 0 ? 'text-green-600' : 'text-orange-600'}`}>
                  {netGrid < 0 ? 'Exporting' : (netGrid > 0 ? 'Importing' : 'Islanded')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={timePeriod === "day" ? "default" : "outline"}
          onClick={() => setTimePeriod("day")}
          className={timePeriod === "day" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
        >
          Day
        </Button>
        <Button
          variant={timePeriod === "month" ? "default" : "outline"}
          onClick={() => setTimePeriod("month")}
          className={timePeriod === "month" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
        >
          Month
        </Button>
        <Button
          variant={timePeriod === "year" ? "default" : "outline"}
          onClick={() => setTimePeriod("year")}
          className={timePeriod === "year" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
        >
          Year
        </Button>
        <Button
          variant={timePeriod === "total" ? "default" : "outline"}
          onClick={() => setTimePeriod("total")}
          className={timePeriod === "total" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
        >
          Total
        </Button>
      </div>

      {/* Charts and Topology Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Charts Section - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Power Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Power Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.8} />
                    </linearGradient>
                    <linearGradient id="colorGridImport" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorGridExport" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="time"
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                    label={{ value: 'kW', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={renderLegend} />
                  <ReferenceLine y={0} stroke="#9ca3af" />

                  {/* Positive Flows */}
                  <Area
                    type="monotone"
                    dataKey="solar"
                    stroke="#f59e0b"
                    fill="url(#colorSolar)"
                    name="Solar Production"
                    fillOpacity={1}
                    hide={!visibleSeries.solar}
                  />
                  <Area
                    type="monotone"
                    dataKey="fromGrid"
                    stroke="#6366f1"
                    fill="url(#colorGridImport)"
                    name="From Grid"
                    fillOpacity={1}
                    hide={!visibleSeries.fromGrid}
                  />
                  <Area
                    type="monotone"
                    dataKey="discharge"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    name="Batt Discharge"
                    fillOpacity={0.6}
                    hide={!visibleSeries.discharge}
                  />

                  {/* Negative Flows */}
                  <Area
                    type="monotone"
                    dataKey="consumption"
                    stroke="#ef4444"
                    fill="url(#colorConsumption)"
                    name="Consumption"
                    fillOpacity={1}
                    hide={!visibleSeries.consumption}
                  />
                  <Area
                    type="monotone"
                    dataKey="toGrid"
                    stroke="#10b981"
                    fill="url(#colorGridExport)"
                    name="To Grid"
                    fillOpacity={1}
                    hide={!visibleSeries.toGrid}
                  />
                  <Area
                    type="monotone"
                    dataKey="charge"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    name="Batt Charge"
                    fillOpacity={0.6}
                    hide={!visibleSeries.charge}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* SOC Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Battery State of Charge (SOC)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={socData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="time"
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                    domain={[0, 100]}
                    label={{ value: '%', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="soc"
                    stroke="#4f46e5"
                    name="SOC %"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Topology Section */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>System Topology</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <SystemTopology
                solarPower={currentSolar}
                batteryPower={netBattery}
                gridPower={netGrid}
                homeConsumption={currentConsumption}
                batterySoc={Math.round(currentSoc)}
              />
            </CardContent>
          </Card>
        </div>
      </div>


      {/* Environmental & Economic Benefits */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Environmental & Economic Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cost Savings</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">$1,247</p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Leaf className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">CO₂ Reduction</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">3.2 tons</p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TreeDeciduous className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Trees Planted Eq.</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">156</p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Solar Yield</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">842 kWh</p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Devices Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Devices</CardTitle>
        </CardHeader>
        <CardContent>
          {devices.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No devices found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                      Name
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                      Role
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                      Status
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                      Health
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {devices.map((device) => (
                    <tr key={device.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <button
                          onClick={() => navigate(`/devices/${device.id}`)}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          {device.name}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <RoleBadge role={device.role} />
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            device.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {device.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <HealthBadge lastSeenAt={device.last_seen_at} status={device.status} />
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/devices/${device.id}`)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Price Signals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Price Signals</CardTitle>
        </CardHeader>
        <CardContent>
          {recentPrices.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No price signals found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                      Effective At
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                      Price
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                      Source
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentPrices.map((price: any) => (
                    <tr key={price.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {format(new Date(price.effective_at), "MMM dd, yyyy HH:mm")}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        ${price.price.toFixed(4)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-gray-100 text-gray-800">
                          {price.source === "manual"
                            ? "Manual"
                            : price.source === "schedule_generator"
                              ? "Schedule Generator"
                              : price.source === "api_import"
                                ? "API Import"
                                : "CSV Import"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      </TabsContent>

      <TabsContent value="devices">
        <Devices plantId={plantId} showHeader={false} />
      </TabsContent>

      <TabsContent value="alerts">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20 text-gray-500">
            <AlertTriangle className="h-16 w-16 mb-4 text-gray-300" />
            <p className="text-xl font-medium">No Data Available</p>
            <p className="text-sm mt-2">There are no active alerts for this plant.</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="info">
        <PlantInfo plantId={plantId || ""} />
      </TabsContent>
      </Tabs>
    </div>
  );
}