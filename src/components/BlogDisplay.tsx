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
      className="w-60 shrink-0 p-3 flex flex-col items-start gap-1 cursor-pointer glass rounded-xl"
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
      <p className="text-white text-sm font-bold max-h-10 overflow-y-auto">
        {blog.title}
      </p>
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
      <div className="flex flex-wrap text-white gap-1.5 max-h-15 overflow-y-auto">
        {blog.categoryIds.map((id) => (
          <p className="text-xxs glass rounded-2xl">
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
