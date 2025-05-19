
import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import jobService from '@/services/jobService'; // Assume this service exists
import type { JobDescription } from '../types'; // Assume this type exists
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  ArrowLeft,
  Info,
  UploadCloud,
  Users,
  Briefcase, // For Job Title section
  CalendarDays, // For Posted Date
  FileText as FileTextIcon, // For Description
  ListChecks, // For Must-Have Skills
  Target, // For Key Focus Areas
} from 'lucide-react';
import { toast } from 'sonner';
import ResumeUploadForm from './ResumeUploadForm'; // Assume this component exists
import CandidateList from '@/components/CandidateList'; // Assume this component exists and is styled
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator'; // For visual separation


export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<JobDescription | null>(null);
  const [isLoadingJob, setIsLoadingJob] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchJobDetails = useCallback(() => {
    if (!jobId) {
      setError('No job ID provided.');
      setIsLoadingJob(false);
      setJob(null);
      return;
    }
    setIsLoadingJob(true);
    setError(null); // Clear previous errors

    jobService
      .getJobById(jobId)
      .then((data) => {
        setJob(data);
      })
      .catch((err) => {
        console.error('Failed to fetch job details:', err);
        setError(err.message || 'Failed to load job details. The job may not exist or there was a network issue.');
        setJob(null); // Ensure job is null on error
      })
      .finally(() => setIsLoadingJob(false));
  }, [jobId]);

  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  const handleResumeUploaded = () => {
    toast.success('Resume Uploaded & Analysis Started', {
      description: 'The candidate list will refresh automatically with new results shortly.',
      duration: 5000, // Keep toast a bit longer
      action: {
        label: 'Got it',
        onClick: () => { /* Sonner handles dismissal */ },
      },
    });
    // Simulate analysis time before triggering refresh
    // In a real app, this might be an event from a backend or polling
    setTimeout(() => {
      setRefreshTrigger((prev) => prev + 1);
    }, 5000); // Increased delay to simulate analysis
  };

  if (isLoadingJob) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
        <Loader2 className="h-12 w-12 animate-spin text-violet-600 mb-4" />
        <p className="text-lg text-gray-600">Loading Job Details...</p>
      </div>
    );
  }

  if (error || !job) { // Combined error and no-job state for cleaner logic
    return (
      <div className="container mx-auto max-w-2xl py-10 px-4 text-center">
         <Alert variant={error ? "destructive" : "default"} className="text-left">
          <Info className={`h-5 w-5 ${error ? 'text-red-500' : 'text-blue-500'}`} />
          <AlertTitle className="font-semibold">
            {error ? 'Error Loading Job' : 'Job Not Found'}
          </AlertTitle>
          <AlertDescription>
            {error || 'The job you are looking for does not exist or may have been removed.'}
            <Button variant="outline" asChild className="mt-6 w-full sm:w-auto">
              <Link to="/jobs" className="flex items-center justify-center">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Jobs
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Main job detail view
  return (
    <div className="container mx-auto max-w-5xl py-8 px-4 sm:px-6 lg:px-8 space-y-10">
      <Button
        variant="outline" // Changed from ghost for a bit more presence
        asChild
        className="text-gray-700 hover:text-violet-700 hover:border-violet-300 transition group"
      >
        <Link to="/jobs" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to All Jobs
        </Link>
      </Button>

      {/* Job Details Card */}
      <Card className="shadow-lg border-gray-200/80">
        <CardHeader className="border-b border-gray-100 pb-6">
          <div className="flex items-center space-x-3 mb-1">
            <Briefcase className="h-8 w-8 text-violet-600" />
            <CardTitle className="text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">
              {job.title}
            </CardTitle>
          </div>
          {job.companyName && ( // Display company name if available
            <p className="text-lg text-gray-600">{job.companyName} {job.location && `- ${job.location}`}</p>
          )}
          <CardDescription className="text-sm text-gray-500 pt-2 flex items-center">
            <CalendarDays className="mr-2 h-4 w-4" />
            Posted on:{' '}
            {new Date(job.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-8">
          <div>
            <h3 className="font-semibold text-xl mb-3 text-gray-700 flex items-center">
              <FileTextIcon className="mr-2 h-5 w-5 text-violet-500" />
              Full Description
            </h3>
            <div className="prose prose-sm sm:prose-base max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed">
              {job.descriptionText}
            </div>
          </div>

          <Separator />

          {job.mustHaveSkills && job.mustHaveSkills.length > 0 && (
            <div>
              <h3 className="font-semibold text-xl mb-4 text-gray-700 flex items-center">
                <ListChecks className="mr-2 h-5 w-5 text-violet-500" />
                Must-Have Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.mustHaveSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="default" // Default is usually primary color (e.g., violet)
                    className="px-3 py-1 text-sm rounded-md"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {job.focusAreas && job.focusAreas.length > 0 && (
            <div>
              <h3 className="font-semibold text-xl mb-4 text-gray-700 flex items-center">
                <Target className="mr-2 h-5 w-5 text-violet-500" />
                Key Focus Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.focusAreas.map((area) => (
                  <Badge
                    key={area}
                    variant="secondary"
                    className="px-3 py-1 text-sm rounded-md"
                  >
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resume Upload Card */}
      <Card className="shadow-lg border-gray-200/80">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <UploadCloud className="h-7 w-7 text-violet-600" />
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Upload Resumes
            </CardTitle>
          </div>
          <CardDescription className="pt-1 text-gray-500">
            Upload resumes (PDF, DOCX) to analyze candidate suitability for this job.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResumeUploadForm
            jobId={job.id ?? job._id!} // Added non-null assertion assuming job is loaded
            onUploadSuccess={handleResumeUploaded}
          />
        </CardContent>
      </Card>

      {/* Candidate List Card */}
      <Card className="shadow-lg border-gray-200/80">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Users className="h-7 w-7 text-violet-600" />
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Analyzed Candidates
            </CardTitle>
          </div>
          <CardDescription className="pt-1 text-gray-500">
            Candidates evaluated for this role will appear below.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:px-4 py-4">
          {jobId ? ( // jobId is confirmed if job is loaded
            <CandidateList jobId={jobId} refreshTrigger={refreshTrigger} />
          ) : (
            // This case should ideally not be hit if job is loaded, but as a fallback:
            <div className="text-center py-8 text-gray-500">
              <Info className="h-8 w-8 mx-auto mb-2" />
              <p>Candidate information will be displayed here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}