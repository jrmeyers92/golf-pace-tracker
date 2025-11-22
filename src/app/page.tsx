import CourseSearchHero from "@/components/CourseSearchHero";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Search, Timer, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-linear-to-b from-primary/10 via-background to-background py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Know Your Round Time{" "}
              <span className="text-primary">Before You Go</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Real pace of play data from golfers like you. Search by course
              name or location to find out how long rounds actually take.
            </p>

            {/* Client Component for Search */}
            <CourseSearchHero />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">12,847</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Rounds Tracked
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">1,234</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Golf Courses
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">4.2 hrs</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Average Round Time
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Make Better Tee Time Decisions
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Stop guessing how long your round will take. Get real data from
              real golfers.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Time of Day Insights</h3>
              <p className="mt-2 text-muted-foreground">
                See how pace varies by tee time. Morning rounds typically faster
                than afternoon? The data will show you.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Day of Week Analysis</h3>
              <p className="mt-2 text-muted-foreground">
                Weekends vs. weekdays, holidays vs. regular days. Plan your
                round when courses are less crowded.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Group Size Data</h3>
              <p className="mt-2 text-muted-foreground">
                Understand how 2-somes, 3-somes, and 4-somes affect pace at your
                favorite courses.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Course Rankings</h3>
              <p className="mt-2 text-muted-foreground">
                Find the fastest courses in your area. Sort by average pace,
                location, and more.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Timer className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Real Community Data</h3>
              <p className="mt-2 text-muted-foreground">
                No estimates or guesses. All data comes from actual golfers
                tracking their real round times.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Easy Search</h3>
              <p className="mt-2 text-muted-foreground">
                Quickly find any course by name, location, or area. Filter
                results to match your preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y bg-muted/30 py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Simple, fast, and community-driven
            </p>
          </div>

          <div className="mt-16 grid gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="text-xl font-semibold">Search for a Course</h3>
              <p className="mt-2 text-muted-foreground">
                Find the golf course you&apos;re planning to play or have just
                played.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="text-xl font-semibold">View or Submit Data</h3>
              <p className="mt-2 text-muted-foreground">
                See real pace data or submit your own round time to help others.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="text-xl font-semibold">Plan Your Round</h3>
              <p className="mt-2 text-muted-foreground">
                Make informed decisions about when to book your tee time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 p-8 text-center md:p-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Track Your Pace?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of golfers making smarter tee time decisions with
              real data.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/submit">Submit Round Time</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
