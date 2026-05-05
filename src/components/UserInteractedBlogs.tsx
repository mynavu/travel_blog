// U16
import { use, useEffect, useState } from "react";
import axios from "axios";
import { path } from "../App";
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
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="p-4 flex flex-col gap-6 ">
      <div className="flex justify-around gap-3 flex-wrap">
        {blogs.length ? (
          blogs.map((blog) => (
            <BlogDisplay blog={blog} categories={categories} cities={cities} />
          ))
        ) : (
          <p>No blogs</p>
        )}
      </div>
    </div>
  );
}
