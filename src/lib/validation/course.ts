// lib/validation/course.ts
import { z } from "zod";

// US States enum
const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
] as const;

const COUNTRIES = ["US", "CA", "MX"] as const;

// Enums for validation
export const stateSchema = z.enum(US_STATES);
export const countrySchema = z.enum(COUNTRIES);

// Number of holes schema
export const numberOfHolesSchema = z.union([
  z.literal(9),
  z.literal(18),
  z.literal(27),
]);

// CLIENT-SIDE SCHEMA (for form validation)
export const submitCourseClientSchema = z.object({
  name: z
    .string()
    .min(2, "Course name must be at least 2 characters")
    .max(200, "Course name must not exceed 200 characters"),
  address: z.string(), // Empty string is allowed
  city: z.string().min(2, "City is required").max(100),
  state: stateSchema,
  zip_code: z.string(), // Empty string is allowed
  country: countrySchema,
  number_of_holes: numberOfHolesSchema,
  par: z
    .number()
    .int()
    .min(27, "Par must be at least 27")
    .max(90, "Par must not exceed 90")
    .optional(),
  phone: z.string(), // Empty string is allowed
  website: z.string(), // Empty string is allowed
});

// SERVER-SIDE SCHEMA (includes database fields like latitude/longitude)
export const createCourseServerSchema = submitCourseClientSchema.extend({
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
});

// UPDATE SCHEMA (for editing courses - all fields optional except id)
export const updateCourseSchema = submitCourseClientSchema.partial().extend({
  id: z.string().uuid("Invalid course ID"),
});

// SEARCH/FILTER SCHEMA (for course search and filtering)
export const courseSearchSchema = z.object({
  q: z.string().optional(),
  distance: z.number().positive().optional(),
  state: stateSchema.optional(),
  city: z.string().optional(),
  day: z.enum(["any", "weekday", "weekend"]).optional(),
  time: z.enum(["any", "morning", "afternoon", "evening"]).optional(),
  sort: z
    .enum(["fastest", "slowest", "distance", "popular", "name"])
    .optional()
    .default("fastest"),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

// Type exports for use in components and actions
export type SubmitCourseClientInput = z.infer<typeof submitCourseClientSchema>;
export type CreateCourseServerInput = z.infer<typeof createCourseServerSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type CourseSearchInput = z.infer<typeof courseSearchSchema>;

// Helper type for the full course data from database
export type CourseData = {
  id: string;
  name: string;
  address: string | null;
  city: string;
  state: string;
  zip_code: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  number_of_holes: number;
  par: number | null;
  phone: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
};
