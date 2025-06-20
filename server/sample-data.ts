import { storage } from './storage';
import type { InsertStudent } from '@shared/schema';

export const sampleStudents: InsertStudent[] = [
  {
    name: "Sarah Johnson",
    studentId: "STU001",
    gradeLevel: "10th Grade",
    section: "Section A",
    mathGrade: 92,
    scienceGrade: 88,
    englishGrade: 94,
    historyGrade: 87,
    artsGrade: 91,
    peGrade: 95,
    attendanceRate: 96,
    participationScore: 88
  },
  {
    name: "Michael Chen",
    studentId: "STU002", 
    gradeLevel: "10th Grade",
    section: "Section A",
    mathGrade: 78,
    scienceGrade: 82,
    englishGrade: 75,
    historyGrade: 80,
    artsGrade: 85,
    peGrade: 90,
    attendanceRate: 85,
    participationScore: 75
  },
  {
    name: "Emma Rodriguez",
    studentId: "STU003",
    gradeLevel: "11th Grade", 
    section: "Section B",
    mathGrade: 95,
    scienceGrade: 93,
    englishGrade: 89,
    historyGrade: 92,
    artsGrade: 88,
    peGrade: 87,
    attendanceRate: 98,
    participationScore: 92
  },
  {
    name: "James Wilson",
    studentId: "STU004",
    gradeLevel: "9th Grade",
    section: "Section A", 
    mathGrade: 65,
    scienceGrade: 68,
    englishGrade: 72,
    historyGrade: 70,
    artsGrade: 75,
    peGrade: 80,
    attendanceRate: 78,
    participationScore: 65
  },
  {
    name: "Olivia Thompson",
    studentId: "STU005",
    gradeLevel: "12th Grade",
    section: "Section B",
    mathGrade: 89,
    scienceGrade: 91,
    englishGrade: 93,
    historyGrade: 88,
    artsGrade: 94,
    peGrade: 92,
    attendanceRate: 94,
    participationScore: 89
  },
  {
    name: "David Kim",
    studentId: "STU006",
    gradeLevel: "11th Grade",
    section: "Section C",
    mathGrade: 55,
    scienceGrade: 60,
    englishGrade: 58,
    historyGrade: 62,
    artsGrade: 65,
    peGrade: 70,
    attendanceRate: 72,
    participationScore: 55
  },
  {
    name: "Sophia Martinez",
    studentId: "STU007",
    gradeLevel: "10th Grade",
    section: "Section B",
    mathGrade: 86,
    scienceGrade: 84,
    englishGrade: 90,
    historyGrade: 85,
    artsGrade: 89,
    peGrade: 88,
    attendanceRate: 91,
    participationScore: 84
  },
  {
    name: "Ryan Davis",
    studentId: "STU008",
    gradeLevel: "9th Grade",
    section: "Section B",
    mathGrade: 73,
    scienceGrade: 76,
    englishGrade: 78,
    historyGrade: 74,
    artsGrade: 82,
    peGrade: 85,
    attendanceRate: 83,
    participationScore: 76
  },
  {
    name: "Isabella Garcia",
    studentId: "STU009",
    gradeLevel: "12th Grade",
    section: "Section A",
    mathGrade: 97,
    scienceGrade: 95,
    englishGrade: 96,
    historyGrade: 94,
    artsGrade: 93,
    peGrade: 89,
    attendanceRate: 99,
    participationScore: 95
  },
  {
    name: "Ethan Brown",
    studentId: "STU010",
    gradeLevel: "11th Grade",
    section: "Section A",
    mathGrade: 48,
    scienceGrade: 52,
    englishGrade: 55,
    historyGrade: 50,
    artsGrade: 58,
    peGrade: 65,
    attendanceRate: 65,
    participationScore: 48
  }
];

export async function loadSampleData(): Promise<void> {
  console.log('Loading sample data...');
  
  for (const student of sampleStudents) {
    try {
      await storage.createStudent(student);
    } catch (error) {
      console.error(`Error creating student ${student.name}:`, error);
    }
  }
  
  console.log(`Successfully loaded ${sampleStudents.length} sample students`);
}