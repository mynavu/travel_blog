import { X } from "lucide-react";
import { useState } from "react";
import { path } from "../../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type DeleteBlogModalProps = {
  blogId: string | undefined;
  cookies: { token?: any; userId?: any };
  setShowDeleteModal: (value: boolean) => void;
};

export function DeleteBlogModal({
  blogId,
  cookies,
  setShowDeleteModal,
}: DeleteBlogModalProps) {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const deleteBlog = async () => {
    try {
      await axios.delete(`${path}/blogs/${blogId}`, {
        headers: { "X-Authorization": cookies.token },
      });
      setShowDeleteModal(false);
      navigate("/search");
    } catch (e: any) {
      setError(
        e.response?.data?.message ||
          e.response?.data ||
          "Failed to delete blog. It may have comments.",
      );
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={() => setShowDeleteModal(false)}
    >
      <div
        className="bg-teal-950 p-6 rounded-xl w-80 flex flex-col gap-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <p className="text-amber-300 font-bold">Delete Blog</p>
          <X
            className="cursor-pointer"
            onClick={() => setShowDeleteModal(false)}
          />
        </div>

        <p className="text-sm">
          Are you sure you want to delete this blog? This action cannot be
          undone.
        </p>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <div className="flex gap-2">
          <button
            className="flex-1 bg-teal-800 rounded p-1"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </button>
          <button
            className="flex-1 bg-red-700 rounded p-1"
            onClick={deleteBlog}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
