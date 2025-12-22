export type Department = 'Computer Science' | 'Physical Science';

export type Year = '1st Year' | '2nd Year' | '3rd Year';

export type Semester = '1st Semester' | '2nd Semester';

export type UserRole = 'lecturer' | 'examiner' | 'hod';

export type PaperStatus = 
  | 'draft' 
  | 'pending_moderation' 
  | 'moderated' 
  | 'revision_required'
  | 'pending_approval' 
  | 'approved' 
  | 'rejected'
  | 'printed';

export type PaperType = 'exam' | 'assessment';

export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  department: Department;
  createdAt: string;
}

export interface Signature {
  userId: string;
  userName: string;
  role: UserRole;
  timestamp: string;
  action: string;
}

export interface ModerationComment {
  id: string;
  userId: string;
  userName: string;
  comment: string;
  timestamp: string;
}

export interface Paper {
  id: string;
  courseCode: string;
  courseName: string;
  department: Department;
  year: Year;
  semester: Semester;
  paperType: PaperType;
  content: string; // reference to PDF content
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

export interface Course {
  code: string;
  name: string;
  department: Department;
  year: Year;
  semester: Semester;
}

export const COURSES: Course[] = [
  // Computer Science - 1st Year
  { code: 'CS1121', name: 'Introduction to Programming', department: 'Computer Science', year: '1st Year', semester: '1st Semester' },
  { code: 'CS1122', name: 'Computer Fundamentals', department: 'Computer Science', year: '1st Year', semester: '1st Semester' },
  { code: 'CS1123', name: 'Discrete Mathematics', department: 'Computer Science', year: '1st Year', semester: '1st Semester' },
  { code: 'CS1221', name: 'Object Oriented Programming', department: 'Computer Science', year: '1st Year', semester: '2nd Semester' },
  { code: 'CS1222', name: 'Data Structures', department: 'Computer Science', year: '1st Year', semester: '2nd Semester' },
  
  // Computer Science - 2nd Year
  { code: 'CS2121', name: 'Database Systems', department: 'Computer Science', year: '2nd Year', semester: '1st Semester' },
  { code: 'CS2122', name: 'Web Development', department: 'Computer Science', year: '2nd Year', semester: '1st Semester' },
  { code: 'CS2123', name: 'Computer Networks', department: 'Computer Science', year: '2nd Year', semester: '1st Semester' },
  { code: 'CS2221', name: 'Software Engineering', department: 'Computer Science', year: '2nd Year', semester: '2nd Semester' },
  { code: 'CS2222', name: 'Operating Systems', department: 'Computer Science', year: '2nd Year', semester: '2nd Semester' },
  
  // Computer Science - 3rd Year
  { code: 'CS3121', name: 'Machine Learning', department: 'Computer Science', year: '3rd Year', semester: '1st Semester' },
  { code: 'CS3122', name: 'Computer Graphics', department: 'Computer Science', year: '3rd Year', semester: '1st Semester' },
  { code: 'CS3123', name: 'Compiler Design', department: 'Computer Science', year: '3rd Year', semester: '1st Semester' },
  { code: 'CS3221', name: 'Artificial Intelligence', department: 'Computer Science', year: '3rd Year', semester: '2nd Semester' },
  { code: 'CS3222', name: 'Cloud Computing', department: 'Computer Science', year: '3rd Year', semester: '2nd Semester' },
  
  // Physical Science - 1st Year
  { code: 'PS1121', name: 'Classical Mechanics', department: 'Physical Science', year: '1st Year', semester: '1st Semester' },
  { code: 'PS1122', name: 'General Chemistry', department: 'Physical Science', year: '1st Year', semester: '1st Semester' },
  { code: 'PS1221', name: 'Thermodynamics', department: 'Physical Science', year: '1st Year', semester: '2nd Semester' },
  
  // Physical Science - 2nd Year
  { code: 'PS2121', name: 'Electromagnetism', department: 'Physical Science', year: '2nd Year', semester: '1st Semester' },
  { code: 'PS2122', name: 'Organic Chemistry', department: 'Physical Science', year: '2nd Year', semester: '1st Semester' },
  { code: 'PS2221', name: 'Quantum Mechanics', department: 'Physical Science', year: '2nd Year', semester: '2nd Semester' },
  
  // Physical Science - 3rd Year
  { code: 'PS3121', name: 'Statistical Mechanics', department: 'Physical Science', year: '3rd Year', semester: '1st Semester' },
  { code: 'PS3122', name: 'Physical Chemistry', department: 'Physical Science', year: '3rd Year', semester: '1st Semester' },
  { code: 'PS3221', name: 'Nuclear Physics', department: 'Physical Science', year: '3rd Year', semester: '2nd Semester' },
];

export const DEPARTMENTS: Department[] = ['Computer Science', 'Physical Science'];
export const YEARS: Year[] = ['1st Year', '2nd Year', '3rd Year'];
export const SEMESTERS: Semester[] = ['1st Semester', '2nd Semester'];
