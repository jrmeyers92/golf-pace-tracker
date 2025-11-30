// app/admin/courses/CourseApprovalList.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { approveCourse } from "@/actions/course/approve-course";
import { deleteCourse } from "@/actions/course/delete-course";
import { updateCourse } from "@/actions/course/update-course";
import {
  submitCourseClientSchema,
  type SubmitCourseClientInput,
} from "@/lib/validation/course";
import { Course } from "@/types/database.types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// US States list
const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

interface CourseApprovalListProps {
  initialCourses: Course[];
}

export default function CourseApprovalList({
  initialCourses,
}: CourseApprovalListProps) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const form = useForm<SubmitCourseClientInput>({
    resolver: zodResolver(submitCourseClientSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: undefined,
      zip_code: "",
      country: "US",
      number_of_holes: 18,
      par: undefined,
      phone: "",
      website: "",
    },
  });

  function handleEditClick(course: Course) {
    setEditingCourse(course);
    form.reset({
      name: course.name,
      address: course.address || "",
      city: course.city || "",
      state: course.state || undefined,
      zip_code: course.zip_code || "",
      country: (course.country as "US" | "CA" | "MX") || "US",
      number_of_holes: (course.number_of_holes as 9 | 18 | 27) || 18,
      par: course.par || undefined,
      phone: course.phone || "",
      website: course.website || "",
    });
    setIsEditDialogOpen(true);
  }

  async function onEditSubmit(data: SubmitCourseClientInput) {
    if (!editingCourse) return;

    try {
      setProcessingId(editingCourse.id);
      setError(null);

      const result = await updateCourse({
        id: editingCourse.id,
        ...data,
      });

      if (!result.success) {
        toast.error("Error", {
          description: result.error || "Failed to update course",
        });
        return;
      }

      // Update the course in the list
      setCourses(
        courses.map((c) =>
          c.id === editingCourse.id
            ? {
                ...c,
                ...data,
                address: data.address || null,
                zip_code: data.zip_code || null,
                par: data.par || null,
                phone: data.phone || null,
                website: data.website || null,
              }
            : c
        )
      );

      toast.success("Success", {
        description: "Course updated successfully",
      });

      setIsEditDialogOpen(false);
      setEditingCourse(null);
    } catch (err) {
      console.error("Error updating course:", err);
      toast.error("Error", {
        description: "An unexpected error occurred",
      });
    } finally {
      setProcessingId(null);
    }
  }

  async function handleApprove(course: Course) {
    try {
      setProcessingId(course.id);
      setError(null);

      const result = await approveCourse(course.id);

      if (!result.success) {
        throw new Error(result.error || "Failed to approve course");
      }

      setCourses(courses.filter((c) => c.id !== course.id));
      toast.success("Success", {
        description: "Course approved successfully",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error approving course:", err);
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDelete(courseId: string) {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      setProcessingId(courseId);
      setError(null);

      const result = await deleteCourse(courseId);

      if (!result.success) {
        throw new Error(result.error || "Failed to delete course");
      }

      setCourses(courses.filter((c) => c.id !== courseId));
      toast.success("Success", {
        description: "Course deleted successfully",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error deleting course:", err);
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <>
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">No courses pending approval</p>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {course.name}
                  </h2>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {course.address && (
                      <div>
                        <span className="text-gray-500">Address:</span>
                        <span className="ml-2 text-gray-900">
                          {course.address}
                        </span>
                      </div>
                    )}

                    {(course.city || course.state) && (
                      <div>
                        <span className="text-gray-500">Location:</span>
                        <span className="ml-2 text-gray-900">
                          {[course.city, course.state]
                            .filter(Boolean)
                            .join(", ")}
                          {course.zip_code && ` ${course.zip_code}`}
                        </span>
                      </div>
                    )}

                    {course.phone && (
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <span className="ml-2 text-gray-900">
                          {course.phone}
                        </span>
                      </div>
                    )}

                    {course.website && (
                      <div>
                        <span className="text-gray-500">Website:</span>
                        <a
                          href={course.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 hover:underline"
                        >
                          {course.website}
                        </a>
                      </div>
                    )}

                    <div>
                      <span className="text-gray-500">Holes:</span>
                      <span className="ml-2 text-gray-900">
                        {course.number_of_holes || "N/A"}
                      </span>
                    </div>

                    {course.par && (
                      <div>
                        <span className="text-gray-500">Par:</span>
                        <span className="ml-2 text-gray-900">{course.par}</span>
                      </div>
                    )}

                    {course.latitude && course.longitude && (
                      <div>
                        <span className="text-gray-500">Coordinates:</span>
                        <span className="ml-2 text-gray-900">
                          {course.latitude}, {course.longitude}
                        </span>
                      </div>
                    )}

                    {course.created_at && (
                      <div>
                        <span className="text-gray-500">Submitted:</span>
                        <span className="ml-2 text-gray-900">
                          {new Date(course.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="ml-6 flex flex-col gap-2">
                  <button
                    onClick={() => handleEditClick(course)}
                    disabled={processingId === course.id}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors min-w-[100px] flex items-center justify-center gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleApprove(course)}
                    disabled={processingId === course.id}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors min-w-[100px]"
                  >
                    {processingId === course.id ? "Processing..." : "Approve"}
                  </button>

                  <button
                    onClick={() => handleDelete(course.id)}
                    disabled={processingId === course.id}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors min-w-[100px]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Make changes to the course information before approving.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onEditSubmit)}
              className="space-y-6"
            >
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="number_of_holes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Holes</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                          value={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="9">9 holes</SelectItem>
                            <SelectItem value="18">18 holes</SelectItem>
                            <SelectItem value="27">27 holes</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="par"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Par</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined
                              )
                            }
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Location</h3>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {US_STATES.map((state) => (
                              <SelectItem key={state.value} value={state.value}>
                                {state.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="zip_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="MX">Mexico</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input type="url" {...field} />
                      </FormControl>
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
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={processingId !== null}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={processingId !== null}
                  className="flex-1"
                >
                  {processingId !== null ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
