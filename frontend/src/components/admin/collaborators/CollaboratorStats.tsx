import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  ScanLine,
  AlertOctagon,
} from "lucide-react";
import type { CollaboratorStats as StatsType } from "@/types/collaborator";

interface Props {
  stats: StatsType;
}

export default function CollaboratorStats({ stats }: Props) {
  const {
    total,
    active,
    inactive,
    suspended,
    admins,
    scanners,
  } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <div>
            <CardDescription>Total</CardDescription>
            <CardTitle className="text-2xl">{total}</CardTitle>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <UserCheck className="h-6 w-6 text-green-600" />
          <div>
            <CardDescription>Ativos</CardDescription>
            <CardTitle className="text-2xl">{active}</CardTitle>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-blue-600" />
          <div>
            <CardDescription>Gerentes</CardDescription>
            <CardTitle className="text-2xl">{admins}</CardTitle>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <ScanLine className="h-6 w-6 text-purple-600" />
          <div>
            <CardDescription>Colaboradores</CardDescription>
            <CardTitle className="text-2xl">{scanners}</CardTitle>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <UserX className="h-6 w-6 text-gray-500" />
          <div>
            <CardDescription>Inativos</CardDescription>
            <CardTitle className="text-2xl">{inactive}</CardTitle>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <AlertOctagon className="h-6 w-6 text-red-600" />
          <div>
            <CardDescription>Suspensos</CardDescription>
            <CardTitle className="text-2xl">{suspended}</CardTitle>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
