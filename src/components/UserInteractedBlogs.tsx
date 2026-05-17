import type { Blog, User, Comment, Reaction, City, Category } from "../types";
import { useNavigate, useLocation } from "react-router-dom";
import { BlogDisplay } from "./BlogDisplay";

import { Clock, MapPin } from "lucide-react";

type UserInteractedBlogsProps = {
  blogs: Blog[];
  cities: City[];
  categories: Category[];
};
export function UserInteractedBlogs({
  blogs,
  cities,
  categories,
}: UserInteractedBlogsProps) {
  return (
    <>
      {blogs.length ? (
        <div className="flex justify-start gap-3 flex-wrap mb-10">
          {blogs.map((blog) => (
            <BlogDisplay blog={blog} categories={categories} cities={cities} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-40">
          <p className="text-white">There are no blogs to display.</p>
        </div>
      )}
    </>
  );
}
