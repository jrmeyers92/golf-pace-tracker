"use server";

import { createAdminClient } from "@/lib/supabase/clients/admin";
import {
  createErrorResponse,
  createSuccessResponse,
  errorMessages,
} from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

type ApproveCourseResponse =
  | { success: false; error: string }
  | { success: true; message: string };

export async function approveCourse(
  courseId: string
): Promise<ApproveCourseResponse> {
  try {
    // 1. Check authentication
    const { userId } = await auth();
    if (!userId) {
      return createErrorResponse(errorMessages.AUTHENTICATION_REQUIRED);
    }

    // 2. Validate courseId is a valid UUID
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(courseId)) {
      return createErrorResponse("Invalid course ID");
    }

    const supabase = await createAdminClient();

    // 3. Check if course exists and is not already verified
    const { data: existingCourse, error: fetchError } = await supabase
      .from("golf_pace_tracker_courses")
      .select("id, name, verified")
      .eq("id", courseId)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching course:", fetchError);
      return createErrorResponse("Failed to fetch course");
    }

    if (!existingCourse) {
      return createErrorResponse("Course not found");
    }

    if (existingCourse.verified) {
      return createErrorResponse("Course is already verified");
    }

    // 4. Update the course to set verified = true
    const { error: updateError } = await supabase
      .from("golf_pace_tracker_courses")
      .update({ verified: true })
      .eq("id", courseId);

    if (updateError) {
      console.error("Course approval error:", updateError);
      return createErrorResponse("Failed to approve course");
    }

    // 5. Revalidate relevant pages
    revalidatePath("/courses");
    revalidatePath("/verify-courses");

    return createSuccessResponse("Course approved successfully");
  } catch (error) {
    console.error("Error approving course:", error);
    return createErrorResponse(errorMessages.SERVER_ERROR);
  }
}
