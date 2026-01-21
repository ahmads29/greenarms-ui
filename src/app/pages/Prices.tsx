import { useState } from "react";
import { PageHeader } from "@/app/components/PageHeader";
import { ScopeBadge } from "@/app/components/ScopeBadge";
import { mockPrices, mockPlants, mockDevices } from "@/app/data/mockData";
import { useApp } from "@/app/context/AppContext";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { DollarSign, Plus } from "lucide-react";
import { format } from "date-fns";

export function Prices() {
  const { user } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPrices = mockPrices.filter((price) => {
    const searchLower = searchQuery.toLowerCase();
    const plant = price.plant_id ? mockPlants.find((p) => p.id === price.plant_id) : null;
    const device = price.device_id ? mockDevices.find((d) => d.id === price.device_id) : null;
    
    return (
      price.scope.toLowerCase().includes(searchLower) ||
      plant?.name.toLowerCase().includes(searchLower) ||
      device?.name.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div>
      <PageHeader
        title="Prices"
        description="Price signals and market data"
        action={
          user.canModify && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Price Signal
            </Button>
          )
        }
      />

      <Card>
        <CardContent className="pt-6">
          {/* Search */}
          <div className="mb-4">
            <Input
              placeholder="Search prices..."
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
                    Effective At
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Plant
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Scope
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Device
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Price
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPrices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900">No prices found</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Get started by creating your first price signal
                      </p>
                      {user.canModify && (
                        <Button className="mt-4">Create Price Signal</Button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredPrices.map((price) => {
                    const plant = price.plant_id ? mockPlants.find((p) => p.id === price.plant_id) : null;
                    const device = price.device_id ? mockDevices.find((d) => d.id === price.device_id) : null;

                    return (
                      <tr key={price.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {format(new Date(price.effective_at), "MMM dd, yyyy HH:mm")}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{plant?.name || "-"}</td>
                        <td className="py-3 px-4">
                          <ScopeBadge scope={price.scope} />
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{device?.name || "-"}</td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                          ${price.price.toFixed(4)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            className={
                              price.status === "dispatched"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {price.status.charAt(0).toUpperCase() + price.status.slice(1)}
                          </Badge>
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
