// actions/course/update-course.ts
"use server";

import { createAdminClient } from "@/lib/supabase/clients/admin";
import {
  createErrorResponse,
  createSuccessResponse,
  errorMessages,
} from "@/lib/validation";
import {
  updateCourseSchema,
  type UpdateCourseInput,
} from "@/lib/validation/course";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type UpdateCourseResponse =
  | { success: false; error: string; details?: unknown }
  | { success: true; message: string };

export async function updateCourse(
  courseData: UpdateCourseInput
): Promise<UpdateCourseResponse> {
  try {
    // 1. Check authentication
    const { userId } = await auth();
    if (!userId) {
      return createErrorResponse(errorMessages.AUTHENTICATION_REQUIRED);
    }

    // 2. Validate data with update schema
    let validatedData;
    try {
      validatedData = updateCourseSchema.parse(courseData);
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

    // 3. Check if course exists
    const { data: existingCourse, error: fetchError } = await supabase
      .from("golf_pace_tracker_courses")
      .select("id")
      .eq("id", validatedData.id)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching course:", fetchError);
      return createErrorResponse("Failed to fetch course");
    }

    if (!existingCourse) {
      return createErrorResponse("Course not found");
    }

    // 4. Prepare update data (exclude id from update)
    const { id, ...updateData } = validatedData;

    // Convert empty strings to null for nullable fields
    const preparedData = {
      ...(updateData.name !== undefined && { name: updateData.name }),
      ...(updateData.address !== undefined && {
        address: updateData.address || null,
      }),
      ...(updateData.city !== undefined && { city: updateData.city }),
      ...(updateData.state !== undefined && { state: updateData.state }),
      ...(updateData.zip_code !== undefined && {
        zip_code: updateData.zip_code || null,
      }),
      ...(updateData.country !== undefined && { country: updateData.country }),
      ...(updateData.number_of_holes !== undefined && {
        number_of_holes: updateData.number_of_holes,
      }),
      ...(updateData.par !== undefined && { par: updateData.par ?? null }),
      ...(updateData.phone !== undefined && {
        phone: updateData.phone || null,
      }),
      ...(updateData.website !== undefined && {
        website: updateData.website || null,
      }),
    };

    // 5. Update course
    const { error: updateError } = await supabase
      .from("golf_pace_tracker_courses")
      .update(preparedData)
      .eq("id", id);

    if (updateError) {
      console.error("Course update error:", updateError);
      return createErrorResponse("Failed to update course");
    }

    // 6. Revalidate relevant pages
    revalidatePath("/courses");
    revalidatePath("/admin/courses");

    return createSuccessResponse("Course updated successfully");
  } catch (error) {
    console.error("Error updating course:", error);
    return createErrorResponse(errorMessages.SERVER_ERROR);
  }
}
