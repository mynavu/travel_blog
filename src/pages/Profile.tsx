// U16
import { useParams } from "react-router-dom";
import { use, useEffect, useState } from "react";
import axios from "axios";
import defaultPfp from "../assets/default_pfp.png";
import { path } from "../App";
import type { Blog, User } from "../types";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import { EditProfileModal } from "../components/EditProfileModal";

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

  useEffect(() => {
    (async () => {
      try {
        const userResult = await axios.get(`${path}/users/${id}`);

        setProfile(userResult.data);
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

      {Object.entries(blogs).map(([seriesName, seriesBlogs]) => (
        <div key={seriesName}>
          <p className="text-amber-300 font-bold mb-2">
            {seriesName === "noSeries" ? "Other Posts" : seriesName}
          </p>
          <div className="flex flex-row gap-3 overflow-x-auto pb-2">
            {seriesBlogs.map((blog) => (
              <div
                key={blog.blogId}
                className="bg-teal-950 min-w-48 w-48 p-3 flex flex-col gap-1 cursor-pointer flex-shrink-0"
                onClick={() => navigate(`/blog/${blog.blogId}`)}
              >
                <img
                  src={`${path}/blogs/${blog.blogId}/image`}
                  className="w-48 h-32 object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                <p className="text-amber-300 text-xs font-bold">{blog.title}</p>
                <p className="text-white text-xs">
                  {blog.numReactions} reactions
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
