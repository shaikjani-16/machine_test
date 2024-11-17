import { NewEmployee } from "@/models/newEmployee";
import { NextResponse } from "next/server"; // Ensure NextResponse is imported

export async function PUT(req, { params }) {
  const { employeeId, status } = params;

  try {
    // Find the employee and update the status
    const res = await NewEmployee.findByIdAndUpdate(employeeId, {
      $set: { status: status },
    });

    // Check if the employee was found
    if (!res) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    // Return success response with message and status code
    return NextResponse.json(
      { message: "Employee status updated successfully" },
      { status: 200 } // Use 200 for successful update
    );
  } catch (err) {
    // Log the error for debugging purposes
    console.error("Error updating status:", err);

    // Return error response with status 500 (Internal Server Error)
    return NextResponse.json(
      { message: "Internal server error", error: err.message },
      { status: 500 }
    );
  }
}
