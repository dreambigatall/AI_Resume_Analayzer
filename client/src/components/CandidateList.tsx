
// src/components/CandidateList.tsx
import { useEffect, useState, useCallback } from 'react';
import resumeService from '@/services/resumeService';
import type { Candidate, GeminiEducation } from '@/types';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Star, AlertCircle, RefreshCcw, Loader2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CandidateListProps {
  jobId: string;
  refreshTrigger: number;
}

export default function CandidateList({ jobId, refreshTrigger }: CandidateListProps) {
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
      console.error('Failed to fetch candidates:', err);
      setError(err.message || 'Could not load candidates.');
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates, refreshTrigger]);

  const renderEducation = (edus?: GeminiEducation[]) => {
    if (!edus?.length) {
      return <span className="italic text-gray-500">Not specified</span>;
    }
    return (
      <ul className="list-disc list-inside space-y-0.5 text-sm">
        {edus.map((e, i) => (
          <li key={i}>
            <strong>{e.degree || '–'}</strong> at {e.institution || '–'}
            {e.graduationYear && ` (’${String(e.graduationYear).slice(-2)})`}
          </li>
        ))}
      </ul>
    );
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
          <span className="text-gray-500">Loading candidates...</span>
        </div>
        <div className="mt-4 space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4 flex items-start space-x-2">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <div>
          <AlertTitle>Error Loading Candidates</AlertTitle>
          <AlertDescription className="flex items-center space-x-2">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchCandidates}
              className="flex items-center"
            >
              <RefreshCcw className="mr-1 h-4 w-4" /> Retry
            </Button>
          </AlertDescription>
        </div>
      </Alert>
    );
  }

  if (!candidates.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No candidates analyzed yet.</p>
        <p className="text-sm">Upload resumes to see them here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={fetchCandidates}
          disabled={isLoading}
          className="flex items-center space-x-1"
        >
          <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <Accordion type="single" collapsible>
          <Table>
            <TableCaption className="mt-4">
              Analyzed candidates for this job
            </TableCaption>
            <TableHeader className="bg-gray-50 sticky top-0">
              <TableRow>
                <TableHead className="w-[40px]">#</TableHead>
                <TableHead className="w-[40px] text-center">★</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Exp.</TableHead>
                <TableHead>Top Skills</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((c, i) => (
                <TableRow
                  key={c.candidateId}
                  className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                >
                  <TableCell className="font-medium">{i + 1}</TableCell>
                  <TableCell className="text-center">
                    {c.isFlagged && (
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-300" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{c.score}/10</span>
                      <Progress
                        value={c.score * 10}
                        className="w-24 h-2 bg-gray-200"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{c.yearsExperience ?? '–'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {(c.skills ?? []).slice(0, 5).map((s, idx) => (
                        <Badge key={idx} variant="default" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                      {c.skills && c.skills.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{c.skills.length - 5}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <AccordionItem value={`cand-${c.candidateId}`}>
                      <AccordionTrigger className="flex items-center justify-end space-x-1 text-violet-600 hover:text-violet-800">
                        <span>View</span>
                        <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:-rotate-180" />
                      </AccordionTrigger>
                      <AccordionContent className="p-4 bg-gray-50 rounded-md text-left space-y-4 max-w-md mx-auto break-words whitespace-pre-wrap">
                        <div>
                          <strong>Justification:</strong>
                          <p className="mt-1">{c.justification || 'None.'}</p>
                        </div>
                        <div>
                          <strong>Education:</strong>
                          <div className="mt-1">{renderEducation(c.education)}</div>
                        </div>
                        {c.skills?.length ? (
                          <div>
                            <strong>All Skills:</strong>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {c.skills.map((s, j) => (
                                <Badge key={j} variant="outline" className="text-xs">
                                  {s}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ) : null}
                        {c.warnings?.length ? (
                          <div className="text-red-600">
                            <strong>Warnings:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
                              {c.warnings.map((w, j) => (
                                <li key={j}>{w}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                        <p className="mt-2 text-xs text-gray-500">
                          File: {c.originalFilename}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Accordion>
      </div>
    </div>
  );
}

