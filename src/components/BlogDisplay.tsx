import type { Blog, Category, City } from "../types";
import { useNavigate, useLocation } from "react-router-dom";
import { path } from "../App";
import { MapPin, Clock } from "lucide-react";

type BlogDisplayProps = {
  blog: Blog;
  categories: Category[];
  cities: City[];
};

export function BlogDisplay({ blog, categories, cities }: BlogDisplayProps) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div
      key={blog.blogId}
      className="w-60 p-3 flex flex-col items-start gap-1 cursor-pointer"
      style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "12px",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
      }}
      onClick={() =>
        navigate(`/blog/${blog.blogId}`, {
          state: { background: location.state?.background || location },
        })
      }
    >
      <img
        src={`${path}/blogs/${blog.blogId}/image`}
        onError={(e) => (e.currentTarget.style.display = "none")}
        className="w-60 h-60 object-cover"
      />
      <p className="text-white text-sm font-bold">{blog.title}</p>
      <p className="text-white text-xs">
        by {blog.creatorFirstName} {blog.creatorLastName}
      </p>
      <div className="flex gap-2">
        <div className="flex gap-1">
          <MapPin size={15} className="text-white" />
          <p className="text-xs text-white">
            {cities.find((i) => i.cityId === blog.cityId)?.name}
          </p>
        </div>
        <div className="flex gap-1">
          <Clock size={15} className="text-white" />
          <p className="text-xs text-white">
            {new Date(blog.creationDate).toLocaleDateString("en-NZ")}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap text-white gap-2">
        {blog.categoryIds.map((id) => (
          <p className="text-xxs glass-blue rounded-2xl">
            &nbsp;&nbsp;&nbsp;
            {categories.find((i) => i.categoryId === id)?.name}
            &nbsp;&nbsp;&nbsp;
          </p>
        ))}
      </div>
      <p className="text-xs text-white">{blog.numReactions} Reactions</p>
    </div>
  );
}
