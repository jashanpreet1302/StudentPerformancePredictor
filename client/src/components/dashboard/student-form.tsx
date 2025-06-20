import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertStudentSchema, type InsertStudent } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

export default function StudentForm() {
  const [isOpen, setIsOpen] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertStudent>({
    resolver: zodResolver(insertStudentSchema),
    defaultValues: {
      name: "",
      studentId: "",
      gradeLevel: "",
      section: "",
      mathGrade: 0,
      scienceGrade: 0,
      englishGrade: 0,
      historyGrade: 0,
      artsGrade: 0,
      peGrade: 0,
      attendanceRate: 0,
      participationScore: 0,
    },
  });

  const createStudentMutation = useMutation({
    mutationFn: async (data: InsertStudent) => {
      const response = await apiRequest("POST", "/api/students", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Student added successfully",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/overview"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/grade-distribution"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/subject-performance"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add student",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertStudent) => {
    createStudentMutation.mutate(data);
  };

  const handleClear = () => {
    form.reset();
  };

  if (!isOpen) {
    return (
      <Card className="shadow-sm border border-slate-200">
        <CardContent className="p-6">
          <Button 
            onClick={() => setIsOpen(true)}
            className="w-full"
          >
            Add New Student
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border border-slate-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-800">Add New Student</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter student name"
                {...form.register("name")}
                className="transition-colors"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                placeholder="Enter student ID"
                {...form.register("studentId")}
                className="transition-colors"
              />
              {form.formState.errors.studentId && (
                <p className="text-sm text-red-600">{form.formState.errors.studentId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gradeLevel">Grade Level</Label>
              <Select onValueChange={(value) => form.setValue("gradeLevel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9th Grade">9th Grade</SelectItem>
                  <SelectItem value="10th Grade">10th Grade</SelectItem>
                  <SelectItem value="11th Grade">11th Grade</SelectItem>
                  <SelectItem value="12th Grade">12th Grade</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.gradeLevel && (
                <p className="text-sm text-red-600">{form.formState.errors.gradeLevel.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Class Section</Label>
              <Select onValueChange={(value) => form.setValue("section", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Section A">Section A</SelectItem>
                  <SelectItem value="Section B">Section B</SelectItem>
                  <SelectItem value="Section C">Section C</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.section && (
                <p className="text-sm text-red-600">{form.formState.errors.section.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700">Subject Grades</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: "Mathematics", key: "mathGrade" },
                { name: "Science", key: "scienceGrade" },
                { name: "English", key: "englishGrade" },
                { name: "History", key: "historyGrade" },
                { name: "Arts", key: "artsGrade" },
                { name: "PE", key: "peGrade" },
              ].map((subject) => (
                <div key={subject.key} className="space-y-1">
                  <Label className="text-xs text-slate-600">{subject.name}</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="85"
                    {...form.register(subject.key as keyof InsertStudent, { valueAsNumber: true })}
                    className="text-sm transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="attendanceRate">Attendance Rate (%)</Label>
              <Input
                id="attendanceRate"
                type="number"
                min="0"
                max="100"
                placeholder="87"
                {...form.register("attendanceRate", { valueAsNumber: true })}
                className="transition-colors"
              />
              {form.formState.errors.attendanceRate && (
                <p className="text-sm text-red-600">{form.formState.errors.attendanceRate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="participationScore">Participation Score</Label>
              <Select onValueChange={(value) => form.setValue("participationScore", parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select participation level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="95">Excellent (90-100)</SelectItem>
                  <SelectItem value="85">Good (80-89)</SelectItem>
                  <SelectItem value="75">Average (70-79)</SelectItem>
                  <SelectItem value="65">Below Average (60-69)</SelectItem>
                  <SelectItem value="55">Poor (Below 60)</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.participationScore && (
                <p className="text-sm text-red-600">{form.formState.errors.participationScore.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button type="button" variant="outline" onClick={handleClear}>
              Clear Form
            </Button>
            <Button 
              type="submit" 
              disabled={createStudentMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {createStudentMutation.isPending ? "Adding..." : "Add Student"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
