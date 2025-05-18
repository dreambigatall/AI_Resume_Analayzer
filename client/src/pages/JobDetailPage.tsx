// // // src/pages/JobDetailPage.tsx
// // import { useEffect, useState } from 'react';
// // import { useParams, Link } from 'react-router-dom'; // Added Link for back button
// // import jobService from '@/services/jobService'; // UPDATED
// // import type { JobDescription } from '../types';
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// // import { Badge } from '@/components/ui/badge';
// // import { Button } from '@/components/ui/button'; // Added Button
// // import { Loader2, ArrowLeft } from 'lucide-react'; // Added ArrowLeft
// // // import ResumeUploadForm from '@/components/ResumeUploadForm';
// // import { toast } from 'sonner';
// // import ResumeUploadForm from './ResumeUploadForm';
// // const JobDetailPage = () => {
// //   const { jobId } = useParams<{ jobId: string }>();
// //   const [job, setJob] = useState<JobDescription | null>(null);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [showResumeUploadSuccess, setShowResumeUploadSuccess] = useState(false); // To refresh candidates list or show message

// //   const fetchJobDetails = () => { // Renamed for clarity
// //     if (!jobId) return;
// //     setIsLoading(true);
// //     jobService.getJobById(jobId) // UPDATED
// //       .then(data => {
// //         setJob(data);
// //         setError(null);
// //       })
// //       .catch(err => {
// //         console.error("Failed to fetch job details:", err);
// //         setError(err.message || "Failed to load job details.");
// //       })
// //       .finally(() => setIsLoading(false));
// //   };

// //   useEffect(() => {
// //     fetchJobDetails();
// //   }, [jobId]);

// //   const handleResumeUploaded = () => {
// //     setShowResumeUploadSuccess(true);
// //     toast.success('Resume Uploaded', {
// //            description: 'Analysis has started. Candidate list will update when ready.'
// //          });
// //     // On Day 3, this callback would trigger a re-fetch of candidates or use a polling mechanism.
// //     // For now, just a message or potentially a manual refresh button could be shown.
// //   };


// //   if (isLoading) {
// //     return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
// //   }

// //   if (error) {
// //     return (
// //         <Card>
// //             <CardHeader>
// //                 <CardTitle>Error</CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //                 <p className="text-destructive">{error}</p>
// //                 <Button variant="outline" asChild className="mt-4">
// //                     <Link to="/jobs"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs</Link>
// //                 </Button>
// //             </CardContent>
// //         </Card>
// //     );
// //   }

// //   if (!job) {
// //     return (
// //         <Card>
// //             <CardHeader>
// //                 <CardTitle>Not Found</CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //                 <p>Job not found.</p>
// //                 <Button variant="outline" asChild className="mt-4">
// //                     <Link to="/jobs"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs</Link>
// //                 </Button>
// //             </CardContent>
// //         </Card>
// //     );
// //   }

// //   return (
// //     <div className="space-y-8">
// //         <div>
// //             <Button variant="outline" asChild className="mb-6">
// //                 <Link to="/jobs"><ArrowLeft className="mr-2 h-4 w-4" /> Back to All Jobs</Link>
// //             </Button>
// //         </div>
// //       <Card>
// //         <CardHeader>
// //           <CardTitle className="text-3xl">{job.title}</CardTitle>
// //           <CardDescription>Posted on: {new Date(job.createdAt).toLocaleDateString()}</CardDescription>
// //         </CardHeader>
// //         <CardContent className="space-y-6"> {/* Increased spacing */}
// //           <div>
// //             <h3 className="font-semibold text-xl mb-2">Job Description</h3> {/* Increased heading size */}
// //             <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">{job.descriptionText}</p>
// //           </div>

// //           {job.mustHaveSkills && job.mustHaveSkills.length > 0 && (
// //             <div>
// //               <h3 className="font-semibold text-xl mb-2">Must-Have Skills</h3>
// //               <div className="flex flex-wrap gap-2">
// //                 {job.mustHaveSkills.map(skill => <Badge key={skill} variant="default" className="text-sm px-2 py-1">{skill}</Badge>)}
// //               </div>
// //             </div>
// //           )}

