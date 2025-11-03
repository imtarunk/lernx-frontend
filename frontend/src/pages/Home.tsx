import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Course } from "@/types";
import api from "@/lib/api";

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get("/courses");
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <p className="text-center">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="py-2 sm:py-4">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-2 tracking-tight">
          SAT Study Courses
        </h1>
        <p className="text-muted-foreground">
          Explore {courses.length} comprehensive courses to prepare for your SAT
          exam
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {courses.map((course) => (
          <Link key={course.id} to={`/course/${course.id}`}>
            <Card className="glass glass-edge backdrop-noise glass-hover cursor-pointer h-full rounded-2xl overflow-hidden">
              {/* Thumbnail */}
              <div className="aspect-video relative">
                <img
                  src="/thumn.png"
                  alt={course.label}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
              <CardHeader>
                <CardTitle className="tracking-tight">{course.label}</CardTitle>
                <CardDescription>
                  {course.description ||
                    "Start practicing to improve your skills"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Click to view questions
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
