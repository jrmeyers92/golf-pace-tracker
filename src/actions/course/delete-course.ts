// actions/course/delete-course.ts
"use server";

import { createAdminClient } from "@/lib/supabase/clients/admin";
import {
  createErrorResponse,
  createSuccessResponse,
  errorMessages,
} from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

type DeleteCourseResponse =
  | { success: false; error: string }
  | { success: true; message: string };

export async function deleteCourse(
  courseId: string
): Promise<DeleteCourseResponse> {
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

    // 3. Check if course exists
    const { data: existingCourse, error: fetchError } = await supabase
      .from("golf_pace_tracker_courses")
      .select("id, name")
      .eq("id", courseId)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching course:", fetchError);
      return createErrorResponse("Failed to fetch course");
    }

    if (!existingCourse) {
      return createErrorResponse("Course not found");
    }

    // 4. Delete the course (cascade will handle related round_submissions)
    const { error: deleteError } = await supabase
      .from("golf_pace_tracker_courses")
      .delete()
      .eq("id", courseId);

    if (deleteError) {
      console.error("Course delete error:", deleteError);
      return createErrorResponse("Failed to delete course");
    }

    // 5. Revalidate relevant pages
    revalidatePath("/courses");
    revalidatePath("/verify-courses");

    return createSuccessResponse("Course deleted successfully");
  } catch (error) {
    console.error("Error deleting course:", error);
    return createErrorResponse(errorMessages.SERVER_ERROR);
  }
}