// //           {job.focusAreas && job.focusAreas.length > 0 && (
// //             <div>
// //               <h3 className="font-semibold text-xl mb-2">Key Focus Areas</h3>
// //               <div className="flex flex-wrap gap-2">
// //                 {job.focusAreas.map(area => <Badge variant="secondary" key={area} className="text-sm px-2 py-1">{area}</Badge>)}
// //               </div>
// //             </div>
// //           )}
// //         </CardContent>
// //       </Card>

// //       <Card>
// //         <CardHeader>
// //             <CardTitle>Upload Resume</CardTitle>
// //             <CardDescription>Upload a resume (PDF or DOCX) for this job to start analysis.</CardDescription>
// //         </CardHeader>
// //         <CardContent>
// //             <ResumeUploadForm jobId={job._id} onUploadSuccess={handleResumeUploaded} />
// //             {showResumeUploadSuccess && (
// //                 <p className="mt-4 text-sm text-green-600">
// //                     Resume uploaded successfully! Candidate analysis will begin shortly.
// //                 </p>
// //             )}
// //         </CardContent>
// //       </Card>

// //       <Card>
// //          <CardHeader>
// //             <CardTitle>Candidates</CardTitle>
// //             <CardDescription>Analyzed candidates for this job will appear below once processing is complete.</CardDescription>
// //         </CardHeader>
// //         <CardContent>
// //             {/* CandidateList component will go here on Day 3 */}
// //             <p className="text-muted-foreground italic">Candidate list will be displayed here.</p>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // };
// // // You'll need to import useToast if you use the toast in handleResumeUploaded
// // // import { useToast } from "@/components/ui/use-toast"; // Add this if not already present at top
// // // And then call it: const { toast } = useToast(); inside the component.

// // export default JobDetailPage;

// // src/pages/JobDetailPage.tsx
// import { useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import jobService from '@/services/jobService';
// import type { JobDescription } from '../types';
// import {
//   Card, CardContent, CardDescription, CardHeader, CardTitle
// } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Loader2, ArrowLeft } from 'lucide-react';
// import { toast } from 'sonner';
// import ResumeUploadForm from './ResumeUploadForm';

// export default function JobDetailPage() {
//   const { jobId } = useParams<{ jobId: string }>();
//   const [job, setJob] = useState<JobDescription | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showResumeUploadSuccess, setShowResumeUploadSuccess] = useState(false);

//   const fetchJobDetails = () => {
//     if (!jobId) return;
//     setIsLoading(true);
//     jobService.getJobById(jobId)
//       .then(data => {
//         setJob(data);
//         setError(null);
//       })
//       .catch(err => {
//         console.error("Failed to fetch job details:", err);
//         setError(err.message || "Failed to load job details.");
//       })
//       .finally(() => setIsLoading(false));
//   };

//   useEffect(() => {
//     fetchJobDetails();
//   }, [jobId]);

//   const handleResumeUploaded = () => {
//     setShowResumeUploadSuccess(true);
//     toast.success('Resume Uploaded', {
//       description: 'Analysis has started. Candidate list will update when ready.'
//     });
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Error</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-destructive">{error}</p>
//           <Button variant="outline" asChild className="mt-4">
//             <Link to="/jobs">
//               <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
//             </Link>
//           </Button>
//         </CardContent>
//       </Card>
//     );
//   }

//   if (!job) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Not Found</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p>Job not found.</p>
//           <Button variant="outline" asChild className="mt-4">
//             <Link to="/jobs">
//               <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
//             </Link>
//           </Button>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <Button variant="outline" asChild className="mb-6">
//         <Link to="/jobs">
//           <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Jobs
//         </Link>
//       </Button>

//       <Card>
//         <CardHeader>
//           <CardTitle className="text-3xl">{job.title}</CardTitle>
//           <CardDescription>
//             Posted on: {new Date(job.createdAt).toLocaleDateString()}
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div>
//             <h3 className="font-semibold text-xl mb-2">Job Description</h3>
//             <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
//               {job.descriptionText}
//             </p>
//           </div>

//           {job.mustHaveSkills?.length ? (
//             <div>
//               <h3 className="font-semibold text-xl mb-2">Must-Have Skills</h3>
//               <div className="flex flex-wrap gap-2">
//                 {job.mustHaveSkills.map(skill => (
//                   <Badge key={skill} className="text-sm px-2 py-1">
//                     {skill}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           ) : null}

