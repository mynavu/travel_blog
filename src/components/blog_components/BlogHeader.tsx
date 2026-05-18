import { useNavigate } from "react-router-dom";
import { path } from "../../App";
import defaultPfp from "../../assets/default_pfp.png";
import type { Blog, City, Category } from "../../types";
import { Trash, Pencil, CornerLeftDown, MapPin, Clock } from "lucide-react";

type BlogHeaderProps = {
  blog: Blog | null;
  validCity: City | null;
  validCategories: Category[];
  cookies: { userId?: any };
  isLoggedIn: boolean;
  setShowModal: (v: boolean) => void;
  setShowDeleteModal: (v: boolean) => void;
};

export function BlogHeader({
  blog,
  validCity,
  validCategories,
  cookies,
  isLoggedIn,
  setShowModal,
  setShowDeleteModal,
}: BlogHeaderProps) {
  const navigate = useNavigate();

  if (!blog) return null;

  return (
    <>
      {/* PROFILE PIC AND NAME */}
      <div
        className="flex flex-row gap-2 items-center glass-button rounded-2xl pr-2 pl-1 py-1 cursor-pointer text-white hover:text-amber-300"
        onClick={() => navigate(`/profile/${blog?.creatorId}`)}
      >
        <img
          className="w-7 h-7 rounded-full object-cover"
          src={`${path}/users/${blog?.creatorId}/image`}
          onError={(e) => (e.currentTarget.src = defaultPfp)}
        />
        <p className="text-sm">
          {blog?.creatorFirstName} {blog?.creatorLastName}
        </p>
      </div>

      {/* TITLE */}
      <div className="flex w-full max-h-10 overflow-y-auto mt-2 mb-2">
        <p className="text-white text-left">{blog?.title}</p>
        {String(cookies.userId) === String(blog?.creatorId) && isLoggedIn && (
          <div className="ml-2 flex rounded-2xl gap-2">
            <Pencil
              className="text-white cursor-pointer hover:text-amber-300"
              onClick={() => setShowModal(true)}
              size={15}
            />
            <Trash
              className="text-white cursor-pointer hover:text-rose-400"
              onClick={() => setShowDeleteModal(true)}
              size={15}
            />
          </div>
        )}
      </div>

      {/* SERIES */}
      <p className="text-xs text-white text-left overflow-y-auto max-h-10">
        Series: {blog?.series}
      </p>

      {/* LOCATION AND DATE */}
      <div className="flex gap-2 mt-2">
        <div className="flex gap-1">
          <MapPin size={15} className="text-white" />
          <p className="text-xs text-white">{validCity?.name}</p>
        </div>
        <div className="flex gap-1">
          <Clock size={15} className="text-white" />
          <p className="text-xs text-white">
            {new Date(blog.creationDate).toLocaleDateString("en-NZ")}
          </p>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="flex flex-wrap text-white gap-1.5 mt-2 max-h-15 overflow-y-auto mb-2">
        {validCategories.map((cat) => (
          <p key={cat.categoryId} className="text-xxs glass rounded-2xl">
            &nbsp;&nbsp;&nbsp;{cat.name}&nbsp;&nbsp;&nbsp;
          </p>
        ))}
      </div>

      {/* DESCRIPTION */}
      <p className="text-xs text-white text-left max-h-8 overflow-y-auto">
        {blog?.description}
      </p>

      {/* NUMBER OF COMMENTS */}
      <div className="flex justify-end text-white py-2 w-full">
        <CornerLeftDown className="pt-1" size={20} />
        <p className="text-xs">
          {blog.numberOfUniqueCommenters === 0
            ? "No comments"
            : blog.numberOfUniqueCommenters === 1
              ? "1 unique comment"
              : `${blog.numberOfUniqueCommenters} unique comments`}
        </p>
      </div>

      <hr className="w-full border-white/20 border-t border-solid mb-2" />
    </>
  );
}
