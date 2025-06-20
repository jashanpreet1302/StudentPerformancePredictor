import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Eye, Edit, Trash2, Plus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Student } from "@shared/schema";

export default function StudentTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("All Grades");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: students = [], isLoading } = useQuery<Student[]>({
    queryKey: ["/api/students"],
  });

  const deleteStudentMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/students/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Student deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/overview"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/grade-distribution"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete student",
        variant: "destructive",
      });
    },
  });

  // Filter students based on search query and grade filter
  const filteredStudents = students.filter(student => {
    const matchesQuery = !searchQuery || 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGrade = gradeFilter === "All Grades" || 
      student.gradeLevel.includes(gradeFilter.replace("Grade ", ""));
    
    return matchesQuery && matchesGrade;
  });

  // Paginate results
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  const getPerformanceBadgeColor = (level: string) => {
    switch (level) {
      case "Excellent": return "bg-green-100 text-green-800";
      case "Good": return "bg-blue-100 text-blue-800";
      case "Average": return "bg-amber-100 text-amber-800";
      case "Below Average": return "bg-orange-100 text-orange-800";
      case "At Risk": return "bg-red-100 text-red-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const getPredictionBadgeColor = (prediction: string) => {
    switch (prediction) {
      case "High Achiever": return "bg-green-100 text-green-800";
      case "Will Improve": return "bg-blue-100 text-blue-800";
      case "Needs Support": return "bg-amber-100 text-amber-800";
      case "At Risk": return "bg-orange-100 text-orange-800";
      case "Critical": return "bg-red-100 text-red-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-500", "bg-purple-500", "bg-green-500", 
      "bg-red-500", "bg-amber-500", "bg-pink-500"
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteStudentMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm border border-slate-200">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border border-slate-200 mb-8">
      <CardHeader className="p-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h3 className="text-lg font-semibold text-slate-800">Student Records</h3>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm w-64"
              />
            </div>
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Grades">All Grades</SelectItem>
                <SelectItem value="Grade 9">Grade 9</SelectItem>
                <SelectItem value="Grade 10">Grade 10</SelectItem>
                <SelectItem value="Grade 11">Grade 11</SelectItem>
                <SelectItem value="Grade 12">Grade 12</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {paginatedStudents.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-500">No students found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">Student</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">Grade</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">Average</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">Attendance</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">Performance</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">Prediction</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {paginatedStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 ${getAvatarColor(student.name)} rounded-full flex items-center justify-center text-white text-sm font-medium`}>
                            {getInitials(student.name)}
                          </div>
                          <span className="font-medium text-slate-800">{student.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600">{student.studentId}</td>
                      <td className="py-4 px-6 text-sm text-slate-600">{student.gradeLevel}</td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-slate-800">
                          {parseFloat(student.averageGrade || "0").toFixed(1)}
                        </span>
                        <span className="text-xs text-slate-500 ml-1">
                          ({parseFloat(student.averageGrade || "0") >= 90 ? "A" :
                            parseFloat(student.averageGrade || "0") >= 80 ? "B" :
                            parseFloat(student.averageGrade || "0") >= 70 ? "C" :
                            parseFloat(student.averageGrade || "0") >= 60 ? "D" : "F"})
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Progress 
                            value={parseFloat(student.attendanceRate)} 
                            className="w-12 h-2"
                          />
                          <span className="text-sm text-slate-600">
                            {parseFloat(student.attendanceRate).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge className={getPerformanceBadgeColor(student.performanceLevel || "")}>
                          {student.performanceLevel}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <Badge className={getPredictionBadgeColor(student.prediction || "")}>
                          {student.prediction}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-700">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-amber-600 hover:text-amber-700">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(student.id, student.name)}
                            disabled={deleteStudentMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredStudents.length)}</span> of{" "}
                  <span className="font-medium">{filteredStudents.length}</span> students
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: Math.min(3, totalPages) }).map((_, i) => {
                    const page = currentPage <= 2 ? i + 1 : currentPage - 1 + i;
                    if (page > totalPages) return null;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