//           {job.focusAreas?.length ? (
//             <div>
//               <h3 className="font-semibold text-xl mb-2">Key Focus Areas</h3>
//               <div className="flex flex-wrap gap-2">
//                 {job.focusAreas.map(area => (
//                   <Badge key={area} variant="secondary" className="text-sm px-2 py-1">
//                     {area}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           ) : null}
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Upload Resume</CardTitle>
//           <CardDescription>
//             Upload a resume (PDF or DOCX) for this job to start analysis.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <ResumeUploadForm jobId={job.id || job._id} onUploadSuccess={handleResumeUploaded} />
//           {showResumeUploadSuccess && (
//             <p className="mt-4 text-sm text-green-600">
//               Resume uploaded successfully! Candidate analysis will begin shortly.
//             </p>
//           )}
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Candidates</CardTitle>
//           <CardDescription>
//             Analyzed candidates for this job will appear below once processing is complete.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <p className="text-muted-foreground italic">
//             Candidate list will be displayed here.
//           </p>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// src/pages/JobDetailPage.tsx
// import { useEffect, useState, useCallback } from 'react'; // Added useCallback
// import { useParams, Link } from 'react-router-dom';
// import jobService from '@/services/jobService';
// import type { JobDescription } from '../types'; // Ensure this path is correct if types/index.ts is in src/
// import {
//   Card, CardContent, CardDescription, CardHeader, CardTitle
// } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Loader2, ArrowLeft } from 'lucide-react';
// // import { toast } from 'sonner'; // If you were using sonner
// // import { useToast } from "@/components/ui/use-toast"; // For shadcn toast
// import { toast } from 'sonner';
// import ResumeUploadForm from './ResumeUploadForm'; // Adjusted path if it's in components/
// import CandidateList from '@/components/CandidateList'; // Import CandidateList

// export default function JobDetailPage() {
//   const { jobId } = useParams<{ jobId: string }>();
//   const [job, setJob] = useState<JobDescription | null>(null);
//   const [isLoadingJob, setIsLoadingJob] = useState(true); // Specific loading state for job details
//   const [error, setError] = useState<string | null>(null);
//   // const { toast } = useToast(); // For shadcn toast

//   // State to trigger candidate list refresh
//   const [candidateListRefreshTrigger, setCandidateListRefreshTrigger] = useState(0);

//   const fetchJobDetails = useCallback(() => { // useCallback to stabilize function reference
//     if (!jobId) return;
//     setIsLoadingJob(true);
//     jobService.getJobById(jobId)
//       .then(data => {
//         setJob(data);
//         setError(null);
//       })
//       .catch(err => {
//         console.error("Failed to fetch job details:", err);
//         setError(err.message || "Failed to load job details.");
//       })
//       .finally(() => setIsLoadingJob(false));
//   }, [jobId]); // Dependency on jobId

//   useEffect(() => {
//     fetchJobDetails();
//   }, [fetchJobDetails]); // useEffect depends on the stable fetchJobDetails

//   const handleResumeUploaded = () => {
//     toast({ // Using shadcn toast
//       title: "Resume Uploaded",
//       description: "Analysis has started. Candidate list will refresh shortly.",
//       variant: "default", // Or "success" if you add that variant style
//     });
//     // Trigger a refresh of the candidate list after a short delay to allow processing
//     setTimeout(() => {
//         setCandidateListRefreshTrigger(prev => prev + 1);
//     }, 3000); // Adjust delay as needed, or implement polling
//   };

//   if (isLoadingJob) { // Use specific loading state
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Error</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-destructive">{error}</p>
//           <Button variant="outline" asChild className="mt-4">
//             <Link to="/jobs">
//               <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
//             </Link>
//           </Button>
//         </CardContent>
//       </Card>
//     );
//   }

//   if (!job) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Not Found</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p>Job not found.</p>
//           <Button variant="outline" asChild className="mt-4">
//             <Link to="/jobs">
//               <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
//             </Link>
//           </Button>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <Button variant="outline" asChild className="mb-6">
//         <Link to="/jobs">
//           <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Jobs
//         </Link>
//       </Button>

