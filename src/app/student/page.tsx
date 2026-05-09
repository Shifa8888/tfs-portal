'use client';

import { useEffect, useState, type ReactElement } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/context';
import { CyberBackground } from '@/components/CyberBackground';
import { ThemeSelector } from '@/components/ThemeSelector';
import {
  GraduationCap, BookOpen, Calendar, Award, Clock, LogOut,
  Search, Bell, User, TrendingUp, Star, BookMarked,
  ChevronRight, Check, AlertCircle
} from 'lucide-react';
import {
  getAllCourses, getAnnouncements, getStudentEnrollments
} from '@/lib/auth';

interface Course {
  id: number;
  title: string;
  code: string;
  description: string;
  instructor: string;
  schedule: string;
  credits: number | null;
  createdAt: Date | null;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  authorId: number;
  priority: string | null;
  createdAt: Date | null;
}

interface Enrollment {
  id: number;
  grade: string | null;
  status: string | null;
  courseTitle: string | null;
  courseCode: string | null;
  courseInstructor: string | null;
  courseSchedule: string | null;
  courseCredits: number | null;
  courseDescription: string | null;
}

export default function StudentDashboard() {
  const { user, setUser, theme } = useApp();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/');
      return;
    }
    loadData();
  }, [user, router]);

  const loadData = async () => {
    setLoading(true);
    const [coursesRes, announcementsRes, enrollmentsRes] = await Promise.all([
      getAllCourses(),
      getAnnouncements(),
      getStudentEnrollments(user?.id || 0),
    ]);
    if (coursesRes.success && coursesRes.courses) setCourses(coursesRes.courses);
    if (announcementsRes.success && announcementsRes.announcements) setAnnouncements(announcementsRes.announcements);
    if (enrollmentsRes.success && enrollmentsRes.enrollments) setEnrollments(enrollmentsRes.enrollments);
    setLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    router.push('/');
  };

  const getGradeColor = (grade: string | null) => {
    if (!grade) return 'var(--text-secondary)';
    if (grade.startsWith('A')) return '#00ff41';
    if (grade.startsWith('B')) return '#00ffff';
    if (grade.startsWith('C')) return '#ffff00';
    if (grade.startsWith('D')) return '#ff6600';
    return '#ff0040';
  };

  const enrolledCourseIds = enrollments.map(e => e.courseTitle);

  const navItems = [
    { id: 'dashboard', icon: GraduationCap, label: 'Dashboard' },
    { id: 'courses', icon: BookOpen, label: 'My Courses' },
    { id: 'browse', icon: Search, label: 'Browse' },
    { id: 'schedule', icon: Calendar, label: 'Schedule' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  const tabs: Record<string, ReactElement> = {
    dashboard: (
      <div>
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cyber-card"
          style={{
            padding: '32px',
            marginBottom: '30px',
            background: 'linear-gradient(135deg, rgba(0,255,255,0.1), rgba(255,0,255,0.05))',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'var(--accent-primary)', opacity: 0.05 }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', letterSpacing: '2px', marginBottom: '8px' }}>
              // WELCOME BACK
            </p>
            <h1 style={{ fontFamily: 'var(--font-cyber)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, color: 'var(--accent-primary)', textShadow: 'var(--glow-primary)', marginBottom: '8px' }}>
              Hello, {user?.name}! 👋
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '600px' }}>
              Ready to continue your learning journey? You have {enrollments.length} active courses and {announcements.length} new announcements.
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '30px' }}>
          {[
            { icon: BookOpen, label: 'Enrolled Courses', value: enrollments.length, color: '#00ffff' },
            { icon: Clock, label: 'Study Hours', value: enrollments.length * 3, color: '#ff00ff', suffix: ' hrs' },
            { icon: Award, label: 'Average Grade', value: enrollments.filter(e => e.grade).length > 0 ? 'A' : 'N/A', color: '#ffff00' },
            { icon: TrendingUp, label: 'Completion', value: enrollments.length > 0 ? '65' : '0', color: '#00ff41', suffix: '%' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="cyber-card stat-card"
              style={{ padding: '20px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '10px',
                  background: `${stat.color}15`,
                  border: `1px solid ${stat.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <stat.icon size={22} color={stat.color} />
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '1px', opacity: 0.7 }}>{stat.label}</p>
                  <p style={{ fontFamily: 'var(--font-cyber)', fontSize: '24px', fontWeight: 800, color: stat.color }}>
                    {stat.value}{stat.suffix || ''}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
          {/* My Courses */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="cyber-card"
            style={{ padding: '24px' }}
          >
            <h3 style={{ fontFamily: 'var(--font-cyber)', fontSize: '14px', color: 'var(--accent-primary)', letterSpacing: '2px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} />
              MY COURSES
            </h3>
            {enrollments.slice(0, 4).map((enroll, i) => (
              <motion.div
                key={enroll.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px',
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '10px',
                  marginBottom: '10px',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div className="cyber-avatar" style={{ width: '40px', height: '40px', fontSize: '16px', flexShrink: 0 }}>
                  📖
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {enroll.courseTitle || 'N/A'}
                  </p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)', opacity: 0.6 }}>
                    {enroll.courseCode || ''} • {enroll.courseInstructor || ''}
                  </p>
                </div>
                {enroll.grade ? (
                  <span style={{ fontFamily: 'var(--font-cyber)', fontSize: '18px', fontWeight: 800, color: getGradeColor(enroll.grade) }}>
                    {enroll.grade}
                  </span>
                ) : (
                  <span className="cyber-badge badge-info">In Progress</span>
                )}
              </motion.div>
            ))}
            {enrollments.length === 0 && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)', opacity: 0.5, textAlign: 'center', padding: '20px' }}>
                No courses enrolled yet. Browse courses to get started!
              </p>
            )}
          </motion.div>

          {/* Announcements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="cyber-card"
            style={{ padding: '24px' }}
          >
            <h3 style={{ fontFamily: 'var(--font-cyber)', fontSize: '14px', color: 'var(--accent-primary)', letterSpacing: '2px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} />
              LATEST ANNOUNCEMENTS
            </h3>
            {announcements.slice(0, 5).map((ann, i) => (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="announcement-card"
                style={{ padding: '12px 0 12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {ann.title}
                  </h4>
                  <span className={`cyber-badge ${ann.priority === 'high' ? 'badge-danger' : 'badge-info'}`}>
                    {ann.priority || 'normal'}
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, opacity: 0.8 }}>
                  {ann.content.length > 100 ? ann.content.substring(0, 100) + '...' : ann.content}
                </p>
              </motion.div>
            ))}
            {announcements.length === 0 && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)', opacity: 0.5, textAlign: 'center', padding: '20px' }}>
                No announcements yet
              </p>
            )}
          </motion.div>
        </div>
      </div>
    ),

    courses: (
      <div>
        <h2 style={{ fontFamily: 'var(--font-cyber)', fontSize: '20px', color: 'var(--accent-primary)', letterSpacing: '3px', marginBottom: '24px' }}>
          📚 MY ENROLLED COURSES
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {enrollments.map((enroll, i) => (
            <motion.div
              key={enroll.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="cyber-card"
              style={{ padding: '24px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-primary)', letterSpacing: '2px' }}>
                    {enroll.courseCode}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                    {enroll.courseTitle}
                  </h3>
                </div>
                <div className="cyber-avatar" style={{ width: '40px', height: '40px', fontSize: '16px' }}>📖</div>
              </div>

              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
                {enroll.courseDescription}
              </p>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span className="cyber-badge badge-info">👤 {enroll.courseInstructor}</span>
                <span className="cyber-badge badge-success">⭐ {enroll.courseCredits || 3} Credits</span>
                <span className="cyber-badge badge-warning">🕐 {enroll.courseSchedule}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)', opacity: 0.5, marginBottom: '4px' }}>Progress</p>
                  <div className="cyber-progress" style={{ width: '120px' }}>
                    <div className="cyber-progress-fill" style={{ width: '65%' }} />
                  </div>
                </div>
                {enroll.grade ? (
                  <span style={{ fontFamily: 'var(--font-cyber)', fontSize: '24px', fontWeight: 800, color: getGradeColor(enroll.grade) }}>
                    {enroll.grade}
                  </span>
                ) : (
                  <span className="cyber-badge badge-info">In Progress</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        {enrollments.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ fontSize: '64px', marginBottom: '16px' }}>📚</p>
            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', opacity: 0.5 }}>
              You haven't enrolled in any courses yet.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cyber-btn"
              onClick={() => setActiveTab('browse')}
              style={{ marginTop: '20px' }}
            >
              Browse Courses
            </motion.button>
          </div>
        )}
      </div>
    ),

    browse: (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontFamily: 'var(--font-cyber)', fontSize: '20px', color: 'var(--accent-primary)', letterSpacing: '3px' }}>
            🔍 BROWSE COURSES
          </h2>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--accent-primary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="cyber-input"
              placeholder="Search courses..."
              style={{ paddingLeft: '36px', width: '280px' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {courses
            .filter(c =>
              c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
              c.instructor.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((course, i) => {
              const isEnrolled = enrolledCourseIds.includes(course.title);
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="cyber-card"
                  style={{ padding: '24px', position: 'relative' }}
                >
                  {isEnrolled && (
                    <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                      <span className="cyber-badge badge-success">✓ Enrolled</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-primary)', letterSpacing: '2px' }}>
                        {course.code}
                      </span>
                      <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                        {course.title}
                      </h3>
                    </div>
                    <div className="cyber-avatar" style={{ width: '40px', height: '40px', fontSize: '16px' }}>📖</div>
                  </div>

                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px', minHeight: '42px' }}>
                    {course.description}
                  </p>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <span className="cyber-badge badge-info">👤 {course.instructor}</span>
                    <span className="cyber-badge badge-success">⭐ {course.credits || 3} Credits</span>
                    <span className="cyber-badge badge-warning">🕐 {course.schedule}</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: isEnrolled ? 1 : 1.05 }}
                    whileTap={{ scale: isEnrolled ? 1 : 0.95 }}
                    className="cyber-btn"
                    disabled={isEnrolled}
                    style={{
                      width: '100%',
                      opacity: isEnrolled ? 0.6 : 1,
                    }}
                  >
                    {isEnrolled ? 'Already Enrolled' : 'Enroll Now'}
                  </motion.button>
                </motion.div>
              );
            })}
        </div>
        {courses.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ fontSize: '64px', marginBottom: '16px' }}>📚</p>
            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', opacity: 0.5 }}>
              No courses available yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    ),

    schedule: (
      <div>
        <h2 style={{ fontFamily: 'var(--font-cyber)', fontSize: '20px', color: 'var(--accent-primary)', letterSpacing: '3px', marginBottom: '24px' }}>
          📅 MY SCHEDULE
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, i) => {
            const dayCourses = enrollments.filter(e => e.courseSchedule?.toLowerCase().includes(day.toLowerCase()));
            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="cyber-card"
                style={{ padding: '20px' }}
              >
                <h3 style={{
                  fontFamily: 'var(--font-cyber)',
                  fontSize: '12px',
                  color: 'var(--accent-primary)',
                  letterSpacing: '2px',
                  marginBottom: '16px',
                  textAlign: 'center',
                }}>
                  {day.toUpperCase()}
                </h3>
                {dayCourses.length > 0 ? (
                  dayCourses.map((course, j) => (
                    <div key={j} style={{
                      padding: '12px',
                      background: 'rgba(0,0,0,0.3)',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      borderLeft: '3px solid var(--accent-primary)',
                    }}>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {course.courseTitle}
                      </p>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)', opacity: 0.6 }}>
                        {course.courseSchedule}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', opacity: 0.3, textAlign: 'center' }}>
                    No classes
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    ),

    profile: (
      <div>
        <h2 style={{ fontFamily: 'var(--font-cyber)', fontSize: '20px', color: 'var(--accent-primary)', letterSpacing: '3px', marginBottom: '24px' }}>
          👤 MY PROFILE
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
          <div className="cyber-card" style={{ padding: '32px', textAlign: 'center' }}>
            <div className="cyber-avatar" style={{
              width: '100px',
              height: '100px',
              fontSize: '40px',
              margin: '0 auto 20px',
            }}>
              {user?.name.charAt(0) || 'S'}
            </div>
            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {user?.name}
            </h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--accent-primary)', marginBottom: '16px' }}>
              {user?.email}
            </p>
            <span className="cyber-badge badge-success" style={{ fontSize: '14px', padding: '6px 16px' }}>
              STUDENT
            </span>
          </div>

          <div className="cyber-card" style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-cyber)', fontSize: '14px', color: 'var(--accent-primary)', letterSpacing: '2px', marginBottom: '20px' }}>
              📊 ACADEMIC OVERVIEW
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>Courses Enrolled</span>
                <span style={{ fontFamily: 'var(--font-cyber)', fontSize: '18px', fontWeight: 800, color: 'var(--accent-primary)' }}>{enrollments.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>Total Credits</span>
                <span style={{ fontFamily: 'var(--font-cyber)', fontSize: '18px', fontWeight: 800, color: '#ffff00' }}>
                  {enrollments.reduce((sum, e) => sum + (e.courseCredits || 0), 0)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>Completed</span>
                <span style={{ fontFamily: 'var(--font-cyber)', fontSize: '18px', fontWeight: 800, color: '#00ff41' }}>
                  {enrollments.filter(e => e.grade).length}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>Status</span>
                <span className="cyber-badge badge-success">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="cyber-card" style={{ padding: '24px', marginTop: '20px' }}>
          <h3 style={{ fontFamily: 'var(--font-cyber)', fontSize: '14px', color: 'var(--accent-primary)', letterSpacing: '2px', marginBottom: '20px' }}>
            🏆 ACHIEVEMENTS
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
            {[
              { icon: '🎯', name: 'First Enrollment', desc: 'Enrolled in first course', unlocked: enrollments.length > 0 },
              { icon: '📚', name: 'Bookworm', desc: 'Enrolled in 3+ courses', unlocked: enrollments.length >= 3 },
              { icon: '⭐', name: 'Top Student', desc: 'Achieved A grade', unlocked: enrollments.some(e => e.grade === 'A') },
              { icon: '🔥', name: 'Streak', desc: '7 day login streak', unlocked: false },
              { icon: '🎓', name: 'Scholar', desc: 'Completed 5 courses', unlocked: enrollments.filter(e => e.grade).length >= 5 },
              { icon: '💎', name: 'Dedicated', desc: 'All A grades', unlocked: false },
            ].map((ach, i) => (
              <motion.div
                key={ach.name}
                whileHover={{ scale: 1.05 }}
                style={{
                  padding: '20px',
                  background: ach.unlocked ? 'rgba(0,255,255,0.1)' : 'rgba(0,0,0,0.3)',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: ach.unlocked ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.05)',
                  opacity: ach.unlocked ? 1 : 0.5,
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{ach.icon}</div>
                <p style={{ fontFamily: 'var(--font-cyber)', fontSize: '11px', color: ach.unlocked ? 'var(--accent-primary)' : 'var(--text-secondary)', letterSpacing: '1px', marginBottom: '4px' }}>
                  {ach.name}
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)', opacity: 0.6 }}>
                  {ach.desc}
                </p>
                {ach.unlocked && <span style={{ fontFamily: 'var(--font-cyber)', fontSize: '9px', color: '#00ff41' }}>✓ UNLOCKED</span>}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    ),
  };

  if (!user || user.role !== 'student') return null;

  return (
    <div className={`theme-${theme} cyber-bg`} style={{ minHeight: '100vh', position: 'relative' }}>
      <CyberBackground />

      {/* Navigation */}
      <nav className="cyber-nav" style={{ position: 'sticky', top: 0, zIndex: 50, padding: '12px 24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <GraduationCap size={24} color="var(--accent-primary)" />
            <h1 style={{ fontFamily: 'var(--font-cyber)', fontSize: '16px', fontWeight: 800, color: 'var(--accent-primary)', letterSpacing: '3px' }}>
              STUDENT PORTAL
            </h1>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--accent-secondary)',
              padding: '2px 8px',
              border: '1px solid var(--accent-secondary)',
              borderRadius: '10px',
            }}>
              v2.0
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {navItems.map(item => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(item.id)}
                className={`cyber-nav-item ${activeTab === item.id ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-cyber)',
                  letterSpacing: '1px',
                }}
              >
                <item.icon size={14} />
                <span style={{ display: 'inline' }}>{item.label}</span>
              </motion.button>
            ))}
            <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 8px' }} />
            <ThemeSelector />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              style={{
                background: 'rgba(255,0,64,0.1)',
                border: '1px solid rgba(255,0,64,0.3)',
                borderRadius: '8px',
                padding: '8px 14px',
                color: '#ff0040',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-cyber)',
                fontSize: '11px',
                letterSpacing: '1px',
              }}
            >
              <LogOut size={14} />
              Logout
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '30px 24px', position: 'relative', zIndex: 10 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {tabs[activeTab]}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
