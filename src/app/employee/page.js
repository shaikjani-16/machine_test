"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ShowImage from "../components/image";
import { useRouter } from "next/navigation";
const EmployeeList = () => {
  const [employee, setEmployee] = useState([]);
  const [filteredEmployee, setFilteredEmployee] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const getEmployeeList = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/employee`, {
        method: "GET",
      });
      const data = await res.json();
      setEmployee(data);
      setFilteredEmployee(data); // Set filtered employee list initially to all employees
    } catch (error) {
      console.error("Error fetching employee data:", error);
    } finally {
      setLoading(false);
    }
  };
  const changeStatus = async (_id, status) => {
    try {
      const res = await fetch(`/api/employee/${_id}/${status}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
      });

      // Make sure to check if the response is successful
      const data = await res.json();

      // Check if the response has the expected properties
      if (data) {
        const { message, error } = data; // Don't destructure 'status' if it's not part of the response
        console.log(data);
        if (error) {
          alert(error);
        } else {
          router.push("/");
          getEmployeeList();
          alert(message);
          // Redirect or refresh the page
          // Or use another approach to update the UI
        }
      } else {
        console.error("Unexpected response format", data);
      }
    } catch (error) {
      console.error("Error changing status:", error);
    }
  };

  const deleteEmployee = async (_id) => {
    try {
      const res = await fetch(`/api/employee/${_id}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
      });
      const data = await res.json();
      const { message, error } = data;

      if (error) {
        alert(error);
      } else {
        alert(message);
        getEmployeeList();
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sortedEmployees = [...filteredEmployee].sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];

      if (field === "createdAt") {
        return order === "asc"
          ? new Date(valueA) - new Date(valueB)
          : new Date(valueB) - new Date(valueA);
      }

      if (typeof valueA === "string") {
        return order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return order === "asc" ? valueA - valueB : valueB - valueA;
    });

    setFilteredEmployee(sortedEmployees);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      const filteredData = employee.filter(
        (emp) =>
          emp.name.toLowerCase().includes(value.toLowerCase()) ||
          emp.email.toLowerCase().includes(value.toLowerCase()) ||
          (emp.mobile && emp.mobile.toString().includes(value)) // Convert mobile to string before using includes
      );
      setFilteredEmployee(filteredData);
    } else {
      setFilteredEmployee(employee); // If search is cleared, show all employees
    }
  };

  useEffect(() => {
    getEmployeeList();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen p-4">
      <div className="flex flex-col w-full max-w-7xl">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border rounded-lg shadow overflow-hidden">
              <div className="p-2 bg-gray-50 border-b flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-center flex-grow text-gray-800">
                  Employee Detail List
                </h1>

                <h1 className="text-xl font-semibold text-center flex-grow text-gray-800">
                  Employees Count: {filteredEmployee.length}
                </h1>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search by Name, Email, or Mobile"
                  className="border border-gray-400 rounded-lg px-3 py-1.5 text-sm"
                />

                <Link href="/employee/addemployee">
                  <button className="border border-gray-400 rounded-lg font-medium px-3 py-1.5">
                    Add Employee
                  </button>
                </Link>
              </div>

              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  Loading employees...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                          onClick={() => handleSort("_id")}
                        >
                          ID{" "}
                          {sortField === "_id"
                            ? sortOrder === "asc"
                              ? "↑"
                              : "↓"
                            : ""}
                        </th>{" "}
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Image
                        </th>
                        <th
                          className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                          onClick={() => handleSort("name")}
                        >
                          Name{" "}
                          {sortField === "name"
                            ? sortOrder === "asc"
                              ? "↑"
                              : "↓"
                            : ""}
                        </th>
                        <th
                          className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                          onClick={() => handleSort("email")}
                        >
                          Email{" "}
                          {sortField === "email"
                            ? sortOrder === "asc"
                              ? "↑"
                              : "↓"
                            : ""}
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Mobile No.
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Designation
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Gender
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Course
                        </th>
                        <th
                          className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                          onClick={() => handleSort("createdAt")}
                        >
                          Created Date{" "}
                          {sortField === "createdAt"
                            ? sortOrder === "asc"
                              ? "↑"
                              : "↓"
                            : ""}
                        </th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                          Action
                        </th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredEmployee.length > 0 ? (
                        filteredEmployee.map((item, index) => {
                          const {
                            _id,
                            name,
                            email,
                            mobile,
                            designation,
                            gender,
                            course,
                            imageId,
                            createdAt,
                            status,
                          } = item;
                          return (
                            <tr
                              key={index}
                              className="divide-y divide-gray-200"
                            >
                              <td className="px-3 py-4 text-sm font-medium text-gray-800">
                                {index + 1}
                              </td>
                              <td className="px-3 py-4 text-sm font-medium text-gray-800">
                                <ShowImage imageid={imageId} />
                              </td>
                              <td className="px-3 py-4 text-sm font-medium text-gray-800">
                                {name}
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-800">
                                {email}
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-800">
                                {mobile}
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-800">
                                {designation}
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-800">
                                {gender}
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-800">
                                {course}
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-800">
                                {new Date(createdAt).toLocaleString()}
                              </td>
                              <td className="px-3 py-4 text-sm font-medium text-right">
                                <Link
                                  href={`/employee/${_id}`}
                                  className="text-green-600"
                                >
                                  Edit
                                </Link>
                                <div
                                  className="text-red-600 cursor-pointer"
                                  onClick={() => deleteEmployee(_id)}
                                >
                                  Delete
                                </div>
                              </td>
                              <td className="px-3 py-4 text-sm font-medium text-right">
                                {status === "Active" ? (
                                  <div
                                    className="text-red-600 cursor-pointer"
                                    onClick={() =>
                                      changeStatus(_id, "Deactive")
                                    }
                                  >
                                    <span className="text-green-600">
                                      Active
                                    </span>
                                    <br />
                                    Deactivate
                                  </div>
                                ) : (
                                  <div
                                    className="text-green-600 cursor-pointer"
                                    onClick={() => changeStatus(_id, "Active")}
                                  >
                                    <span className="text-red-600">
                                      Deactive
                                    </span>
                                    <br />
                                    <span className="text-green-600">
                                      Activate
                                    </span>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan="10"
                            className="text-center text-gray-500 py-4"
                          >
                            No employees found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
