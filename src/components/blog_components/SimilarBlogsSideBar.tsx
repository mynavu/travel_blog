import type { Blog, Category, City } from "../../types";
import { BlogDisplay } from "../BlogDisplay";

type SimilarBlogsSideBarProps = {
  similarBlogs: Blog[];
  categories: Category[];
  cities: City[];
};

export function SimilarBlogsSideBar({
  similarBlogs,
  categories,
  cities,
}: SimilarBlogsSideBarProps) {
  return (
    <>
      <div
        className="flex flex-col gap-2 pb-2 overflow-y-auto pb-20"
        style={{ width: "270px", height: "calc(100vh - 120px)" }}
      >
        <p className="text-white text-xs">
          View {similarBlogs.length} similar blogs:
        </p>
        {similarBlogs.map((blog) => (
          <BlogDisplay blog={blog} categories={categories} cities={cities} />
        ))}
      </div>
    </>
  );
}
