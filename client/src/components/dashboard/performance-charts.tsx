import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { RefreshCw, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import type { GradeDistribution } from "@shared/schema";

// Mock trend data - in a real app, this would come from the API
const trendData = [
  { month: "Jan", averageGrade: 82, attendance: 85 },
  { month: "Feb", averageGrade: 84, attendance: 87 },
  { month: "Mar", averageGrade: 83, attendance: 86 },
  { month: "Apr", averageGrade: 86, attendance: 88 },
  { month: "May", averageGrade: 85, attendance: 87 },
  { month: "Jun", averageGrade: 87, attendance: 89 },
];

const COLORS = {
  A: "#059669", // green-600
  B: "#16A34A", // green-500
  C: "#EA580C", // orange-600
  DF: "#DC2626", // red-600
};

export default function PerformanceCharts() {
  const { data: gradeDistribution, isLoading } = useQuery<GradeDistribution>({
    queryKey: ["/api/analytics/grade-distribution"],
  });

  const pieData = gradeDistribution ? [
    { name: "A Grade", value: gradeDistribution.A, color: COLORS.A },
    { name: "B Grade", value: gradeDistribution.B, color: COLORS.B },
    { name: "C Grade", value: gradeDistribution.C, color: COLORS.C },
    { name: "D/F Grade", value: gradeDistribution.DF, color: COLORS.DF },
  ] : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Performance Trends Chart */}
      <Card className="shadow-sm border border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-800">Performance Trends</CardTitle>
            <div className="flex items-center space-x-2">
              <Select defaultValue="6months">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6months">Last 6 months</SelectItem>
                  <SelectItem value="year">Last year</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="averageGrade" 
                  stroke="#059669" 
                  strokeWidth={2}
                  name="Average Grade"
                />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#EA580C" 
                  strokeWidth={2}
                  name="Attendance"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="text-slate-600">Average Grade</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                <span className="text-slate-600">Attendance</span>
              </div>
            </div>
            <span className="text-slate-400">Updated 5 min ago</span>
          </div>
        </CardContent>
      </Card>

      {/* Grade Distribution */}
      <Card className="shadow-sm border border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-800">Grade Distribution</CardTitle>
            <Button 
              variant="ghost" 
              className="text-sm text-green-600 hover:text-green-700 font-medium"
              onClick={() => {
                alert('This would show detailed grade distribution analysis');
              }}
            >
              View Details
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PieChartIcon className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-500">Loading distribution...</p>
              </div>
            </div>
          ) : gradeDistribution ? (
            <>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">A Grade</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{gradeDistribution.A}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">B Grade</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{gradeDistribution.B}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">C Grade</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{gradeDistribution.C}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">D/F Grade</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{gradeDistribution.DF}%</span>
                </div>
              </div>
            </>
          ) : (
            <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PieChartIcon className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-500">No distribution data available</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
