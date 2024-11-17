"use client";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { uploadFile } from "@/service/file";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
// Validation schema
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
    .union([
      z.instanceof(File), // Validate if it's an instance of File
      z.undefined(), // Allow undefined for optional
    ])
    .refine((file) => !file || file.size > 0, {
      message: "Image is required if provided",
    }),
});

const AddEmployee = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { course: [] },
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setValue("image", file);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log(data);
      let imageId = null;

      if (data.image instanceof File) {
        const formData = new FormData();
        formData.append("profile-image", data.image);

        // Mock upload function (replace with actual service function)
        imageId = await uploadFile(formData);
      }

      const res = await fetch(`${process.env.BASE_URL}/api/employee`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          designation: data.designation,
          gender: data.gender,
          course: data.course[0],
          imageId,
        }),
      });

      const responseData = await res.json();
      const { message, error } = responseData;

      if (error) {
        toast.error(error);
      } else {
        toast.success(message);
        router.push("/");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("There was an error submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <div className="form border shadow-md border-gray-400 rounded-xl py-6 px-9">
        {/* Form Header */}
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
            <h1 className="text-2xl font-semibold">Add Employee Detail</h1>
          </div>
        </div>

        {/* Form Fields */}
        <div className="bottom">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <input
                type="text"
                {...register("name")}
                placeholder="Enter name"
                className="border border-gray-400 hover:border-gray-700 w-96 px-1.5 py-1.5 rounded-md outline-none mb-5 placeholder-gray-400"
              />
              <p className="text-red-500">{errors.name?.message}</p>
            </div>

            <div>
              <input
                type="email"
                {...register("email")}
                placeholder="Enter email"
                className="border border-gray-400 hover:border-gray-700 w-96 px-1.5 py-1.5 rounded-md outline-none mb-5 placeholder-gray-400"
              />
              <p className="text-red-500">{errors.email?.message}</p>
            </div>

            <div>
              <input
                type="text"
                {...register("mobile")}
                placeholder="Mobile number"
                className="border border-gray-400 hover:border-gray-700 w-96 px-1.5 py-1.5 rounded-md outline-none mb-5 placeholder-gray-400"
              />
              <p className="text-red-500">{errors.mobile?.message}</p>
            </div>

            <div>
              <select
                {...register("designation")}
                className="border border-gray-400 hover:border-gray-700 w-96 px-1.5 py-1.5 rounded-md outline-none mb-8 placeholder-gray-400"
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
                className="border border-gray-400 hover:border-gray-700 w-96 px-1.5 py-1.5 rounded-md outline-none mb-5 placeholder-gray-400"
              />
              <p className="text-red-500">{errors.image?.message}</p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="bg-gray-100 hover:bg-gray-200 w-full py-1.5 border border-gray-400 rounded-md font-medium mb-5"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
