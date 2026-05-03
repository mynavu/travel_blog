// U16
import { useParams } from "react-router-dom";
import { use, useEffect, useState } from "react";
import axios from "axios";
import defaultPfp from "../assets/default_pfp.png";
import { path } from "../App";
import type { Blog, User, Comment, Reaction, Category, City } from "../types";
import { useNavigate } from "react-router-dom";
import { Pencil, LibraryBig, MessageCircle, Heart } from "lucide-react";
import { EditProfileModal } from "../components/modals/EditProfileModal";
import { UserSeriesBlogs } from "../components/UserSeriesBlogs";
import { UserInteractedBlogs } from "../components/UserInteractedBlogs";

type ProfileProps = {
  cookies: { token?: any; userId?: any };
};
export function Profile({ cookies }: ProfileProps) {
  const { id } = useParams();
  const [profile, setProfile] = useState<User | null>(null);
  const [series, setSeries] = useState<string[]>([]);
  const [blogs, setBlogs] = useState<Record<string, Blog[]>>({});
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [commentedBlogs, setCommentedBlogs] = useState<Blog[]>([]);
  const [reactedBlogs, setReactedBlogs] = useState<Blog[]>([]);
  const [viewState, setViewState] = useState("series");
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    (async () => {
      try {
        // PROFILE INFO
        const userResult = await axios.get(`${path}/users/${id}`);
        setProfile(userResult.data);

        // CITIES AND CATEGORIES
        const citiesResult = await axios.get(`${path}/blogs/cities`);
        const citiesData = citiesResult.data as City[];
        setCities(citiesData);

        const categoriesResult = await axios.get(`${path}/blogs/categories`);
        const categoriesData = categoriesResult.data as Category[];
        setCategories(categoriesData);

        // SERIES
        const seriesResult = await axios.get(`${path}/users/${id}/series`);
        const seriesList = seriesResult.data;
        setSeries(seriesList);
        const blogsResult = await axios.get(`${path}/blogs`, {
          params: { creatorId: id },
        });
        const blogList = blogsResult.data.blogs;

        const seriesMap: Record<string, Blog[]> = { noSeries: [] };

        for (const blog of blogList) {
          if (!blog.series) {
            seriesMap["noSeries"] = [...seriesMap["noSeries"], blog];
          } else {
            if (!seriesMap[blog.series]) {
              seriesMap[blog.series] = [];
            }
            seriesMap[blog.series] = [...seriesMap[blog.series], blog];
          }
        }
        setBlogs(seriesMap);

        // COMMENTS AND REACTIONS
        const interactedResult = await axios.get(
          `${path}/blogs?interactedByMe=true&count=100`,
          {
            headers: { "X-Authorization": cookies.token },
          },
        );
        const interactedBlogs = interactedResult.data.blogs;

        // fetch all reactions and comments in parallel
        const [reactionsResults, commentsResults] = await Promise.all([
          Promise.all(
            interactedBlogs.map((blog: Blog) =>
              axios.get(`${path}/blogs/${blog.blogId}/react`),
            ),
          ),
          Promise.all(
            interactedBlogs.map((blog: Blog) =>
              axios.get(`${path}/blogs/${blog.blogId}/comments`),
            ),
          ),
        ]);

        const reactedBlogs: Blog[] = [];
        const commentedBlogs: Blog[] = [];

        interactedBlogs.forEach((blog: Blog, index: number) => {
          const hasReacted = reactionsResults[index].data.some(
            (r: Reaction) => r.userId === Number(cookies.userId),
          );
          const hasCommented = commentsResults[index].data.some(
            (c: Comment) => c.commenterId === Number(cookies.userId),
          );
          if (hasReacted) reactedBlogs.push(blog);
          if (hasCommented) commentedBlogs.push(blog);
        });
        setReactedBlogs(reactedBlogs);
        setCommentedBlogs(commentedBlogs);
      } catch (e: any) {}
    })();
  }, [id]);
  if (!profile) return <p>Loading...</p>;

  return (
    <div className="mt-20 p-4 flex flex-col gap-6">
      {showModal && (
        <EditProfileModal
          cookies={cookies}
          setShowModal={setShowModal}
          id={id as string}
        />
      )}
      <div className="flex items-center gap-3">
        <img
          className="w-12 h-12 rounded-full object-cover"
          src={`${path}/users/${id}/image`}
          onError={(e) => (e.currentTarget.src = defaultPfp)}
        />
        <p className="text-white text-xl font-bold">
          {profile.firstName} {profile.lastName}
        </p>
        {String(cookies.userId) === id && (
          <Pencil className="text-white" onClick={() => setShowModal(true)} />
        )}
      </div>

      <div className="flex">
        <LibraryBig onClick={() => setViewState("series")} />
        <MessageCircle onClick={() => setViewState("commented")} />
        <Heart onClick={() => setViewState("reacted")} />
      </div>
      {viewState === "series" && <UserSeriesBlogs blogs={blogs} />}
      {viewState === "commented" && (
        <UserInteractedBlogs
          blogs={commentedBlogs}
          categories={categories}
          cities={cities}
        />
      )}
      {viewState === "reacted" && (
        <UserInteractedBlogs
          blogs={reactedBlogs}
          categories={categories}
          cities={cities}
        />
      )}
    </div>
  );
}
