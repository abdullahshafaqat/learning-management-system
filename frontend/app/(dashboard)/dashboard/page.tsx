'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';

const StudentDashboard = ({ user }: { user: any }) => {
  const stats = [
    {
      title: 'Total Courses',
      value: '0',
      description: 'Enrolled courses',
      gradient: 'gradient-primary',
    },
    {
      title: 'Completed',
      value: '0',
      description: 'Courses finished',
      gradient: 'gradient-success',
    },
    {
      title: 'In Progress',
      value: '0',
      description: 'Currently learning',
      gradient: 'gradient-accent',
    },
    {
      title: 'Certificates',
      value: '0',
      description: 'Earned certificates',
      gradient: 'gradient-secondary',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Student Dashboard
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300">
          Welcome back, {user?.username}!
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          Your learning journey continues here.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="hover-lift border-0 shadow-lg overflow-hidden relative"
          >
            <div className={`absolute inset-0 ${stat.gradient} opacity-10`}></div>
            <CardHeader className="relative">
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardDescription>
              <CardTitle className="text-4xl font-bold">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-gray-500">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>My Courses</CardTitle>
          <CardDescription>
            Resume where you left off.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">
            You haven't enrolled in any courses yet. Browse our catalog to get started!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const InstructorDashboard = ({ user }: { user: any }) => {
  const stats = [
    {
      title: 'Total Students',
      value: '0',
      description: 'Active learners',
      gradient: 'gradient-primary',
    },
    {
      title: 'Published Courses',
      value: '0',
      description: 'Live courses',
      gradient: 'gradient-success',
    },
    {
      title: 'Total Earnings',
      value: '$0.00',
      description: 'Lifetime revenue',
      gradient: 'gradient-accent',
    },
    {
      title: 'Rating',
      value: '0.0',
      description: 'Average rating',
      gradient: 'gradient-secondary',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Instructor Dashboard
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300">
          Welcome back, {user?.username}!
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your courses and students.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="hover-lift border-0 shadow-lg overflow-hidden relative"
          >
            <div className={`absolute inset-0 ${stat.gradient} opacity-10`}></div>
            <CardHeader className="relative">
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardDescription>
              <CardTitle className="text-4xl font-bold">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-gray-500">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Course Management</CardTitle>
          <CardDescription>
             Create and manage your content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">
            Ready to teach? Create your first course today.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a check or wait for hydration if needed
    // In a real app, you might wait for a 'checking' flag from useAuth
    if (user !== undefined) {
       setLoading(false);
    }
    // Fallback if user is null but not loaded yet
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [user]);

  if (loading) {
     return (
        <div className="flex h-screen items-center justify-center">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
     )
  }

  if (!user) {
      return (
          <div className="p-8">
              <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
              <p>Please log in to view this page.</p>
          </div>
      )
  }

  // Simple role check - default to student if not specified
  const isInstructor = user.role === 'instructor' || user.role === 'admin';

  return (
    <div>
        {isInstructor ? (
            <InstructorDashboard user={user} />
        ) : (
            <StudentDashboard user={user} />
        )}
    </div>
  );
}
