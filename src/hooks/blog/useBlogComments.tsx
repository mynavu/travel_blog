import { useEffect, useState } from "react";
import axios from "axios";
import { path } from "../../App";
import type { Comment } from "../../types";

type UseBlogCommentsProps = {
  id?: string;
  cookies: { token?: string; userId?: string };
  refetchBlog: () => void;
};

export function useBlogComments({
  id,
  cookies,
  refetchBlog,
}: UseBlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const commentRes = await axios.get(`${path}/blogs/${id}/comments`);
      setComments(commentRes.data);
    };

    load();

    console.log("COMMENTS RENDER");
  }, [id, cookies.userId]);

  const commentOnBlog = async (
    commentString: string,
    parentId: number | null,
  ) => {
    if (!id) return;
    if (commentString.trim().length === 0) return;
    await axios.post(
      `${path}/blogs/${id}/comments`,
      { comment: commentString, parentId },
      { headers: { "X-Authorization": cookies.token } },
    );
    await refetchBlog();
    const commentResult = await axios.get(`${path}/blogs/${id}/comments`);
    setComments(commentResult.data);
  };

  return {
    comments,
    commentOnBlog,
  };
}
