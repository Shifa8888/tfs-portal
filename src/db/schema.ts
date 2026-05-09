import { pgTable, serial, varchar, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).notNull().default('student'), // 'admin' or 'student'
  avatar: text('avatar').default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  description: text('description').notNull(),
  instructor: varchar('instructor', { length: 255 }).notNull(),
  schedule: varchar('schedule', { length: 255 }).notNull(),
  credits: integer('credits').default(3),
  createdAt: timestamp('created_at').defaultNow(),
});

export const enrollments = pgTable('enrollments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  courseId: integer('course_id').notNull(),
  grade: varchar('grade', { length: 5 }).default(''),
  status: varchar('status', { length: 20 }).default('enrolled'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  authorId: integer('author_id').notNull(),
  priority: varchar('priority', { length: 20 }).default('normal'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const schedules = pgTable('schedules', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  day: varchar('day', { length: 20 }).notNull(),
  time: varchar('time', { length: 50 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  room: varchar('room', { length: 100 }).default(''),
  createdAt: timestamp('created_at').defaultNow(),
});
