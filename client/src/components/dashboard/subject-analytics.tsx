import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Download, TrendingUp, TrendingDown } from "lucide-react";
import type { SubjectPerformance } from "@shared/schema";

export default function SubjectAnalytics() {
  const { data: subjectPerformance = [], isLoading } = useQuery<SubjectPerformance[]>({
    queryKey: ["/api/analytics/subject-performance"],
  });

  const chartData = subjectPerformance.map(subject => ({
    name: subject.subject,
    average: subject.average,
  }));

  return (
    <Card className="mt-8 shadow-sm border border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-800">Subject Performance Analytics</CardTitle>
          <div className="flex items-center space-x-3">
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="math">Mathematics</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="history">History</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subject Comparison Chart */}
          <div>
            <h4 className="text-md font-medium text-slate-700 mb-4">Average Scores by Subject</h4>
            {isLoading ? (
              <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                <p className="text-slate-500">Loading chart data...</p>
              </div>
            ) : chartData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="average" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                <p className="text-slate-500">No data available</p>
              </div>
            )}
          </div>

          {/* Performance Matrix */}
          <div>
            <h4 className="text-md font-medium text-slate-700 mb-4">Performance Matrix</h4>
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 bg-slate-50 rounded-lg animate-pulse"></div>
                ))
              ) : subjectPerformance.length > 0 ? (
                subjectPerformance.map((subject) => (
                  <div key={subject.subject} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <span className="font-medium text-slate-800">{subject.subject}</span>
                      <p className="text-sm text-slate-600">Class Average: {subject.average.toFixed(1)}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        {subject.change >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                        )}
                        <span className={`text-lg font-bold ${subject.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {subject.change >= 0 ? '+' : ''}{subject.change.toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">vs last month</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <p className="text-slate-500">No performance data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
