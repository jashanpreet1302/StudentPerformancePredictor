import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStudentSchema } from "@shared/schema";
import { z } from "zod";
import { loadSampleData } from "./sample-data";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all students
  app.get("/api/students", async (_req, res) => {
    try {
      const students = await storage.getAllStudents();
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  // Get student by ID
  app.get("/api/students/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid student ID" });
      }
      
      const student = await storage.getStudent(id);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      res.json(student);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch student" });
    }
  });

  // Create new student
  app.post("/api/students", async (req, res) => {
    try {
      const validatedData = insertStudentSchema.parse(req.body);
      
      // Check if student ID already exists
      const existingStudent = await storage.getStudentByStudentId(validatedData.studentId);
      if (existingStudent) {
        return res.status(400).json({ message: "Student ID already exists" });
      }
      
      const student = await storage.createStudent(validatedData);
      res.status(201).json(student);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create student" });
    }
  });

  // Update student
  app.put("/api/students/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid student ID" });
      }
      
      const validatedData = insertStudentSchema.partial().parse(req.body);
      const student = await storage.updateStudent(id, validatedData);
      
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      res.json(student);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update student" });
    }
  });

  // Delete student
  app.delete("/api/students/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid student ID" });
      }
      
      const success = await storage.deleteStudent(id);
      if (!success) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete student" });
    }
  });

  // Search students
  app.get("/api/students/search", async (req, res) => {
    try {
      const query = req.query.q as string || "";
      const gradeFilter = req.query.grade as string;
      
      const students = await storage.searchStudents(query, gradeFilter);
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Failed to search students" });
    }
  });

  // Get overview statistics
  app.get("/api/analytics/overview", async (_req, res) => {
    try {
      const stats = await storage.getOverviewStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch overview stats" });
    }
  });

  // Get grade distribution
  app.get("/api/analytics/grade-distribution", async (_req, res) => {
    try {
      const distribution = await storage.getGradeDistribution();
      res.json(distribution);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch grade distribution" });
    }
  });

  // Get subject performance
  app.get("/api/analytics/subject-performance", async (_req, res) => {
    try {
      const performance = await storage.getSubjectPerformance();
      res.json(performance);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subject performance" });
    }
  });

  // Load sample data
  app.post("/api/load-sample-data", async (_req, res) => {
    try {
      await loadSampleData();
      res.json({ message: "Sample data loaded successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to load sample data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
