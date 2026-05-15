export function rewriteRecommendation(rec) {
  if (!rec) return "";
  let parts = [];
  if (rec.title) parts.push(rec.title + ".");
  if (rec.because) parts.push("In short: " + rec.because);
  if (rec.expectedImpact) parts.push("Expected impact: " + rec.expectedImpact);
  if (rec.actionSteps && rec.actionSteps.length) {
    const steps = rec.actionSteps.slice(0, 3).join('; ');
    parts.push("Suggested steps: " + steps + ".");
  }
  return parts.join(' ');
}
