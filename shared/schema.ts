import { pgTable, text, serial, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  studentId: text("student_id").notNull().unique(),
  gradeLevel: text("grade_level").notNull(),
  section: text("section").notNull(),
  
  // Subject grades (0-100)
  mathGrade: integer("math_grade").notNull(),
  scienceGrade: integer("science_grade").notNull(),
  englishGrade: integer("english_grade").notNull(),
  historyGrade: integer("history_grade").notNull(),
  artsGrade: integer("arts_grade").notNull(),
  peGrade: integer("pe_grade").notNull(),
  
  // Attendance and participation
  attendanceRate: decimal("attendance_rate", { precision: 5, scale: 2 }).notNull(),
  participationScore: integer("participation_score").notNull(),
  
  // Calculated fields
  averageGrade: decimal("average_grade", { precision: 5, scale: 2 }),
  performanceLevel: text("performance_level"),
  prediction: text("prediction"),
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  averageGrade: true,
  performanceLevel: true,
  prediction: true,
}).extend({
  mathGrade: z.number().min(0).max(100),
  scienceGrade: z.number().min(0).max(100),
  englishGrade: z.number().min(0).max(100),
  historyGrade: z.number().min(0).max(100),
  artsGrade: z.number().min(0).max(100),
  peGrade: z.number().min(0).max(100),
  attendanceRate: z.number().min(0).max(100),
  participationScore: z.number().min(0).max(100),
});

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;

// Analytics types
export type OverviewStats = {
  totalStudents: number;
  averageGrade: string;
  attendanceRate: string;
  atRiskStudents: number;
};

export type GradeDistribution = {
  A: number;
  B: number;
  C: number;
  DF: number;
};

export type SubjectPerformance = {
  subject: string;
  average: number;
  change: number;
};
