import { useEffect, useState } from "react";
import axios from "axios";
import { path } from "../App";
import type { Blog, Comment, Reaction, City, Category } from "../types";

export function useBlog(id: string | undefined, cookies: { userId?: any }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reactions, setReactions] = useState<Record<string, number>>({
    REACTION_1: 0,
    REACTION_2: 0,
    REACTION_3: 0,
    REACTION_4: 0,
    REACTION_5: 0,
  });

  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [similarBlogs, setSimilarBlogs] = useState<Blog[]>([]);

  const [validCity, setValidCity] = useState<City | null>(null);
  const [validCategories, setValidCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const [blogRes, commentRes, reactionRes, cityRes, categoryRes] =
        await Promise.all([
          axios.get(`${path}/blogs/${id}`),
          axios.get(`${path}/blogs/${id}/comments`),
          axios.get(`${path}/blogs/${id}/react`),
          axios.get(`${path}/blogs/cities`),
          axios.get(`${path}/blogs/categories`),
        ]);

      const blogData = blogRes.data;
      const reactionList: Reaction[] = reactionRes.data;

      setBlog(blogData);
      setComments(commentRes.data);
      setCities(cityRes.data);
      setCategories(categoryRes.data);

      const city = cityRes.data.find((c: City) => c.cityId === blogData.cityId);
      const cats = categoryRes.data.filter((c: Category) =>
        blogData.categoryIds.includes(c.categoryId),
      );

      setValidCity(city);
      setValidCategories(cats);

      // reactions
      const reactionCount: Record<string, number> = {
        REACTION_1: 0,
        REACTION_2: 0,
        REACTION_3: 0,
        REACTION_4: 0,
        REACTION_5: 0,
      };

      reactionList.forEach((r) => {
        reactionCount[r.reaction]++;
        if (r.userId === Number(cookies.userId)) {
          setUserReaction(r.reaction);
        }
      });

      setReactions(reactionCount);

      // similar blogs
      const sameCity = axios.get(
        `${path}/blogs?count=4&cityIds=${blogData.cityId}`,
      );

      const sameCreator = axios.get(
        `${path}/blogs?count=4&creatorId=${blogData.creatorId}`,
      );

      const sameCats = axios.get(
        `${path}/blogs?count=4&${cats
          .map((c: Category) => `categoryIds=${c.categoryId}`)
          .join("&")}`,
      );

      const [cityRes2, catRes2, creatorRes2] = await Promise.all([
        sameCity,
        sameCats,
        sameCreator,
      ]);

      const all = [
        ...cityRes2.data.blogs,
        ...catRes2.data.blogs,
        ...creatorRes2.data.blogs,
      ];

      const seen = new Set<number>();
      const unique = all.filter((b: Blog) => {
        if (b.blogId === blogData.blogId || seen.has(b.blogId)) return false;
        seen.add(b.blogId);
        return true;
      });

      setSimilarBlogs(unique);
    };

    load();
  }, [id]);

  return {
    blog,
    comments,
    reactions,
    userReaction,
    cities,
    categories,
    validCity,
    validCategories,
    similarBlogs,
    setComments,
    setReactions,
    setUserReaction,
  };
}
