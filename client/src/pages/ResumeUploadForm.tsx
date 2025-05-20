

// src/components/ResumeUploadForm.tsx
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import resumeService from '@/services/resumeService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { Loader2, UploadCloud } from "lucide-react";

interface ResumeUploadFormInputs {
  resumeFile: FileList;
}

interface ResumeUploadFormProps {
  jobId: string;
  onUploadSuccess?: () => void;
}

export default function ResumeUploadForm({ jobId, onUploadSuccess }: ResumeUploadFormProps) {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<ResumeUploadFormInputs>();
  const [isLoading, setIsLoading] = useState(false);

  const resumeFileValue = watch("resumeFile");

  const onSubmit: SubmitHandler<ResumeUploadFormInputs> = async (data) => {
    if (!data.resumeFile || data.resumeFile.length === 0) {
      toast.error("No file selected", {
        description: "Please select a resume file to upload."
      });
      return;
    }

    const file = data.resumeFile[0];
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid File Type", {
        description: "Please upload a PDF, DOC, or DOCX file."
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await resumeService.uploadResume(jobId, file);
      toast.success("Upload Successful", {
        description: response.message || "Resume uploaded and queued for analysis."
      });
      reset();
      onUploadSuccess?.();
    } catch (error: any) {
      console.error("Resume upload failed:", error);
      toast.error("Upload Failed", {
        description: error.message || "Could not upload resume."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="resumeFile" className="mb-2 block text-sm font-medium">
          Select Resume File (PDF, DOC, DOCX)
        </Label>
        <Input
          id="resumeFile"
          type="file"
          accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          {...register('resumeFile', { required: "Resume file is required" })}
          className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4 file:rounded-full
            file:border-0 file:text-sm file:font-semibold
            file:bg-primary file:text-primary-foreground
            hover:file:bg-primary/90 cursor-pointer"
        />
        {resumeFileValue && resumeFileValue.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            Selected: {resumeFileValue[0].name}
          </p>
        )}
        {errors.resumeFile && (
          <p className="text-sm text-destructive mt-1">
            {errors.resumeFile.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
        {isLoading
          ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          : <UploadCloud className="mr-2 h-4 w-4" />
        }
        {isLoading ? 'Uploading...' : 'Upload & Analyze'}
      </Button>
    </form>
  );
}
