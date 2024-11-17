import { NewEmployee } from "@/models/newEmployee";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { employeeId } = params;

  try {
    const employee = await NewEmployee.findById(employeeId);
    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ employee }, { status: 200 });
  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json(
      { error: "Failed to fetch employee" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { employeeId } = params;

  try {
    const { name, email, mobile, designation, gender, course, imageId } =
      await request.json();

    const employee = await NewEmployee.findById(employeeId);
    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.mobile = mobile || employee.mobile;
    employee.designation = designation || employee.designation;
    employee.gender = gender || employee.gender;
    employee.course = course || employee.course;
    employee.imageId = imageId || employee.imageId;
    const updatedEmployee = await employee.save();
    return NextResponse.json(
      {
        updatedEmployee,
        message: "Employee updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { employeeId } = params;

  try {
    const result = await NewEmployee.deleteOne({ _id: employeeId });
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Employee deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}
