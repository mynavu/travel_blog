import { useEffect, useState } from "react";
import axios from "axios";
import { path } from "../App";
import type { City, Category } from "../types";

export function useBlogMetadata() {
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const load = async () => {
      const [cityRes, categoryRes] = await Promise.all([
        axios.get(`${path}/blogs/cities`),
        axios.get(`${path}/blogs/categories`),
      ]);
      setCities(cityRes.data);
      setCategories(categoryRes.data);
    };

    console.log("BLOG META RENDER");

    load();
  }, []);

  return {
    cities,
    categories,
  };
}
