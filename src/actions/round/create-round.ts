"use server";

import { createAdminClient } from "@/lib/supabase/clients/admin";
import {
  createErrorResponse,
  createSuccessResponse,
  errorMessages,
} from "@/lib/validation";
import {
  createRoundServerSchema,
  type SubmitRoundClientInput,
} from "@/lib/validation/round";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type CreateRoundResponse =
  | { success: false; error: string; details?: unknown }
  | { success: true; message: string; data?: { roundId: string } };

export async function createRound(
  roundData: SubmitRoundClientInput
): Promise<CreateRoundResponse> {
  try {
    // 1. Check authentication
    const { userId } = await auth();
    if (!userId) {
      return createErrorResponse(errorMessages.AUTHENTICATION_REQUIRED);
    }

    // 2. Validate data with server schema
    let validatedData;
    try {
      // Transform holes_played from string to number for server schema
      const dataToValidate = {
        ...roundData,
        holes_played: parseInt(roundData.holes_played),
      };
      validatedData = createRoundServerSchema.parse(dataToValidate);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        console.error("Validation errors:", validationError.issues);
        return createErrorResponse(
          errorMessages.VALIDATION_FAILED,
          validationError.issues
        );
      }
      throw validationError;
    }

    const supabase = await createAdminClient();

    // 3. Verify course exists
    const { data: course, error: courseError } = await supabase
      .from("golf_pace_tracker_courses")
      .select("id")
      .eq("id", validatedData.course_id)
      .single();

    if (courseError || !course) {
      return createErrorResponse("Selected course not found");
    }

    // 4. Combine date and time into a single timestamp
    const [hours, minutes] = validatedData.tee_time.split(":").map(Number);
    const playedAt = new Date(validatedData.played_date);
    playedAt.setHours(hours, minutes, 0, 0);

    // 5. Insert round submission
    // Note: day_of_week and time_of_day will be auto-populated by the database trigger
    const { data: round, error: roundError } = await supabase
      .from("golf_pace_tracker_round_submissions")
      .insert([
        {
          course_id: validatedData.course_id,
          user_id: userId,
          played_at: playedAt.toISOString(),
          duration_minutes: validatedData.duration_minutes,
          number_of_players: validatedData.number_of_players,
          holes_played: validatedData.holes_played,
          walk_or_cart: validatedData.walk_or_cart,
          weather_conditions: validatedData.weather_conditions || null,
          notes: validatedData.notes || null,
        },
      ])
      .select()
      .single();

    if (roundError) {
      console.error("Round insert error:", roundError);
      return createErrorResponse("Failed to submit round");
    }

    // 6. Revalidate relevant pages
    revalidatePath("/");
    revalidatePath("/rounds");
    revalidatePath(`/courses/${validatedData.course_id}`);

    return createSuccessResponse("Round submitted successfully", {
      roundId: round.id,
    });
  } catch (error) {
    console.error("Error creating round:", error);
    return createErrorResponse(errorMessages.SERVER_ERROR);
  }
}
