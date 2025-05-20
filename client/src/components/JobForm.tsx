// src/components/JobForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { JobFormData } from '../lib/validators';
import { JobSchema } from '@/lib/validators'; // Make sure validators.ts has JobSchema
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Ensure 'form' component is added via shadcn
import { Loader2 } from "lucide-react";

interface JobFormProps {
  onSubmit: (data: JobFormData) => Promise<void>;
  initialData?: Partial<JobFormData>;
  isLoading: boolean;
  submitButtonText?: string;
  onCancel?: () => void;
}

const JobForm = ({ onSubmit, initialData = {}, isLoading, submitButtonText = "Submit", onCancel }: JobFormProps) => {
  const form = useForm<JobFormData>({
    resolver: zodResolver(JobSchema),
    defaultValues: {
      title: initialData.title || '',
      descriptionText: initialData.descriptionText || '',
      mustHaveSkills: initialData.mustHaveSkills || '',
      focusAreas: initialData.focusAreas || '',
    },
  });

  // If initialData changes (e.g., when opening an edit form), reset the form
  // useEffect(() => {
  //   if (initialData) {
  //     form.reset({
  //       title: initialData.title || '',
  //       descriptionText: initialData.descriptionText || '',
  //       mustHaveSkills: Array.isArray(initialData.mustHaveSkills) ? initialData.mustHaveSkills.join(', ') : initialData.mustHaveSkills || '',
  //       focusAreas: Array.isArray(initialData.focusAreas) ? initialData.focusAreas.join(', ') : initialData.focusAreas || '',
  //     });
  //   }
  // }, [initialData, form.reset]);


  const handleFormSubmit = async (data: JobFormData) => {
    // The parent component (JobsListPage) will handle splitting the string skills/areas into arrays
    await onSubmit(data);
  };

  return (
    <Form {...form}> {/* Spread form methods here */}
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 md:space-y-6"> {/* Increased spacing */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="e.g., Senior Software Engineer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="descriptionText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the job role, responsibilities, qualifications, company culture, etc."
                  {...field}
                  rows={6} // Increased rows
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mustHaveSkills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Must-Have Skills</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Node.js, React, API Design" {...field} />
              </FormControl>
              <FormDescription>
                Comma-separated list of skills. These will be emphasized during analysis.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="focusAreas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key Focus Areas</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Scalability, Microservices, Team Leadership" {...field} />
              </FormControl>
              <FormDescription>
                Comma-separated list. Experience in these areas will be weighted more heavily.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-2 space-y-2 sm:space-y-0 pt-2">
            {onCancel && (
                 <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
            )}
          <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Saving...' : submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default JobForm;