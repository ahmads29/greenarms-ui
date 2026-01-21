import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { mockPlants } from "@/app/data/mockData";
import { Pencil, Camera, Upload, Trash2, MapPin, Globe } from "lucide-react";

interface PlantInfoProps {
    plantId: string;
}

export function PlantInfo({ plantId }: PlantInfoProps) {
    const plant = mockPlants.find((p: { id: string }) => p.id === plantId);

    if (!plant) return <div>Plant not found</div>;

    // Enriched mock data since we don't have all fields in the basic mock
    const enrichedPlant = {
        ...plant,
        address: "Bechmezzine",
        creationDate: "2022/10/24",
        location: "Longitude :35°48'22.84\" Latitude :34°19'4.93\"",
        plantType: "Residential",
        systemType: "PV + Grid + Consumption + Battery",
        azimuth: "15 °",
        tiltAngle: "15 °",
        onGridDate: "2022/10/24",
        onGridStatus: "On-grid",
        runningDays: "1185Day(s)",
        currency: "USD",
        unitPrice: "0.42 USD/kWh",
        totalCost: "44 kUSD",
        plantManager: "GREEN ARMS SARL (Business)",
        managerName: "Bernard Ammoun",
        managerEmail: "bammoun@gmail.com",
        contactPerson: "Bernard",
        phone: "70850525",
        businessName: "Green Arms"
    };

    const InfoRow = ({ label, value }: { label: string, value: string | number }) => (
        <div className="flex justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-2 rounded-sm transition-colors">
            <span className="text-gray-500 text-sm">{label}</span>
            <span className="text-gray-900 text-sm font-medium text-right">{value}</span>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">Plant Info</h2>
                <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Cover Image */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 uppercase">Cover</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group">
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400">
                                    <Camera className="w-12 h-12 opacity-50" />
                                </div>
                                {/* Overlay Actions */}
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="sm" className="text-white hover:text-blue-200 hover:bg-transparent">
                                        <Upload className="w-4 h-4 mr-2" /> Replace
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-white hover:text-red-200 hover:bg-transparent">
                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Info */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 uppercase">System Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-0.5">
                            <InfoRow label="Plant Type" value={enrichedPlant.plantType} />
                            <InfoRow label="System Type" value={enrichedPlant.systemType} />
                            <InfoRow label="Capacity" value={`${plant.capacity_kwp || 36} kWp`} />
                            <InfoRow label="Planned Self-used Rate" value="100 %" />
                            <InfoRow label="Azimuth" value={enrichedPlant.azimuth} />
                            <InfoRow label="Tilt Angle" value={enrichedPlant.tiltAngle} />
                            <InfoRow label="On-grid Date" value={enrichedPlant.onGridDate} />
                            <InfoRow label="On-grid Status" value={enrichedPlant.onGridStatus} />
                            <InfoRow label="Accumulated running days" value={enrichedPlant.runningDays} />
                        </CardContent>
                    </Card>

                    {/* Owner Info */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 uppercase">Owner Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-0.5">
                            <InfoRow label="Contact Person" value={enrichedPlant.contactPerson} />
                            <InfoRow label="Phone" value={enrichedPlant.phone} />
                            <InfoRow label="Business Name" value={enrichedPlant.businessName} />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Basic Info */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 uppercase">Basic Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-0.5">
                            <InfoRow label="Name" value={plant.name} />
                            <InfoRow label="Address" value={enrichedPlant.address} />
                            <InfoRow label="Plants ID" value={plant.id} />
                            <InfoRow label="Creation Date" value={enrichedPlant.creationDate} />
                            <InfoRow label="Location" value={enrichedPlant.location} />
                            <InfoRow label="Time Zone" value={`(${plant.timezone}) Beirut`} />
                        </CardContent>
                    </Card>

                    {/* Yield Info */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 uppercase">Yield Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-0.5">
                            <InfoRow label="Currency" value={enrichedPlant.currency} />
                            <InfoRow label="Unit Price" value={enrichedPlant.unitPrice} />
                            <InfoRow label="Subsidy income" value="--" />
                            <InfoRow label="Total Cost" value={enrichedPlant.totalCost} />
                            <InfoRow label="Daily repayment" value="--" />
                        </CardContent>
                    </Card>

                    {/* Plant Manager Info */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 uppercase">Plant Manager Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-0.5">
                            <InfoRow label="Plant Manager" value={enrichedPlant.plantManager} />
                            <InfoRow label="Name" value={enrichedPlant.managerName} />
                            <InfoRow label="Phone Number" value="--" />
                            <InfoRow label="E-mail" value={enrichedPlant.managerEmail} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
