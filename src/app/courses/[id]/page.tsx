// app/courses/[id]/page.tsx
import { getCourseById } from "@/actions/course/get-course";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Globe,
  MapPin,
  Phone,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CoursePage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getCourseById(params.id);

  if (!result.success) {
    notFound();
  }

  const course = result.data;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/courses">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Button>
      </Link>

      {/* Course Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{course.name}</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>
            {[course.address, course.city, course.state, course.zip_code]
              .filter(Boolean)
              .join(", ")}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
              <CardDescription>
                Basic details about this golf course
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Holes
                    </p>
                    <p className="text-2xl font-bold">
                      {course.number_of_holes || 18}
                    </p>
                  </div>
                </div>

                {course.par && (
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Par
                      </p>
                      <p className="text-2xl font-bold">{course.par}</p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Contact Information */}
              <div className="space-y-3">
                <h3 className="font-semibold">Contact Information</h3>

                {course.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />

                    <a
                      href={`tel:${course.phone}`}
                      className="text-primary hover:underline"
                    >
                      {course.phone}
                    </a>
                  </div>
                )}

                {course.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />

                    <a
                      href={course.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pace of Play Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Pace of Play</CardTitle>
              <CardDescription>
                Average round times at this course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Average Times */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Overall
                      </span>
                    </div>
                    <p className="text-2xl font-bold">
                      {course.stats?.average_duration || "N/A"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      minutes
                    </p>
                  </div>

                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Weekday
                      </span>
                    </div>
                    <p className="text-2xl font-bold">
                      {course.stats?.weekday_average || "N/A"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      minutes
                    </p>
                  </div>

                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Weekend
                      </span>
                    </div>
                    <p className="text-2xl font-bold">
                      {course.stats?.weekend_average || "N/A"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      minutes
                    </p>
                  </div>
                </div>

                {/* No data state */}
                {!course.stats?.average_duration && (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground mb-4">
                      No pace of play data yet for this course
                    </p>
                    <Link href={`/submit-round?course=${course.id}`}>
                      <Button>Submit Your Round Time</Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Rounds */}
          {course.recent_rounds && course.recent_rounds.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Rounds</CardTitle>
                <CardDescription>Latest submitted round times</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {course.recent_rounds.map((round: any) => (
                    <div
                      key={round.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">
                            {round.duration_minutes} minutes
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {round.holes_played} holes •{" "}
                            {round.number_of_players} players
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {new Date(round.played_at).toLocaleDateString()}
                        </p>
                        {round.walk_or_cart && (
                          <p className="text-xs text-muted-foreground capitalize">
                            {round.walk_or_cart}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href={`/submit-round?course=${course.id}`}
                className="block"
              >
                <Button className="w-full" size="lg">
                  Submit Round Time
                </Button>
              </Link>

              {course.website && (
                <a
                  href={course.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="outline" className="w-full" size="lg">
                    <Globe className="mr-2 h-4 w-4" />
                    Book Tee Time
                  </Button>
                </a>
              )}

              {course.phone && (
                <a href={`tel:${course.phone}`} className="block">
                  <Button variant="outline" className="w-full" size="lg">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Course
                  </Button>
                </a>
              )}
            </CardContent>
          </Card>

          {/* Map Card */}
          {course.latitude && course.longitude && (
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  {/* You can integrate Google Maps or Mapbox here */}
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${course.latitude},${course.longitude}`}
                    allowFullScreen
                  />
                </div>
                <div className="mt-4">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${course.latitude},${course.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full">
                      <MapPin className="mr-2 h-4 w-4" />
                      Get Directions
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Course Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total Rounds
                </span>
                <span className="font-semibold">
                  {course.stats?.total_rounds || 0}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Fastest Round
                </span>
                <span className="font-semibold">
                  {course.stats?.fastest_round || "N/A"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Slowest Round
                </span>
                <span className="font-semibold">
                  {course.stats?.slowest_round || "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
