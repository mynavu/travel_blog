import { Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Blog, Comment, Reaction, City, Category } from "../types";
import { path } from "../App";
import axios from "axios";

type CreateButtonProps = {
  cookies: { token?: any; userId?: any };
};

export function CreateButton({ cookies }: CreateButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [chosenCity, setChosenCity] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [series, setSeries] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [categoryFocused, setCategoryFocused] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const citiesResult = await axios.get(`${path}/blogs/cities`);
        const citiesData = citiesResult.data as City[];
        setCities(citiesData);

        const categoriesResult = await axios.get(`${path}/blogs/categories`);
        const categoriesData = categoriesResult.data as Category[];
        setCategories(categoriesData);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const createBlog = async () => {
    if (
      !title ||
      !description ||
      !chosenCity ||
      categoryList.length === 0 ||
      !imageFile
    )
      return;

    try {
      const result = await axios.post(
        `${path}/blogs`,
        {
          title,
          description,
          cityId: chosenCity,
          categoryIds: categoryList.map((c) => c.categoryId),
          ...(series && { series }),
        },
        { headers: { "X-Authorization": cookies.token } },
      );

      const blogId = result.data.blogId;

      await axios.put(`${path}/blogs/${blogId}/image`, imageFile, {
        headers: {
          "X-Authorization": cookies.token,
          "Content-Type": imageFile.type,
        },
      });
      setShowModal(false);
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <button
        className="bg-cyan-500 fixed bottom-8 left-8 w-12 h-12 rounded-full text-white text-xl font-bold flex justify-center items-center z-50"
        onClick={() => setShowModal(true)}
      >
        <Plus />
      </button>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-teal-950 p-6 rounded-xl w-96 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <p className="text-amber-300 font-bold">Create Blog</p>
              <X
                className="cursor-pointer"
                onClick={() => setShowModal(false)}
              />
            </div>
            <p>Title</p>
            <input
              type="text"
              className="bg-white"
              onChange={(e) => setTitle(e.target.value)}
            />
            <p>Description</p>
            <input
              type="text"
              className="bg-white"
              onChange={(e) => setDescription(e.target.value)}
            />
            <p>Categories</p>
            <input
              type="text"
              className="bg-white"
              onChange={(e) => setCategorySearch(e.target.value)}
              onFocus={() => setCategoryFocused(true)}
              onBlur={() => setTimeout(() => setCategoryFocused(false), 100)}
              value={categorySearch}
            />
            {categoryFocused && (
              <div className="absolute z-50 bg-white text-black w-44 max-h-40 overflow-y-auto">
                {categories
                  .filter((category) =>
                    category.name
                      .toLowerCase()
                      .startsWith(categorySearch.toLowerCase()),
                  )
                  .map((category) => (
                    <div
                      key={category.categoryId}
                      className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        if (!categoryList.includes(category)) {
                          setCategoryList([...categoryList, category]);
                        }
                        setCategorySearch(""); // clear input
                        setCategoryFocused(false);
                      }}
                    >
                      {category.name}
                    </div>
                  ))}
              </div>
            )}
            {categoryList.map((category) => (
              <div
                key={category.categoryId}
                className="text-xs  text-pink-800 bg-pink-300/80 p-1 rounded-2xl cursor-pointer"
                onClick={() =>
                  setCategoryList(categoryList.filter((i) => i !== category))
                }
              >
                {category.name}
              </div>
            ))}
            <p>City</p>
            <select onChange={(e) => setChosenCity(Number(e.target.value))}>
              {cities.map((city) => (
                <option key={city.cityId} value={city.cityId}>
                  {city.name}
                </option>
              ))}
            </select>
            <p>Image</p>
            <input
              type="file"
              accept="image/png, image/jpeg, image/gif"
              className="bg-white"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
            <p>Series</p>
            <input
              type="text"
              className="bg-white"
              onChange={(e) => setSeries(e.target.value)}
            />
            <button className="bg-cyan-800" onClick={() => createBlog()}>
              Post
            </button>
          </div>
        </div>
      )}
    </>
  );
}
