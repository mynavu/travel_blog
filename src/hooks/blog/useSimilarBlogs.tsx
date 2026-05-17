import { useEffect, useState } from "react";
import axios from "axios";
import { path } from "../../App";
import type { Blog, Category } from "../../types";

export function useSimilarBlogs(
  id: string | undefined,
  blog: Blog | null,
  validCategories: Category[],
) {
  const [similarBlogs, setSimilarBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    if (!id || !blog) return;
    const load = async () => {
      // console.log("BLOG:", blog);

      // similar blogs
      const sameCity = axios.get(
        `${path}/blogs?count=3&cityIds=${blog?.cityId}`,
      );

      const sameCreator = axios.get(
        `${path}/blogs?count=3&creatorId=${blog?.creatorId}`,
      );

      const sameCats = axios.get(
        `${path}/blogs?count=3&${validCategories
          .map((c: Category) => `categoryIds=${c.categoryId}`)
          .join("&")}`,
      );

      // console.log("VALID CAT:", validCategories);

      const [cityRes2, creatorRes2, catRes2] = await Promise.all([
        sameCity,
        sameCreator,
        sameCats,
      ]);

      // console.log("SAME CITY:", cityRes2);
      // console.log("SAME CAT:", catRes2);
      // console.log("SAME CREATOR:", creatorRes2);

      const all = [
        ...cityRes2.data.blogs,
        ...catRes2.data.blogs,
        ...creatorRes2.data.blogs,
      ];

      // console.log("ALL:", all);

      const seen = new Set<number>();
      const unique = all.filter((b: Blog) => {
        if (b.blogId === blog?.blogId || seen.has(b.blogId)) return false;
        seen.add(b.blogId);
        return true;
      });

      setSimilarBlogs(unique);
      // console.log("SIMILAR BLOG RENDER");
    };

    load();
  }, [blog?.blogId, validCategories]);

  return {
    similarBlogs,
  };
}
