import { Clock, LandPlot, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      {/* CTA Banner */}
      <div className="border-b bg-primary/5">
        <div className="container mx-auto px-4 py-8 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div>
              <h3 className="text-lg font-semibold">
                Can&apos;t find the course you&apos;re looking for?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Help grow our database by adding missing courses
              </p>
            </div>
            <Link
              href="/submit-course"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Submit a Course
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <LandPlot className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Pace Of Play Tracker</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Know your round time before you go. Real pace of play data from
              golfers like you.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Making golf more enjoyable since 2024</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/courses"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/submit-round"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Submit Round Time
                </Link>
              </li>
              <li>
                <Link
                  href="/submit-course"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Add a Course
                </Link>
              </li>
              <li>
                <Link
                  href="/favorites"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  My Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/how-it-works"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider">
                Get in Touch
              </h4>
              <a
                href="mailto:hello@golfpacetracker.com"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                hello@golfpacetracker.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground md:flex-row">
            <p>© {currentYear} Pace Of Play Tracker. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link
                href="/sitemap"
                className="transition-colors hover:text-primary"
              >
                Sitemap
              </Link>
              <Link
                href="/changelog"
                className="transition-colors hover:text-primary"
              >
                Changelog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
