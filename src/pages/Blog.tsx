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
} from "lucide-react";
import { useParams } from "react-router-dom";
import type { Blog, Comment, Reaction } from "../types";
import { path } from "../App";
import axios from "axios";
import defaultPfp from "../assets/default_pfp.png";

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

  const { id } = useParams();

  useEffect(() => {
    (async () => {
      const blogResult = await axios.get(`${path}/blogs/${id}`);
      setBlog(blogResult.data);
      console.log("BLOG", blogResult.data);
      const commentResult = await axios.get(`${path}/blogs/${id}/comments`);
      setComments(commentResult.data);
      console.log("COMMENTS", commentResult.data);
      const reactionResult = await axios.get(`${path}/blogs/${id}/react`);
      const reactionList: Reaction[] = reactionResult.data;

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
      console.log("REACTIONS", reactionResult.data);
      setReactions(reactionCount);
    })();
  }, []);

  const toggleReplies = (commentId: number) => {
    if (expandedComments.includes(commentId)) {
      setExpandedComments(expandedComments.filter((id) => id !== commentId));
    } else {
      setExpandedComments([...expandedComments, commentId]);
    }
  };

  const reactToBlog = async (reaction: string) => {
    await axios.post(
      `${path}/blogs/${id}/react`,
      { reaction },
      { headers: { "X-Authorization": cookies.token } },
    );
    setUserReaction(reaction);
    setReactions({ ...reactions, [reaction]: reactions[reaction] + 1 });
  };

  const removeReaction = async (reaction: string) => {
    await axios.delete(`${path}/blogs/${id}/react`, {
      headers: { "X-Authorization": cookies.token },
    });
    setUserReaction(null);
    setReactions({ ...reactions, [reaction]: reactions[reaction] - 1 });
  };

  const commentOnBlog = async () => {
    if (commentString.length === 0) {
      return;
    }

    const parentId = replyComment ? replyComment.commentId : null;

    await axios.post(
      `${path}/blogs/${id}/comments`,
      { comment: commentString, parentId },
      {
        headers: { "X-Authorization": cookies.token },
      },
    );
    const commentResult = await axios.get(`${path}/blogs/${id}/comments`);
    setComments(commentResult.data);

    setCommentString("");
    setReplyComment(null);
  };

  const getSimilarBlogs = async () => {};

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-start justify-center gap-4 mt-25">
        {blog !== null && (
          <div className="flex flex-col w-100">
            <img
              src={`${path}/blogs/${blog?.blogId}/image`}
              onError={(e) => (e.currentTarget.style.display = "none")}
              className="w-100 h-100 object-cover"
            />
            <div className="flex justify-between mt-2">
              {" "}
              <div
                className="relative"
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setShowReactions(false)}
              >
                {userReaction === "REACTION_1" ? (
                  <Smile
                    className="text-amber-300"
                    onClick={() => removeReaction("REACTION_1")}
                  />
                ) : userReaction === "REACTION_2" ? (
                  <PartyPopper
                    className="text-purple-300"
                    onClick={() => removeReaction("REACTION_2")}
                  />
                ) : userReaction === "REACTION_3" ? (
                  <Heart
                    className="text-pink-300"
                    onClick={() => removeReaction("REACTION_3")}
                  />
                ) : userReaction === "REACTION_4" ? (
                  <ThumbsUp
                    className="text-cyan-300"
                    onClick={() => removeReaction("REACTION_4")}
                  />
                ) : userReaction === "REACTION_5" ? (
                  <Star
                    className="text-yellow-200"
                    onClick={() => removeReaction("REACTION_5")}
                  />
                ) : (
                  <SmilePlus />
                )}

                {isLoggedIn && showReactions && (
                  <div className="absolute bottom-4 left-0 flex gap-2 bg-teal-900 p-2 rounded-xl z-50">
                    <Smile
                      className="text-amber-300 cursor-pointer hover:scale-125 transition-transform"
                      onClick={() => reactToBlog("REACTION_1")}
                    />
                    <PartyPopper
                      className="text-purple-300 cursor-pointer hover:scale-125 transition-transform"
                      onClick={() => reactToBlog("REACTION_2")}
                    />
                    <Heart
                      className="text-pink-300 cursor-pointer hover:scale-125 transition-transform"
                      onClick={() => reactToBlog("REACTION_3")}
                    />
                    <ThumbsUp
                      className="text-cyan-300 cursor-pointer hover:scale-125 transition-transform"
                      onClick={() => reactToBlog("REACTION_4")}
                    />
                    <Star
                      className="text-yellow-200 cursor-pointer hover:scale-125 transition-transform"
                      onClick={() => reactToBlog("REACTION_5")}
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <div className="flex">
                  <MessageCircle className="text-teal-500" />
                  {comments.length}
                </div>
                {reactions.REACTION_1 > 0 && (
                  <div className="flex">
                    <Smile className="text-amber-300" /> {reactions.REACTION_1}
                  </div>
                )}
                {reactions.REACTION_2 > 0 && (
                  <div className="flex">
                    <PartyPopper className="text-purple-300" />
                    {reactions.REACTION_2}
                  </div>
                )}
                {reactions.REACTION_3 > 0 && (
                  <div className="flex">
                    <Heart className="text-pink-300" /> {reactions.REACTION_3}
                  </div>
                )}
                {reactions.REACTION_4 > 0 && (
                  <div className="flex">
                    <ThumbsUp className="text-cyan-300" />{" "}
                    {reactions.REACTION_4}
                  </div>
                )}
                {reactions.REACTION_5 > 0 && (
                  <div className="flex">
                    <Star className="text-yellow-200" /> {reactions.REACTION_5}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {blog !== null && (
          <div className="w-60 h-100 flex flex-col">
            <p className="text-amber-300">{blog?.title}</p>
            <div className="flex">
              <p className="text-sm">
                {blog?.creatorFirstName} {blog?.creatorLastName}
              </p>
              <img
                className="w-7 h-7 rounded-full object-cover"
                src={`${path}/users/${blog?.creatorId}/image`}
                onError={(e) => (e.currentTarget.src = defaultPfp)}
              />
            </div>
            <p>SERIES: {blog?.series}</p>
            <p className="text-sm">{blog?.description}</p>

            {/* comments area */}
            <div className="flex flex-col overflow-y-auto flex-1">
              {comments
                .filter((comment) => comment.parentId === null)
                .map((comment) => {
                  const replies = comments.filter(
                    (child) => child.parentId === comment.commentId,
                  );
                  const isExpanded = expandedComments.includes(
                    comment.commentId,
                  );

                  return (
                    <div
                      key={comment.commentId}
                      className="flex flex-col bg-amber-300"
                    >
                      <div className="flex flex-row">
                        <img
                          className="w-7 h-7 rounded-full object-cover"
                          src={`${path}/users/${comment.commenterId}/image`}
                          onError={(e) => (e.currentTarget.src = defaultPfp)}
                        />
                        <div className="flex flex-col items-start">
                          <p>
                            {comment.commenterFirstName}{" "}
                            {comment.commenterLastName}
                          </p>
                          <p>
                            {new Date(comment.timestamp).toLocaleDateString(
                              "en-NZ",
                            )}
                          </p>
                          <p>{comment.comment}</p>
                          <div
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => toggleReplies(comment.commentId)}
                          >
                            <MessageCircle size={16} />
                            <p>{replies.length}</p>
                          </div>
                          <div
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => setReplyComment(comment)}
                          >
                            <MessageCirclePlus size={16} />
                            <button>Reply</button>
                          </div>
                        </div>
                      </div>

                      {isExpanded &&
                        replies.map((childComment) => (
                          <div
                            key={childComment.commentId}
                            className="flex bg-pink-600"
                          >
                            <img
                              className="w-7 h-7 rounded-full object-cover"
                              src={`${path}/users/${childComment.commenterId}/image`}
                              onError={(e) =>
                                (e.currentTarget.src = defaultPfp)
                              }
                            />
                            <p>{childComment.comment}</p>
                            <p>
                              {childComment.commenterFirstName}{" "}
                              {childComment.commenterLastName}
                            </p>
                            <p>
                              {new Date(
                                childComment.timestamp,
                              ).toLocaleDateString("en-NZ")}
                            </p>
                          </div>
                        ))}
                    </div>
                  );
                })}
            </div>
            {isLoggedIn && (
              <div className="flex sticky bottom-0 bg-teal-900 pt-2">
                {replyComment !== null && (
                  <button onClick={() => setReplyComment(null)}>
                    @{replyComment.commenterFirstName}{" "}
                    {replyComment.commenterLastName}
                  </button>
                )}
                <input
                  className="bg-white flex-1"
                  onChange={(e) => setCommentString(e.target.value)}
                  value={commentString}
                />
                <MessageCirclePlus onClick={() => commentOnBlog()} />
              </div>
            )}
          </div>
        )}
      </div>

      <p>Similar blogs</p>
    </div>
  );
}
