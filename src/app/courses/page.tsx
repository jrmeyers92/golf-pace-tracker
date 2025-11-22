// app/courses/page.tsx
import { searchCourses } from "@/actions/course/search-courses";
import CourseSearchHero from "@/components/CourseSearchHero";
import { courseSearchSchema } from "@/lib/validation/course";
import { MapPin, Navigation } from "lucide-react";
import Link from "next/link";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Parse and validate search params
  const filters = courseSearchSchema.parse({
    q: searchParams.q || undefined,
    distance: searchParams.distance ? Number(searchParams.distance) : undefined,
    day: searchParams.day || undefined,
    time: searchParams.time || undefined,
    sort: searchParams.sort || "fastest",
    // You'll get these from user's location on the client
    latitude: searchParams.lat ? Number(searchParams.lat) : undefined,
    longitude: searchParams.lng ? Number(searchParams.lng) : undefined,
  });

  // Fetch courses based on filters
  const result = await searchCourses(filters);
  const courses = result.success ? result.data.courses : [];
  const hasSearched = Boolean(searchParams.q || searchParams.distance);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Find Golf Courses</h1>
        <p className="text-muted-foreground">
          Search thousands of golf courses and compare pace of play
        </p>
      </div>

      <CourseSearchHero />

      {/* Search Results */}
      {hasSearched && (
        <div className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">
              {courses.length > 0
                ? `Found ${courses.length} course${
                    courses.length !== 1 ? "s" : ""
                  }`
                : "No courses found"}
            </h2>
            {courses.length === 0 && (
              <p className="text-muted-foreground mt-2">
                Try adjusting your search filters or search term
              </p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group"
              >
                <div className="h-full rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {course.name}
                    </h3>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    {(course.city || course.state) && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span>
                          {[course.city, course.state]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    )}

                    {course.distance !== undefined && (
                      <div className="flex items-center gap-2">
                        <Navigation className="h-4 w-4 shrink-0" />
                        <span>{course.distance.toFixed(1)} miles away</span>
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-2 border-t">
                      <span>{course.number_of_holes || 18} holes</span>
                      {course.par && <span>Par {course.par}</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Default State - Show popular courses or recent additions */}
      {!hasSearched && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Popular Courses</h2>
          <p className="text-muted-foreground">
            Use the search above to find courses near you
          </p>
        </div>
      )}
    </div>
  );
}
