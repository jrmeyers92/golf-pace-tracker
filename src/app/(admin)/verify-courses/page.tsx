// app/admin/courses/page.tsx
import CourseApprovalList from "@/components/CourseApprovalList";
import { createAdminClient } from "@/lib/supabase/clients/admin";
async function getUnverifiedCourses() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("golf_pace_tracker_courses")
    .select("*")
    .eq("verified", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching courses:", error);
    return [];
  }

  return data || [];
}

export default async function CourseApprovalPage() {
  const courses = await getUnverifiedCourses();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Course Approval Admin
          </h1>
          <p className="text-gray-600 mt-2">
            {courses.length} unverified course{courses.length !== 1 ? "s" : ""}{" "}
            pending approval
          </p>
        </div>

        <CourseApprovalList initialCourses={courses} />
      </div>
    </div>
  );
}
