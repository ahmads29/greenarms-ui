import { useState, useEffect } from "react";
import { PageHeader } from "@/app/components/PageHeader";
import { StatusBadge } from "@/app/components/StatusBadge";
import { HealthBadge } from "@/app/components/HealthBadge";
import { RoleBadge } from "@/app/components/RoleBadge";
import { mockDevices, mockPlants, mockAlarms } from "@/app/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Building2, Settings, Wifi, WifiOff, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  fetchProductionMetrics,
  fetchPlantStatusMetrics,
  fetchHistoricalProduction,
  fetchPeakHourRankings,
  fetchPowerNormalizationRankings,
  type ProductionMetrics,
  type PlantStatusMetrics,
  type HistoricalProductionData,
  type PeakHourRanking,
  type PowerNormalizationRanking,
} from "@/app/api/dashboardApi";
import { getDashboardOverview } from "@/app/api/dashboard.api";
import { DashboardOverview } from "@/app/types/api/Dashboard.types";
import { Server, Activity, AlertTriangle, Layers } from "lucide-react";

export function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState("2026/01");
  const [viewMode, setViewMode] = useState<"Month" | "Year">("Month");
  
  // API data states
  const [overviewData, setOverviewData] = useState<DashboardOverview | null>(null);
  const [productionMetrics, setProductionMetrics] = useState<ProductionMetrics | null>(null);
  const [plantStatus, setPlantStatus] = useState<PlantStatusMetrics | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalProductionData[]>([]);
  const [peakHourRankings, setPeakHourRankings] = useState<PeakHourRanking[]>([]);
  const [powerNormalizationRankings, setPowerNormalizationRankings] = useState<PowerNormalizationRanking[]>([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all dashboard data
  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      try {
        // Fetch real overview data independently to not block mock data if it fails
        try {
          const overview = await getDashboardOverview();
          setOverviewData(overview);
        } catch (err) {
          console.error("Failed to fetch dashboard overview:", err);
        }

        const [metrics, status, historical, peakRankings, powerRankings] = await Promise.all([
          fetchProductionMetrics(),
          fetchPlantStatusMetrics(),
          fetchHistoricalProduction(selectedMonth, viewMode),
          fetchPeakHourRankings(),
          fetchPowerNormalizationRankings(),
        ]);

        setProductionMetrics(metrics);
        setPlantStatus(status);
        setHistoricalData(historical);
        setPeakHourRankings(peakRankings);
        setPowerNormalizationRankings(powerRankings);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, [selectedMonth, viewMode]);

  // Show loading state
  if (isLoading || !productionMetrics || !plantStatus) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-sm text-gray-500">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="Dashboard"
          description=""
        />
        <Button variant="outline" size="sm">
          Customize
        </Button>
      </div>

      {/* Production Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Production Overview</CardTitle>
              <p className="text-xs text-gray-500">
                Updated: {new Date().toLocaleString('en-US', { 
                  year: 'numeric', 
                  month: '2-digit', 
                  day: '2-digit', 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false 
                })} UTC +03:00
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-8">
              {/* Circular Progress */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#4F46E5"
                      strokeWidth="8"
                      strokeDasharray={`${parseFloat(productionMetrics.capacityUtilization) * 2.827} 282.7`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{productionMetrics.capacityUtilization}%</span>
                  </div>
                </div>
              </div>

              {/* Production Stats */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Total Production Power</p>
                  <p className="text-2xl font-bold text-gray-900">{productionMetrics.totalProductionPower.toFixed(2)} kW</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Installed Capacity</p>
                  <p className="text-lg font-semibold text-gray-900">{(productionMetrics.installedCapacity / 1000).toFixed(2)} MWp</p>
                </div>
              </div>
            </div>

            {/* Additional Metrics Grid */}
            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Daily Solar Production</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{productionMetrics.dailySolarProduction} kWh</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Monthly Solar Production</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{productionMetrics.monthlySolarProduction} MWh</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Yearly Solar Production</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{productionMetrics.yearlySolarProduction} MWh</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Total Production</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{productionMetrics.totalProduction} GWh</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Historical Production */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Historical Production</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "Month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("Month")}
                >
                  Month
                </Button>
                <Button
                  variant={viewMode === "Year" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("Year")}
                >
                  Year
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium px-2">{selectedMonth}</span>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Monthly Solar Production: {productionMetrics.monthlySolarProduction} MWh
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={historicalData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 11 }}
                  interval={2}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="production" fill="#3B82F6" name="Daily Solar Production" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Device Status (Real Data) */}
      {overviewData && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Device Status</CardTitle>
              <Badge variant={overviewData.has_devices ? "default" : "secondary"}>
                {overviewData.has_devices ? "System Active" : "No Devices"}
              </Badge>
            </div>
            <p className="text-xs text-gray-500">
              Last Updated: {new Date(overviewData.data_freshness).toLocaleString()}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <Server className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Total Devices</p>
                  <p className="text-2xl font-bold text-gray-900">{overviewData.total_devices}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium tracking-wide uppercase">Active</p>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <p className="text-2xl font-bold text-gray-900">{overviewData.active_devices}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium tracking-wide uppercase">Roles</p>
                <div className="flex flex-col text-sm">
                  <span className="text-gray-700">Master: <span className="font-semibold">{overviewData.master_devices}</span></span>
                  <span className="text-gray-700">Slave: <span className="font-semibold">{overviewData.slave_devices}</span></span>
                  <span className="text-gray-700">Standalone: <span className="font-semibold">{overviewData.standalone_devices}</span></span>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium tracking-wide uppercase">Groups</p>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-blue-500" />
                  <p className="text-2xl font-bold text-gray-900">{overviewData.device_groups}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium tracking-wide uppercase">Recent Errors (24h)</p>
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`h-4 w-4 ${overviewData.recent_errors_24h > 0 ? 'text-red-500' : 'text-gray-300'}`} />
                  <p className={`text-2xl font-bold ${overviewData.recent_errors_24h > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    {overviewData.recent_errors_24h}
                  </p>
                </div>
              </div>
              
              <div>
                 <p className="text-xs text-gray-500 mb-2 font-medium tracking-wide uppercase">Last Dispatch</p>
                 <p className="text-sm font-medium text-gray-900">
                    {overviewData.last_dispatch_time 
                      ? new Date(overviewData.last_dispatch_time).toLocaleTimeString() 
                      : "None"}
                 </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plant Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Plant Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Total Plants</p>
                <p className="text-2xl font-bold text-gray-900">{plantStatus.totalPlants}</p>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium tracking-wide uppercase">Incomplete Plants</p>
              <p className="text-2xl font-bold text-gray-900">{plantStatus.incompletePlants}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium tracking-wide uppercase">Offline Plants</p>
              <p className="text-2xl font-bold text-gray-900">{plantStatus.offlinePlants}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium tracking-wide uppercase">Partially Offline Plants</p>
              <p className="text-2xl font-bold text-gray-900">{plantStatus.partiallyOfflinePlants}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium tracking-wide uppercase">Plants with Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{plantStatus.plantsWithAlerts}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Peak Hour Rankings */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Peak Hour Rankings</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Top plants by peak hour production</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Rank
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Plant
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Address
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    kWh
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {peakHourRankings.map((plant, index) => (
                  <tr key={plant.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-700">{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-medium text-gray-900">{plant.name}</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{plant.address}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{plant.kwh.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Power Normalization Rankings */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Power Normalization Rankings</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Top plants by power normalization</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Rank
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Plant
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {powerNormalizationRankings.map((plant, index) => (
                  <tr key={plant.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-700">{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-medium text-gray-900">{plant.name}</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{plant.percentage.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}