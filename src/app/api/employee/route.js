import { connectDb } from "@/database/db";
import { Employee } from "@/models/Employee";
import { NextResponse } from "next/server";
import { NewEmployee } from "@/models/newEmployee";

// Connect to the database
connectDb();

// GET: Retrieve all employees
export async function GET() {
  try {
    const employees = await NewEmployee.find();
    return NextResponse.json(
      employees.length > 0 ? employees : { message: "No employees found" }
    );
  } catch (error) {
    console.error("Error retrieving employees:", error);
    return NextResponse.json(
      { error: "Failed to retrieve employees" },
      { status: 500 }
    );
  }
}

// POST: Add a new employee
export async function POST(req) {
  try {
    // Parse incoming JSON request
    const body = await req.json();
    const { name, email, mobile, designation, gender, course, imageId } = body;
    const courseString = Array.isArray(course) ? course.join(", ") : course;

    // Check if the user already exists
    const existingUser = await NewEmployee.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" });
    }

    // Create a new employee document
    const newEmployee = new NewEmployee({
      name,
      email,
      mobile,
      designation,
      gender,
      course: courseString,
      imageId,
    });

    // Save to database
    await newEmployee.save();

    return NextResponse.json({ message: "Employee added successfully" });
  } catch (error) {
    console.error("Error adding employee:", error);
    return NextResponse.json({ error: "Failed to add employee" });
  }
}
