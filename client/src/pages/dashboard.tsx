import { useState, useEffect } from "react";
import OverviewStats from "@/components/dashboard/overview-stats";
import StudentForm from "@/components/dashboard/student-form";
import PerformanceCharts from "@/components/dashboard/performance-charts";
import StudentTable from "@/components/dashboard/student-table";
import SubjectAnalytics from "@/components/dashboard/subject-analytics";
import { Users, BarChart3, FileText, Menu, Download, Upload, TrendingUp, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClueStradLogo } from "@/components/ui/logo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loadSampleDataMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/load-sample-data");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Sample data loaded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/overview"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/grade-distribution"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/subject-performance"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load sample data",
        variant: "destructive",
      });
    },
  });

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "report":
        setActiveTab("reports");
        break;
      case "export":
        // Create and download CSV
        const csvContent = "data:text/csv;charset=utf-8,Name,Student ID,Grade Level,Average Grade,Performance Level\n";
        const link = document.createElement("a");
        link.setAttribute("href", csvContent);
        link.setAttribute("download", "student_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;
      case "import":
        // Trigger file input
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".csv";
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            alert(`File "${file.name}" selected for import. Import functionality would be implemented here.`);
          }
        };
        input.click();
        break;
      case "analytics":
        setActiveTab("analytics");
        break;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            {/* Dashboard Overview */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Performance Dashboard</h2>
              <OverviewStats />
            </div>

            {/* Quick Actions & Add Student Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <StudentForm />
              </div>
              
              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-between bg-green-50 border-green-200 hover:bg-green-100 text-green-800"
                    onClick={() => handleQuickAction("report")}
                  >
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="h-4 w-4" />
                      <span className="font-medium">Generate Report</span>
                    </div>
                    <TrendingUp className="h-4 w-4" />
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full justify-between bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-800"
                    onClick={() => handleQuickAction("export")}
                  >
                    <div className="flex items-center space-x-3">
                      <Download className="h-4 w-4" />
                      <span className="font-medium">Export Data</span>
                    </div>
                    <FileText className="h-4 w-4" />
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full justify-between bg-green-50 border-green-200 hover:bg-green-100 text-green-800"
                    onClick={() => handleQuickAction("import")}
                  >
                    <div className="flex items-center space-x-3">
                      <Upload className="h-4 w-4" />
                      <span className="font-medium">Import Data</span>
                    </div>
                    <Users className="h-4 w-4" />
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full justify-between bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-800"
                    onClick={() => handleQuickAction("analytics")}
                  >
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="h-4 w-4" />
                      <span className="font-medium">View Analytics</span>
                    </div>
                    <TrendingUp className="h-4 w-4" />
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full justify-between bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-800"
                    onClick={() => loadSampleDataMutation.mutate()}
                    disabled={loadSampleDataMutation.isPending}
                  >
                    <div className="flex items-center space-x-3">
                      <Database className="h-4 w-4" />
                      <span className="font-medium">
                        {loadSampleDataMutation.isPending ? "Loading..." : "Load Sample Data"}
                      </span>
                    </div>
                    <Users className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-slate-600">Student data updated</span>
                      <span className="text-slate-400">2 min ago</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-slate-600">Report generated</span>
                      <span className="text-slate-400">1 hour ago</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-slate-600">Data exported</span>
                      <span className="text-slate-400">3 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visualization Section */}
            <PerformanceCharts />
          </>
        );

      case "students":
        return (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Student Management</h2>
              <div className="mb-8">
                <StudentForm />
              </div>
            </div>
            <StudentTable />
          </>
        );

      case "analytics":
        return (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Analytics & Insights</h2>
              <OverviewStats />
            </div>
            <PerformanceCharts />
            <SubjectAnalytics />
          </>
        );

      case "reports":
        return (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Reports & Documentation</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="shadow-sm border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-800">Performance Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">Comprehensive analysis of student performance trends and predictions.</p>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-sm border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-800">Grade Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">Statistical breakdown of grade distributions across all subjects.</p>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analysis
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-sm border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-800">At-Risk Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">Detailed report on students requiring additional support.</p>
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    <Users className="h-4 w-4 mr-2" />
                    Generate List
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-sm border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-800">Attendance Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">Track attendance patterns and their impact on performance.</p>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-sm border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-800">Subject Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">Compare performance across different subjects and identify trends.</p>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Analysis
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-sm border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-800">Custom Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">Create custom reports with specific filters and parameters.</p>
                  <Button className="w-full bg-slate-600 hover:bg-slate-700">
                    <FileText className="h-4 w-4 mr-2" />
                    Create Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <ClueStradLogo size={32} />
              <h1 className="text-xl font-semibold text-slate-800">clueStrad</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`font-medium pb-1 transition-colors ${
                  activeTab === "dashboard"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("students")}
                className={`font-medium pb-1 transition-colors ${
                  activeTab === "students"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Students
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`font-medium pb-1 transition-colors ${
                  activeTab === "analytics"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`font-medium pb-1 transition-colors ${
                  activeTab === "reports"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Reports
              </button>
            </nav>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
}
