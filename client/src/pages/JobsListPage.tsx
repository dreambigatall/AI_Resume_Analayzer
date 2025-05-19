
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you are using React Router
import jobService from '@/services/jobService'; // Now using your actual service
import type { JobDescription, CreateJobData } from '../types'; // Now using your actual types
import type { JobFormData } from '../lib/validators'; // Now using your actual types
import JobForm from '@/components/JobForm'; // Now using your actual form component

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from '@/components/ui/table';
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  // DialogFooter, // Removed as JobForm handles its own footer/buttons
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner'; // Now using your actual toast
import {
  MoreHorizontal,
  Trash2,
  PlusCircle,
  Loader2,
  // Eye, // Replaced by FileText for consistency
  Briefcase,
  AlertTriangle,
  X,
  Search,
  FileText, // For "View Details"
  // Edit3, // For "Edit" if you add that functionality
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge'; // Removed as 'status' field might not exist

const JobsListPage = () => {
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isCreateJobDialogOpen, setIsCreateJobDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<JobDescription | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  // Fetch all jobs
  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const data = await jobService.getAllJobs();
      setJobs(data);
    } catch (error: any) {
      console.error("Failed to fetch jobs:", error);
      const msg = error?.response?.data?.message || error.message || "Could not load jobs.";
      toast.error("Error Loading Jobs", { description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Create job handler
  const handleCreateJobSubmit = async (formData: JobFormData) => {
    setIsFormLoading(true);
    // Assuming JobFormData directly maps or your JobForm handles the structure for CreateJobData
    // The original code had this structure:
    const createData: CreateJobData = {
      title: formData.title,
      descriptionText: formData.descriptionText,
      mustHaveSkills: formData.mustHaveSkills
        ? formData.mustHaveSkills.split(',').map(s => s.trim()).filter(s => s)
        : [],
      focusAreas: formData.focusAreas
        ? formData.focusAreas.split(',').map(s => s.trim()).filter(s => s)
        : [],
    };
    try {
      await jobService.createJob(createData);
      toast.success("Job Created!", {
        description: `“${createData.title}” was added.`,
      });
      setIsCreateJobDialogOpen(false);
      fetchJobs(); // Refresh the list
    } catch (error: any) {
      console.error("Failed to create job:", error);
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong while creating the job.";
      toast.error("Create Failed", { description: msg });
    } finally {
      setIsFormLoading(false);
    }
  };

  // Delete job handler
  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    setIsFormLoading(true);
    try {
      await jobService.deleteJob(jobToDelete._id);
      toast.success("Job Deleted", {
        description: `"${jobToDelete.title}" has been removed.`,
      });
      setJobToDelete(null);
      fetchJobs(); // Refresh the list
    } catch (error: any) {
      console.error("Failed to delete job:", error);
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong while deleting the job.";
      toast.error("Delete Failed", { description: msg });
    } finally {
      setIsFormLoading(false);
    }
  };

  // Filtered jobs based on search term
  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state UI
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 text-slate-700 p-6">
        <Loader2 className="h-16 w-16 animate-spin text-indigo-600 mb-6" />
        <p className="text-xl font-medium text-slate-600">Loading Job Postings...</p>
        <p className="text-sm text-slate-500">Please wait a moment.</p>
      </div>
    );
  }

  // Main page content
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-8 px-4 md:px-8 lg:px-12 border-1 border-gray-200 rounded-lg">
      <div className="container mx-auto space-y-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <Briefcase className="h-10 w-10 text-indigo-600" />
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-800">Job Postings</h1>
              <p className="text-slate-500 text-sm">Manage your company's open positions.</p>
            </div>
          </div>
          <Dialog
            open={isCreateJobDialogOpen}
            onOpenChange={setIsCreateJobDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg px-6 py-3">
                <PlusCircle className="mr-2 h-5 w-5" />
                Create New Job
              </Button>
            </DialogTrigger>
            <DialogPortal>
              <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
              <DialogContent
                className="
                  fixed top-1/2 left-1/2 z-50
                  w-[90vw] max-w-2xl max-h-[90vh]
                  -translate-x-1/2 -translate-y-1/2
                  bg-white text-slate-800
                  p-0 overflow-hidden
                  rounded-xl shadow-2xl border border-slate-200
                  data-[state=open]:animate-content-show
                "
              >
                <DialogHeader className="px-6 py-4 border-b border-slate-200">
                  <DialogTitle className="text-2xl font-semibold flex items-center gap-3">
                    <PlusCircle className="h-7 w-7 text-indigo-600" />
                    Create New Job Posting
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 mt-1">
                    Fill in the details below to publish a new job listing.
                  </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-6 max-h-[calc(90vh-180px)] overflow-y-auto"> {/* Adjusted padding and max-height */}
                  {/* Your actual JobForm component will be rendered here */}
                  <JobForm
                    onSubmit={handleCreateJobSubmit}
                    isLoading={isFormLoading}
                    // Ensure your JobForm accepts these props or adapt as needed
                    submitButtonText="Publish Job" 
                    onCancel={() => setIsCreateJobDialogOpen(false)}
                  />
                </div>
                
                <DialogClose className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-slate-100 transition-colors">
                  <X className="h-5 w-5 text-slate-500" />
                  <span className="sr-only">Close</span>
                </DialogClose>
              </DialogContent>
            </DialogPortal>
          </Dialog>
        </header>

        {/* Search and Filters */}
        {jobs.length > 0 && (
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="search"
                placeholder="Search by job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-1/2 lg:w-1/3 pl-10 pr-4 py-2.5 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
              />
            </div>
          </div>
        )}

        {/* Empty State or Jobs Table */}
        {filteredJobs.length === 0 && !isLoading ? (
          <Card className="text-center shadow-lg border-slate-200 bg-white rounded-xl overflow-hidden">
            <CardHeader className="pt-12 pb-8 bg-slate-50">
              <Briefcase className="mx-auto h-20 w-20 text-indigo-300 mb-4" />
              <CardTitle className="mt-4 text-3xl font-semibold text-slate-700">No Job Postings Found</CardTitle>
              {searchTerm ? (
                <CardDescription className="mt-2 text-slate-500 text-base">
                  Try adjusting your search term or create a new job.
                </CardDescription>
              ) : (
                <CardDescription className="mt-2 text-slate-500 text-base">
                  Get started by clicking the "Create New Job" button.
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="py-8">
              <p className="text-slate-500">
                Once you add jobs, they’ll appear here. Let's build your team!
              </p>
            </CardContent>
             {!searchTerm && (
                <CardFooter className="pb-10 pt-0 flex justify-center">
                     <Button size="lg" onClick={() => setIsCreateJobDialogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg px-6 py-3">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Create Your First Job
                    </Button>
                </CardFooter>
            )}
          </Card>
        ) : (
          <Card className="shadow-xl border-slate-200 bg-white rounded-xl overflow-hidden">
            <CardHeader className="px-6 py-5 border-b border-slate-200">
              <CardTitle className="text-xl font-semibold text-slate-800">Manage Your Postings</CardTitle>
              <CardDescription className="text-slate-500 text-sm">
                View, manage, or delete your active job postings below.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="w-[60%] min-w-[300px] px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-600">
                        Job Title
                      </TableHead>
                      <TableHead className="min-w-[180px] px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-600">
                        Date Created
                      </TableHead>
                      {/* Removed Status and Applicants columns as they might not be in your actual JobDescription type */}
                      {/* If you have these fields, you can add the TableHead and TableCell back */}
                      <TableHead className="text-right min-w-[100px] px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-600">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-slate-200">
                    {filteredJobs.map(job => (
                      <TableRow key={job._id} className="hover:bg-slate-50/50 transition-colors duration-150">
                        <TableCell
                          className="font-medium text-indigo-700 hover:text-indigo-800 hover:underline cursor-pointer px-6 py-4 whitespace-nowrap"
                          onClick={() => navigate(`/jobs/${job._id}`)} // Ensure this route exists
                        >
                          {job.title}
                        </TableCell>
                        <TableCell className="text-slate-500 px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(job.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long', // Changed back to 'long' as in original user code
                            day: 'numeric',
                          })}
                        </TableCell>
                        <TableCell className="text-right px-6 py-4 whitespace-nowrap">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-9 w-9 p-0 data-[state=open]:bg-slate-100 text-slate-500 hover:text-slate-700">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 shadow-lg rounded-md border-slate-200">
                              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-slate-500">Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => navigate(`/jobs/${job._id}`)} className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 px-2 py-1.5 text-sm text-slate-700">
                                <FileText className="mr-2 h-4 w-4 text-indigo-500" /> View Details
                              </DropdownMenuItem>
                              {/* Add Edit option here if needed
                              <DropdownMenuItem onClick={() => { /* handle edit logic for job * / }} className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 px-2 py-1.5 text-sm text-slate-700">
                                <Edit3 className="mr-2 h-4 w-4 text-blue-500" /> Edit Job
                              </DropdownMenuItem> */}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="flex items-center gap-2 text-red-600 hover:!bg-red-50 hover:!text-red-700 cursor-pointer px-2 py-1.5 text-sm"
                                onClick={() => setJobToDelete(job)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Job
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  {filteredJobs.length > 5 && (
                     <TableCaption className="py-4 text-sm text-slate-500">
                        End of job list. {jobs.length} total postings.
                    </TableCaption>
                  )}
                </Table>
              </div>
            </CardContent>
             {filteredJobs.length > 0 && (
                <CardFooter className="px-6 py-4 border-t border-slate-200 text-sm text-slate-500">
                    Showing {filteredJobs.length} of {jobs.length} job postings.
                </CardFooter>
            )}
          </Card>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!jobToDelete}
          onOpenChange={open => !open && setJobToDelete(null)}
        >
          <AlertDialogContent
            className="
              fixed left-1/2 top-1/2 z-50
              w-[90vw] max-w-md
              -translate-x-1/2 -translate-y-1/2
              bg-white text-slate-800 p-6 shadow-xl rounded-lg border border-slate-200
              data-[state=open]:animate-content-show
            "
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center text-xl font-semibold">
                <AlertTriangle className="mr-3 h-7 w-7 text-red-500" />
                Confirm Deletion
              </AlertDialogTitle>
              <AlertDialogDescription className="pt-2 text-slate-600">
                Are you absolutely sure you want to delete the job posting:
                <br />
                <strong className="font-semibold text-slate-700 mt-1 block">
                  “{jobToDelete?.title}”?
                </strong>
                <br />
                This action cannot be undone and will permanently remove the job.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <AlertDialogCancel asChild>
                  <Button variant="outline" onClick={() => setJobToDelete(null)} disabled={isFormLoading}>Cancel</Button>
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteJob}
                disabled={isFormLoading}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {isFormLoading
                  ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  : <Trash2 className="mr-2 h-4 w-4" />
                }
                Delete Job
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default JobsListPage;

// Add these to your tailwind.config.js if you want the dialog animations:
// (This is just an example, shadcn/ui might handle this automatically)
/*
module.exports = {
  // ...
  theme: {
    extend: {
      keyframes: {
        'content-show': {
          from: { opacity: '0', transform: 'translate(-50%, -48%) scale(0.96)' },
          to: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
        },
      },
      animation: {
        'content-show': 'content-show 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')], // Ensure you have this plugin
};
*/