//       {/* Job Details Card - (code from previous step, ensure it's correct) */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-3xl">{job.title}</CardTitle>
//           <CardDescription>
//             Posted on: {new Date(job.createdAt).toLocaleDateString()}
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div>
//             <h3 className="font-semibold text-xl mb-2">Job Description</h3>
//             <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
//               {job.descriptionText}
//             </p>
//           </div>
//           {job.mustHaveSkills?.length ? ( // Optional chaining and check length
//             <div>
//               <h3 className="font-semibold text-xl mb-2">Must-Have Skills</h3>
//               <div className="flex flex-wrap gap-2">
//                 {job.mustHaveSkills.map(skill => (
//                   <Badge key={skill} className="text-sm px-2 py-1">
//                     {skill}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           ) : null}
//           {job.focusAreas?.length ? ( // Optional chaining and check length
//             <div>
//               <h3 className="font-semibold text-xl mb-2">Key Focus Areas</h3>
//               <div className="flex flex-wrap gap-2">
//                 {job.focusAreas.map(area => (
//                   <Badge key={area} variant="secondary" className="text-sm px-2 py-1">
//                     {area}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           ) : null}
//         </CardContent>
//       </Card>

//       {/* Resume Upload Card - (code from previous step, ensure it's correct) */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Upload Resume</CardTitle>
//           <CardDescription>
//             Upload a resume (PDF or DOCX) for this job to start analysis.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <ResumeUploadForm jobId={job._id} onUploadSuccess={handleResumeUploaded} />
//           {/* Removed the showResumeUploadSuccess p tag here as toast and list refresh handle it */}
//         </CardContent>
//       </Card>

//       {/* Candidates List Card */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Candidates</CardTitle>
//           <CardDescription>
//             Analyzed candidates for this job. Results may take a few moments to appear after upload.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {jobId && <CandidateList jobId={jobId} refreshTrigger={candidateListRefreshTrigger} />}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// src/pages/JobDetailPage.tsx
import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import jobService from '@/services/jobService';
import type { JobDescription } from '../types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import ResumeUploadForm from './ResumeUploadForm';
import CandidateList from '@/components/CandidateList';

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<JobDescription | null>(null);
  const [isLoadingJob, setIsLoadingJob] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Counter to force CandidateList to re-fetch
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchJobDetails = useCallback(() => {
    if (!jobId) return;
    setIsLoadingJob(true);

    jobService
      .getJobById(jobId)
      .then((data) => {
        setJob(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to fetch job details:', err);
        setError(err.message || 'Failed to load job details.');
      })
      .finally(() => setIsLoadingJob(false));
  }, [jobId]);

  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  const handleResumeUploaded = () => {
    // Show a toast notification on upload success
    toast.success('Resume Uploaded', {
      description:
        'Analysis has started. Candidate list will refresh when ready.',
    });

    // Trigger a refresh after a brief delay to allow backend processing
    setTimeout(() => {
      setRefreshTrigger((prev) => prev + 1);
    }, 3000);
  };

  if (isLoadingJob) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
          <Button variant="outline" asChild className="mt-4">
            <Link to="/jobs">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!job) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Job not found.</p>
          <Button variant="outline" asChild className="mt-4">
            <Link to="/jobs">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Button variant="outline" asChild className="mb-6">
        <Link to="/jobs">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Jobs
        </Link>
      </Button>

      {/* Job Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{job.title}</CardTitle>
          <CardDescription>
            Posted on: {new Date(job.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-xl mb-2">Job Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
              {job.descriptionText}
            </p>
          </div>

          {job.mustHaveSkills?.length ? (
            <div>
              <h3 className="font-semibold text-xl mb-2">Must-Have Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.mustHaveSkills.map((skill) => (
                  <Badge key={skill} className="text-sm px-2 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}

          {job.focusAreas?.length ? (
            <div>
              <h3 className="font-semibold text-xl mb-2">Key Focus Areas</h3>
              <div className="flex flex-wrap gap-2">
                {job.focusAreas.map((area) => (
                  <Badge
                    key={area}
                    variant="secondary"
                    className="text-sm px-2 py-1"
                  >
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Resume Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Resume</CardTitle>
          <CardDescription>
            Upload a resume (PDF or DOCX) for this job to start analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResumeUploadForm
            jobId={job.id ?? job._id}
            onUploadSuccess={handleResumeUploaded}
          />
        </CardContent>
      </Card>

      {/* Candidates List */}
      <Card>
        <CardHeader>
          <CardTitle>Candidates</CardTitle>
          <CardDescription>
            Analyzed candidates will appear here—results may take a moment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CandidateList
            jobId={jobId}
            refreshTrigger={refreshTrigger}
          />
        </CardContent>
      </Card>
    </div>
  );
}
