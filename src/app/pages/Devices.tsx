import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/app/components/PageHeader";
import { StatusBadge } from "@/app/components/StatusBadge";
import { HealthBadge } from "@/app/components/HealthBadge";
import { RoleBadge } from "@/app/components/RoleBadge";
import { mockDevices, mockPlants } from "@/app/data/mockData";
import { useApp } from "@/app/context/AppContext";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Settings, Edit, Eye, Plus, Play } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";

interface DevicesProps {
  plantId?: string;
  showHeader?: boolean;
}

export function Devices({ plantId, showHeader = true }: DevicesProps) {
  const { user } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [plantFilter, setPlantFilter] = useState(plantId || "all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  // Keep plantFilter in sync if prop changes
  if (plantId && plantFilter !== plantId) {
    setPlantFilter(plantId);
  }

  const filteredDevices = mockDevices.filter((device) => {
    const plant = mockPlants.find((p) => p.id === device.plant_id);
    const searchLower = searchQuery.toLowerCase();

    const matchesSearch =
      device.name.toLowerCase().includes(searchLower) ||
      device.serial_number.toLowerCase().includes(searchLower);

    const matchesPlant = plantFilter === "all" || device.plant_id === plantFilter;
    const matchesStatus = statusFilter === "all" || device.status === statusFilter;
    const matchesRole = roleFilter === "all" || device.role === roleFilter;

    return matchesSearch && matchesPlant && matchesStatus && matchesRole;
  });

  const getDeviceRoleText = (device: typeof mockDevices[0]) => {
    if (device.role === "master") {
      const slaves = mockDevices.filter((d) => d.master_device_id === device.id);
      return `Master (${slaves.length} slaves)`;
    } else if (device.role === "slave" && device.master_device_id) {
      const master = mockDevices.find((d) => d.id === device.master_device_id);
      return `Slave of ${master?.name || "Unknown"}`;
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
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Device
                </Button>
              </div>
            )
          }
        />
      )}

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
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
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
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Decision
                  </th>
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
                {filteredDevices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12">
                      <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900">No devices found</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Get started by creating your first device
                      </p>
                      {user.canModify && (
                        <Button className="mt-4">Create Device</Button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredDevices.map((device) => {
                    const plant = mockPlants.find((p) => p.id === device.plant_id);

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
                        <td className="py-3 px-4 text-sm text-gray-700">{plant?.name}</td>
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
                        <td className="py-3 px-4">
                          <StatusBadge
                            decision={device.decision}
                            effectiveStatus={device.effective_status}
                          />
                        </td>
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
                            {user.canModify && (
                              <Button variant="ghost" size="sm">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
