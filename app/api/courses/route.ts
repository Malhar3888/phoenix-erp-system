import { getAllCourses } from "@/lib/queries"

export async function GET() {
  try {
    const courses = await getAllCourses()
    return Response.json({ courses })
  } catch (error) {
    console.error("Failed to fetch courses:", error)
    return Response.json({ courses: [], error: "Failed to fetch courses" }, { status: 500 })
  }
}
