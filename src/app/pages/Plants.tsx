import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/app/components/PageHeader";
import { mockPlants, mockDevices } from "@/app/data/mockData";
import { useApp } from "@/app/context/AppContext";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Building2, Edit, Eye, Loader2 } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { CreateSiteDialog } from "@/app/components/CreateSiteDialog";
import { Site } from "@/app/types/api/Sites.types";
import { sitesApi } from "@/app/api";
import { toast } from "sonner";

export function Plants() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [plants, setPlants] = useState<Site[]>([]);

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    setIsLoading(true);
    try {
      const response = await sitesApi.getSites();
      // Handle different response structures (array vs paginated object)
      const data = Array.isArray(response) ? response : (response as any).results || [];
      
      if (Array.isArray(data)) {
        setPlants(data);
      } else {
        console.error("Unexpected API response format:", response);
        setPlants([]);
        toast.error("Received invalid data format from server");
      }
    } catch (error) {
      console.error("Failed to fetch plants:", error);
      // Fallback to mock data if API fails
      toast.error("Failed to load plants from API. Using local data.");
      
      const initialPlants = mockPlants.map(p => ({
        ...p,
        id: p.id, // Keep original ID (string)
        country: "US", // Default for mock
        state: "NY", // Default for mock
        uses_dynamic_tariff: false,
        device_count: 0,
        updated_at: new Date().toISOString()
      })) as unknown as Site[];
      
      setPlants(initialPlants);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateClick = () => {
    setEditingSite(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (plant: Site) => {
    setEditingSite(plant);
    setIsDialogOpen(true);
  };

  const handleSaveSuccess = (savedSite: Site) => {
    setPlants(prev => {
      const exists = prev.find(p => p.id === savedSite.id);
      if (exists) {
        return prev.map(p => p.id === savedSite.id ? savedSite : p);
      }
      return [...prev, savedSite];
    });
  };

  const getPlantDeviceCount = (plantId: string | number) => {
    const devices = mockDevices.filter((d) => d.plant_id === plantId.toString());
    const masters = devices.filter((d) => d.role === "master").length;
    const slaves = devices.filter((d) => d.role === "slave").length;
    const standalone = devices.filter((d) => d.role === "standalone").length;
    return { total: devices.length, masters, slaves, standalone };
  };

  const getPlantStatus = (plantId: string | number) => {
    const devices = mockDevices.filter((d) => d.plant_id === plantId.toString());
    if (devices.length === 0) return "No Devices";

    const onlineDevices = devices.filter(
      (d) =>
        d.status === "active" &&
        d.last_seen_at &&
        new Date(d.last_seen_at).getTime() > Date.now() - 30 * 60 * 1000
    );

    if (onlineDevices.length === devices.length) return "Healthy";
    if (onlineDevices.length > 0) return "Degraded";
    return "Offline";
  };

  const getPlantDecisions = (plantId: string | number) => {
    const devices = mockDevices.filter((d) => d.plant_id === plantId.toString());
    const charging = devices.filter((d) => d.effective_status === "CHARGING").length;
    const discharging = devices.filter((d) => d.effective_status === "DISCHARGING").length;
    const neutral = devices.filter((d) => d.effective_status === "NEUTRAL").length;
    return { charging, discharging, neutral };
  };

  return (
    <div>
      <PageHeader
        title="Plants"
        description="Manage your plants and locations"
        action={
          user.canModify && (
            <Button onClick={handleCreateClick}>
              <Building2 className="h-4 w-4 mr-2" />
              Create Plant
            </Button>
          )
        }
      />

      <Card>
        <CardContent className="pt-6">
          {/* Search */}
          <div className="mb-4">
            <Input
              placeholder="Search plants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : (
              <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Name
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Timezone
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Tariff Zone
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Devices
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Decision
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPlants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900">No plants found</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Get started by creating your first plant
                      </p>
                      {user.canModify && (
                        <Button className="mt-4" onClick={handleCreateClick}>Create Plant</Button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredPlants.map((plant) => {
                    const deviceCount = getPlantDeviceCount(plant.id);
                    const status = getPlantStatus(plant.id);
                    const decisions = getPlantDecisions(plant.id);

                    return (
                      <tr key={plant.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <button
                            onClick={() => navigate(`/plants/${plant.id}`)}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                          >
                            {plant.name}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{plant.timezone}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {plant.tariff_zone || "-"}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {deviceCount.total} ({deviceCount.masters} Master, {deviceCount.slaves}{" "}
                          Slave, {deviceCount.standalone} Standalone)
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            className={
                              status === "Healthy"
                                ? "bg-green-100 text-green-800"
                                : status === "Degraded"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : status === "Offline"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                            }
                          >
                            {status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {decisions.charging}C {decisions.discharging}D {decisions.neutral}N
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/plants/${plant.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {user.canModify && (
                              <Button variant="ghost" size="sm" onClick={() => handleEditClick(plant)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
          )}
              </tbody>
            </table>
            )}
          </div>
        </CardContent>
      </Card>
      
      <CreateSiteDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        siteToEdit={editingSite}
        onSuccess={handleSaveSuccess}
      />
    </div>
  );
}
