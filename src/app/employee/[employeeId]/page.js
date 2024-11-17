"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { uploadFile } from "@/service/file";

// Validation Schema
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  mobile: z
    .string()
    .regex(/^\d+$/, "Mobile number must contain only digits")
    .min(10, "Mobile number must be at least 10 digits long"),
  designation: z.enum(["HR", "Manager", "Sales"]),
  gender: z.enum(["M", "F"]),
  course: z
    .array(z.enum(["MCA", "BCA", "BSC"]))
    .nonempty("At least one course must be selected"),
  image: z
    .union([z.instanceof(File), z.undefined()])
    .refine((file) => !file || file.size > 0, {
      message: "Image is required if provided",
    }),
});

const EditEmployee = ({ params }) => {
  const router = useRouter();
  const { employeeId } = params;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      course: [],
    },
  });

  const [loading, setLoading] = useState(false);

  // Fetch Employee Data
  const fetchEmployee = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/employee/${employeeId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      const employee = data.employee;

      // Populate form with existing employee data
      setValue("name", employee.name);
      setValue("email", employee.email);
      setValue("mobile", String(employee.mobile)); // Ensure mobile is a string
      setValue("designation", employee.designation);
      setValue("gender", employee.gender);
      setValue("course", [employee.course]);
    } catch (error) {
      console.error("Failed to fetch employee data:", error);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [employeeId]);

  // Handle File Input
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setValue("image", file);
  };

  // Handle Form Submission
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      let imageId = null;

      if (data.image instanceof File) {
        const formData = new FormData();
        formData.append("profile-image", data.image);
        imageId = await uploadFile(formData);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/employee/${employeeId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            mobile: String(data.mobile), // Ensure mobile is a string
            designation: data.designation,
            gender: data.gender,
            course: data.course[0],
            imageId,
          }),
        }
      );

      const responseData = await res.json();
      if (responseData.error) {
        toast.error(responseData.error);
      } else {
        toast.success(responseData.message);
        router.push("/employee");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <div className="form shadow-md border border-gray-400 rounded-xl py-6 px-9">
        <div className="top">
          <div className="flex gap-[40px] mb-5 items-center">
            <Link href="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </Link>
            <h1 className="text-2xl font-semibold">Edit Employee Detail</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              type="text"
              {...register("name")}
              placeholder="Enter name"
              className="border w-96 px-1.5 py-1.5 rounded-md mb-5"
            />
            <p className="text-red-500">{errors.name?.message}</p>
          </div>

          <div>
            <input
              type="email"
              {...register("email")}
              placeholder="Enter email"
              className="border w-96 px-1.5 py-1.5 rounded-md mb-5"
            />
            <p className="text-red-500">{errors.email?.message}</p>
          </div>

          <div>
            <input
              type="text"
              {...register("mobile")}
              placeholder="Mobile number"
              className="border w-96 px-1.5 py-1.5 rounded-md mb-5"
            />
            <p className="text-red-500">{errors.mobile?.message}</p>
          </div>

          <div>
            <select
              {...register("designation")}
              className="border w-96 px-1.5 py-1.5 rounded-md mb-8"
            >
              <option value="">Select Designation</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </select>
            <p className="text-red-500">{errors.designation?.message}</p>
          </div>

          <div>
            <label>
              <input type="radio" {...register("gender")} value="M" /> Male
            </label>
            <label>
              <input type="radio" {...register("gender")} value="F" /> Female
            </label>
            <p className="text-red-500">{errors.gender?.message}</p>
          </div>

          <div>
            <label>Course</label>
            <div>
              {["MCA", "BCA", "BSC"].map((course) => (
                <label key={course}>
                  <input
                    type="checkbox"
                    value={course}
                    {...register("course")}
                    onChange={(e) => {
                      const courses = watch("course");
                      setValue(
                        "course",
                        e.target.checked
                          ? [...courses, course]
                          : courses.filter((c) => c !== course)
                      );
                    }}
                  />
                  {course}
                </label>
              ))}
            </div>
            <p className="text-red-500">{errors.course?.message}</p>
          </div>

          <div>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className="border w-96 px-1.5 py-1.5 rounded-md mb-5"
            />
            <p className="text-red-500">{errors.image?.message}</p>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-100 hover:bg-gray-200 w-full py-1.5 border rounded-md"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;