import { X, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { path } from "../../App";
import axios from "axios";
import type { City, Category } from "../../types";
import { useNavigate } from "react-router-dom";

type BlogModalProps = {
  mode: "create" | "edit";
  blogId?: string;
  cookies: { token?: any; userId?: any };
  setShowModal: (value: boolean) => void;
};

export function BlogModal({
  mode,
  blogId,
  cookies,
  setShowModal,
}: BlogModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryFocused, setCategoryFocused] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [chosenCity, setChosenCity] = useState<number | null>(3);
  const [series, setSeries] = useState("");
  const [existingSeries, setExistingSeries] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [seriesList, setSeriesList] = useState<string[]>([]);
  const [seriesFocused, setSeriesFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    (async () => {
      try {
        const [citiesResult, categoriesResult] = await Promise.all([
          axios.get(`${path}/blogs/cities`),
          axios.get(`${path}/blogs/categories`),
        ]);

        const citiesData: City[] = citiesResult.data;
        const categoriesData: Category[] = categoriesResult.data;
        setCities(citiesData);
        setCategories(categoriesData);

        if (mode === "edit" && blogId) {
          const blogResult = await axios.get(`${path}/blogs/${blogId}`);
          const blog = blogResult.data;

          setTitle(blog.title);
          setDescription(blog.description);
          setChosenCity(blog.cityId);
          setExistingSeries(blog.series || null);
          setImagePreview(`${path}/blogs/${blogId}/image`);

          const existingCategories = categoriesData.filter((c) =>
            blog.categoryIds.includes(c.categoryId),
          );
          setCategoryList(existingCategories);

          if (!blog.series) {
            const seriesResult = await axios.get(
              `${path}/users/${cookies.userId}/series`,
            );
            setSeriesList(seriesResult.data);
          }
        }

        if (mode === "create") {
          const seriesResult = await axios.get(
            `${path}/users/${cookies.userId}/series`,
          );
          setSeriesList(seriesResult.data);
        }
      } catch (e) {
        console.log(e);
      }
    })();
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (
      !title ||
      !description ||
      chosenCity === null ||
      categoryList.length === 0 ||
      !imagePreview
    ) {
      setErrorMessage(
        "Please fill out the required field including uploading an image",
      );
      return;
    }

    try {
      if (mode === "create") {
        // ADD ERROR MESSAGE IF SERIES IS TAKEN
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

        // Check if valid file
        if (imageFile) {
          await axios.put(
            `${path}/blogs/${result.data.blogId}/image`,
            imageFile,
            {
              headers: {
                "X-Authorization": cookies.token,
                "Content-Type": imageFile.type,
              },
            },
          );
        }
      } else {
        const body: any = {
          title,
          description,
          cityId: chosenCity,
          categoryIds: categoryList.map((c) => c.categoryId),
        };

        // only add series if blog didn't already have one
        if (!existingSeries && series) {
          body.series = series;
        }

        await axios.patch(`${path}/blogs/${blogId}`, body, {
          headers: { "X-Authorization": cookies.token },
        });

        if (imageFile) {
          await axios.put(`${path}/blogs/${blogId}/image`, imageFile, {
            headers: {
              "X-Authorization": cookies.token,
              "Content-Type": imageFile.type,
            },
          });
        }
      }

      setShowModal(false);
      navigate("/search");
      window.location.reload();
    } catch (e: any) {
      setErrorMessage(e.response?.statusText || "An error occurred");
      console.log(e);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={() => setShowModal(false)}
    >
      <div
        className=" p-6 rounded-xl w-96 flex flex-col gap-2 text-white overflow-y-auto max-h-screen glass text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <div className="flex">
            <Pencil size={20} className="pt-1 text-amber-300" />
            <p className="text-amber-300 font-bold text-sm">
              {mode === "create" ? "Create Blog" : "Edit Blog"}
            </p>
          </div>
          <X className="cursor-pointer" onClick={() => setShowModal(false)} />
        </div>

        {/* Image */}
        <div className="flex flex-col items-center gap-2">
          {imagePreview && (
            <img
              className="w-30 h-30 object-cover rounded"
              src={imagePreview}
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
          <input
            type="file"
            accept="image/png, image/jpeg, image/gif"
            className="text-xs glass-button w-45 p-1 rounded-2xl pl-2 cursor-pointer"
            onChange={handleImageChange}
          />
        </div>

        <div className="flex gap-2">
          <p>
            Title<span className="text-rose-400">*</span>
          </p>
          <input
            type="text"
            className="glass rounded-2xl flex-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <p>
            Description<span className="text-rose-400">*</span>
          </p>
          <input
            type="text"
            className="glass rounded-2xl flex-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <p>
            Categories<span className="text-rose-400">*</span>
          </p>
          <div className="relative flex-1">
            <input
              type="text"
              className="glass rounded-2xl w-full"
              onChange={(e) => setCategorySearch(e.target.value)}
              onFocus={() => setCategoryFocused(true)}
              onBlur={() => setTimeout(() => setCategoryFocused(false), 100)}
              value={categorySearch}
            />
            {categoryFocused && (
              <div className="absolute z-50 bg-white text-black w-full max-h-15 overflow-y-auto rounded-lg">
                {categories
                  .filter((category) =>
                    category.name
                      .toLowerCase()
                      .startsWith(categorySearch.toLowerCase()),
                  )
                  .map((category) => (
                    <div
                      key={category.categoryId}
                      className="px-2 py-1 hover:bg-amber-300 cursor-pointer"
                      onMouseDown={() => {
                        if (!categoryList.includes(category)) {
                          setCategoryList([...categoryList, category]);
                        }
                        setCategorySearch("");
                        setCategoryFocused(false);
                      }}
                    >
                      {category.name}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
        {categoryList.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categoryList.map((category) => (
              <div
                key={category.categoryId}
                className="text-xs glass px-1 rounded-2xl cursor-pointer hover:line-through"
                onClick={() =>
                  setCategoryList(categoryList.filter((i) => i !== category))
                }
              >
                {category.name}
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <p>
            City<span className="text-rose-400">*</span>
          </p>
          <select
            className="text-white glass rounded-2xl flex-1"
            value={chosenCity || 3}
            onChange={(e) => setChosenCity(Number(e.target.value))}
          >
            {cities.map((city) => (
              <option key={city.cityId} value={city.cityId}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          {/* Series - show input if create mode, or edit mode with no existing series */}
          {mode === "edit" && existingSeries ? (
            <p className="text-xs text-amber-300">
              Series: {existingSeries} (cannot be changed once set)
            </p>
          ) : (
            <>
              <p>Series</p>
              <div className="relative flex-1">
                <input
                  type="text"
                  className="rounded-2xl glass text-white pl-1 w-full focus:outline-white focus:outline"
                  onChange={(e) => setSeries(e.target.value)}
                  onFocus={() => setSeriesFocused(true)}
                  onBlur={() => setTimeout(() => setSeriesFocused(false), 100)}
                  value={series}
                />
                {seriesFocused && (
                  <div className="absolute z-50  text-black bg-white w-full max-h-12 overflow-y-auto rounded-lg text-xs">
                    {seriesList
                      .filter(
                        (s): s is string =>
                          typeof s === "string" && s.trim() !== "",
                      )
                      .filter((s) =>
                        s.toLowerCase().startsWith(series.toLowerCase()),
                      )
                      .map((s) => (
                        <div
                          key={s}
                          className="px-2 py-1 hover:bg-amber-300 cursor-pointer"
                          onMouseDown={() => {
                            setSeries(s);
                            setSeriesFocused(false);
                          }}
                        >
                          {s}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <button
          className="glass-button rounded-2xl p-1 text-amber-300"
          onClick={handleSubmit}
        >
          {mode === "create" ? "Post" : "Update"}
        </button>
        {errorMessage && (
          <p className="text-rose-400 text-xs pt-3">
            {errorMessage !== null && errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
