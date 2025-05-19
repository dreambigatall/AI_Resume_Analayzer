
// src/pages/HomePage.tsx
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Briefcase, FileText, BarChart2 } from 'lucide-react';

const featureData = [
  {
    title: 'Effortless Job Management',
    description: 'Create, edit, and track all your job openings in one centralized place.',
    icon: <Briefcase className="text-5xl text-indigo-500 mb-4" />,
  },
  {
    title: 'Smart Resume Analysis',
    description: 'Leverage AI to quickly analyze resumes and identify top candidates.',
    icon: <FileText className="text-5xl text-indigo-500 mb-4" />,
  },
  {
    title: 'Actionable Insights',
    description: 'Gain valuable insights into your hiring process and candidate pipeline.',
    icon: <BarChart2 className="text-5xl text-indigo-500 mb-4" />,
  },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-16 px-4 space-y-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-center bg-gradient-to-br from-teal-50 via-indigo-50 to-purple-50 p-12 rounded-2xl shadow-2xl backdrop-blur-sm transition-transform duration-700 ease-in-out hover:scale-102">
        <h1 className="text-6xl font-extrabold mb-6 text-gray-900 leading-tight">
          Welcome,{' '}
          <span className="text-indigo-600 dark:text-teal-300">
            {user?.email || 'Guest'}
          </span>
          !
        </h1>
        <p className="text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
          Your ultimate platform to simplify hiring, from crafting perfect job
          descriptions to AI-powered candidate matching.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link to="/jobs">
            <Button
              size="lg"
              className="px-10 py-4 text-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-300"
            >
              View My Jobs
            </Button>
          </Link>
          <Link to="/jobs">
            <Button
              size="lg"
              variant="outline"
              className="px-10 py-4 text-lg border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors duration-300"
            >
              Create New Job
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Unlock Your Hiring Potential
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {featureData.map((feature, idx) => (
            <div
              key={idx}
              className="transition-transform duration-300 ease-out transform hover:scale-105"
            >
              <Card className="h-full text-center p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-gray-700 rounded-2xl">
                <CardHeader>
                  {feature.icon}
                  <CardTitle className="text-2xl font-semibold mt-2 text-gray-900 dark:text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Secondary CTA */}
      <section className="relative text-center py-16 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50 rounded-2xl shadow-inner backdrop-blur-sm transition-opacity duration-1000 ease-in opacity-90 hover:opacity-100">
        <h3 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-400">
          Ready to Get Started?
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
          Dive in and explore all the powerful features designed to streamline
          your recruitment.
        </p>
        <Link to="/dashboard">
          <Button
            size="lg"
            className="px-10 py-4 text-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-300"
          >
            Go to Dashboard
          </Button>
        </Link>
      </section>
    </div>
  );
}
