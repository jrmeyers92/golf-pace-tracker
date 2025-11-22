// lib/validation/round.ts
import { z } from "zod";

// Client-side schema (for form validation)
export const submitRoundClientSchema = z.object({
  course_id: z.string().uuid("Please select a valid course"),
  played_date: z.date(),
  tee_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time (HH:MM format)",
  }),
  duration_minutes: z
    .number()
    .min(30, "Duration must be at least 30 minutes")
    .max(600, "Duration must be less than 10 hours"),
  number_of_players: z
    .number()
    .min(1, "At least 1 player required")
    .max(6, "Maximum 6 players allowed"),
  holes_played: z.enum(["9", "18"]),
  walk_or_cart: z.enum(["walk", "cart", "mixed"]),
  weather_conditions: z
    .enum(["sunny", "cloudy", "rainy", "windy", "hot", "cold"])
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(500, "Notes must be less than 500 characters")
    .optional(),
});

// Server-side schema (transforms for database)
export const createRoundServerSchema = submitRoundClientSchema.extend({
  course_id: z.string().uuid(),
  holes_played: z.number().refine((val) => val === 9 || val === 18),
});

// Type exports for use in components and actions
export type SubmitRoundClientInput = z.infer<typeof submitRoundClientSchema>;
export type CreateRoundServerInput = z.infer<typeof createRoundServerSchema>;

// Helper type for the full round data from database
export type RoundData = {
  id: string;
  course_id: string;
  user_id: string;
  played_at: string;
  duration_minutes: number;
  number_of_players: number;
  holes_played: number;
  day_of_week: number | null;
  time_of_day: string | null;
  walk_or_cart: string | null;
  weather_conditions: string | null;
  notes: string | null;
  created_at: string;
};
