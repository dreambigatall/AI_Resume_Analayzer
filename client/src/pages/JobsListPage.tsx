// src/pages/JobsListPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Link is not directly used here anymore for navigation
import jobService from '@/services/jobService'; // UPDATED
// import { JobDescription } from '../types/index';
import type { JobDescription } from '../types'
import type { JobFormData } from '../lib/validators';
import JobForm from '@/components/JobForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // Removed DialogFooter, DialogClose as they are part of DialogContent now or managed by onOpenChange
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
// import { useToast } from "@/components/ui/use-toast";
import { toast } from 'sonner';
import { MoreHorizontal, Trash2, Edit3, PlusCircle, Loader2, Eye } from "lucide-react"; // Added Eye icon
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CreateJobData } from '../types/index';

const JobsListPage = () => {
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isCreateJobDialogOpen, setIsCreateJobDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<JobDescription | null>(null);
  // const { toast } = useToast();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const data = await jobService.getAllJobs(); // UPDATED
      setJobs(data);
    } catch (error: any) {
      console.error("Failed to fetch jobs:", error);
      toast({ title: "Error", description: error.message || "Failed to fetch jobs.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreateJobSubmit = async (formData: JobFormData) => {
    setIsFormLoading(true);
    const createData: CreateJobData = {
      title: formData.title,
      descriptionText: formData.descriptionText,
      mustHaveSkills: formData.mustHaveSkills?.split(',').map(s => s.trim()).filter(s => s) || [],
      focusAreas: formData.focusAreas?.split(',').map(s => s.trim()).filter(s => s) || [],
    };
    try {
      await jobService.createJob(createData); // UPDATED
      toast({ title: "Success", description: "Job created successfully." });
      setIsCreateJobDialogOpen(false); // Close dialog
      fetchJobs(); // Refresh list
    } catch (error: any) {
      console.error("Failed to create job:", error);
      toast({ title: "Error", description: error.message || "Failed to create job.", variant: "destructive" });
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    setIsFormLoading(true); // Can use a specific loading state for delete if preferred
    try {
      await jobService.deleteJob(jobToDelete._id); // UPDATED
      toast({ title: "Success", description: `Job "${jobToDelete.title}" deleted.` });
      setJobToDelete(null); // Close dialog
      fetchJobs(); // Refresh list
    } catch (error: any) {
      console.error("Failed to delete job:", error);
      toast({ title: "Error", description: error.message || "Failed to delete job.", variant: "destructive" });
    } finally {
      setIsFormLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Job Postings</h1>
        <Dialog open={isCreateJobDialogOpen} onOpenChange={setIsCreateJobDialogOpen}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-4 w-4" /> Create New Job</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Create New Job</DialogTitle>
              <DialogDescription>Fill in the details for your new job posting.</DialogDescription>
            </DialogHeader>
            <div className="py-4"> {/* Added padding for form inside dialog */}
              <JobForm onSubmit={handleCreateJobSubmit} isLoading={isFormLoading} submitButtonText="Create Job" />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Jobs Found</CardTitle>
            <CardDescription>You haven't created any job postings yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Click the "Create New Job" button to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Job List</CardTitle>
             <CardDescription>Manage your job postings here.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Title</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job._id}>
                    <TableCell
                      className="font-medium hover:underline cursor-pointer"
                      onClick={() => navigate(`/jobs/${job._id}`)}
                    >
                        {job.title}
                    </TableCell>
                    <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => navigate(`/jobs/${job._id}`)}>
                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem onClick={() => alert("Edit: " + job._id)} disabled>
                                    <Edit3 className="mr-2 h-4 w-4" /> Edit (TODO)
                                </DropdownMenuItem> */}
                                <DropdownMenuItem
                                className="text-destructive focus:text-destructive focus:bg-destructive/10" // Adjusted focus color for delete
                                onClick={() => setJobToDelete(job)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={!!jobToDelete} onOpenChange={(open) => !open && setJobToDelete(null)}> {/* Ensure dialog closes correctly */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job posting
              "{jobToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setJobToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteJob}
              disabled={isFormLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isFormLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
export default JobsListPage;