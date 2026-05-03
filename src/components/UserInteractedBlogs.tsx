// U16
import { use, useEffect, useState } from "react";
import axios from "axios";
import { path } from "../App";
import type { Blog, User, Comment, Reaction, City, Category } from "../types";
import { useNavigate } from "react-router-dom";
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

  return (
    <div className="mt-20 p-4 flex flex-col gap-6 bg-green-400">
      <div className="flex justify-around gap-3 flex-wrap">
        {blogs.length ? (
          blogs.map((blog) => (
            <div
              key={blog.blogId}
              className="bg-teal-950 w-60 p-3 flex flex-col items-start gap-1"
              onClick={() => navigate(`/blog/${blog.blogId}`)}
            >
              <img
                src={`${path}/blogs/${blog.blogId}/image`}
                onError={(e) => (e.currentTarget.style.display = "none")}
                className="w-60 h-60 object-cover"
              />
              <p className="text-amber-300 text-xs font-bold">{blog.title}</p>
              <p className="text-amber-300 text-xs">
                Written by {blog.creatorFirstName} {blog.creatorLastName}
              </p>
              <div className="flex justify-around">
                <MapPin size={18} className="text-amber-500" />
                <p className="text-xs text-amber-500">
                  {cities.find((i) => i.cityId === blog.cityId)?.name}
                </p>
                <Clock size={18} className="text-amber-500" />
                <p className="text-xs text-amber-500">
                  {new Date(blog.creationDate).toLocaleDateString("en-NZ")}
                </p>
              </div>
              <div className="flex flex-wrap text-white gap-2">
                {blog.categoryIds.map((id) => (
                  <p className="text-xxs bg-cyan-800 outline-1 outline-cyan-600  rounded-2xl">
                    &nbsp;&nbsp;&nbsp;
                    {categories.find((i) => i.categoryId === id)?.name}
                    &nbsp;&nbsp;&nbsp;
                  </p>
                ))}
              </div>
              <p className="text-xs text-white">
                {blog.numReactions} Reactions
              </p>
            </div>
          ))
        ) : (
          <p>No blogs</p>
        )}
      </div>
    </div>
  );
}
