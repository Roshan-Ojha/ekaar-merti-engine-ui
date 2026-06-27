export interface QuestionEvaluationSummary {
  questionNumber: number;
  marksAwarded: number;
  generalFeedback: string | null;
}

export interface EvaluationPoint {
  pointNumber: number;
  candidateWrote: string;
  componentMarks: Record<string, number>;
  totalMarks: number;
  feedback: string;
}

export interface EvaluationQuestionDetail extends QuestionEvaluationSummary {
  points: EvaluationPoint[];
  pointsCounted: number | null;
}

export interface ParsedEvaluation {
  questions: QuestionEvaluationSummary[];
  totalMarksAwarded: number;
}

export interface ParsedEvaluationDetails {
  questions: EvaluationQuestionDetail[];
  totalMarksAwarded: number;
}

function readComponentMarks(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object') {
    return {};
  }

  return Object.entries(value as Record<string, unknown>).reduce<Record<string, number>>((marks, [key, amount]) => {
    if (typeof amount === 'number') {
      marks[key] = amount;
    }

    return marks;
  }, {});
}

function readPoint(item: unknown): EvaluationPoint | null {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const record = item as Record<string, unknown>;
  const pointNumber = record.point_number;
  const candidateWrote = record.candidate_wrote;
  const totalMarks = record.total_marks;
  const feedback = record.feedback;

  if (typeof pointNumber !== 'number' || typeof totalMarks !== 'number') {
    return null;
  }

  return {
    pointNumber,
    candidateWrote: typeof candidateWrote === 'string' ? candidateWrote : '—',
    componentMarks: readComponentMarks(record.component_marks),
    totalMarks,
    feedback: typeof feedback === 'string' ? feedback : '—'
  };
}

function readQuestionDetail(item: Record<string, unknown>): EvaluationQuestionDetail | null {
  const summary = readSummary(item);

  if (!summary) {
    return null;
  }

  const points = Array.isArray(item.points)
    ? item.points
        .map(readPoint)
        .filter((point): point is EvaluationPoint => point !== null)
        .sort((a, b) => a.pointNumber - b.pointNumber)
    : [];

  const summaryRecord =
    item.summary && typeof item.summary === 'object' ? (item.summary as Record<string, unknown>) : null;
  const pointsCounted = summaryRecord?.points_counted;

  return {
    ...summary,
    points,
    pointsCounted: typeof pointsCounted === 'number' ? pointsCounted : null
  };
}

function readSummary(item: Record<string, unknown>): QuestionEvaluationSummary | null {
  const questionNumber = item.question_number;

  if (typeof questionNumber !== 'number') {
    return null;
  }

  const summary = item.summary;

  if (!summary || typeof summary !== 'object') {
    return null;
  }

  const summaryRecord = summary as Record<string, unknown>;
  const marksAwarded = summaryRecord.total_marks_awarded;

  if (typeof marksAwarded !== 'number') {
    return null;
  }

  const generalFeedback = summaryRecord.general_feedback;

  return {
    questionNumber,
    marksAwarded,
    generalFeedback: typeof generalFeedback === 'string' ? generalFeedback : null
  };
}

export function parseEvaluation(evaluation: Record<string, unknown>): ParsedEvaluation {
  const results = evaluation.results;

  if (!Array.isArray(results)) {
    return { questions: [], totalMarksAwarded: 0 };
  }

  const questions = results
    .map((item) => (item && typeof item === 'object' ? readSummary(item as Record<string, unknown>) : null))
    .filter((item): item is QuestionEvaluationSummary => item !== null)
    .sort((a, b) => a.questionNumber - b.questionNumber);

  const totalMarksAwarded = questions.reduce((sum, item) => sum + item.marksAwarded, 0);

  return { questions, totalMarksAwarded };
}

export function parseEvaluationDetails(evaluation: Record<string, unknown>): ParsedEvaluationDetails {
  const results = evaluation.results;

  if (!Array.isArray(results)) {
    return { questions: [], totalMarksAwarded: 0 };
  }

  const questions = results
    .map((item) => (item && typeof item === 'object' ? readQuestionDetail(item as Record<string, unknown>) : null))
    .filter((item): item is EvaluationQuestionDetail => item !== null)
    .sort((a, b) => a.questionNumber - b.questionNumber);

  const totalMarksAwarded = questions.reduce((sum, item) => sum + item.marksAwarded, 0);

  return { questions, totalMarksAwarded };
}
