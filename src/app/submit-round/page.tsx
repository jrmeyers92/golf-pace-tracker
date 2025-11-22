// app/submit-round/page.tsx
import SubmitRoundForm from "@/components/forms/SubmitRoundForm";
import { createAdminClient } from "@/lib/supabase/clients/admin";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SubmitRoundPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch courses for the dropdown
  const supabase = await createAdminClient();
  const { data: courses, error } = await supabase
    .from("golf_pace_tracker_courses")
    .select("id, name, city, state")
    .order("name");

  if (error) {
    console.error("Error fetching courses:", error);
  }

  return (
    <div className="container mx-auto max-w-4xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Submit a Round</h1>
        <p className="text-muted-foreground mt-2">
          Share how long your round took to help other golfers plan their tee
          times
        </p>
      </div>

      <SubmitRoundForm courses={courses || []} />
    </div>
  );
}
