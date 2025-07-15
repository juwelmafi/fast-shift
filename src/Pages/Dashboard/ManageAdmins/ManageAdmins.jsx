import { useState } from "react";
import Swal from "sweetalert2";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecurity from "../../../hooks/useAxiosSecurity";
import { FaUserShield, FaUserSlash } from "react-icons/fa";

const ManageAdmins = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const axiosSecure = useAxiosSecurity();

  // Fetch users based on search query
  const {
    data: users = [],
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["search-users", searchQuery],
    enabled: !!searchQuery,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/search?q=${searchQuery}`);
      return res.data;
    },
  });

  // Use mutation for role updates
  const { mutateAsync } = useMutation({
    mutationFn: async ({ id, isAdmin }) => {
      const endpoint = isAdmin
        ? `/users/remove-admin/${id}`
        : `/users/make-admin/${id}`;
      return await axiosSecure.patch(endpoint);
    },
    onSuccess: () => {
      refetch();
    },
  });

  // Trigger make-admin with confirmation
  const handleMakeAdmin = async (id) => {
    const confirm = await Swal.fire({
      title: "Make this user an admin?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await mutateAsync({ id, isAdmin: false });
      if (res?.modifiedCount > 0 || res?.data?.modifiedCount > 0) {
        Swal.fire("Success", "User promoted to admin", "success");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to make admin", error);
    }
  };

  // Trigger remove-admin with confirmation
  const handleRemoveAdmin = async (id) => {
    const confirm = await Swal.fire({
      title: "Remove admin role?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await mutateAsync({ id, isAdmin: true });
      if (res?.modifiedCount > 0 || res?.data?.modifiedCount > 0) {
        Swal.fire("Success", "Admin removed", "success");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to remove admin", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Search & Manage Users</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by email or name"
          className="input input-bordered w-full max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={() => refetch()}
          className="btn btn-primary text-black"
          disabled={!searchQuery}
        >
          {isFetching ? "Searching..." : "Search"}
        </button>
      </div>

      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Created At</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user._id}>
                  <td>{idx + 1}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.created_at).toLocaleString()}</td>
                  <td>
                    <span
                      className={`badge ${user.role === "admin"
                        ? "badge-success"
                        : "badge-ghost"
                        }`}
                    >
                      {user.role || "user"}
                    </span>
                  </td>
                  <td>
                    {user.role === "admin" ? (
                      <button
                        onClick={() => handleRemoveAdmin(user._id)}
                        className="btn btn-sm btn-warning flex items-center gap-1"
                      >
                        <FaUserSlash />
                        Remove Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMakeAdmin(user._id)}
                        className="btn btn-sm btn-primary text-black flex items-center gap-1"
                      >
                        <FaUserShield />
                        Make Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : searchQuery && !isFetching ? (
        <p className="text-gray-500">No users found.</p>
      ) : null}
    </div>
  );
};

export default ManageAdmins;
