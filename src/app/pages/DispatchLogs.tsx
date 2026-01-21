import { useState } from "react";
import { PageHeader } from "@/app/components/PageHeader";
import { mockDispatchLogs, mockPlants, mockDevices } from "@/app/data/mockData";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { FileText } from "lucide-react";
import { format } from "date-fns";

export function DispatchLogs() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = mockDispatchLogs.filter((log) => {
    const device = mockDevices.find((d) => d.id === log.device_id);
    const plant = mockPlants.find((p) => p.id === log.plant_id);
    const searchLower = searchQuery.toLowerCase();
    
    return (
      device?.name.toLowerCase().includes(searchLower) ||
      plant?.name.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div>
      <PageHeader
        title="Dispatch Logs"
        description="History of price dispatch operations"
      />

      <Card>
        <CardContent className="pt-6">
          {/* Search */}
          <div className="mb-4">
            <Input
              placeholder="Search dispatch logs..."
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
                    Time
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Plant
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Device
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Price
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Result
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Acknowledged
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Error
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900">No dispatch logs found</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Dispatch logs will appear here after price dispatches
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => {
                    const plant = mockPlants.find((p) => p.id === log.plant_id);
                    const device = mockDevices.find((d) => d.id === log.device_id);

                    return (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {format(new Date(log.timestamp), "MMM dd, HH:mm:ss")}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{plant?.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{device?.name}</td>
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
                        <td className="py-3 px-4">
                          <Badge
                            className={
                              log.acknowledged
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {log.acknowledged ? "Yes" : "No"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-red-600">{log.error || "-"}</td>
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
