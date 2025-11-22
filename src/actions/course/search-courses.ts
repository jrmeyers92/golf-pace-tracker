// actions/course/search-courses.ts
"use server";

import { createAdminClient } from "@/lib/supabase/clients/admin";
import { createErrorResponse } from "@/lib/validation";
import type { CourseSearchInput } from "@/lib/validation/course";

type SearchCoursesResponse =
  | { success: false; error: string }
  | {
      success: true;
      data: {
        courses: Array<{
          id: string;
          name: string;
          address: string | null;
          city: string | null;
          state: string | null;
          zip_code: string | null;
          country: string | null;
          number_of_holes: number | null;
          par: number | null;
          phone: string | null;
          website: string | null;
          distance?: number; // Distance in miles (if using location search)
        }>;
        count: number;
      };
    };

export async function searchCourses(
  filters: CourseSearchInput
): Promise<SearchCoursesResponse> {
  try {
    const supabase = await createAdminClient();
    let query = supabase.from("golf_pace_tracker_courses").select("*", {
      count: "exact",
    });

    // 1. TEXT SEARCH - Uses the full-text search index
    if (filters.q) {
      // Use full-text search for course names
      query = query.textSearch("name", filters.q, {
        type: "websearch",
        config: "english",
      });
    }

    // 2. LOCATION FILTERS
    if (filters.state) {
      query = query.eq("state", filters.state);
    }

    if (filters.city) {
      query = query.ilike("city", `%${filters.city}%`);
    }

    // 3. DISTANCE-BASED SEARCH (if user provides lat/lng)
    if (
      filters.latitude !== undefined &&
      filters.longitude !== undefined &&
      filters.distance
    ) {
      // Use PostGIS for distance calculation (requires PostGIS extension)
      // This will filter courses within X miles of the given coordinates
      query = query.not("latitude", "is", null).not("longitude", "is", null);

      // We'll calculate distance in JavaScript after fetching
      // For better performance, you could use a PostGIS query or stored function
    }

    // 4. SORTING
    switch (filters.sort) {
      case "name":
        query = query.order("name", { ascending: true });
        break;
      case "popular":
        // You might want to add a popularity score or view count later
        query = query.order("created_at", { ascending: false });
        break;
      default:
        query = query.order("name", { ascending: true });
    }

    const { data: courses, error, count } = await query;

    if (error) {
      console.error("Course search error:", error);
      return createErrorResponse("Failed to search courses");
    }

    // 5. POST-PROCESS: Calculate distances if location search is enabled
    let processedCourses = courses || [];

    if (
      filters.latitude !== undefined &&
      filters.longitude !== undefined &&
      filters.distance
    ) {
      processedCourses = processedCourses
        .map((course) => {
          if (course.latitude && course.longitude) {
            const distance = calculateDistance(
              filters.latitude!,
              filters.longitude!,
              Number(course.latitude),
              Number(course.longitude)
            );
            return { ...course, distance };
          }
          return null;
        })
        .filter(
          (course): course is NonNullable<typeof course> => course !== null
        )
        .filter((course) => course.distance! <= filters.distance!)
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    return {
      success: true,
      data: {
        courses: processedCourses,
        count: count || 0,
      },
    };
  } catch (error) {
    console.error("Error searching courses:", error);
    return createErrorResponse("An error occurred while searching");
  }
}

// Haversine formula to calculate distance between two coordinates in miles
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
