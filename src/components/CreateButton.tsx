import { Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Blog, Comment, Reaction, City, Category } from "../types";
import { path } from "../App";
import axios from "axios";
import { BlogModal } from "./modals/BlogModal";

type CreateButtonProps = {
  cookies: { token?: any; userId?: any };
};

export function CreateButton({ cookies }: CreateButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        className="fixed bottom-8 left-8 w-12 h-12 rounded-full text-white text-xl font-bold flex justify-center items-center z-50 glass cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <Plus className="text-amber-300" />
      </button>

      {showModal && (
        <BlogModal
          mode="create"
          setShowModal={setShowModal}
          cookies={cookies}
        />
      )}
    </>
  );
}
