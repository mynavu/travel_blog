// U16
import { use, useEffect, useState } from "react";
import axios from "axios";
import { path } from "../App";
import type { Blog, User, Comment, Reaction, City, Category } from "../types";
import { useNavigate, useLocation } from "react-router-dom";
import { BlogDisplay } from "./BlogDisplay";

type UserSeriesBlogsProps = {
  blogs: Record<string, Blog[]>;
  categories: Category[];
  cities: City[];
};
export function UserSeriesBlogs({
  blogs,
  categories,
  cities,
}: UserSeriesBlogsProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="p-4 flex flex-col gap-6 ">
      {Object.entries(blogs)
        .filter(([, blogs]) => blogs.length > 0)
        .sort(([seriesNameA], [seriesNameB]) =>
          seriesNameA.localeCompare(seriesNameB),
        )
        .map(([seriesName, seriesBlogs]) => (
          <div key={seriesName}>
            <p className="text-amber-300 font-bold mb-2">
              {seriesName === "noSeries" ? "Other Posts" : seriesName}
            </p>

            <div className="flex flex-row gap-3 overflow-x-auto pb-2">
              {[...seriesBlogs]
                .sort(
                  (a, b) =>
                    new Date(a.creationDate).getTime() -
                    new Date(b.creationDate).getTime(),
                )
                .map((blog) => (
                  <BlogDisplay
                    key={blog.blogId}
                    blog={blog}
                    cities={cities}
                    categories={categories}
                  />
                ))}
            </div>
          </div>
        ))}
    </div>
  );
}
