// U1, U2, U3, U4, U5, U6
import { useState, useEffect } from "react";
import axios from "axios";
import type { Blog } from "../types";
import { path } from "../App";
import { ArrowRight, ArrowLeft, Clock, MapPin } from "lucide-react";

export function Search() {
  /*
  AC.1 The user can type characters (e.g., a word or phrase) into an appropriate search box to search for specific blogs.
  AC.2 Only and all blogs whose title or description contains the provided characters are shown (possibly after using pagination).
  */
  const [searchString, setSearchString] = useState("");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [sort, setSort] = useState("");
  const [reactionNum, setReactionNum] = useState(null);
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [blogImages, setBlogImages] = useState([]);
  const [lastPageNum, setLastPageNum] = useState(null);
  const [totalBlogNum, setTotalBlogNum] = useState(null);
  const [citySearch, setCitySearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [cityList, setCityList] = useState<City[]>([]);
  const [categoryFocused, setCategoryFocused] = useState(false);
  const [cityFocused, setCityFocused] = useState(false);

  // Types
  type City = { cityId: number; name: string };
  type Category = { categoryId: number; name: string };

  // Constants
  const PAGE_SIZE = 8;

  // Load data and populate blogs
  useEffect(() => {
    (async () => {
      try {
        const citiesResult = await axios.get(`${path}/blogs/cities`);
        setCities(citiesResult.data as City[]);

        const categoriesResult = await axios.get(`${path}/blogs/categories`);
        setCategories(categoriesResult.data as Category[]);

        // const categoryIds = categoriesResult.map((i) => i.categoryId);
        // const cityIds = citiesResult.map((i) => i.cityId);

        const blogResults = await axios.get(
          `${path}/blogs?startIndex=${startIndex}&count=8`,
        );

        setBlogs(blogResults.data.blogs as Blog[]);
        setTotalBlogNum(blogResults.data.count);
        console.log(blogResults);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const searchBlogs = async () => {
    try {
      const result = await axios.get(`${path}?q=${searchString}`);
      setBlogs(result.data.blogs as Blog[]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex justify-around items-center mt-20">
        <select className="text-black bg-white">
          <option>Test xsxnsk</option>
        </select>
        <input
          type="text"
          className="bg-white"
          onChange={(e) => setCitySearch(e.target.value)}
        />
        <div>
          <p className="text-xs text-cyan-300">Cities</p>
          <input
            type="text"
            className="bg-white"
            onChange={(e) => setCitySearch(e.target.value)}
            onFocus={() => setCityFocused(true)}
            onBlur={() => setTimeout(() => setCityFocused(false), 100)}
            value={citySearch}
          />
          {cityFocused && (
            <div className="absolute z-50 bg-white text-black w-44 max-h-40 overflow-y-auto">
              {cities
                .filter((city) =>
                  city.name.toLowerCase().startsWith(citySearch.toLowerCase()),
                )
                .map((city) => (
                  <div
                    key={city.cityId}
                    className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
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
        </div>
        <button
          onClick={() => searchBlogs()}
          className="bg-cyan-400 text-sm p-1.5  text-cyan-800 font-bold rounded-2xl"
        >
          SEARCH
        </button>
      </div>
      <div className="flex gap-2">
        {categoryList.map((category) => (
          <div>{category.name}</div>
        ))}
      </div>
      <div className="flex justify-between">
        <select>
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
          <option value="CREATED_ASC">Chronologically by creation date</option>
          <option value="CREATED_DESC">
            Reversed chronologically by creation date
          </option>
        </select>
        <p>{totalBlogNum} results found</p>
      </div>
      <div className="flex justify-around gap-3 flex-wrap">
        {blogs.length ? (
          blogs.map((blog) => (
            <div
              key={blog.blogId}
              className="bg-teal-950 w-60 p-3 flex flex-col items-start gap-1"
            >
              <img
                src={`${path}/blogs/${blog.blogId}/image`}
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <p className="text-amber-300 text-xs font-bold">{blog.title}</p>
              <p className="text-amber-300 text-xs">
                Written by {blog.creatorFirstName} {blog.creatorLastName}
              </p>
              <div className="flex justify-around">
                <MapPin size={18} className="text-amber-500" />
                <p className="text-xs text-amber-500">
                  {cities.find((i) => i.cityId === blog.cityId)?.name}
                </p>
                <Clock size={18} className="text-amber-500" />
                <p className="text-xs text-amber-500">
                  {new Date(blog.creationDate).toLocaleDateString("en-NZ")}
                </p>
              </div>
              <div className="flex flex-wrap text-white gap-2">
                {blog.categoryIds.map((id) => (
                  <p className="text-xxs bg-cyan-800 outline-1 outline-cyan-600  rounded-2xl">
                    &nbsp;&nbsp;&nbsp;
                    {categories.find((i) => i.categoryId === id)?.name}
                    &nbsp;&nbsp;&nbsp;
                  </p>
                ))}
              </div>
              <p className="text-xs text-white">
                {blog.numReactions} Reactions
              </p>
            </div>
          ))
        ) : (
          <p>No blogs</p>
        )}
      </div>
      <div className="flex justify-center gap-2 text-amber-500">
        <button className="text-amber-300">1</button>
        <button>2</button>
        <p>...</p>
        <button>{totalBlogNum}</button>
        <button>
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}
