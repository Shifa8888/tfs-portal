'use server';

import { users, courses, announcements, enrollments } from '@/db/schema';
import { db } from '@/db/index';
import { eq } from 'drizzle-orm';

const ADMIN_EMAIL = 'Harrypotter24321@gmail.com';
const ADMIN_PASSWORD = 'Harry(890)';

export async function loginUser(email: string, password: string) {
  try {
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      const existingAdmin = await db.select().from(users).where(eq(users.email, ADMIN_EMAIL));
      if (existingAdmin.length === 0) {
        await db.insert(users).values({
          name: 'Harry - Admin',
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          role: 'admin',
        });
      }
      return {
        success: true,
        user: { id: existingAdmin[0]?.id || 1, name: 'Harry - Admin', email: ADMIN_EMAIL, role: 'admin' as const },
      };
    }

    const user = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    if (user.length === 0 || user[0].password !== password) {
      return { success: false, message: 'Invalid email or password' };
    }

    return {
      success: true,
      user: { id: user[0].id, name: user[0].name, email: user[0].email, role: user[0].role as 'admin' | 'student' },
    };
  } catch {
    return { success: false, message: 'Login failed. Please try again.' };
  }
}

export async function registerUser(name: string, email: string, password: string) {
  try {
    const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    if (existing.length > 0) return { success: false, message: 'Email already registered' };
    await db.insert(users).values({ name, email: email.toLowerCase(), password, role: 'student' });
    return { success: true, message: 'Registration successful' };
  } catch {
    return { success: false, message: 'Registration failed' };
  }
}

export async function getAllUsers() {
  try {
    const result = await db.select().from(users).where(eq(users.role, 'student'));
    return { success: true, users: result };
  } catch {
    return { success: false, message: 'Failed to fetch users' };
  }
}

export async function getAllCourses() {
  try {
    const result = await db.select().from(courses);
    return { success: true, courses: result };
  } catch {
    return { success: false, message: 'Failed to fetch courses' };
  }
}

export async function createCourse(course: { title: string; code: string; description: string; instructor: string; schedule: string; credits: number }) {
  try {
    await db.insert(courses).values(course);
    return { success: true, message: 'Course created' };
  } catch {
    return { success: false, message: 'Failed to create course' };
  }
}

export async function createAnnouncement(data: { title: string; content: string; authorId: number; priority: string }) {
  try {
    await db.insert(announcements).values(data);
    return { success: true, message: 'Announcement created' };
  } catch {
    return { success: false, message: 'Failed to create announcement' };
  }
}

export async function getAnnouncements() {
  try {
    const result = await db.select().from(announcements).orderBy(announcements.createdAt);
    return { success: true, announcements: result };
  } catch {
    return { success: false, message: 'Failed to fetch announcements' };
  }
}

export async function enrollStudent(userId: number, courseId: number) {
  try {
    await db.insert(enrollments).values({ userId, courseId, status: 'enrolled' });
    return { success: true, message: 'Student enrolled' };
  } catch {
    return { success: false, message: 'Failed to enroll student' };
  }
}

export async function getStudentEnrollments(userId: number) {
  try {
    const result = await db
      .select({
        id: enrollments.id,
        grade: enrollments.grade,
        status: enrollments.status,
        courseTitle: courses.title,
        courseCode: courses.code,
        courseInstructor: courses.instructor,
        courseSchedule: courses.schedule,
        courseCredits: courses.credits,
        courseDescription: courses.description,
      })
      .from(enrollments)
      .leftJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, userId));
    return { success: true, enrollments: result };
  } catch {
    return { success: false, message: 'Failed to fetch enrollments' };
  }
}

export async function getAllEnrollments() {
  try {
    const result = await db
      .select({
        id: enrollments.id,
        grade: enrollments.grade,
        status: enrollments.status,
        userName: users.name,
        userEmail: users.email,
        courseTitle: courses.title,
        courseCode: courses.code,
      })
      .from(enrollments)
      .leftJoin(users, eq(enrollments.userId, users.id))
      .leftJoin(courses, eq(enrollments.courseId, courses.id));
    return { success: true, enrollments: result };
  } catch {
    return { success: false, message: 'Failed to fetch enrollments' };
  }
}
