"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CourseSearchHero() {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [distance, setDistance] = useState("25");
  const [dayOfWeek, setDayOfWeek] = useState("any");
  const [timeOfDay, setTimeOfDay] = useState("any");
  const [sortBy, setSortBy] = useState("fastest");

  const handleSearch = () => {
    // Build query params
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (distance !== "25") params.set("distance", distance);
    if (dayOfWeek !== "any") params.set("day", dayOfWeek);
    if (timeOfDay !== "any") params.set("time", timeOfDay);
    if (sortBy !== "fastest") params.set("sort", sortBy);

    // Navigate to search results
    router.push(`/courses?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search course name or enter location..."
            className="h-12 bg-card pl-10 pr-4 shadow-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button
          size="lg"
          variant="outline"
          className="h-12 px-4 shadow-md sm:w-auto"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-5 w-5 sm:mr-2" />
          <span className="hidden sm:inline">Filters</span>
        </Button>
        <Button
          size="lg"
          className="h-12 px-8 shadow-md"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mt-4 rounded-lg border bg-card p-4 shadow-md">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Distance</label>
              <Select value={distance} onValueChange={setDistance}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select radius" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Within 10 miles</SelectItem>
                  <SelectItem value="25">Within 25 miles</SelectItem>
                  <SelectItem value="50">Within 50 miles</SelectItem>
                  <SelectItem value="100">Within 100 miles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Day of Week
              </label>
              <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Any day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any day</SelectItem>
                  <SelectItem value="weekday">Weekdays</SelectItem>
                  <SelectItem value="weekend">Weekends</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Time of Day
              </label>
              <Select value={timeOfDay} onValueChange={setTimeOfDay}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Any time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any time</SelectItem>
                  <SelectItem value="morning">Morning (Before 12pm)</SelectItem>
                  <SelectItem value="afternoon">
                    Afternoon (12pm-4pm)
                  </SelectItem>
                  <SelectItem value="evening">Evening (After 4pm)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fastest">Fastest pace</SelectItem>
                  <SelectItem value="slowest">Slowest pace</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="popular">Most popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      <p className="mt-4 text-sm text-muted-foreground">
        Try: &quot;Torrey Pines&quot; or &quot;San Diego, CA&quot; or
        &quot;92037&quot;
      </p>
    </div>
  );
}
