// actions/course/get-course.ts
"use server";

import { createAdminClient } from "@/lib/supabase/clients/admin";
import { createErrorResponse } from "@/lib/validation";

type GetCourseResponse =
  | { success: false; error: string }
  | {
      success: true;
      data: {
        id: string;
        name: string;
        address: string | null;
        city: string | null;
        state: string | null;
        zip_code: string | null;
        country: string | null;
        latitude: number | null;
        longitude: number | null;
        number_of_holes: number | null;
        par: number | null;
        phone: string | null;
        website: string | null;
        created_at: string;
        updated_at: string;
        stats?: {
          total_rounds: number;
          average_duration: number;
          weekday_average: number;
          weekend_average: number;
          fastest_round: number;
          slowest_round: number;
        };
        recent_rounds?: Array<{
          id: string;
          duration_minutes: number;
          holes_played: number;
          number_of_players: number;
          played_at: string;
          walk_or_cart: string | null;
        }>;
      };
    };

export async function getCourseById(
  courseId: string
): Promise<GetCourseResponse> {
  try {
    const supabase = await createAdminClient();

    // 1. Get course details
    const { data: course, error: courseError } = await supabase
      .from("golf_pace_tracker_courses")
      .select("*")
      .eq("id", courseId)
      .single();

    if (courseError || !course) {
      console.error("Course fetch error:", courseError);
      return createErrorResponse("Course not found");
    }

    // 2. Get round statistics
    const { data: rounds, error: roundsError } = await supabase
      .from("golf_pace_tracker_round_submissions")
      .select("duration_minutes, day_of_week, played_at")
      .eq("course_id", courseId);

    let stats = undefined;
    if (!roundsError && rounds && rounds.length > 0) {
      const durations = rounds.map((r) => r.duration_minutes);
      const weekdayRounds = rounds.filter(
        (r) => r.day_of_week && r.day_of_week >= 1 && r.day_of_week <= 5
      );
      const weekendRounds = rounds.filter(
        (r) => r.day_of_week && (r.day_of_week === 0 || r.day_of_week === 6)
      );

      stats = {
        total_rounds: rounds.length,
        average_duration: Math.round(
          durations.reduce((a, b) => a + b, 0) / durations.length
        ),
        weekday_average:
          weekdayRounds.length > 0
            ? Math.round(
                weekdayRounds.reduce((sum, r) => sum + r.duration_minutes, 0) /
                  weekdayRounds.length
              )
            : 0,
        weekend_average:
          weekendRounds.length > 0
            ? Math.round(
                weekendRounds.reduce((sum, r) => sum + r.duration_minutes, 0) /
                  weekendRounds.length
              )
            : 0,
        fastest_round: Math.min(...durations),
        slowest_round: Math.max(...durations),
      };
    }

    // 3. Get recent rounds (last 5)
    const { data: recentRounds, error: recentError } = await supabase
      .from("golf_pace_tracker_round_submissions")
      .select(
        "id, duration_minutes, holes_played, number_of_players, played_at, walk_or_cart"
      )
      .eq("course_id", courseId)
      .order("played_at", { ascending: false })
      .limit(5);

    return {
      success: true,
      data: {
        ...course,
        stats,
        recent_rounds: recentError ? [] : recentRounds,
      },
    };
  } catch (error) {
    console.error("Error fetching course:", error);
    return createErrorResponse("Failed to fetch course details");
  }
}
