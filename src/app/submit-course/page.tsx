import SubmitCourseForm from "@/components/forms/SubmitCourseForm";
import { MapPin } from "lucide-react";

export default function SubmitCoursePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Header */}
      <section className="border-b bg-linear-to-brfrom-primary/5 to-background py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Submit a Golf Course
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Help grow our database by adding a course that&apos;s missing from
              our collection
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            {/* Info Card */}
            <div className="mb-8 rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="mb-3 font-semibold">Before you submit:</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-primary">•</span>
                  <span>
                    Please search our database first to ensure the course
                    isn&apos;t already listed
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-primary">•</span>
                  <span>
                    Provide as much accurate information as possible to help
                    other golfers
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-primary">•</span>
                  <span>
                    All submissions will be reviewed before being added to the
                    database
                  </span>
                </li>
              </ul>
            </div>

            {/* Form */}
            <SubmitCourseForm />
          </div>
        </div>
      </section>
    </main>
  );
}
