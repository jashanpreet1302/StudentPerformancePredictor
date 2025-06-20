import { students, type Student, type InsertStudent, type OverviewStats, type GradeDistribution, type SubjectPerformance } from "@shared/schema";

export interface IStorage {
  // Student CRUD operations
  getStudent(id: number): Promise<Student | undefined>;
  getStudentByStudentId(studentId: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: number, student: Partial<InsertStudent>): Promise<Student | undefined>;
  deleteStudent(id: number): Promise<boolean>;
  getAllStudents(): Promise<Student[]>;
  
  // Analytics operations
  getOverviewStats(): Promise<OverviewStats>;
  getGradeDistribution(): Promise<GradeDistribution>;
  getSubjectPerformance(): Promise<SubjectPerformance[]>;
  searchStudents(query: string, gradeFilter?: string): Promise<Student[]>;
}

export class MemStorage implements IStorage {
  private students: Map<number, Student>;
  private currentId: number;

  constructor() {
    this.students = new Map();
    this.currentId = 1;
  }

  // Helper method to calculate performance metrics
  private calculatePerformanceMetrics(student: InsertStudent): {
    averageGrade: number;
    performanceLevel: string;
    prediction: string;
  } {
    const grades = [
      student.mathGrade,
      student.scienceGrade,
      student.englishGrade,
      student.historyGrade,
      student.artsGrade,
      student.peGrade,
    ];
    
    const averageGrade = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
    
    // Calculate weighted performance score (grades 60%, attendance 25%, participation 15%)
    const performanceScore = (averageGrade * 0.6) + (student.attendanceRate * 0.25) + (student.participationScore * 0.15);
    
    let performanceLevel: string;
    let prediction: string;
    
    if (performanceScore >= 90) {
      performanceLevel = "Excellent";
      prediction = "High Achiever";
    } else if (performanceScore >= 80) {
      performanceLevel = "Good";
      prediction = "Will Improve";
    } else if (performanceScore >= 70) {
      performanceLevel = "Average";
      prediction = "Needs Support";
    } else if (performanceScore >= 60) {
      performanceLevel = "Below Average";
      prediction = "At Risk";
    } else {
      performanceLevel = "At Risk";
      prediction = "Critical";
    }
    
    return { averageGrade, performanceLevel, prediction };
  }

  async getStudent(id: number): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async getStudentByStudentId(studentId: string): Promise<Student | undefined> {
    return Array.from(this.students.values()).find(
      (student) => student.studentId === studentId,
    );
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = this.currentId++;
    const metrics = this.calculatePerformanceMetrics(insertStudent);
    
    const student: Student = {
      ...insertStudent,
      id,
      attendanceRate: insertStudent.attendanceRate.toString(),
      averageGrade: metrics.averageGrade.toString(),
      performanceLevel: metrics.performanceLevel,
      prediction: metrics.prediction,
    };
    
    this.students.set(id, student);
    return student;
  }

  async updateStudent(id: number, updateData: Partial<InsertStudent>): Promise<Student | undefined> {
    const existingStudent = this.students.get(id);
    if (!existingStudent) {
      return undefined;
    }

    // Convert existing student to InsertStudent format for calculations
    const existingInsertData: InsertStudent = {
      name: existingStudent.name,
      studentId: existingStudent.studentId,
      gradeLevel: existingStudent.gradeLevel,
      section: existingStudent.section,
      mathGrade: existingStudent.mathGrade,
      scienceGrade: existingStudent.scienceGrade,
      englishGrade: existingStudent.englishGrade,
      historyGrade: existingStudent.historyGrade,
      artsGrade: existingStudent.artsGrade,
      peGrade: existingStudent.peGrade,
      attendanceRate: parseFloat(existingStudent.attendanceRate),
      participationScore: existingStudent.participationScore,
    };

    const updatedStudentData = { ...existingInsertData, ...updateData };
    const metrics = this.calculatePerformanceMetrics(updatedStudentData);
    
    const updatedStudent: Student = {
      id,
      name: updatedStudentData.name,
      studentId: updatedStudentData.studentId,
      gradeLevel: updatedStudentData.gradeLevel,
      section: updatedStudentData.section,
      mathGrade: updatedStudentData.mathGrade,
      scienceGrade: updatedStudentData.scienceGrade,
      englishGrade: updatedStudentData.englishGrade,
      historyGrade: updatedStudentData.historyGrade,
      artsGrade: updatedStudentData.artsGrade,
      peGrade: updatedStudentData.peGrade,
      attendanceRate: updatedStudentData.attendanceRate.toString(),
      participationScore: updatedStudentData.participationScore,
      averageGrade: metrics.averageGrade.toString(),
      performanceLevel: metrics.performanceLevel,
      prediction: metrics.prediction,
    };
    
    this.students.set(id, updatedStudent);
    return updatedStudent;
  }

