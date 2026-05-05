import { X, TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Grainient from "../Grainient";

type GetAccessModalProps = {
  setShowAccessModal: (value: boolean) => void;
};

export function GetAccessModal({ setShowAccessModal }: GetAccessModalProps) {
  const navigate = useNavigate();

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={() => setShowAccessModal(false)}
    >
      <div
        className="relative p-6 rounded-xl w-80 flex flex-col gap-4 text-white glass overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Grainient
            color1={"#007498"}
            color2={"#003b5e"}
            color3={"#55b3ff"}
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
              <p className="text-amber-300 font-bold">Please log in first</p>
              <TriangleAlert className="text-amber-300" />
            </div>
            <X
              className="cursor-pointer"
              onClick={() => setShowAccessModal(false)}
            />
          </div>
          <p className="text-sm">
            To interact with blog posts, you must Log In or Register an account.
          </p>
          <div className="flex gap-2">
            <button
              className="flex-1 glass rounded p-1 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="flex-1 bg-amber-300 rounded p-1 text-blue-900 cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
