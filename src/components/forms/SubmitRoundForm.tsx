"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createRound } from "@/actions/round/create-round";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  submitRoundClientSchema,
  type SubmitRoundClientInput,
} from "@/lib/validation/round";

interface Course {
  id: string;
  name: string;
  city: string;
  state: string;
}

interface SubmitRoundFormProps {
  courses: Course[];
}

export default function SubmitRoundForm({ courses }: SubmitRoundFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SubmitRoundClientInput>({
    resolver: zodResolver(submitRoundClientSchema),
    defaultValues: {
      course_id: "",
      played_date: new Date(),
      tee_time: "",
      duration_minutes: undefined,
      number_of_players: 2,
      holes_played: "18",
      walk_or_cart: "cart",
      weather_conditions: null,
      notes: "",
    },
  });

  const onSubmit = async (data: SubmitRoundClientInput) => {
    console.log("Form submitted with data:", data);
    setIsSubmitting(true);
    try {
      const result = await createRound(data);
      console.log("Create round result:", result);

      if (!result.success) {
        console.error("Round creation failed:", result);
        toast.error("Error", {
          description: result.error,
        });
      } else {
        toast.success("Success", {
          description: "Round submitted successfully!",
        });
        router.push("/");
      }
    } catch (error) {
      console.error("Caught error in onSubmit:", error);
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate duration display
  const durationMinutes = form.watch("duration_minutes");
  const durationDisplay =
    durationMinutes && durationMinutes > 0
      ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`
      : "";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Course Selection */}
        <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Course Information</h2>

          <FormField
            control={form.control}
            name="course_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Golf Course *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name} - {course.city}, {course.state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Can't find your course?{" "}
                  <a
                    href="/submit-course"
                    className="text-primary underline hover:no-underline"
                  >
                    Submit a new course
                  </a>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Round Details */}
        <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Round Details</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="played_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date Played *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-background",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tee_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tee Time *</FormLabel>
                  <FormControl>
                    <Input type="time" className="bg-background" {...field} />
                  </FormControl>
                  <FormDescription>What time did you tee off?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="holes_played"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Holes Played *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select holes" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="9">9 holes</SelectItem>
                      <SelectItem value="18">18 holes</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="number_of_players"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Players *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select players" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 player</SelectItem>
                      <SelectItem value="2">2 players</SelectItem>
                      <SelectItem value="3">3 players</SelectItem>
                      <SelectItem value="4">4 players</SelectItem>
                      <SelectItem value="5">5 players</SelectItem>
                      <SelectItem value="6">6 players</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="duration_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="180"
                    className="bg-background"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormDescription>
                  Total time from first tee to final putt
                  {durationDisplay && ` (${durationDisplay})`}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="walk_or_cart"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Walk or Cart *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="walk">Walk</SelectItem>
                    <SelectItem value="cart">Cart</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Optional Information */}
        <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Additional Details (Optional)
          </h2>

          <FormField
            control={form.control}
            name="weather_conditions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weather Conditions</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? undefined}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select weather" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sunny">Sunny</SelectItem>
                    <SelectItem value="cloudy">Cloudy</SelectItem>
                    <SelectItem value="rainy">Rainy</SelectItem>
                    <SelectItem value="windy">Windy</SelectItem>
                    <SelectItem value="hot">Hot</SelectItem>
                    <SelectItem value="cold">Cold</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional details about the round..."
                    className="bg-background min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Add any relevant details (course conditions, pace issues,
                  etc.)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/")}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Round"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