  async deleteStudent(id: number): Promise<boolean> {
    return this.students.delete(id);
  }

  async getAllStudents(): Promise<Student[]> {
    return Array.from(this.students.values());
  }

  async getOverviewStats(): Promise<OverviewStats> {
    const allStudents = Array.from(this.students.values());
    const totalStudents = allStudents.length;
    
    if (totalStudents === 0) {
      return {
        totalStudents: 0,
        averageGrade: "N/A",
        attendanceRate: "N/A",
        atRiskStudents: 0,
      };
    }

    const avgGrade = allStudents.reduce((sum, student) => sum + parseFloat(student.averageGrade || "0"), 0) / totalStudents;
    const avgAttendance = allStudents.reduce((sum, student) => sum + parseFloat(student.attendanceRate), 0) / totalStudents;
    const atRiskCount = allStudents.filter(student => student.performanceLevel === "At Risk").length;

    // Convert average grade to letter grade
    let letterGrade = "F";
    if (avgGrade >= 90) letterGrade = "A";
    else if (avgGrade >= 80) letterGrade = "B";
    else if (avgGrade >= 70) letterGrade = "C";
    else if (avgGrade >= 60) letterGrade = "D";

    return {
      totalStudents,
      averageGrade: letterGrade,
      attendanceRate: `${avgAttendance.toFixed(1)}%`,
      atRiskStudents: atRiskCount,
    };
  }

  async getGradeDistribution(): Promise<GradeDistribution> {
    const allStudents = Array.from(this.students.values());
    const total = allStudents.length;
    
    if (total === 0) {
      return { A: 0, B: 0, C: 0, DF: 0 };
    }

    const counts = { A: 0, B: 0, C: 0, DF: 0 };
    
    allStudents.forEach(student => {
      const avg = parseFloat(student.averageGrade || "0");
      if (avg >= 90) counts.A++;
      else if (avg >= 80) counts.B++;
      else if (avg >= 70) counts.C++;
      else counts.DF++;
    });

    return {
      A: Math.round((counts.A / total) * 100),
      B: Math.round((counts.B / total) * 100),
      C: Math.round((counts.C / total) * 100),
      DF: Math.round((counts.DF / total) * 100),
    };
  }

  async getSubjectPerformance(): Promise<SubjectPerformance[]> {
    const allStudents = Array.from(this.students.values());
    
    if (allStudents.length === 0) {
      return [];
    }

    const subjects = [
      { name: "Mathematics", key: "mathGrade" },
      { name: "Science", key: "scienceGrade" },
      { name: "English", key: "englishGrade" },
      { name: "History", key: "historyGrade" },
      { name: "Arts", key: "artsGrade" },
      { name: "PE", key: "peGrade" },
    ];

    return subjects.map(subject => {
      const average = allStudents.reduce((sum, student) => {
        return sum + (student[subject.key as keyof Student] as number);
      }, 0) / allStudents.length;

      // Simulate month-over-month change (in real app, this would be calculated from historical data)
      const change = (Math.random() - 0.5) * 6; // Random change between -3% and +3%

      return {
        subject: subject.name,
        average: Math.round(average * 10) / 10,
        change: Math.round(change * 10) / 10,
      };
    });
  }

  async searchStudents(query: string, gradeFilter?: string): Promise<Student[]> {
    const allStudents = Array.from(this.students.values());
    
    return allStudents.filter(student => {
      const matchesQuery = !query || 
        student.name.toLowerCase().includes(query.toLowerCase()) ||
        student.studentId.toLowerCase().includes(query.toLowerCase());
      
      const matchesGrade = !gradeFilter || gradeFilter === "All Grades" || 
        student.gradeLevel.includes(gradeFilter.replace("Grade ", ""));
      
      return matchesQuery && matchesGrade;
    });
  }
}

export const storage = new MemStorage();
