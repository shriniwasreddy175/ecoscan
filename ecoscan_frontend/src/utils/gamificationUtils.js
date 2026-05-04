/**
 * Gamification utilities for EcoScan.
 *
 * Computes EcoPoints, level, badges, and streak from product analysis history.
 * All logic is derived from the history array returned by the products API.
 */

export const LEVELS = [
  { name: "Seedling",                icon: "🌱", minPoints: 0,    maxPoints: 99   },
  { name: "Eco Explorer",            icon: "🌿", minPoints: 100,  maxPoints: 249  },
  { name: "Green Guardian",          icon: "♻️", minPoints: 250,  maxPoints: 499  },
  { name: "Eco Warrior",             icon: "🌍", minPoints: 500,  maxPoints: 999  },
  { name: "Sustainability Champion", icon: "🏆", minPoints: 1000, maxPoints: Infinity },
];

/** Points earned per analysis based on overall sustainability score. */
function getPointsForScore(overallScore) {
  if (overallScore >= 80) return 20;
  if (overallScore >= 60) return 15;
  if (overallScore >= 40) return 10;
  if (overallScore >= 20) return 5;
  return 2;
}

/** Sum all EcoPoints from history. */
export function computeEcoPoints(history) {
  return history.reduce(
    (total, item) => total + getPointsForScore(item.overallSustainabilityScore ?? 0),
    0
  );
}

/** Return the current level object (with its index) for the given totalPoints. */
export function getLevel(totalPoints) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalPoints >= LEVELS[i].minPoints) {
      return { ...LEVELS[i], index: i };
    }
  }
  return { ...LEVELS[0], index: 0 };
}

/** Progress percentage (0-100) towards the next level. */
export function getProgressToNextLevel(totalPoints) {
  const current = getLevel(totalPoints);
  if (current.index === LEVELS.length - 1) return 100; // already max level
  const next = LEVELS[current.index + 1];
  const range = next.minPoints - current.minPoints;
  const progress = totalPoints - current.minPoints;
  return Math.min(100, Math.round((progress / range) * 100));
}

const BADGE_DEFINITIONS = [
  {
    id: "first_steps",
    name: "First Steps",
    icon: "🌱",
    description: "Analyzed your first product",
    check: (history) => history.length >= 1,
  },
  {
    id: "data_explorer",
    name: "Data Explorer",
    icon: "📊",
    description: "Analyzed 5 or more products",
    check: (history) => history.length >= 5,
  },
  {
    id: "researcher",
    name: "Researcher",
    icon: "🔬",
    description: "Analyzed 10 or more products",
    check: (history) => history.length >= 10,
  },
  {
    id: "eco_champion",
    name: "Eco Champion",
    icon: "🏆",
    description: "Achieved an overall sustainability score above 90",
    check: (history) => history.some((h) => (h.overallSustainabilityScore ?? 0) >= 90),
  },
  {
    id: "recycling_hero",
    name: "Recycling Hero",
    icon: "♻️",
    description: "Achieved an Eco Score of 80 or above",
    check: (history) => history.some((h) => (h.ecoScore ?? 0) >= 80),
  },
  {
    id: "low_carbon",
    name: "Low-Carbon Leader",
    icon: "💨",
    description: "Analyzed a product with carbon footprint below 2 kg CO₂",
    check: (history) => history.some((h) => (h.carbonFootprint ?? Infinity) < 2),
  },
  {
    id: "planet_protector",
    name: "Planet Protector",
    icon: "🌍",
    description: "Analyzed 25 or more products",
    check: (history) => history.length >= 25,
  },
];

/** Returns all badge definitions annotated with `earned: true/false`. */
export function computeBadges(history) {
  return BADGE_DEFINITIONS.map((badge) => ({
    ...badge,
    earned: badge.check(history),
  }));
}

/** Milliseconds in one calendar day. */
const MS_PER_DAY = 86_400_000;

/**
 * Counts the current consecutive-day streak.
 * A streak is maintained as long as the user ran at least one analysis
 * each day up to and including today (or yesterday).
 */
export function computeStreak(history) {
  if (!history.length) return 0;

  const days = new Set(
    history
      .filter((h) => h.createdAt)
      .map((h) => {
        const d = new Date(h.createdAt);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
  );

  if (!days.size) return 0;

  const sortedDays = Array.from(days).sort((a, b) => b - a); // descending

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Streak must include today or yesterday to be active
  if (sortedDays[0] < yesterday.getTime()) return 0;

  let streak = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    const diffDays = Math.round((sortedDays[i - 1] - sortedDays[i]) / MS_PER_DAY);
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/** Aggregate gamification stats from product history. */
export function computeGamification(history) {
  const totalPoints = computeEcoPoints(history);
  const level = getLevel(totalPoints);
  const progressToNext = getProgressToNextLevel(totalPoints);
  const badges = computeBadges(history);
  const streak = computeStreak(history);

  return {
    totalPoints,
    level,
    progressToNext,
    badges,
    streak,
    totalAnalyses: history.length,
  };
}
