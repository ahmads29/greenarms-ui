import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/app/components/PageHeader";
import { StatusBadge } from "@/app/components/StatusBadge";
import { HealthBadge } from "@/app/components/HealthBadge";
import { RoleBadge } from "@/app/components/RoleBadge";
import { mockDevices, mockPlants, mockDispatchLogs } from "@/app/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { ArrowLeft, Activity, Zap, Battery, Users, Loader2 } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { getDeviceDetails, getDeviceGroupInfo } from "@/app/api/devices.api";
import { Device, DeviceGroupInfo } from "@/app/types/api/Devices.types";
import { toast } from "sonner";

export function DeviceDetail() {
  const { id: deviceId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [device, setDevice] = useState<Device | null>(null);
  const [groupInfo, setGroupInfo] = useState<DeviceGroupInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!deviceId) return;
      setLoading(true);
      try {
        const deviceData = await getDeviceDetails(deviceId);
        setDevice(deviceData);
        
        try {
          const groupData = await getDeviceGroupInfo(deviceId);
          setGroupInfo(groupData);
        } catch (error) {
          console.error("Failed to fetch group info:", error);
          // Don't fail the whole page if group info fails, just log it
        }
      } catch (error) {
        console.error("Failed to fetch device details:", error);
        toast.error("Failed to load device details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [deviceId]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!device) {
    return (
      <div>
        <PageHeader title="Device Not Found" />
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">The device you're looking for doesn't exist.</p>
            <Button className="mt-4" onClick={() => navigate("/devices")}>
              Back to Devices
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Use group info members if available, otherwise fallback to finding in mock data (or just empty if we want to be strict)
  // For now, let's rely on groupInfo.group_members if we have them.
  const groupMembers = groupInfo?.group_members || [];
  
  // Identify master/slave relationships from group info
  const masterDevice = device.role === 'slave' 
    ? groupMembers.find(d => d.role === 'master') 
    : null;
    
  const slaveDevices = device.role === 'master'
    ? groupMembers.filter(d => d.role === 'slave')
    : [];

  const deviceLogs = mockDispatchLogs
    .filter((l) => l.device_id === deviceId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  return (
    <div>
      <PageHeader
        title={device.name}
        description={`Serial: ${device.serial_number} | Plant: ${device.site_name}`}
        action={
          <Button variant="outline" onClick={() => navigate("/devices")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Devices
          </Button>
        }
      />

      {/* Top Badges */}
      <div className="flex items-center gap-3 mb-6">
        <RoleBadge role={device.role} />
        {device.role === "slave" && masterDevice && (
          <span className="text-sm text-gray-500">Slave of {masterDevice.name}</span>
        )}
        {device.role === "master" && slaveDevices.length > 0 && (
          <span className="text-sm text-gray-500">{slaveDevices.length} slave devices</span>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="group-info">Group Info</TabsTrigger>
          <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
          <TabsTrigger value="decisions">Decisions</TabsTrigger>
          <TabsTrigger value="dispatch-logs">Dispatch Logs</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="mt-2">
                      <HealthBadge lastSeenAt={device.last_seen_at} status={device.status} />
                    </div>
                  </div>
                  <Activity className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Power</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {/* device.power_kw is not in the type definition yet, using a safe access or placeholder if needed. 
                          The provided JSON doesn't show power_kw. I'll comment it out or handle it safely. 
                          Checking type definition: Device interface doesn't have power_kw. 
                          But the original code used it. I will assume it might come from telemetry later or mock had it.
                          For now let's use a placeholder or check if it exists in 'device' as any.
                      */}
                      {(device as any).power_kw !== undefined ? `${(device as any).power_kw.toFixed(1)} kW` : "-"}
                    </p>
                  </div>
                  <Zap className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">SOC</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {/* Similar to power_kw, checking if soc_percent exists or use generic access */}
                      {(device as any).soc_percent !== undefined ? `${(device as any).soc_percent}%` : "-"}
                    </p>
                  </div>
                  <Battery className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div>
                  <p className="text-sm text-gray-500">Last Seen</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {device.last_seen_at
                      ? formatDistanceToNow(new Date(device.last_seen_at), { addSuffix: true })
                      : "Never"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Latest Decision */}
          <Card>
            <CardHeader>
              <CardTitle>Latest Decision Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <StatusBadge
                  decision={device.latest_decision?.decision || "idle"}
                  effectiveStatus={device.status}
                />
                <span className="text-sm text-gray-500">
                  {device.last_seen_at
                    ? format(new Date(device.last_seen_at), "MMM dd, yyyy HH:mm:ss")
                    : "No data"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Device Info */}
          <Card>
            <CardHeader>
              <CardTitle>Device Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Plant</dt>
                  <dd className="text-sm font-medium text-gray-900 mt-1">{device.site_name}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Serial Number</dt>
                  <dd className="text-sm font-medium text-gray-900 mt-1">
                    {device.serial_number}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Firmware Version</dt>
                  <dd className="text-sm font-medium text-gray-900 mt-1">
                    {device.firmware_version || "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">SDK Device ID</dt>
                  <dd className="text-sm font-medium text-gray-900 mt-1">
                    {device.sdk_device_id || "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Commissioning Status</dt>
                  <dd className="mt-1">
                    <Badge className="bg-green-100 text-green-800 capitalize">
                      {device.commissioning_status || "Unknown"}
                    </Badge>
                  </dd>
                </div>
                {device.commissioned_at && (
                  <div>
                    <dt className="text-sm text-gray-500">Commissioned At</dt>
                    <dd className="text-sm font-medium text-gray-900 mt-1">
                      {format(new Date(device.commissioned_at), "MMM dd, yyyy HH:mm")}
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Slave Devices (if master) */}
          {device.role === "master" && slaveDevices.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Slave Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {slaveDevices.map((slave) => (
                    <div
                      key={slave.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{slave.name}</p>
                        <p className="text-xs text-gray-500">{slave.serial_number}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/devices/${slave.id}`)}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Group Info Tab */}
        <TabsContent value="group-info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Group Information</CardTitle>
            </CardHeader>
            <CardContent>
              {groupMembers.length === 0 ? (
                 <div className="text-center py-12">
                   <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                   <p className="text-gray-500">No group members found.</p>
                 </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupMembers.map((member) => (
                      <div key={member.id} className={`p-4 rounded-lg border ${member.id === device.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'}`}>
                         <div className="flex justify-between items-start mb-2">
                           <div>
                             <h4 className="font-medium text-gray-900">{member.name}</h4>
                             <p className="text-xs text-gray-500">{member.serial_number}</p>
                           </div>
                           <RoleBadge role={member.role} />
                         </div>
                         <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                            <Badge variant={member.status === 'active' ? 'default' : 'secondary'} className={member.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}>
                              {member.status}
                            </Badge>
                            {member.id !== device.id && (
                              <Button size="sm" variant="ghost" onClick={() => navigate(`/devices/${member.id}`)}>
                                View
                              </Button>
                            )}
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Telemetry Tab */}
        <TabsContent value="telemetry">
          <Card>
            <CardHeader>
              <CardTitle>Telemetry Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-12 text-gray-500">
                No telemetry samples available yet.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Decisions Tab */}
        <TabsContent value="decisions">
          <Card>
            <CardHeader>
              <CardTitle>Decision History</CardTitle>
            </CardHeader>
            <CardContent>
              {device.role === "slave" ? (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    This device is a slave. Decision status is inherited from master device{" "}
                    {masterDevice?.name}.
                  </p>
                </div>
              ) : null}
              <p className="text-center py-12 text-gray-500">No decision history available.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dispatch Logs Tab */}
        <TabsContent value="dispatch-logs">
          <Card>
            <CardHeader>
              <CardTitle>Dispatch Logs</CardTitle>
            </CardHeader>
            <CardContent>
              {deviceLogs.length === 0 ? (
                <p className="text-center py-12 text-gray-500">No dispatch logs found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                          Time
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                          Price
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                          Result
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                          Error
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {deviceLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {format(new Date(log.timestamp), "MMM dd, HH:mm:ss")}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {log.price !== null ? `$${log.price.toFixed(4)}` : "-"}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              className={
                                log.result === "success"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {log.result.charAt(0).toUpperCase() + log.result.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-red-600">{log.error || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
