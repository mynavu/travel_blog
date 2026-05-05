import { useState } from "react";
import { useParams } from "react-router-dom";
import type { Blog, Comment, Reaction, City, Category } from "../types";
import { path } from "../App";
import { BlogModal } from "../components/modals/BlogModal";
import { DeleteBlogModal } from "../components/modals/DeleteBlogModal";
import { GetAccessModal } from "../components/modals/GetAccessModal";
import { BlogHeader } from "../components/blog_components/BlogHeader";
import { CommentSection } from "../components/blog_components/CommentSection";
import { ReactionPanel } from "../components/blog_components/ReactionPanel";
import { SimilarBlogsSideBar } from "../components/blog_components/SimilarBlogsSideBar";
import { useBlog } from "../hooks/useBlog";
import { useBlogReactions } from "../hooks/blog/useBlogReactions";
import { useBlogComments } from "../hooks/blog/useBlogComments";
import { useSimilarBlogs } from "../hooks/blog/useSimilarBlogs";
import { useBlogMetadata } from "../hooks/useBlogMetadata";

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

  const { categories, cities } = useBlogMetadata();

  const { blog, validCity, validCategories, refetchBlog } = useBlog(
    id,
    cities,
    categories,
  );
  const { comments, commentOnBlog } = useBlogComments({
    id,
    cookies,
    refetchBlog,
  });

  const { reactions, userReaction, reactToBlog, removeReaction } =
    useBlogReactions({ id, cookies });

  const { similarBlogs } = useSimilarBlogs(id, blog, validCategories);

  const toggleReplies = (commentId: number) => {
    if (expandedComments.includes(commentId)) {
      setExpandedComments(expandedComments.filter((id) => id !== commentId));
    } else {
      setExpandedComments([...expandedComments, commentId]);
    }
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
              setShowAccessModal={setShowAccessModal}
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
              setShowAccessModal={setShowAccessModal}
              isLoggedIn={isLoggedIn}
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
