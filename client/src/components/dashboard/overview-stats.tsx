import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Users, GraduationCap, Calendar, AlertTriangle } from "lucide-react";
import type { OverviewStats } from "@shared/schema";

export default function OverviewStatsComponent() {
  const { data: stats, isLoading } = useQuery<OverviewStats>({
    queryKey: ["/api/analytics/overview"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-slate-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-slate-500">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <p>No data available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="shadow-sm border border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Students</p>
              <p className="text-3xl font-bold text-slate-800">{stats.totalStudents}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="text-blue-600 h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">+12%</span>
            <span className="text-slate-600 ml-1">from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Average Grade</p>
              <p className="text-3xl font-bold text-slate-800">{stats.averageGrade}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-green-600 h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">+3.2%</span>
            <span className="text-slate-600 ml-1">improvement</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Attendance Rate</p>
              <p className="text-3xl font-bold text-slate-800">{stats.attendanceRate}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-amber-600 h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-600 font-medium">-1.5%</span>
            <span className="text-slate-600 ml-1">needs attention</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">At Risk Students</p>
              <p className="text-3xl font-bold text-slate-800">{stats.atRiskStudents}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-red-600 h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-600 font-medium">
              {stats.totalStudents > 0 ? ((stats.atRiskStudents / stats.totalStudents) * 100).toFixed(1) : "0"}%
            </span>
            <span className="text-slate-600 ml-1">of total students</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
