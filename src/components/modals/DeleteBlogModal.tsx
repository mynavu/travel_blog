import { X, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { path } from "../../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Grainient from "../Grainient";

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
      window.location.reload();
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
        className="relative p-6 rounded-xl w-80 flex flex-col gap-4 text-white glass overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Grainient
            color1="#7e004f"
            color2="#5e002b"
            color3="#c52d6f"
            timeSpeed={0.25}
            colorBalance={0.09}
            warpStrength={1}
            warpFrequency={5}
            warpSpeed={2.5}
            warpAmplitude={50}
            blendAngle={0}
            blendSoftness={0.05}
            rotationAmount={500}
            noiseScale={2}
            grainAmount={0.1}
            grainScale={2}
            grainAnimated={false}
            contrast={1.5}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.9}
          />
        </div>

        {/* content above grainient */}
        <div
          style={{ position: "relative", zIndex: 1 }}
          className="flex flex-col gap-4"
        >
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <p className="text-amber-300 font-bold">Delete Blog</p>
              <TriangleAlert className="text-amber-300" />
            </div>
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
              className="flex-1 glass rounded p-1"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <button
              className="flex-1 bg-amber-300 rounded p-1 text-rose-900"
              onClick={deleteBlog}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
