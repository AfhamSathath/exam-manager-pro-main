// frontend/src/types.ts

// Departments
export type Department = "Computer Science" | "Physical Science";
export const DEPARTMENTS: Department[] = ["Computer Science", "Physical Science"];

// Academic Years
export type Year = "1st Year" | "2nd Year" | "3rd Year";
export const YEARS: Year[] = ["1st Year", "2nd Year", "3rd Year"];

// Semesters
export type Semester = "1st Semester" | "2nd Semester";
export const SEMESTERS: Semester[] = ["1st Semester", "2nd Semester"];

// User Roles
export type UserRole = "lecturer" | "examiner" | "hod";

// Paper Status
export type PaperStatus =
  | "draft"
  | "pending_moderation"
  | "moderated"
  | "revision_required"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "printed";

// Paper Types
export type PaperType = "exam" | "assessment";

// User Interface
export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  department: Department;
  createdAt: string;
}

// Signature Interface
export interface Signature {
  userId: string;
  userName: string;
  role: UserRole;
  timestamp: string;
  action: string;
}

// Moderation Comment Interface
export interface ModerationComment {
  id: string;
  userId: string;
  userName: string;
  comment: string;
  timestamp: string;
}

// Paper Interface
export interface Paper {
  id: string;
  courseCode: string;
  courseName: string;
  department: Department;
  year: Year;
  semester: Semester;
  paperType: PaperType;
  content: string; // PDF file reference
  status: PaperStatus;
  lecturerId: string;
  lecturerName: string;
  examinerId?: string;
  examinerName?: string;
  signatures: Signature[];
  moderationComments: ModerationComment[];
  revisions: {
    id: string;
    content: string;
    timestamp: string;
    version: number;
  }[];
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
  isLocked: boolean;
}

// Course Interface
export interface Course {
  code: string;
  name: string;
  department: Department;
  year: Year;
  semester: Semester;
}

// Courses Array
export const COURSES: Course[] = [
  // Computer Science
  { code: "CO1121", name: "Basic Mathematics for Computing", department: "Computer Science", year: "1st Year", semester: "1st Semester" },
  { code: "CO1122", name: "Basic Computer Programming", department: "Computer Science", year: "1st Year", semester: "1st Semester" },
  { code: "CO1112", name: "Practical work on CO1122", department: "Computer Science", year: "1st Year", semester: "1st Semester" },
  { code: "CO1123", name: "Formal Methods for Problem Solving", department: "Computer Science", year: "1st Year", semester: "1st Semester" },
  { code: "CO1124", name: "Computer Systems & PC Applications", department: "Computer Science", year: "1st Year", semester: "1st Semester" },
  { code: "CO1114", name: "Practical work on CO1124", department: "Computer Science", year: "1st Year", semester: "1st Semester" },
  { code: "CO1125", name: "Statistics for Science and Technology", department: "Computer Science", year: "1st Year", semester: "1st Semester" },
  { code: "CO1115", name: "Practical work on CO1125", department: "Computer Science", year: "1st Year", semester: "1st Semester" },
  { code: "CO1126", name: "Management Information System", department: "Computer Science", year: "1st Year", semester: "1st Semester" },
  { code: "GEP - I", name: "General English Proficiency - I", department: "Computer Science", year: "1st Year", semester: "1st Semester" },
  // 2nd Year
  { code: "CO2121", name: "Advanced Mathematics for Computing", department: "Computer Science", year: "2nd Year", semester: "1st Semester" },
  { code: "CO2122", name: "Operating Systems", department: "Computer Science", year: "2nd Year", semester: "1st Semester" },
  { code: "CO2123", name: "Software Engineering", department: "Computer Science", year: "2nd Year", semester: "1st Semester" },
  { code: "CO2124", name: "Internet and Web Design", department: "Computer Science", year: "2nd Year", semester: "1st Semester" },
  { code: "CO2125", name: "Object Oriented Programming", department: "Computer Science", year: "2nd Year", semester: "1st Semester" },
  { code: "CO2126", name: "Sri Lankan Studies", department: "Computer Science", year: "2nd Year", semester: "1st Semester" },
  { code: "GEP - III", name: "General English Proficiency - III", department: "Computer Science", year: "2nd Year", semester: "1st Semester" },
  // Physical Science - 1st Year
  { code: "PS1121", name: "Classical Mechanics", department: "Physical Science", year: "1st Year", semester: "1st Semester" },
  { code: "PS1122", name: "General Chemistry", department: "Physical Science", year: "1st Year", semester: "1st Semester" },
  { code: "PS1221", name: "Thermodynamics", department: "Physical Science", year: "1st Year", semester: "2nd Semester" },
  // Physical Science - 2nd Year
  { code: "PS2121", name: "Electromagnetism", department: "Physical Science", year: "2nd Year", semester: "1st Semester" },
  { code: "PS2122", name: "Organic Chemistry", department: "Physical Science", year: "2nd Year", semester: "1st Semester" },
  { code: "PS2221", name: "Quantum Mechanics", department: "Physical Science", year: "2nd Year", semester: "2nd Semester" },
  // Physical Science - 3rd Year
  { code: "PS3121", name: "Statistical Mechanics", department: "Physical Science", year: "3rd Year", semester: "1st Semester" },
  { code: "PS3122", name: "Physical Chemistry", department: "Physical Science", year: "3rd Year", semester: "1st Semester" },
  { code: "PS3221", name: "Nuclear Physics", department: "Physical Science", year: "3rd Year", semester: "2nd Semester" },
];
