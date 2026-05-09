'use server';

// ─── Hardcoded credentials (no database needed) ───────────────────────────────
const ADMIN_EMAIL = 'Harrypotter24321@gmail.com';
const ADMIN_PASSWORD = 'Harry(890)';

// In-memory store for students, courses, announcements (resets on server restart)
// For a persistent no-DB solution, data lives here during the session.
const inMemoryStudents: User[] = [];
const inMemoryCourses: Course[] = [
  { id: 1, title: 'Introduction to Computer Science', code: 'CS101', description: 'Fundamentals of programming and computer science.', instructor: 'Dr. Smith', schedule: 'Monday/Wednesday 9:00 AM', credits: 3, createdAt: new Date() },
  { id: 2, title: 'Mathematics for Engineers', code: 'MATH201', description: 'Calculus, linear algebra and differential equations.', instructor: 'Dr. Khan', schedule: 'Tuesday/Thursday 11:00 AM', credits: 4, createdAt: new Date() },
  { id: 3, title: 'Physics I', code: 'PHY101', description: 'Mechanics, thermodynamics and waves.', instructor: 'Dr. Ali', schedule: 'Monday/Wednesday/Friday 10:00 AM', credits: 3, createdAt: new Date() },
];
const inMemoryAnnouncements: Announcement[] = [
  { id: 1, title: 'Welcome to Academy TSF!', content: 'Welcome to the new semester. Please check your course schedules.', authorId: 1, priority: 'high', createdAt: new Date() },
  { id: 2, title: 'Mid-term Exams Schedule', content: 'Mid-term exams will be held from next week. Prepare accordingly.', authorId: 1, priority: 'normal', createdAt: new Date() },
];
const inMemoryEnrollments: Enrollment[] = [];

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'student';
  createdAt: Date;
}

interface Course {
  id: number;
  title: string;
  code: string;
  description: string;
  instructor: string;
  schedule: string;
  credits: number;
  createdAt: Date;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  authorId: number;
  priority: string;
  createdAt: Date;
}

interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  grade: string;
  status: string;
  createdAt: Date;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function loginUser(email: string, password: string) {
  // Admin login
  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
    return {
      success: true,
      user: { id: 1, name: 'Harry - Admin', email: ADMIN_EMAIL, role: 'admin' as const },
    };
  }

  // Student login
  const student = inMemoryStudents.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!student) {
    return { success: false, message: 'Invalid email or password' };
  }

  return {
    success: true,
    user: { id: student.id, name: student.name, email: student.email, role: 'student' as const },
  };
}

export async function registerUser(name: string, email: string, password: string) {
  const existing = inMemoryStudents.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) return { success: false, message: 'Email already registered' };

  const newUser: User = {
    id: inMemoryStudents.length + 100,
    name,
    email: email.toLowerCase(),
    password,
    role: 'student',
    createdAt: new Date(),
  };
  inMemoryStudents.push(newUser);
  return { success: true, message: 'Registration successful' };
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getAllUsers() {
  return {
    success: true,
    users: inMemoryStudents.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
    })),
  };
}

// ─── Courses ──────────────────────────────────────────────────────────────────

export async function getAllCourses() {
  return { success: true, courses: inMemoryCourses };
}

export async function createCourse(course: {
  title: string;
  code: string;
  description: string;
  instructor: string;
  schedule: string;
  credits: number;
}) {
  const newCourse: Course = {
    id: inMemoryCourses.length + 1,
    ...course,
    createdAt: new Date(),
  };
  inMemoryCourses.push(newCourse);
  return { success: true, message: 'Course created' };
}

// ─── Announcements ────────────────────────────────────────────────────────────

export async function getAnnouncements() {
  return { success: true, announcements: [...inMemoryAnnouncements].reverse() };
}

export async function createAnnouncement(data: {
  title: string;
  content: string;
  authorId: number;
  priority: string;
}) {
  const newAnn: Announcement = {
    id: inMemoryAnnouncements.length + 1,
    ...data,
    createdAt: new Date(),
  };
  inMemoryAnnouncements.push(newAnn);
  return { success: true, message: 'Announcement created' };
}

// ─── Enrollments ──────────────────────────────────────────────────────────────

export async function enrollStudent(userId: number, courseId: number) {
  const already = inMemoryEnrollments.find(e => e.userId === userId && e.courseId === courseId);
  if (already) return { success: false, message: 'Already enrolled' };

  inMemoryEnrollments.push({
    id: inMemoryEnrollments.length + 1,
    userId,
    courseId,
    grade: '',
    status: 'enrolled',
    createdAt: new Date(),
  });
  return { success: true, message: 'Enrolled successfully' };
}

export async function getStudentEnrollments(userId: number) {
  const result = inMemoryEnrollments
    .filter(e => e.userId === userId)
    .map(e => {
      const course = inMemoryCourses.find(c => c.id === e.courseId);
      return {
        id: e.id,
        grade: e.grade || null,
        status: e.status,
        courseTitle: course?.title || null,
        courseCode: course?.code || null,
        courseInstructor: course?.instructor || null,
        courseSchedule: course?.schedule || null,
        courseCredits: course?.credits || null,
        courseDescription: course?.description || null,
      };
    });
  return { success: true, enrollments: result };
}

export async function getAllEnrollments() {
  const result = inMemoryEnrollments.map(e => {
    const student = inMemoryStudents.find(u => u.id === e.userId);
    const course = inMemoryCourses.find(c => c.id === e.courseId);
    return {
      id: e.id,
      grade: e.grade || null,
      status: e.status,
      userName: student?.name || null,
      userEmail: student?.email || null,
      courseTitle: course?.title || null,
      courseCode: course?.code || null,
    };
  });
  return { success: true, enrollments: result };
}
