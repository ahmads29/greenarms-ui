import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/app/components/PageHeader";
import { StatusBadge } from "@/app/components/StatusBadge";
import { HealthBadge } from "@/app/components/HealthBadge";
import { RoleBadge } from "@/app/components/RoleBadge";
import { mockPlants } from "@/app/data/mockData"; // Keep for plant name fallback if needed
import { useApp } from "@/app/context/AppContext";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Settings, Edit, Eye, Plus, Play, Loader2, Trash2 } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { getDevices, deleteDevice } from "@/app/api/devices.api";
import { Device } from "@/app/types/api/Devices.types";
import { CreateDeviceDialog } from "@/app/components/CreateDeviceDialog";
import { toast } from "sonner";
import { sitesApi } from "@/app/api";

interface DevicesProps {
  plantId?: string;
  showHeader?: boolean;
}

export function Devices({ plantId, showHeader = true }: DevicesProps) {
  const { user } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [plantFilter, setPlantFilter] = useState(plantId || "all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState<Device | null>(null);

  // Keep plantFilter in sync if prop changes
  useEffect(() => {
    if (plantId && plantFilter !== plantId) {
      setPlantFilter(plantId);
    }
  }, [plantId]);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      // Build query params
      const params: any = {};
      if (plantFilter !== "all") params.site = plantFilter;
      if (statusFilter !== "all") params.status = statusFilter;
      if (roleFilter !== "all") params.role = roleFilter;
      if (searchQuery) params.search = searchQuery;

      const response = await getDevices(params);
      setDevices(response.results || []);
    } catch (error) {
      console.error("Failed to fetch devices:", error);
      toast.error("Failed to load devices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [plantFilter, statusFilter, roleFilter, searchQuery]);

  const handleDeleteDevice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this device?")) return;
    try {
      await deleteDevice(id);
      toast.success("Device deleted successfully");
      fetchDevices();
    } catch (error) {
      console.error("Failed to delete device:", error);
      toast.error("Failed to delete device");
    }
  };

  const handleCreateSuccess = (device: Device) => {
    fetchDevices();
  };

  const getDeviceRoleText = (device: Device) => {
    if (device.role === "master") {
       return `Master ${device.slave_count ? `(${device.slave_count} slaves)` : ''}`;
    } else if (device.role === "slave") {
       return `Slave ${device.master_device_name ? `of ${device.master_device_name}` : ''}`;
    }
    return "Standalone";
  };

  return (
    <div>
      {showHeader && (
        <PageHeader
          title="Devices"
          description="Manage your inverter devices"
          action={
            user.canModify && (
              <div className="flex gap-2">
                <Button variant="outline">
                  <Play className="h-4 w-4 mr-2" />
                  Start Commissioning
                </Button>
                {/* Note: In global view, we might not want to allow creating device without selecting a site first. 
                    But for simplicity, we disable it or require site selection in dialog. 
                    Here we hide it if no plantId is present to avoid complexity, or open dialog with empty site. 
                    User requirement says: "from insde the plant i cant add device from here ... i can only view devices"
                    So if showHeader is true (global view), we might hide create button or show it but it requires selecting site.
                    Let's follow instruction: "i can only view devices and start commissioning" from /devices page.
                    But wait, "i should be able to add device, the devices is only added to the plant".
                    So in global /devices, maybe no create button? Or create button requires site.
                    The prompt says: "from insde the plant i cant add device from here http://localhost:9000/devices i can only view devices"
                    So I will REMOVE Create Device button from here if it is the global view.
                */}
              </div>
            )
          }
        />
      )}

      {/* Create/Edit Dialog */}
      <CreateDeviceDialog 
        open={createDialogOpen} 
        onOpenChange={(open) => {
          setCreateDialogOpen(open);
          if (!open) setDeviceToEdit(null);
        }}
        siteId={plantId}
        deviceToEdit={deviceToEdit}
        onSuccess={handleCreateSuccess}
      />

      <Card>
        <CardContent className="pt-6">
          {/* Search & Filters */}
          <div className="mb-4 flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search devices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:max-w-sm"
            />

            <div className="flex gap-2 flex-wrap">
              {!plantId && (
                <Select value={plantFilter} onValueChange={setPlantFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Plants" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plants</SelectItem>
                    {/* We should ideally fetch real plants list here, but for now using mock or just relying on text input if needed */}
                    {mockPlants.map((plant) => (
                      <SelectItem key={plant.id} value={plant.id}>
                        {plant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="master">Master</SelectItem>
                  <SelectItem value="slave">Slave</SelectItem>
                  <SelectItem value="standalone">Standalone</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Only show Create button if we are inside a plant view (plantId is present) */}
              {plantId && user.canModify && (
                 <Button onClick={() => setCreateDialogOpen(true)}>
                   <Plus className="h-4 w-4 mr-2" />
                   Add Device
                 </Button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
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
                    Plant
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Serial Number
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Status
                  </th>
                  {/* Decision column might not be in API response yet, removing or keeping if available */}
                  {/* <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Decision
                  </th> */}
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Role
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
                {devices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12">
                      <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900">No devices found</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {plantId ? "Get started by adding your first device" : "No devices available"}
                      </p>
                      {plantId && user.canModify && (
                        <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>Add Device</Button>
                      )}
                    </td>
                  </tr>
                ) : (
                  devices.map((device) => {
                    return (
                      <tr key={device.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <button
                            onClick={() => navigate(`/devices/${device.id}`)}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                          >
                            {device.name}
                          </button>
                          <div className="text-xs text-gray-500">{getDeviceRoleText(device)}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{device.site_name}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{device.serial_number}</td>
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
                        {/* <td className="py-3 px-4">
                          <StatusBadge
                            decision={device.latest_decision?.decision || "idle"}
                            effectiveStatus={device.status}
                          />
                        </td> */}
                        <td className="py-3 px-4">
                          <RoleBadge role={device.role} />
                        </td>
                        <td className="py-3 px-4">
                          <HealthBadge lastSeenAt={device.last_seen_at} status={device.status} />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/devices/${device.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {/* Only allow edit/delete if inside plant view or if user has permission. 
                                Requirement says "from insde the plant i cant add device from here ... i can only view devices"
                                It implies Global View = Read Only (except commissioning). 
                                Plant View = Full Control (Add/Edit).
                            */}
                            {user.canModify && plantId && (
                              <>
                                <Button variant="ghost" size="sm" onClick={() => {
                                  setDeviceToEdit(device);
                                  setCreateDialogOpen(true);
                                }}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteDevice(device.id)}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </>
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
    </div>
  );
}
