import { useState } from "react";
import { PageHeader } from "@/app/components/PageHeader";
import { mockSchedules, mockPlants, mockDevices } from "@/app/data/mockData";
import { useApp } from "@/app/context/AppContext";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Calendar, Plus, Eye } from "lucide-react";
import { format } from "date-fns";

export function Schedules() {
  const { user, navigateTo } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSchedules = mockSchedules.filter((schedule) => {
    const searchLower = searchQuery.toLowerCase();
    return schedule.effective_date.toLowerCase().includes(searchLower);
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      validated: "bg-blue-100 text-blue-800",
      dispatched: "bg-green-100 text-green-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div>
      <PageHeader
        title="Schedules"
        description="Day-ahead price schedules"
        action={
          user.canModify && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Generate Schedule
            </Button>
          )
        }
      />

      <Card>
        <CardContent className="pt-6">
          {/* Search */}
          <div className="mb-4">
            <Input
              placeholder="Search schedules..."
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
                    Effective Date
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Scope Type
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Plant
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Device
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Timezone
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Version
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Completeness
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSchedules.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900">No schedules found</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Get started by generating your first schedule
                      </p>
                      {user.canModify && (
                        <Button className="mt-4">Generate Schedule</Button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredSchedules.map((schedule) => {
                    const plant = schedule.plant_id ? mockPlants.find((p) => p.id === schedule.plant_id) : null;
                    const device = schedule.device_id ? mockDevices.find((d) => d.id === schedule.device_id) : null;

                    return (
                      <tr key={schedule.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {format(new Date(schedule.effective_date), "MMM dd, yyyy")}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            className={
                              schedule.scope_type === "global"
                                ? "bg-orange-100 text-orange-800"
                                : schedule.scope_type === "plant"
                                ? "bg-green-100 text-green-800"
                                : "bg-indigo-100 text-indigo-800"
                            }
                          >
                            {schedule.scope_type.charAt(0).toUpperCase() + schedule.scope_type.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{plant?.name || "-"}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{device?.name || "-"}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{schedule.timezone}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          v{schedule.version}
                          {schedule.is_active && (
                            <Badge className="ml-2 bg-blue-100 text-blue-800">Active</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusBadge(schedule.status)}>
                            {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {schedule.completeness}/96
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigateTo(`schedules/${schedule.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
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
