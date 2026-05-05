import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Blog, Comment, Reaction, City, Category } from "../types";
import { path } from "../App";
import axios from "axios";
import { BlogModal } from "../components/modals/BlogModal";
import { DeleteBlogModal } from "../components/modals/DeleteBlogModal";
import { GetAccessModal } from "../components/modals/GetAccessModal";
import { BlogHeader } from "../components/blog_components/BlogHeader";
import { CommentSection } from "../components/blog_components/CommentSection";
import { ReactionPanel } from "../components/blog_components/ReactionPanel";
import { SimilarBlogsSideBar } from "../components/blog_components/SImilarBlogsSideBar";
import { useBlog } from "../hooks/useBlog";

type BlogProps = {
  isLoggedIn: boolean;
  cookies: { token?: any; userId?: any };
};

export function Blog({ cookies, isLoggedIn }: BlogProps) {
  const { id } = useParams();

  const [showReactions, setShowReactions] = useState(false);
  const [expandedComments, setExpandedComments] = useState<number[]>([]);
  const [replyComment, setReplyComment] = useState<Comment | null>(null);
  const [commentString, setCommentString] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const {
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
  } = useBlog(id, cookies);

  const toggleReplies = (commentId: number) => {
    if (expandedComments.includes(commentId)) {
      setExpandedComments(expandedComments.filter((id) => id !== commentId));
    } else {
      setExpandedComments([...expandedComments, commentId]);
    }
  };

  const reactToBlog = async (reaction: string) => {
    if (!isLoggedIn) {
      setShowAccessModal(true);
      return;
    }
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
    if (!isLoggedIn) {
      setShowAccessModal(true);
      return;
    }
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
      {showAccessModal && (
        <GetAccessModal setShowAccessModal={setShowAccessModal} />
      )}
      <div className="flex flex-row items-start justify-center gap-4 mt-25">
        {blog !== null && (
          <div className="flex flex-col w-100">
            <img
              src={`${path}/blogs/${blog?.blogId}/image`}
              onError={(e) => (e.currentTarget.style.display = "none")}
              className="w-100 h-100 object-cover"
            />
            <ReactionPanel
              cookies={cookies}
              isLoggedIn={isLoggedIn}
              setShowReactions={setShowReactions}
              showReactions={showReactions}
              removeReaction={removeReaction}
              blog={blog}
              userReaction={userReaction}
              reactions={reactions}
              reactToBlog={reactToBlog}
            />
          </div>
        )}

        {blog !== null && (
          <div className="w-60 h-100 flex flex-col items-start overflow-hidden">
            <BlogHeader
              blog={blog}
              validCity={validCity}
              validCategories={validCategories}
              cookies={cookies}
              isLoggedIn={isLoggedIn}
              setShowModal={setShowModal}
              setShowDeleteModal={setShowDeleteModal}
            />
            <CommentSection
              comments={comments}
              expandedComments={expandedComments}
              toggleReplies={toggleReplies}
              setReplyComment={setReplyComment}
              commentString={commentString}
              setCommentString={setCommentString}
              commentOnBlog={commentOnBlog}
              replyComment={replyComment}
            />
          </div>
        )}
        <SimilarBlogsSideBar
          categories={categories}
          cities={cities}
          similarBlogs={similarBlogs}
        />
      </div>
    </div>
  );
}
