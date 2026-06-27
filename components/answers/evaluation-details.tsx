import { MarksDisplay } from './marks-display';

import { Badge } from '@/components/ui/badge';
import { parseEvaluationDetails } from '@/features/answer/utils/parse-evaluation';
import type { GetQuestionSetResult } from '@/features/question/types';

function formatComponentName(name: string): string {
  return name.replace(/_/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
}

interface EvaluationDetailsProps {
  evaluation: Record<string, unknown>;
  questionSet: GetQuestionSetResult;
}

export function EvaluationDetails({ evaluation, questionSet }: EvaluationDetailsProps) {
  const parsed = parseEvaluationDetails(evaluation);
  const marksByQuestionNumber = new Map(questionSet.questions.map((question) => [question.sortOrder, question]));

  if (parsed.questions.length === 0) {
    return <p className="text-muted-foreground text-sm">No detailed evaluation data available.</p>;
  }

  return (
    <div className="mt-4 space-y-4">
      {parsed.questions.map((question) => {
        const questionMeta = marksByQuestionNumber.get(question.questionNumber);

        return (
          <details key={question.questionNumber} className="group rounded-lg border">
            <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 p-4 [&::-webkit-details-marker]:hidden">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">Question {question.questionNumber}</span>
                {question.pointsCounted !== null ? (
                  <Badge variant="outline">{question.pointsCounted} point(s) marked</Badge>
                ) : null}
              </div>
              <MarksDisplay
                marksAwarded={question.marksAwarded}
                totalMarks={questionMeta?.totalMarks ?? null}
                size="sm"
                className="text-foreground"
              />
            </summary>

            <div className="space-y-4 border-t px-4 pt-4 pb-4">
              {question.generalFeedback ? (
                <div className="bg-muted/50 rounded-md p-3">
                  <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Overall feedback</p>
                  <p className="mt-1 text-sm">{question.generalFeedback}</p>
                </div>
              ) : null}

              {question.points.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Marked points</p>
                  {question.points.map((point) => (
                    <div key={point.pointNumber} className="rounded-md border p-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <Badge variant="secondary">Point {point.pointNumber}</Badge>
                        <span className="text-sm font-medium tabular-nums">{point.totalMarks} mark(s)</span>
                      </div>

                      <div className="mt-3 space-y-3">
                        <div>
                          <p className="text-muted-foreground text-xs font-medium">Candidate wrote</p>
                          <p className="mt-1 text-sm">{point.candidateWrote}</p>
                        </div>

                        {Object.keys(point.componentMarks).length > 0 ? (
                          <div>
                            <p className="text-muted-foreground text-xs font-medium">Component marks</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {Object.entries(point.componentMarks).map(([component, marks]) => (
                                <Badge key={component} variant="outline">
                                  {formatComponentName(component)}: {marks}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        <div>
                          <p className="text-muted-foreground text-xs font-medium">Feedback</p>
                          <p className="mt-1 text-sm">{point.feedback}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No individual points were recorded for this question.</p>
              )}
            </div>
          </details>
        );
      })}
    </div>
  );
}
