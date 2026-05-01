// U12
import { TreePalm } from "lucide-react";

export function Navbar() {
  // Logs out
  const logOut = () => {};
  return (
    <>
      <div className="fixed top-0 left-0 right-0 flex bg-teal-950 justify-between items-center px-4 py-2 z-50">
        <TreePalm className="text-amber-300" />
        <div>
          <button> Sign Up</button>
          <button> Login</button>
        </div>
      </div>
    </>
  );
}
