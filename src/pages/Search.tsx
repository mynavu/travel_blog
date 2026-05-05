// U1, U2, U3, U4, U5, U6
import { useState, useEffect } from "react";
import axios from "axios";
import type { Blog } from "../types";
import { path } from "../App";
import { ArrowRight, ArrowLeft, Clock, MapPin } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import type { City, Category } from "../types";
import { BlogDisplay } from "../components/BlogDisplay";

export function Search() {
  /*
  AC.1 The user can type characters (e.g., a word or phrase) into an appropriate search box to search for specific blogs.
  AC.2 Only and all blogs whose title or description contains the provided characters are shown (possibly after using pagination).
  */
  const [searchString, setSearchString] = useState("");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [sort, setSort] = useState("CREATED_DESC");
  const [reactionNum, setReactionNum] = useState<number>(0);
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalBlogNum, setTotalBlogNum] = useState(0);
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [citySearch, setCitySearch] = useState("");
  const [cityList, setCityList] = useState<City[]>([]);
  const [cityFocused, setCityFocused] = useState(false);
  const [categoryFocused, setCategoryFocused] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();
  const location = useLocation();

  // Types

  // Constants

  // Load data and populate blogs
  useEffect(() => {
    (async () => {
      try {
        const citiesResult = await axios.get(`${path}/blogs/cities`);
        const citiesData = citiesResult.data as City[];
        setCities(citiesData);

        const categoriesResult = await axios.get(`${path}/blogs/categories`);
        const categoriesData = categoriesResult.data as Category[];
        setCategories(categoriesData);

        const q = searchParams.get("q") || "";
        const sort = searchParams.get("sortBy") || "CREATED_DESC";
        const startIndex = Number(searchParams.get("startIndex")) || 0;
        const numReactions = Number(searchParams.get("numReactions")) || 0;
        const cityIds = searchParams.getAll("cityIds").map(Number);
        const categoryIds = searchParams.getAll("categoryIds").map(Number);

        setSearchString(q);
        setSort(sort);
        setCurrentIndex(startIndex);
        setReactionNum(numReactions);
        setCityList(citiesData.filter((c) => cityIds.includes(c.cityId)));
        setCategoryList(
          categoriesData.filter((c) => categoryIds.includes(c.categoryId)),
        );

        searchBlogs(
          startIndex,
          q,
          sort,
          numReactions,
          citiesData.filter((c) => cityIds.includes(c.cityId)),
          categoriesData.filter((c) => categoryIds.includes(c.categoryId)),
        );
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const searchBlogs = async (
    index = 0,
    q = searchString,
    sortBy = sort,
    reactions = reactionNum,
    cList = cityList,
    catList = categoryList,
  ) => {
    const params = new URLSearchParams();
    params.append("startIndex", String(index));
    params.append("count", "8");
    if (q) params.append("q", q);
    if (reactions) params.append("numReactions", String(reactions));
    if (sortBy) params.append("sortBy", sortBy);
    cList.forEach((city) => params.append("cityIds", String(city.cityId)));
    catList.forEach((cat) =>
      params.append("categoryIds", String(cat.categoryId)),
    );
    setSearchParams(params);
    const result = await axios.get(`${path}/blogs?${params.toString()}`);
    setBlogs(result.data.blogs as Blog[]);
    setTotalBlogNum(result.data.count);
  };

  return (
    <div>
      <div className="flex justify-around items-center mt-18">
        <div>
          <p className="text-xs text-white">Sort</p>
          <select
            defaultValue="CREATED_DESC"
            className="rounded-2xl glass text-white pl-1 text-xs pt-0.5 pb-0.5 w-70 focus:outline-white focus:outline"
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="ALPHABETICAL_ASC">
              Ascending alphabetically by title
            </option>
            <option value="ALPHABETICAL_DESC">
              Descending alphabetically by title
            </option>
            <option value="REACTIONS_ASC">
              Ascending by number of reactions
            </option>
            <option value="REACTIONS_DESC">
              Descending by number of reactions
            </option>
            <option value="CREATED_ASC">
              Chronologically by creation date
            </option>
            <option value="CREATED_DESC">
              Reversed chronologically by creation date
            </option>
          </select>
        </div>
        {/* MIN REACTION */}
        <div>
          <p className="text-xs text-white">Min reaction</p>
          <input
            type="number"
            defaultValue={0}
            className="rounded-2xl glass text-white pl-1 text-sm w-20 focus:outline-white focus:outline"
            onChange={(e) => setReactionNum(Number(e.target.value))}
          />
        </div>

        {/* CITIES */}
        <div>
          <p className="text-xs text-sky-300">Cities</p>
          <input
            type="text"
            className="rounded-2xl glass-blue text-white pl-1 w-30 text-sm focus:outline-sky-300 focus:outline"
            onChange={(e) => setCitySearch(e.target.value)}
            onFocus={() => setCityFocused(true)}
            onBlur={() => setTimeout(() => setCityFocused(false), 100)}
            value={citySearch}
          />
          {cityFocused && (
            <div className="absolute z-50  text-white glass w-30 max-h-40 overflow-y-auto rounded-xl text-xs">
              {cities
                .filter((city) =>
                  city.name.toLowerCase().startsWith(citySearch.toLowerCase()),
                )
                .map((city) => (
                  <div
                    key={city.cityId}
                    className="px-2 py-1 hover:bg-sky-300/50 cursor-pointer"
                    onClick={() => {
                      if (!cityList.includes(city)) {
                        setCityList([...cityList, city]);
                      }
                      setCitySearch("");
                      setCityFocused(false);
                    }}
                  >
                    {city.name}
                  </div>
                ))}
            </div>
          )}
        </div>
        <div>
          <p className="text-xs text-pink-300">Categories</p>
          <input
            type="text"
            className="rounded-2xl glass-pink text-white pl-1 text-sm focus:outline-pink-300 focus:outline w-40"
            onChange={(e) => setCategorySearch(e.target.value)}
            onFocus={() => setCategoryFocused(true)}
            onBlur={() => setTimeout(() => setCategoryFocused(false), 100)}
            value={categorySearch}
          />
          {categoryFocused && (
            <div className="absolute z-50  text-white glass w-40 max-h-40 overflow-y-auto rounded-xl text-xs">
              {categories
                .filter((category) =>
                  category.name
                    .toLowerCase()
                    .startsWith(categorySearch.toLowerCase()),
                )
                .map((category) => (
                  <div
                    key={category.categoryId}
                    className="px-2 py-1 hover:bg-pink-300/50 cursor-pointer"
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
        </div>
        <div>
          <p className="text-xs text-amber-300">Keyword(s)</p>
          <input
            type="text"
            className="rounded-2xl glass-yellow text-white pl-1 text-sm focus:outline-amber-300 focus:outline"
            onChange={(e) => setSearchString(e.target.value)}
          />
        </div>
        <button
          onClick={() => {
            setCurrentIndex(0);
            searchBlogs(0);
          }}
          className="rounded-2xl glass text-white pl-1.5 pr-1.5 text-sm mt-3 cursor-pointer"
        >
          Search
        </button>
      </div>
      <div className="flex gap-2 mt-2 justify-center flex-wrap">
        {cityList.map((city) => (
          <div
            key={city.cityId}
            className="text-xs text-white glass-blue p-1 rounded-2xl cursor-pointer"
            onClick={() => setCityList(cityList.filter((i) => i !== city))}
          >
            {city.name}
          </div>
        ))}

        {categoryList.map((category) => (
          <div
            key={category.categoryId}
            className="text-xs text-white glass-pink p-1 rounded-2xl cursor-pointer"
            onClick={() =>
              setCategoryList(categoryList.filter((i) => i !== category))
            }
          >
            {category.name}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1">
        <p className="text-amber-300">{totalBlogNum} Results Found: </p>
      </div>
      <div className="flex justify-around gap-3 flex-wrap">
        {blogs.length ? (
          blogs.map((blog) => (
            <BlogDisplay blog={blog} categories={categories} cities={cities} />
          ))
        ) : (
          <p className="text-white py-20">
            There are no blogs that matches your search.
          </p>
        )}
      </div>
      <div className="flex flex-col items-center gap-2 text-amber-500 my-7">
        <div className="glass w-max px-2 rounded-2xl flex flex-row gap-3">
          {/* FIRST */}
          {currentIndex >= 16 && (
            <>
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  searchBlogs(0);
                }}
              >
                1
              </button>
              <p>...</p>
            </>
          )}

          {/* PREV */}
          {currentIndex >= 8 && (
            <button
              onClick={() => {
                const newIndex = currentIndex - 8;
                setCurrentIndex(newIndex);
                searchBlogs(newIndex);
              }}
            >
              {Math.ceil(currentIndex / 8)}
            </button>
          )}
          {/* CURRENT */}
          <button className="text-amber-300">
            {Math.ceil(currentIndex / 8) + 1}
          </button>

          {/* NEXT */}
          {currentIndex + 8 < totalBlogNum && (
            <button
              onClick={() => {
                const newIndex = currentIndex + 8;
                setCurrentIndex(newIndex);
                searchBlogs(newIndex);
              }}
            >
              {Math.ceil(currentIndex / 8) + 2}
            </button>
          )}
          {currentIndex + 16 < totalBlogNum && (
            <>
              <p>...</p>
              <button
                onClick={() => {
                  const newIndex = (Math.ceil(totalBlogNum / 8) - 1) * 8;
                  setCurrentIndex(newIndex);
                  searchBlogs(newIndex);
                }}
              >
                {Math.ceil(totalBlogNum / 8)}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
