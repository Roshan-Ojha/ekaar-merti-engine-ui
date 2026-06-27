export function formatRubricJson(rubric: Record<string, unknown>): string {
  return JSON.stringify(rubric, null, 2);
}

export function parseRubricJson(text: string): { rubric: Record<string, unknown> } | { error: string } {
  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    return { error: 'Invalid JSON. Check syntax and try again.' };
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return { error: 'Rubric must be a JSON object.' };
  }

  return { rubric: parsed as Record<string, unknown> };
}
