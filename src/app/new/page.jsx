// pages/index.js
"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadFile } from "@/service/file";

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
    .custom((value) => value instanceof File && value.size > 0, {
      message: "Image is required",
    })
    .optional(),
});

export default function Home() {
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

  const onSubmit = async (data) => {
    try {
      if (data.image instanceof File) {
        const uploadedImage = await uploadFile(
          new FormData().set("profile-image", data.image)
        );
        console.log("Uploaded Image ID:", uploadedImage);
      }
      console.log("Form Data:", data);
    } catch (error) {
      console.error("Upload Error:", error);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label>Name</label>
          <input
            type="text"
            {...register("name")}
            className="border p-2 rounded w-full"
          />
          <p className="text-red-500">{errors.name?.message}</p>
        </div>

        {/* Email */}
        <div>
          <label>Email</label>
          <input
            type="email"
            {...register("email")}
            className="border p-2 rounded w-full"
          />
          <p className="text-red-500">{errors.email?.message}</p>
        </div>

        {/* Mobile */}
        <div>
          <label>Mobile No</label>
          <input
            type="text"
            {...register("mobile")}
            className="border p-2 rounded w-full"
          />
          <p className="text-red-500">{errors.mobile?.message}</p>
        </div>

        {/* Designation */}
        <div>
          <label>Designation</label>
          <select
            {...register("designation")}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Designation</option>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
          <p className="text-red-500">{errors.designation?.message}</p>
        </div>

        {/* Gender */}
        <div>
          <label>Gender</label>
          <div>
            <label>
              <input type="radio" {...register("gender")} value="M" /> Male
            </label>
            <label>
              <input type="radio" {...register("gender")} value="F" /> Female
            </label>
          </div>
          <p className="text-red-500">{errors.gender?.message}</p>
        </div>

        {/* Course */}
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

        {/* Image Upload */}
        <div>
          <label>Image Upload</label>
          <input
            type="file"
            {...register("image")}
            accept="image/png, image/jpeg"
          />
          <p className="text-red-500">{errors.image?.message}</p>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
