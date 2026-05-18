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
import { useBlogComments } from "../hooks/blog/useBlogComments";
import { useSimilarBlogs } from "../hooks/blog/useSimilarBlogs";
import { useBlogMetadata } from "../hooks/useBlogMetadata";
import defaultImage from "../assets/default_image.png";

type BlogProps = {
  isLoggedIn: boolean;
  cookies: { token?: any; userId?: any };
};

export function Blog({ cookies, isLoggedIn }: BlogProps) {
  const { id } = useParams();

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

  const { similarBlogs } = useSimilarBlogs(id, blog, validCategories);

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
              onError={(e) => (e.currentTarget.src = defaultImage)}
              className="w-100 h-100 object-cover"
            />
            <ReactionPanel
              cookies={cookies}
              id={id}
              isLoggedIn={isLoggedIn}
              blog={blog}
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
              commentOnBlog={commentOnBlog}
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
