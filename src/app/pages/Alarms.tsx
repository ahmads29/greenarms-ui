import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/app/components/PageHeader";
import { mockAlarms, mockDevices } from "@/app/data/mockData";
import { useApp } from "@/app/context/AppContext";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Bell, CheckCircle } from "lucide-react";
import { format } from "date-fns";

export function Alarms() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAlarms = mockAlarms.filter((alarm) => {
    const device = mockDevices.find((d) => d.id === alarm.device_id);
    const searchLower = searchQuery.toLowerCase();
    return (
      alarm.code.toLowerCase().includes(searchLower) ||
      alarm.message.toLowerCase().includes(searchLower) ||
      device?.name.toLowerCase().includes(searchLower)
    );
  });

  const getSeverityBadge = (severity: string) => {
    const colors = {
      info: "bg-blue-100 text-blue-800",
      warning: "bg-yellow-100 text-yellow-800",
      error: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800",
    };
    return colors[severity as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      open: "bg-red-100 text-red-800",
      acknowledged: "bg-yellow-100 text-yellow-800",
      resolved: "bg-green-100 text-green-800",
      suppressed: "bg-gray-100 text-gray-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div>
      <PageHeader
        title="Alarms"
        description="Device alarms and fault monitoring"
      />

      <Card>
        <CardContent className="pt-6">
          {/* Search */}
          <div className="mb-4">
            <Input
              placeholder="Search alarms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Device
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Code
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Category
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Severity
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Occurrences
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    First Seen
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Last Seen
                  </th>
                  {user.canModify && (
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAlarms.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12">
                      <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900">No alarms found</p>
                      <p className="text-sm text-gray-500 mt-1">All systems operational</p>
                    </td>
                  </tr>
                ) : (
                  filteredAlarms.map((alarm) => {
                    const device = mockDevices.find((d) => d.id === alarm.device_id);

                    return (
                      <tr key={alarm.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <button
                            onClick={() => navigate(`/devices/${device?.id}`)}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 text-left"
                            disabled={!device}
                          >
                            {device?.name || "Unknown Device"}
                          </button>
                          <div className="text-xs text-gray-500">{device?.serial_number}</div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className="bg-gray-100 text-gray-800">{alarm.code}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className="bg-indigo-100 text-indigo-800 capitalize">
                            {alarm.category}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getSeverityBadge(alarm.severity)}>
                            {alarm.severity.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusBadge(alarm.status)}>
                            {alarm.status.charAt(0).toUpperCase() + alarm.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{alarm.occurrences}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {format(new Date(alarm.first_seen), "MMM dd, HH:mm")}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {format(new Date(alarm.last_seen), "MMM dd, HH:mm")}
                        </td>
                        {user.canModify && (
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {alarm.status === "open" && (
                                <Button variant="ghost" size="sm">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Acknowledge
                                </Button>
                              )}
                              {alarm.status === "acknowledged" && (
                                <Button variant="ghost" size="sm">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Resolve
                                </Button>
                              )}
                            </div>
                          </td>
                        )}
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
