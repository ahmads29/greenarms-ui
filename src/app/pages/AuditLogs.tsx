import { useState } from "react";
import { PageHeader } from "@/app/components/PageHeader";
import { mockAuditLogs } from "@/app/data/mockData";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { ShieldCheck } from "lucide-react";
import { format } from "date-fns";

export function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = mockAuditLogs.filter((log) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      log.user.toLowerCase().includes(searchLower) ||
      log.action.toLowerCase().includes(searchLower) ||
      log.description.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        description="System audit trail (Admin only)"
      />

      <Card>
        <CardContent className="pt-6">
          {/* Search */}
          <div className="mb-4">
            <Input
              placeholder="Search audit logs..."
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
                    User
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Action
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Description
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <ShieldCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900">No audit logs found</p>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {format(new Date(log.timestamp), "MMM dd, yyyy HH:mm:ss")}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{log.user}</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-indigo-100 text-indigo-800">{log.action}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{log.description}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{log.ip_address}</td>
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
