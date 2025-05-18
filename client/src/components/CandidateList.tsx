// src/components/CandidateList.tsx
import { useEffect, useState, useCallback } from 'react';
import resumeService from '@/services/resumeService';
import type { Candidate, GeminiEducation } from '@/types'; // Ensure Candidate type is correct
import {
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Star, AlertCircle, RefreshCcw, Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface CandidateListProps {
  jobId: string;
  refreshTrigger: number; // A prop to trigger re-fetch from parent
}

const CandidateList = ({ jobId, refreshTrigger }: CandidateListProps) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = useCallback(async () => {
    if (!jobId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await resumeService.getCandidatesForJob(jobId);
      setCandidates(data);
    } catch (err: any) {
      console.error("Failed to fetch candidates:", err);
      setError(err.message || "Could not load candidates.");
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates, refreshTrigger]); // Re-fetch when jobId or refreshTrigger changes

  const renderEducation = (educationArray?: GeminiEducation[]) => {
    if (!educationArray || educationArray.length === 0) return <span className="text-muted-foreground italic">Not specified</span>;
    return (
      <ul className="list-disc list-inside space-y-1">
        {educationArray.map((edu, index) => (
          <li key={index} className="text-sm">
            {edu.degree || 'Degree not specified'} at {edu.institution || 'Institution not specified'}
            {edu.graduationYear && ` (Graduated: ${edu.graduationYear})`}
          </li>
        ))}
      </ul>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Loading candidates...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Candidates</AlertTitle>
        <AlertDescription>
          {error}
          <Button variant="outline" size="sm" onClick={fetchCandidates} className="ml-4">
            <RefreshCcw className="mr-2 h-3 w-3" /> Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No candidates have been analyzed for this job yet.</p>
        <p className="text-sm">Upload resumes to see analysis results here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
       <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={fetchCandidates} disabled={isLoading}>
                <RefreshCcw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh List
            </Button>
        </div>
      <Table>
        <TableCaption className="mt-4">A list of analyzed candidates for this job.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Rank</TableHead>
            <TableHead className="w-[50px] text-center">Flag</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Years Exp.</TableHead>
            <TableHead>Key Skills</TableHead>
            <TableHead className="text-right">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate, index) => (
            <TableRow key={candidate.candidateId}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell className="text-center">
                {candidate.isFlagged && <Star className="h-5 w-5 text-yellow-500 fill-yellow-400" />}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{candidate.score}/10</span>
                  <Progress value={candidate.score * 10} className="w-20 h-2" />
                </div>
              </TableCell>
              <TableCell>{candidate.yearsExperience || 'N/A'}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-xs">
                  {(candidate.skills?.slice(0, 5) || []).map((skill, i) => ( // Show first 5 skills
                    <Badge key={i} variant="secondary">{skill}</Badge>
                  ))}
                  {candidate.skills && candidate.skills.length > 5 && (
                    <Badge variant="outline">+{candidate.skills.length - 5} more</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={`item-${candidate.candidateId}`} className="border-none">
                    <AccordionTrigger className="p-2 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                        View Analysis
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-muted/50 rounded-md mt-1 text-left">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Justification:</h4>
                          <p className="text-sm text-muted-foreground">{candidate.justification || "No justification provided."}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Education:</h4>
                          {renderEducation(candidate.education)}
                        </div>
                        {candidate.skills && candidate.skills.length > 0 && (
                             <div>
                                <h4 className="font-semibold text-sm mb-1">All Skills Mentioned:</h4>
                                <div className="flex flex-wrap gap-1">
                                    {candidate.skills.map((skill, i) => (
                                        <Badge key={i} variant="outline">{skill}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                        {candidate.warnings && candidate.warnings.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-1 text-destructive">Warnings:</h4>
                            <ul className="list-disc list-inside space-y-1 text-destructive text-sm">
                              {candidate.warnings.map((warning, i) => (
                                <li key={i}>{warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                         <p className="text-xs text-muted-foreground mt-2">
                            File: {candidate.originalFilename}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CandidateList;