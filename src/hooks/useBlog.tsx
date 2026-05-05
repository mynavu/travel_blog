import { useEffect, useState } from "react";
import axios from "axios";
import { path } from "../App";
import type { Blog, Comment, Reaction, City, Category } from "../types";

export function useBlog(
  id: string | undefined,
  cities: City[],
  categories: Category[],
) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [validCity, setValidCity] = useState<City | null>(null);
  const [validCategories, setValidCategories] = useState<Category[]>([]);

  const load = async () => {
    if (!id) return;
    const blogRes = await axios.get(`${path}/blogs/${id}`);
    const blogData = blogRes.data;

    setBlog(blogData);

    const city = cities.find((c: City) => c.cityId === blogData.cityId);
    const cats = categories.filter((c: Category) =>
      blogData.categoryIds.includes(c.categoryId),
    );

    setValidCity(city || null);
    setValidCategories(cats);
    console.log("BLOG:", blogData);
    // console.log("VALID CAT FROM USE BLOG:", validCategories);
  };

  useEffect(() => {
    console.log("USE BLOG RENDER");
    load();
  }, [id, cities, categories]);

  return {
    blog,
    validCity,
    validCategories,
    refetchBlog: load,
  };
}
