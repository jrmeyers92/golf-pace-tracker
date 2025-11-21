// actions/course/create-course.ts
"use server";

import { createAdminClient } from "@/lib/supabase/clients/admin";
import {
  createErrorResponse,
  createSuccessResponse,
  errorMessages,
} from "@/lib/validation";
import {
  createCourseServerSchema,
  type SubmitCourseClientInput,
} from "@/lib/validation/course";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type CreateCourseResponse =
  | { success: false; error: string; details?: unknown }
  | { success: true; message: string; data?: { courseId: string } };

export async function createCourse(
  courseData: SubmitCourseClientInput
): Promise<CreateCourseResponse> {
  try {
    // 1. Check authentication
    const { userId } = await auth();
    if (!userId) {
      return createErrorResponse(errorMessages.AUTHENTICATION_REQUIRED);
    }

    // 2. Validate data with server schema
    let validatedData;
    try {
      validatedData = createCourseServerSchema.parse(courseData);
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

    // 3. Check if course already exists (optional - prevent duplicates)
    const { data: existingCourse } = await supabase
      .from("golf_pace_tracker_courses")
      .select("id")
      .eq("name", validatedData.name)
      .eq("city", validatedData.city)
      .eq("state", validatedData.state)
      .maybeSingle();

    if (existingCourse) {
      return createErrorResponse(
        "A course with this name already exists in this location"
      );
    }

    // 4. Optional: Geocode address to get latitude/longitude
    const latitude: number | null = null;
    const longitude: number | null = null;

    // 5. Insert course - convert empty strings to null for nullable fields
    const { data: course, error: courseError } = await supabase
      .from("golf_pace_tracker_courses")
      .insert([
        {
          name: validatedData.name,
          address: validatedData.address || null,
          city: validatedData.city,
          state: validatedData.state,
          zip_code: validatedData.zip_code || null,
          country: validatedData.country,
          latitude,
          longitude,
          number_of_holes: validatedData.number_of_holes,
          par: validatedData.par ?? null,
          phone: validatedData.phone || null,
          website: validatedData.website || null,
        },
      ])
      .select()
      .single();

    if (courseError) {
      console.error("Course insert error:", courseError);
      return createErrorResponse("Failed to create course");
    }

    // 6. Revalidate relevant pages
    revalidatePath("/courses");
    revalidatePath("/submit-course");

    return createSuccessResponse("Course submitted successfully", {
      courseId: course.id,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return createErrorResponse(errorMessages.SERVER_ERROR);
  }
}
