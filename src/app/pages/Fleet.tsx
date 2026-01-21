import { PageHeader } from "@/app/components/PageHeader";
import { mockPlants, mockDevices } from "@/app/data/mockData";
import { Card, CardContent } from "@/app/components/ui/card";
import { StatusBadge } from "@/app/components/StatusBadge";
import { RoleBadge } from "@/app/components/RoleBadge";

export function Fleet() {
  // Calculate plant breakdowns
  const plantBreakdowns = mockPlants.map((plant) => {
    const devices = mockDevices.filter((d) => d.plant_id === plant.id);
    const active = devices.filter((d) => d.status === "active").length;
    const totalPower = devices.reduce((sum, d) => sum + (d.power_kw || 0), 0);
    
    const charging = devices.filter((d) => d.effective_status === "CHARGING").length;
    const discharging = devices.filter((d) => d.effective_status === "DISCHARGING").length;
    const neutral = devices.filter((d) => d.effective_status === "NEUTRAL").length;

    return {
      plant,
      deviceCount: devices.length,
      active,
      totalPower,
      decisions: { charging, discharging, neutral },
    };
  });

  // Calculate device groups
  const deviceGroups = mockDevices
    .filter((d) => d.role === "master")
    .map((master) => {
      const plant = mockPlants.find((p) => p.id === master.plant_id);
      const slaves = mockDevices.filter((d) => d.master_device_id === master.id);
      const totalPower = (master.power_kw || 0) + slaves.reduce((sum, s) => sum + (s.power_kw || 0), 0);

      return {
        master,
        plant,
        slaveCount: slaves.length,
        totalPower,
      };
    });

  return (
    <div>
      <PageHeader
        title="Fleet"
        description="Aggregated metrics and insights"
      />

      {/* Plant Breakdown */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Plant Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Plant
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Timezone
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Devices
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Active
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Power (kW)
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Decisions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {plantBreakdowns.map(({ plant, deviceCount, active, totalPower, decisions }) => (
                  <tr key={plant.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{plant.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{plant.timezone}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{deviceCount}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{active}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{totalPower.toFixed(1)} kW</td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {decisions.charging}C {decisions.discharging}D {decisions.neutral}N
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Device Groups */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Device Groups</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Master Device
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Plant
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Role
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Slaves
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Power (kW)
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Decision
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {deviceGroups.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No device groups found
                    </td>
                  </tr>
                ) : (
                  deviceGroups.map(({ master, plant, slaveCount, totalPower }) => (
                    <tr key={master.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{master.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{plant?.name}</td>
                      <td className="py-3 px-4">
                        <RoleBadge role={master.role} />
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{slaveCount}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{totalPower.toFixed(1)} kW</td>
                      <td className="py-3 px-4">
                        <StatusBadge
                          decision={master.decision}
                          effectiveStatus={master.effective_status}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
