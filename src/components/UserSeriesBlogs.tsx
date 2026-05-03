// U16
import { use, useEffect, useState } from "react";
import axios from "axios";
import { path } from "../App";
import type { Blog, User, Comment, Reaction } from "../types";
import { useNavigate, useLocation } from "react-router-dom";

type UserSeriesBlogsProps = {
  blogs: Record<string, Blog[]>;
};
export function UserSeriesBlogs({ blogs }: UserSeriesBlogsProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="mt-20 p-4 flex flex-col gap-6 bg-green-400">
      {Object.entries(blogs).map(([seriesName, seriesBlogs]) => (
        <div key={seriesName}>
          <p className="text-amber-300 font-bold mb-2">
            {seriesName === "noSeries" ? "Other Posts" : seriesName}
          </p>
          <div className="flex flex-row gap-3 overflow-x-auto pb-2">
            {seriesBlogs.map((blog) => (
              <div
                key={blog.blogId}
                className="bg-teal-950 min-w-48 w-48 p-3 flex flex-col gap-1 cursor-pointer flex-shrink-0"
                onClick={() =>
                  navigate(`/blog/${blog.blogId}`, {
                    state: { background: location },
                  })
                }
              >
                <img
                  src={`${path}/blogs/${blog.blogId}/image`}
                  className="w-48 h-32 object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                <p className="text-amber-300 text-xs font-bold">{blog.title}</p>
                <p className="text-white text-xs">
                  {blog.numReactions} reactions
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
