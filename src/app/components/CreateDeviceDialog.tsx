import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { CreateDeviceRequest, Device } from "@/app/types/api/Devices.types";
import { createDevice, updateDevice } from "@/app/api/devices.api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteId?: string; // Pre-select site if provided
  deviceToEdit?: Device | null;
  onSuccess?: (device: Device) => void;
}

export function CreateDeviceDialog({ 
  open, 
  onOpenChange, 
  siteId, 
  deviceToEdit, 
  onSuccess 
}: CreateDeviceDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateDeviceRequest>({
    site: siteId || "",
    name: "",
    serial_number: "",
    role: "standalone",
    status: "inactive",
  });

  useEffect(() => {
    if (deviceToEdit) {
      setFormData({
        site: deviceToEdit.site,
        name: deviceToEdit.name,
        serial_number: deviceToEdit.serial_number,
        role: deviceToEdit.role,
        status: deviceToEdit.status,
      });
    } else {
      // Reset form when creating new
      setFormData({
        site: siteId || "",
        name: "",
        serial_number: "",
        role: "standalone",
        status: "inactive",
      });
    }
  }, [deviceToEdit, siteId, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result: Device;
      if (deviceToEdit) {
        result = await updateDevice(deviceToEdit.id, formData);
        toast.success("Device updated successfully");
      } else {
        result = await createDevice(formData);
        toast.success("Device created successfully");
      }
      onSuccess?.(result);
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to save device:", error);
      toast.error(error.response?.data?.message || "Failed to save device");
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!deviceToEdit;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Device" : "Create New Device"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update device details."
              : "Add a new device to your plant. Fill in the required information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
                placeholder="e.g. Inverter 1"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serial_number" className="text-right">
                Serial Number
              </Label>
              <Input
                id="serial_number"
                value={formData.serial_number}
                onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                className="col-span-3"
                placeholder="e.g. SN12345678"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="master">Master</SelectItem>
                  <SelectItem value="slave">Slave</SelectItem>
                  <SelectItem value="standalone">Standalone</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Hidden field for site if we are in a context where site is pre-determined */}
            {siteId && <input type="hidden" name="site" value={siteId} />}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Device" : "Create Device"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
