// lib/supabase-helpers.ts
import { Database } from "@/types/database.types";

// Type aliases for easier usage
export type Course =
  Database["public"]["Tables"]["golf_pace_tracker_courses"]["Row"];
export type CourseInsert =
  Database["public"]["Tables"]["golf_pace_tracker_courses"]["Insert"];
export type CourseUpdate =
  Database["public"]["Tables"]["golf_pace_tracker_courses"]["Update"];

export type RoundSubmission =
  Database["public"]["Tables"]["golf_pace_tracker_round_submissions"]["Row"];
export type RoundSubmissionInsert =
  Database["public"]["Tables"]["golf_pace_tracker_round_submissions"]["Insert"];
export type RoundSubmissionUpdate =
  Database["public"]["Tables"]["golf_pace_tracker_round_submissions"]["Update"];

// Helper to calculate day of week (0 = Sunday, 6 = Saturday)
export function getDayOfWeek(date: Date | string): number {
  return new Date(date).getDay();
}

// Helper to determine time of day
export function getTimeOfDay(
  date: Date | string
): "morning" | "afternoon" | "evening" {
  const hour = new Date(date).getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

// Helper to format duration for display
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

// Helper to get day name
export function getDayName(dayOfWeek: number): string {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[dayOfWeek] || "Unknown";
}

// Helper to prepare round submission data
export function prepareRoundSubmission(
  data: Omit<RoundSubmissionInsert, "day_of_week"> & {
    played_at: Date | string;
  }
): RoundSubmissionInsert {
  return {
    ...data,
    day_of_week: getDayOfWeek(data.played_at),
    played_at: new Date(data.played_at).toISOString(),
  };
}

// Type for submission with course data joined
export type RoundSubmissionWithCourse = RoundSubmission & {
  golf_pace_tracker_courses: Course;
};

// Helper for calculating average pace
export function calculateAveragePace(submissions: RoundSubmission[]): number {
  if (submissions.length === 0) return 0;
  const total = submissions.reduce((sum, sub) => sum + sub.duration_minutes, 0);
  return Math.round(total / submissions.length);
}

// Helper for grouping submissions by time of day
export function groupByTimeOfDay(submissions: RoundSubmission[]) {
  return submissions.reduce((acc, sub) => {
    const timeOfDay = sub.time_of_day || "unknown";
    if (!acc[timeOfDay]) {
      acc[timeOfDay] = [];
    }
    acc[timeOfDay].push(sub);
    return acc;
  }, {} as Record<string, RoundSubmission[]>);
}

// Helper for grouping submissions by day of week
export function groupByDayOfWeek(submissions: RoundSubmission[]) {
  return submissions.reduce((acc, sub) => {
    const day = sub.day_of_week?.toString() || "unknown";
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(sub);
    return acc;
  }, {} as Record<string, RoundSubmission[]>);
}

// Validation helper
export function isValidHolesPlayed(holes: number): holes is 9 | 18 {
  return holes === 9 || holes === 18;
}

// Helper for pace rating
export function getPaceRating(
  durationMinutes: number,
  holesPlayed: number
): "fast" | "average" | "slow" {
  const minutesPerHole = durationMinutes / holesPlayed;

  if (minutesPerHole < 13) return "fast"; // < 13 min/hole
  if (minutesPerHole < 15) return "average"; // 13-15 min/hole
  return "slow"; // > 15 min/hole
}
