export interface PerformanceMetrics {
  averageGrade: number;
  performanceLevel: string;
  prediction: string;
  riskLevel: "low" | "medium" | "high" | "critical";
}

export interface StudentGrades {
  mathGrade: number;
  scienceGrade: number;
  englishGrade: number;
  historyGrade: number;
  artsGrade: number;
  peGrade: number;
  attendanceRate: number;
  participationScore: number;
}

/**
 * Calculate performance metrics using statistical methods
 * Uses weighted scoring: grades (60%), attendance (25%), participation (15%)
 */
export function calculatePerformanceMetrics(grades: StudentGrades): PerformanceMetrics {
  // Calculate grade average
  const gradeValues = [
    grades.mathGrade,
    grades.scienceGrade,
    grades.englishGrade,
    grades.historyGrade,
    grades.artsGrade,
    grades.peGrade,
  ];
  
  const averageGrade = gradeValues.reduce((sum, grade) => sum + grade, 0) / gradeValues.length;
  
  // Calculate weighted performance score
  const performanceScore = 
    (averageGrade * 0.6) + 
    (grades.attendanceRate * 0.25) + 
    (grades.participationScore * 0.15);
  
  // Determine performance level and prediction based on thresholds
  let performanceLevel: string;
  let prediction: string;
  let riskLevel: "low" | "medium" | "high" | "critical";
  
  if (performanceScore >= 90) {
    performanceLevel = "Excellent";
    prediction = "High Achiever";
    riskLevel = "low";
  } else if (performanceScore >= 80) {
    performanceLevel = "Good";
    prediction = "Will Improve";
    riskLevel = "low";
  } else if (performanceScore >= 70) {
    performanceLevel = "Average";
    prediction = "Needs Support";
    riskLevel = "medium";
  } else if (performanceScore >= 60) {
    performanceLevel = "Below Average";
    prediction = "At Risk";
    riskLevel = "high";
  } else {
    performanceLevel = "At Risk";
    prediction = "Critical";
    riskLevel = "critical";
  }
  
  return {
    averageGrade,
    performanceLevel,
    prediction,
    riskLevel,
  };
}

/**
 * Calculate grade distribution statistics
 */
export function calculateGradeDistribution(students: Array<{ averageGrade: string }>) {
  const total = students.length;
  
  if (total === 0) {
    return { A: 0, B: 0, C: 0, DF: 0 };
  }

  const counts = { A: 0, B: 0, C: 0, DF: 0 };
  
  students.forEach(student => {
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

/**
 * Calculate subject performance statistics
 */
export function calculateSubjectPerformance(students: Array<{
  mathGrade: number;
  scienceGrade: number;
  englishGrade: number;
  historyGrade: number;
  artsGrade: number;
  peGrade: number;
}>) {
  if (students.length === 0) {
    return [];
  }

  const subjects = [
    { name: "Mathematics", key: "mathGrade" as const },
    { name: "Science", key: "scienceGrade" as const },
    { name: "English", key: "englishGrade" as const },
    { name: "History", key: "historyGrade" as const },
    { name: "Arts", key: "artsGrade" as const },
    { name: "PE", key: "peGrade" as const },
  ];

  return subjects.map(subject => {
    const average = students.reduce((sum, student) => {
      return sum + student[subject.key];
    }, 0) / students.length;

    // Simulate month-over-month change (in real app, this would be calculated from historical data)
    const change = (Math.random() - 0.5) * 6; // Random change between -3% and +3%

    return {
      subject: subject.name,
      average: Math.round(average * 10) / 10,
      change: Math.round(change * 10) / 10,
    };
  });
}

/**
 * Predict student at-risk status based on multiple factors
 */
export function predictAtRiskStatus(metrics: PerformanceMetrics): boolean {
  return metrics.riskLevel === "high" || metrics.riskLevel === "critical";
}

/**
 * Generate performance recommendations
 */
export function generateRecommendations(grades: StudentGrades, metrics: PerformanceMetrics): string[] {
  const recommendations: string[] = [];
  
  // Check attendance
  if (grades.attendanceRate < 80) {
    recommendations.push("Improve attendance rate - current attendance is affecting overall performance");
  }
  
  // Check participation
  if (grades.participationScore < 70) {
    recommendations.push("Increase class participation and engagement");
  }
  
  // Check individual subjects
  const subjects = [
    { name: "Mathematics", grade: grades.mathGrade },
    { name: "Science", grade: grades.scienceGrade },
    { name: "English", grade: grades.englishGrade },
    { name: "History", grade: grades.historyGrade },
    { name: "Arts", grade: grades.artsGrade },
    { name: "PE", grade: grades.peGrade },
  ];
  
  const weakSubjects = subjects.filter(s => s.grade < 70);
  if (weakSubjects.length > 0) {
    recommendations.push(`Focus on improving grades in: ${weakSubjects.map(s => s.name).join(", ")}`);
  }
  
  // Overall performance recommendations
  if (metrics.riskLevel === "critical") {
    recommendations.push("Immediate intervention required - consider tutoring and additional support");
  } else if (metrics.riskLevel === "high") {
    recommendations.push("Additional support recommended to prevent further decline");
  } else if (metrics.riskLevel === "medium") {
    recommendations.push("Monitor progress closely and provide targeted assistance");
  }
  
  return recommendations;
}
