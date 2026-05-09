'use client';

import { useEffect, useState, type ReactElement } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/context';
import { CyberBackground } from '@/components/CyberBackground';
import { ThemeSelector } from '@/components/ThemeSelector';
import {
  Shield, Users, BookOpen, Bell, Settings, LogOut, Plus,
  Search, ChevronRight, TrendingUp, Award, Calendar, Eye, Edit, Trash2
} from 'lucide-react';
import {
  getAllUsers, getAllCourses, getAnnouncements,
  createCourse, createAnnouncement, getAllEnrollments
} from '@/lib/auth';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: Date | null;
}

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

export default function AdminDashboard() {
  const { user, setUser, theme } = useApp();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [showModal, setShowModal] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Form states
  const [newCourse, setNewCourse] = useState({ title: '', code: '', description: '', instructor: '', schedule: '', credits: 3 });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', priority: 'normal' });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }
    loadData();
  }, [user, router]);

  const loadData = async () => {
    setLoading(true);
    const [usersRes, coursesRes, announcementsRes, enrollmentsRes] = await Promise.all([
      getAllUsers(),
      getAllCourses(),
      getAnnouncements(),
      getAllEnrollments(),
    ]);
    if (usersRes.success && usersRes.users) setStudents(usersRes.users);
    if (coursesRes.success && coursesRes.courses) setCourses(coursesRes.courses);
    if (announcementsRes.success && announcementsRes.announcements) setAnnouncements(announcementsRes.announcements);
    if (enrollmentsRes.success && enrollmentsRes.enrollments) setEnrollments(enrollmentsRes.enrollments);
    setLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    router.push('/');
  };

  const handleCreateCourse = async () => {
    if (!newCourse.title || !newCourse.code) return;
    await createCourse(newCourse);
    setNewCourse({ title: '', code: '', description: '', instructor: '', schedule: '', credits: 3 });
    setShowModal(null);
    loadData();
  };

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) return;
    await createAnnouncement({ ...newAnnouncement, authorId: user?.id || 1 });
    setNewAnnouncement({ title: '', content: '', priority: 'normal' });
    setShowModal(null);
    loadData();
  };

  const handleDeleteCourse = async (id: number) => {
    // Soft delete by filtering
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const navItems = [
    { id: 'dashboard', icon: Shield, label: 'Dashboard' },
    { id: 'students', icon: Users, label: 'Students' },
    { id: 'courses', icon: BookOpen, label: 'Courses' },
    { id: 'announcements', icon: Bell, label: 'Announcements' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const tabs: Record<string, ReactElement> = {
    dashboard: (
      <div>
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          {[
            { icon: Users, label: 'Total Students', value: students.length, color: '#00ffff' },
            { icon: BookOpen, label: 'Active Courses', value: courses.length, color: '#ff00ff' },
            { icon: Bell, label: 'Announcements', value: announcements.length, color: '#ffff00' },
            { icon: TrendingUp, label: 'Enrollments', value: enrollments.length, color: '#00ff41' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="cyber-card stat-card"
              style={{ padding: '24px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}>
                    {stat.label}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-cyber)',
                    fontSize: '36px',
                    fontWeight: 800,
                    color: stat.color,
                    textShadow: `0 0 20px ${stat.color}40`,
                  }}>
                    {stat.value}
                  </p>
                </div>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: `${stat.color}15`,
                  border: `1px solid ${stat.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <stat.icon size={24} color={stat.color} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent activity */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="cyber-card"
            style={{ padding: '24px' }}
          >
            <h3 style={{
              fontFamily: 'var(--font-cyber)',
              fontSize: '14px',
              color: 'var(--accent-primary)',
              letterSpacing: '2px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <Award size={18} />
              RECENT ENROLLMENTS
            </h3>
            {enrollments.slice(0, 5).map((enroll, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="cyber-avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                    {enroll.userName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>
                      {enroll.userName || 'Unknown'}
                    </p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)', opacity: 0.6 }}>
                      {enroll.courseCode || 'N/A'}
                    </p>
                  </div>
                </div>
                <span className={`cyber-badge ${enroll.status === 'enrolled' ? 'badge-success' : 'badge-info'}`}>
                  {enroll.status}
                </span>
              </div>
            ))}
            {enrollments.length === 0 && (
              <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '13px', opacity: 0.5 }}>
                No enrollments yet
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="cyber-card"
            style={{ padding: '24px' }}
          >
            <h3 style={{
              fontFamily: 'var(--font-cyber)',
              fontSize: '14px',
              color: 'var(--accent-primary)',
              letterSpacing: '2px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <Calendar size={18} />
              QUICK ACTIONS
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: Plus, label: 'Add New Course', action: () => setShowModal('course'), color: '#00ffff' },
                { icon: Bell, label: 'Post Announcement', action: () => setShowModal('announcement'), color: '#ff00ff' },
                { icon: Users, label: 'View All Students', action: () => setActiveTab('students'), color: '#ffff00' },
                { icon: BookOpen, label: 'Manage Courses', action: () => setActiveTab('courses'), color: '#00ff41' },
              ].map((action, i) => (
                <motion.button
                  key={action.label}
                  whileHover={{ x: 6 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={action.action}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 18px',
                    background: `${action.color}08`,
                    border: `1px solid ${action.color}20`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'all 0.3s',
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: `${action.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <action.icon size={18} color={action.color} />
                  </div>
                  <span>{action.label}</span>
                  <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.4 }} />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    ),

    students: (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontFamily: 'var(--font-cyber)', fontSize: '20px', color: 'var(--accent-primary)', letterSpacing: '3px' }}>
            ðŸ‘¨â€ðŸŽ“ STUDENT MANAGEMENT
          </h2>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--accent-primary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="cyber-input"
              placeholder="Search students..."
              style={{ paddingLeft: '36px', width: '280px' }}
            />
          </div>
        </div>

        <div className="cyber-card" style={{ overflow: 'hidden' }}>
          <table className="cyber-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Status</th>
                <th>Enrolled</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students
                .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(student => {
                  const enrolledCourses = enrollments.filter(e => e.userEmail === student.email).length;
                  return (
                    <tr key={student.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div className="cyber-avatar" style={{ width: '36px', height: '36px', fontSize: '14px' }}>
                            {student.name.charAt(0)}
                          </div>
                          <span style={{ fontWeight: 600, fontFamily: 'var(--font-body)' }}>{student.name}</span>
                        </div>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)' }}>{student.email}</td>
                      <td><span className="cyber-badge badge-success">Active</span></td>
                      <td style={{ fontFamily: 'var(--font-cyber)', fontSize: '14px', color: 'var(--accent-primary)' }}>{enrolledCourses} courses</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ background: 'rgba(0,255,255,0.1)', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: 'var(--accent-primary)' }}>
                            <Eye size={14} />
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ background: 'rgba(255,255,0,0.1)', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: '#ffff00' }}>
                            <Edit size={14} />
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ background: 'rgba(255,0,64,0.1)', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: '#ff0040' }}>
                            <Trash2 size={14} />
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {students.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', opacity: 0.5 }}>
                No students registered yet
              </p>
            </div>
          )}
        </div>
      </div>
    ),

    courses: (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontFamily: 'var(--font-cyber)', fontSize: '20px', color: 'var(--accent-primary)', letterSpacing: '3px' }}>
            ðŸ“š COURSE MANAGEMENT
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cyber-btn"
            onClick={() => setShowModal('course')}
          >
            <Plus size={16} style={{ marginRight: '8px' }} />
            Add Course
          </motion.button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="cyber-card"
              style={{ padding: '24px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--accent-primary)',
                    letterSpacing: '2px',
                  }}>
                    {course.code}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                    {course.title}
                  </h3>
                </div>
                <div className="cyber-avatar" style={{ width: '36px', height: '36px', fontSize: '14px' }}>
                  ðŸ“–
                </div>
              </div>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '16px',
                opacity: 0.8,
                minHeight: '40px',
              }}>
                {course.description}
              </p>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span className="cyber-badge badge-info">
                  ðŸ‘¤ {course.instructor}
                </span>
                <span className="cyber-badge badge-success">
                  â­ {course.credits} Credits
                </span>
                <span className="cyber-badge badge-warning">
                  ðŸ• {course.schedule}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ flex: 1, padding: '8px', background: 'rgba(0,255,255,0.1)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--accent-primary)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                  <Edit size={12} style={{ marginRight: '4px' }} /> Edit
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleDeleteCourse(course.id)} style={{ flex: 1, padding: '8px', background: 'rgba(255,0,64,0.1)', border: '1px solid rgba(255,0,64,0.3)', borderRadius: '6px', color: '#ff0040', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                  <Trash2 size={12} style={{ marginRight: '4px' }} /> Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
        {courses.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>ðŸ“š</p>
            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', opacity: 0.5 }}>
              No courses yet. Click "Add Course" to create one.
            </p>
          </div>
        )}
      </div>
    ),

    announcements: (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontFamily: 'var(--font-cyber)', fontSize: '20px', color: 'var(--accent-primary)', letterSpacing: '3px' }}>
            ðŸ“¢ ANNOUNCEMENTS
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cyber-btn"
            onClick={() => setShowModal('announcement')}
          >
            <Plus size={16} style={{ marginRight: '8px' }} />
            Post Announcement
          </motion.button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {announcements.map((ann, i) => (
            <motion.div
              key={ann.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="cyber-card announcement-card"
              style={{ padding: '20px 20px 20px 24px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {ann.title}
                </h3>
                <span className={`cyber-badge ${ann.priority === 'high' ? 'badge-danger' : ann.priority === 'medium' ? 'badge-warning' : 'badge-info'}`}>
                  {ann.priority || 'normal'}
                </span>
              </div>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}>
                {ann.content}
              </p>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-secondary)',
                opacity: 0.4,
                marginTop: '12px',
              }}>
                Posted: {ann.createdAt?.toLocaleDateString() || 'N/A'}
              </p>
            </motion.div>
          ))}
        </div>
        {announcements.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>ðŸ“¢</p>
            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', opacity: 0.5 }}>
              No announcements yet. Click "Post Announcement" to create one.
            </p>
          </div>
        )}
      </div>
    ),

    settings: (
      <div>
        <h2 style={{ fontFamily: 'var(--font-cyber)', fontSize: '20px', color: 'var(--accent-primary)', letterSpacing: '3px', marginBottom: '24px' }}>
          âš™ï¸ SYSTEM SETTINGS
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
          <div className="cyber-card" style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-cyber)', fontSize: '14px', color: 'var(--accent-primary)', letterSpacing: '2px', marginBottom: '20px' }}>
              ðŸŽ¨ THEME CONFIGURATION
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
              {[
                { id: 'neon', name: 'Neon', color: '#00ffff' },
                { id: 'matrix', name: 'Matrix', color: '#00ff41' },
                { id: 'synthwave', name: 'Synth', color: '#ff00ff' },
                { id: 'ice', name: 'Ice', color: '#00d4ff' },
                { id: 'crimson', name: 'Crimson', color: '#ff0040' },
              ].map(t => (
                <motion.button
                  key={t.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Theme is handled by context
                  }}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: t.color,
                    border: theme === t.id ? '3px solid #fff' : '3px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    boxShadow: theme === t.id ? `0 0 15px ${t.color}` : 'none',
                  }}
                  title={t.name}
                >
                  <span style={{ fontSize: '8px', color: '#000', fontWeight: 700, fontFamily: 'var(--font-cyber)' }}>{t.name.substring(0, 2).toUpperCase()}</span>
                </motion.button>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)', opacity: 0.5, marginTop: '12px' }}>
              Use theme selector in navigation to change
            </p>
          </div>

          <div className="cyber-card" style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-cyber)', fontSize: '14px', color: 'var(--accent-primary)', letterSpacing: '2px', marginBottom: '20px' }}>
              ðŸ‘¤ ADMIN PROFILE
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div className="cyber-avatar" style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                {user?.name.charAt(0) || 'A'}
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {user?.name}
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-primary)' }}>
                  {user?.email}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', opacity: 0.6 }}>Role</span>
                <span className="cyber-badge badge-danger">ADMIN</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', opacity: 0.6 }}>Access Level</span>
                <span style={{ fontFamily: 'var(--font-cyber)', fontSize: '12px', color: 'var(--accent-primary)' }}>Level 5</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', opacity: 0.6 }}>Status</span>
                <span className="cyber-badge badge-success">ONLINE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="cyber-card" style={{ padding: '24px', marginTop: '20px' }}>
          <h3 style={{ fontFamily: 'var(--font-cyber)', fontSize: '14px', color: 'var(--accent-primary)', letterSpacing: '2px', marginBottom: '20px' }}>
            ðŸ“Š SYSTEM STATS
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Database Status', value: 'Connected', badge: 'badge-success' as const },
              { label: 'API Health', value: 'Operational', badge: 'badge-success' as const },
              { label: 'Uptime', value: '99.9%', badge: 'badge-info' as const },
              { label: 'System Version', value: 'v2.0.26', badge: 'badge-warning' as const },
            ].map(stat => (
              <div key={stat.label} style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)', opacity: 0.6, letterSpacing: '1px', marginBottom: '8px' }}>{stat.label}</p>
                <span className={`cyber-badge ${stat.badge}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className={`theme-${theme} cyber-bg`} style={{ minHeight: '100vh', position: 'relative' }}>
      <CyberBackground />

      {/* Navigation */}
      <nav className="cyber-nav" style={{ position: 'sticky', top: 0, zIndex: 50, padding: '12px 24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shield size={24} color="var(--accent-primary)" />
            <h1 style={{ fontFamily: 'var(--font-cyber)', fontSize: '16px', fontWeight: 800, color: 'var(--accent-primary)', letterSpacing: '3px' }}>
              ADMIN PORTAL
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

      {/* Modals */}
      <AnimatePresence>
        {showModal === 'course' && (
          <div className="modal-overlay" onClick={() => setShowModal(null)} style={{ padding: '16px' }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="cyber-card"
              style={{ padding: '20px', width: '100%', maxWidth: '420px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-cyber)', fontSize: '13px', color: 'var(--accent-primary)', letterSpacing: '2px', margin: 0 }}>
                  âž• CREATE COURSE
                </h3>
                <button onClick={() => setShowModal(null)} style={{ background: 'rgba(255,0,64,0.15)', border: '1px solid rgba(255,0,64,0.3)', borderRadius: '6px', color: '#ff0040', cursor: 'pointer', padding: '4px 10px', fontSize: '16px', lineHeight: 1 }}>âœ•</button>
              </div>

              {/* Two-column grid for short fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                {['title', 'code', 'instructor', 'schedule'].map(field => (
                  <div key={field} style={{ gridColumn: field === 'title' ? 'span 2' : 'span 1' }}>
                    <label style={{ fontFamily: 'var(--font-cyber)', fontSize: '9px', letterSpacing: '2px', color: 'var(--accent-primary)', marginBottom: '4px', display: 'block' }}>
                      {field.toUpperCase()}
                    </label>
                    <input
                      className="cyber-input"
                      style={{ padding: '8px 12px', fontSize: '13px' }}
                      value={(newCourse as any)[field]}
                      onChange={e => setNewCourse(prev => ({ ...prev, [field]: e.target.value }))}
                      placeholder={`Enter ${field}`}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '10px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontFamily: 'var(--font-cyber)', fontSize: '9px', letterSpacing: '2px', color: 'var(--accent-primary)', marginBottom: '4px', display: 'block' }}>
                    DESCRIPTION
                  </label>
                  <textarea
                    className="cyber-input"
                    style={{ padding: '8px 12px', fontSize: '13px', resize: 'none' }}
                    value={newCourse.description}
                    onChange={e => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Course description"
                    rows={2}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: 'var(--font-cyber)', fontSize: '9px', letterSpacing: '2px', color: 'var(--accent-primary)', marginBottom: '4px', display: 'block' }}>
                    CREDITS
                  </label>
                  <input
                    className="cyber-input"
                    style={{ padding: '8px 12px', fontSize: '13px' }}
                    type="number"
                    value={newCourse.credits}
                    onChange={e => setNewCourse(prev => ({ ...prev, credits: parseInt(e.target.value) || 3 }))}
                    min={1}
                    max={6}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setShowModal(null)} style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-cyber)', fontSize: '11px', letterSpacing: '1px' }}>
                  CANCEL
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="cyber-btn"
                  onClick={handleCreateCourse}
                  style={{ flex: 2, padding: '10px', fontSize: '11px' }}
                >
                  CREATE COURSE
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}

        {showModal === 'announcement' && (
          <div className="modal-overlay" onClick={() => setShowModal(null)} style={{ padding: '16px' }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="cyber-card"
              style={{ padding: '20px', width: '100%', maxWidth: '400px', position: 'relative' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-cyber)', fontSize: '13px', color: 'var(--accent-primary)', letterSpacing: '2px', margin: 0 }}>
                  ðŸ“¢ POST ANNOUNCEMENT
                </h3>
                <button onClick={() => setShowModal(null)} style={{ background: 'rgba(255,0,64,0.15)', border: '1px solid rgba(255,0,64,0.3)', borderRadius: '6px', color: '#ff0040', cursor: 'pointer', padding: '4px 10px', fontSize: '16px', lineHeight: 1 }}>âœ•</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontFamily: 'var(--font-cyber)', fontSize: '9px', letterSpacing: '2px', color: 'var(--accent-primary)', marginBottom: '4px', display: 'block' }}>
                    TITLE
                  </label>
                  <input
                    className="cyber-input"
                    style={{ padding: '8px 12px', fontSize: '13px' }}
                    value={newAnnouncement.title}
                    onChange={e => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Announcement title"
                  />
                </div>
                <div>
                  <label style={{ fontFamily: 'var(--font-cyber)', fontSize: '9px', letterSpacing: '2px', color: 'var(--accent-primary)', marginBottom: '4px', display: 'block' }}>
                    PRIORITY
                  </label>
                  <select
                    className="cyber-input"
                    style={{ padding: '8px 12px', fontSize: '13px' }}
                    value={newAnnouncement.priority}
                    onChange={e => setNewAnnouncement(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'var(--font-cyber)', fontSize: '9px', letterSpacing: '2px', color: 'var(--accent-primary)', marginBottom: '4px', display: 'block' }}>
                    CONTENT
                  </label>
                  <textarea
                    className="cyber-input"
                    style={{ padding: '8px 12px', fontSize: '13px', resize: 'none' }}
                    value={newAnnouncement.content}
                    onChange={e => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Announcement content"
                    rows={3}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setShowModal(null)} style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-cyber)', fontSize: '11px', letterSpacing: '1px' }}>
                  CANCEL
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="cyber-btn"
                  onClick={handleCreateAnnouncement}
                  style={{ flex: 2, padding: '10px', fontSize: '11px' }}
                >
                  POST NOW
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
