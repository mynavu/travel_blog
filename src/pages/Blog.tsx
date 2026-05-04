// U7, U8, U9
// U14, U15
import { useState, useEffect } from "react";
import {
  SmilePlus,
  Smile,
  PartyPopper,
  Heart,
  ThumbsUp,
  Star,
  MessageCircle,
  MessageCirclePlus,
  Trash,
  Pencil,
  MapPin,
  Clock,
  ArrowUp,
} from "lucide-react";
import { useParams } from "react-router-dom";
import type { Blog, Comment, Reaction, City, Category } from "../types";
import { path } from "../App";
import axios from "axios";
import defaultPfp from "../assets/default_pfp.png";
import { BlogModal } from "../components/modals/BlogModal";
import { DeleteBlogModal } from "../components/modals/DeleteBlogModal";
import { BlogDisplay } from "../components/BlogDisplay";
import { useNavigate, useLocation } from "react-router-dom";

type BlogProps = {
  isLoggedIn: boolean;
  cookies: { token?: any; userId?: any };
};

export function Blog({ cookies, isLoggedIn }: BlogProps) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reactions, setReactions] = useState<Record<string, number>>({
    REACTION_1: 0,
    REACTION_2: 0,
    REACTION_3: 0,
    REACTION_4: 0,
    REACTION_5: 0,
  });
  const [userReaction, setUserReaction] = useState<null | string>(null);
  const [showReactions, setShowReactions] = useState(false);
  const [expandedComments, setExpandedComments] = useState<number[]>([]);
  const [replyComment, setReplyComment] = useState<Comment | null>(null);
  const [commentString, setCommentString] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [validCity, setValidCity] = useState<City | null>(null);
  const [validCategories, setValidCategories] = useState<Category[]>([]);
  const [similarBlogs, setSimilarBlogs] = useState<Blog[]>([]);

  const { id } = useParams();

  useEffect(() => {
    (async () => {
      const blogResult = await axios.get(`${path}/blogs/${id}`);
      setBlog(blogResult.data);
      const commentResult = await axios.get(`${path}/blogs/${id}/comments`);
      setComments(commentResult.data);
      const reactionResult = await axios.get(`${path}/blogs/${id}/react`);
      const reactionList: Reaction[] = reactionResult.data;
      const citiesResult = await axios.get(`${path}/blogs/cities`);
      const categoriesResult = await axios.get(`${path}/blogs/categories`);
      setCities(citiesResult.data);
      setCategories(categoriesResult.data);
      const city = citiesResult.data.find(
        (i: City) => i.cityId === blogResult.data.cityId,
      );
      const cats = categoriesResult.data.filter((c: Category) =>
        blogResult.data.categoryIds.includes(c.categoryId),
      );
      setValidCity(city);
      setValidCategories(cats);

      await getSimilarBlogs(blogResult.data, city, cats);
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
    })();
  }, [id]);

  const toggleReplies = (commentId: number) => {
    if (expandedComments.includes(commentId)) {
      setExpandedComments(expandedComments.filter((id) => id !== commentId));
    } else {
      setExpandedComments([...expandedComments, commentId]);
    }
  };

  const reactToBlog = async (reaction: string) => {
    if (userReaction === reaction) return;

    try {
      if (userReaction !== null) {
        await axios.delete(`${path}/blogs/${id}/react`, {
          headers: { "X-Authorization": cookies.token },
        });
      }

      await axios.post(
        `${path}/blogs/${id}/react`,
        { reaction },
        { headers: { "X-Authorization": cookies.token } },
      );

      setReactions((prev) => {
        const updated = { ...prev };
        if (userReaction !== null) {
          updated[userReaction] = Math.max(0, updated[userReaction] - 1);
        }
        updated[reaction] = updated[reaction] + 1;
        return updated;
      });

      setUserReaction(reaction);
    } catch (e) {
      console.log(e);
    }
  };

  const removeReaction = async (reaction: string) => {
    try {
      await axios.delete(`${path}/blogs/${id}/react`, {
        headers: { "X-Authorization": cookies.token },
      });
      setReactions((prev) => ({
        ...prev,
        [reaction]: Math.max(0, prev[reaction] - 1),
      }));
      setUserReaction(null);
    } catch (e) {
      console.log(e);
    }
  };

  const commentOnBlog = async () => {
    if (commentString.length === 0) return;
    const parentId = replyComment ? replyComment.commentId : null;
    await axios.post(
      `${path}/blogs/${id}/comments`,
      { comment: commentString, parentId },
      { headers: { "X-Authorization": cookies.token } },
    );
    const commentResult = await axios.get(`${path}/blogs/${id}/comments`);
    setComments(commentResult.data);
    setCommentString("");
    setReplyComment(null);
  };

  const getSimilarBlogs = async (blog: Blog, city: City, cats: Category[]) => {
    const sameCityParams = new URLSearchParams();
    sameCityParams.append("count", "4");
    sameCityParams.append("cityIds", String(city.cityId));

    const sameCatParams = new URLSearchParams();
    sameCatParams.append("count", "4");
    cats.forEach((cat) =>
      sameCatParams.append("categoryIds", String(cat.categoryId)),
    );

    const sameCreatorParams = new URLSearchParams();
    sameCreatorParams.append("count", "4");
    sameCreatorParams.append("creatorId", String(blog.creatorId));

    const [cityResult, catResult, creatorResult] = await Promise.all([
      axios.get(`${path}/blogs?${sameCityParams.toString()}`),
      axios.get(`${path}/blogs?${sameCatParams.toString()}`),
      axios.get(`${path}/blogs?${sameCreatorParams.toString()}`),
    ]);

    const allBlogs = [
      ...cityResult.data.blogs,
      ...catResult.data.blogs,
      ...creatorResult.data.blogs,
    ];

    // deduplicate and filter out current blog
    const seen = new Set<number>();
    const unique = allBlogs.filter((b: Blog) => {
      if (b.blogId === blog.blogId || seen.has(b.blogId)) return false;
      seen.add(b.blogId);
      return true;
    });

    setSimilarBlogs(unique);
  };

  return (
    <div className="flex flex-col">
      {showModal && (
        <BlogModal
          mode="edit"
          blogId={id}
          setShowModal={setShowModal}
          cookies={cookies}
        />
      )}
      {showDeleteModal && (
        <DeleteBlogModal
          blogId={id}
          cookies={cookies}
          setShowDeleteModal={setShowDeleteModal}
        />
      )}
      <div className="flex flex-row items-start justify-center gap-4 mt-25">
        {blog !== null && (
          <div className="flex flex-col w-100">
            <img
              src={`${path}/blogs/${blog?.blogId}/image`}
              onError={(e) => (e.currentTarget.style.display = "none")}
              className="w-100 h-100 object-cover"
            />
            <div
              className={`flex mt-2 ${isLoggedIn ? "justify-between" : "justify-end"}`}
            >
              {isLoggedIn && (
                <div
                  className="relative"
                  onMouseEnter={() => setShowReactions(true)}
                  onMouseLeave={() => setShowReactions(false)}
                >
                  {userReaction === "REACTION_1" ? (
                    <Smile
                      className="text-amber-300 amber-glow"
                      onClick={() => removeReaction("REACTION_1")}
                    />
                  ) : userReaction === "REACTION_2" ? (
                    <PartyPopper
                      className="text-purple-300 purple-glow"
                      onClick={() => removeReaction("REACTION_2")}
                    />
                  ) : userReaction === "REACTION_3" ? (
                    <Heart
                      className="text-pink-300 pink-glow"
                      onClick={() => removeReaction("REACTION_3")}
                    />
                  ) : userReaction === "REACTION_4" ? (
                    <ThumbsUp
                      className="text-sky-300 blue-glow"
                      onClick={() => removeReaction("REACTION_4")}
                    />
                  ) : userReaction === "REACTION_5" ? (
                    <Star
                      className="text-yellow-200 yellow-glow"
                      onClick={() => removeReaction("REACTION_5")}
                    />
                  ) : (
                    <SmilePlus className="text-amber-300" />
                  )}

                  {/* REACTIONS PANEL */}
                  {showReactions && (
                    <div className="absolute bottom-6 left-0 flex gap-2 rounded-xl rounded-bl-none z-50 glass p-1">
                      <Smile
                        className="text-amber-300 cursor-pointer hover:scale-125 transition-transform amber-glow"
                        onClick={() => reactToBlog("REACTION_1")}
                      />
                      <PartyPopper
                        className="text-purple-300 cursor-pointer hover:scale-125 transition-transform purple-glow"
                        onClick={() => reactToBlog("REACTION_2")}
                      />
                      <Heart
                        className="text-pink-300 cursor-pointer hover:scale-125 transition-transform pink-glow"
                        onClick={() => reactToBlog("REACTION_3")}
                      />
                      <ThumbsUp
                        className="text-sky-300 cursor-pointer hover:scale-125 transition-transform blue-glow"
                        onClick={() => reactToBlog("REACTION_4")}
                      />
                      <Star
                        className="text-yellow-200 cursor-pointer hover:scale-125 transition-transform yellow-glow"
                        onClick={() => reactToBlog("REACTION_5")}
                      />
                    </div>
                  )}
                </div>
              )}
              <div className="flex gap-2">
                <div className="flex text-white gap-1">
                  <MessageCircle className="text-sky-500" />
                  {blog.numberOfUniqueCommenters}
                </div>
                {reactions.REACTION_1 > 0 && (
                  <div className="flex text-white gap-1">
                    <Smile className="text-amber-300" />
                    {reactions.REACTION_1}
                  </div>
                )}
                {reactions.REACTION_2 > 0 && (
                  <div className="flex text-white gap-1">
                    <PartyPopper className="text-purple-300" />
                    {reactions.REACTION_2}
                  </div>
                )}
                {reactions.REACTION_3 > 0 && (
                  <div className="flex text-white gap-1">
                    <Heart className="text-pink-300" />
                    {reactions.REACTION_3}
                  </div>
                )}
                {reactions.REACTION_4 > 0 && (
                  <div className="flex text-white gap-1">
                    <ThumbsUp className="text-sky-300" />
                    {reactions.REACTION_4}
                  </div>
                )}
                {reactions.REACTION_5 > 0 && (
                  <div className="flex text-white gap-1">
                    <Star className="text-yellow-200" />
                    {reactions.REACTION_5}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {blog !== null && (
          <div className="w-60 h-100 flex flex-col items-start overflow-hidden">
            <div className="flex w-full">
              <p className="text-white text-left">{blog?.title}</p>
              {String(cookies.userId) === String(blog?.creatorId) && (
                <>
                  <Pencil
                    className="text-white cursor-pointer"
                    onClick={() => setShowModal(true)}
                  />
                  <Trash
                    className="text-white cursor-pointer"
                    onClick={() => setShowDeleteModal(true)}
                  />
                </>
              )}
            </div>
            <p className="text-sm text-white">Series: {blog?.series}</p>
            <div className="flex gap-2 mt-2">
              <div className="flex gap-1">
                <MapPin size={15} className="text-white" />
                <p className="text-xs text-white">{validCity?.name}</p>
              </div>
              <div className="flex gap-1">
                <Clock size={15} className="text-white" />
                <p className="text-xs text-white">
                  {new Date(blog.creationDate).toLocaleDateString("en-NZ")}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap text-white gap-2 mt-2">
              {validCategories.map((cat) => (
                <p key={cat.categoryId} className="text-xxs glass rounded-2xl">
                  &nbsp;&nbsp;&nbsp;
                  {cat.name}
                  &nbsp;&nbsp;&nbsp;
                </p>
              ))}
            </div>
            <div className="flex flex-row gap-2 mt-2 mb-2 items-center">
              <img
                className="w-7 h-7 rounded-full object-cover"
                src={`${path}/users/${blog?.creatorId}/image`}
                onError={(e) => (e.currentTarget.src = defaultPfp)}
              />
              <p className="text-sm text-white">
                {blog?.creatorFirstName} {blog?.creatorLastName}
              </p>
            </div>
            <p className="text-xs text-white text-left">{blog?.description}</p>
            <p className="text-xs text-white py-2">
              {blog.numberOfUniqueCommenters === 0
                ? "No comments"
                : blog.numberOfUniqueCommenters === 1
                  ? "1 unique comment"
                  : `${blog.numberOfUniqueCommenters} unique comments`}
            </p>
            <hr className="w-full border-white/20 border-t border-solid mb-2" />

            {/* comments area */}
            <div className="flex flex-col overflow-y-auto flex-1 gap-2 pb-2 w-full">
              {comments
                .filter((comment) => comment.parentId === null)
                .map((comment) => {
                  const replies = comments
                    .filter((child) => child.parentId === comment.commentId)
                    .reverse();
                  const isExpanded = expandedComments.includes(
                    comment.commentId,
                  );
                  return (
                    <div
                      key={comment.commentId}
                      className="flex flex-col w-full"
                    >
                      <div className="flex flex-row glass rounded-2xl rounded-bl-none p-1 w-full gap-1">
                        <img
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                          src={`${path}/users/${comment.commenterId}/image`}
                          onError={(e) => (e.currentTarget.src = defaultPfp)}
                        />
                        <div className="flex flex-col items-start gap-1 min-w-0 flex-1">
                          <div className="flex flex-col items-start">
                            <p className="text-xs text-white">
                              {comment.commenterFirstName}{" "}
                              {comment.commenterLastName}
                            </p>
                            <p className="text-xxs leading-2 text-white">
                              {new Date(comment.timestamp).toLocaleDateString(
                                "en-NZ",
                              )}
                            </p>
                          </div>
                          <p className="text-white text-xs text-left w-full break-words">
                            {comment.comment}
                          </p>
                          <div className="flex gap-2">
                            <div
                              className="flex items-center gap-1 cursor-pointer"
                              onClick={() => toggleReplies(comment.commentId)}
                            >
                              <MessageCircle size={16} className="text-white" />
                              <p className="text-xs text-white">
                                {replies.length}
                              </p>
                            </div>
                            {isLoggedIn && (
                              <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => setReplyComment(comment)}
                              >
                                <MessageCirclePlus
                                  size={16}
                                  className="text-white"
                                />
                                <button className="text-xs text-white">
                                  Reply
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* comment replies */}
                      {isExpanded && (
                        <div className="flex flex-col items-end mt-2 gap-2 w-full">
                          {replies.map((childComment) => (
                            <div
                              key={childComment.commentId}
                              className="flex flex-row glass rounded-2xl rounded-br-none p-1 gap-1"
                              style={{ maxWidth: "90%" }}
                            >
                              <img
                                className="w-7 h-7 rounded-full object-cover shrink-0"
                                src={`${path}/users/${childComment.commenterId}/image`}
                                onError={(e) =>
                                  (e.currentTarget.src = defaultPfp)
                                }
                              />
                              <div className="flex flex-col items-start gap-1 min-w-0 flex-1">
                                <div className="flex flex-col items-start">
                                  <p className="text-xs text-white">
                                    {childComment.commenterFirstName}{" "}
                                    {childComment.commenterLastName}
                                  </p>
                                  <p className="text-xxs leading-2 text-white">
                                    {new Date(
                                      childComment.timestamp,
                                    ).toLocaleDateString("en-NZ")}
                                  </p>
                                </div>
                                <p className="text-white text-xs text-left w-full break-words">
                                  <span className="text-amber-300">
                                    @{comment.commenterFirstName}
                                  </span>
                                  &nbsp;{childComment.comment}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            {isLoggedIn && (
              <div className="flex sticky bottom-0 glass rounded-2xl items-center p-1 w-full mt-2">
                <div className="flex flex-1 items-center min-w-0">
                  {replyComment !== null && (
                    <button
                      onClick={() => setReplyComment(null)}
                      className="glass rounded-2xl px-2 shrink-0 text-amber-300 text-sm"
                    >
                      @{replyComment.commenterFirstName}
                    </button>
                  )}
                  <input
                    className="flex-1 min-w-0 pl-2 outline-none focus:outline-none focus:ring-0 text-white text-sm bg-transparent"
                    onChange={(e) => setCommentString(e.target.value)}
                    value={commentString}
                  />
                </div>
                <ArrowUp
                  onClick={() => commentOnBlog()}
                  size={25}
                  className="glass rounded-2xl shrink-0 ml-2 text-white cursor-pointer"
                />
              </div>
            )}
          </div>
        )}
        <div
          className="flex flex-col gap-2 pb-2 overflow-y-auto pb-20"
          style={{ width: "270px", height: "calc(100vh - 120px)" }}
        >
          <p className="text-white text-xs">
            View {similarBlogs.length} similar blogs:
          </p>
          {similarBlogs.map((blog) => (
            <BlogDisplay blog={blog} categories={categories} cities={cities} />
          ))}
        </div>
      </div>
    </div>
  );
}
