import type { Blog, User, Comment, Reaction, City, Category } from "../types";
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
  console.log("BLOGS:", blogs);
  return (
    <div className="mb-10">
      {Object.values(blogs).some((b) => b.length > 0) ? (
        <div className="flex flex-col gap-6 ">
          {Object.entries(blogs)
            .filter(([, blogs]) => blogs.length > 0)
            .sort(([seriesNameA], [seriesNameB]) => {
              if (seriesNameA === "noSeries") return 1;
              if (seriesNameB === "noSeries") return -1;
              return seriesNameA.localeCompare(seriesNameB);
            })
            .map(([seriesName, seriesBlogs]) => (
              <div key={seriesName}>
                <p className="text-amber-300 font-bold pb-5">
                  {seriesName === "noSeries" ? "No Series" : seriesName}
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
      ) : (
        <div className="flex justify-center items-center h-40">
          <p className="text-white">There are no blogs to display.</p>
        </div>
      )}
    </div>
  );
}
