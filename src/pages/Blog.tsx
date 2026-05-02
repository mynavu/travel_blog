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

export function Blog() {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reactions, setReactions] = useState<Record<string, number>>({
    REACTION_1: 0,
    REACTION_2: 0,
    REACTION_3: 0,
    REACTION_4: 0,
    REACTION_5: 0,
  });
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
      });
      console.log("REACTIONS", reactionResult.data);
      setReactions(reactionCount);
    })();
  }, []);

  const reactToBlog = async (reaction) => {
    axios.post(
      url,
      { email: "a@b.com", password: "123456" },
      { headers: { "X-Authorization": token } },
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 mt-15">
      {blog !== null && (
        <div className="flex flex-col w-100 justify-center align-middle">
          <p className="text-amber-300">{blog?.title}</p>
          <div className="flex">
            <p className="text-sm">
              {blog?.creatorFirstName} {blog?.creatorLastName}
            </p>
            <img
              className="w-7 h-7 rounded-full object-cover"
              src={`${path}/users/${blog?.creatorId}/image`}
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
          <p className="text-sm">{blog?.description}</p>
          <img
            src={`${path}/blogs/${blog?.blogId}/image`}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div className="flex justify-between">
            <SmilePlus />
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
                  <ThumbsUp className="text-cyan-300" /> {reactions.REACTION_4}
                </div>
              )}
              {reactions.REACTION_5 > 0 && (
                <div className="flex">
                  <Star className="text-yellow-200" /> {reactions.REACTION_5}
                </div>
              )}
            </div>
          </div>
          <div className="flex">
            <input className="bg-white" />
            <MessageCirclePlus />
          </div>
          {comments.length > 0 &&
            comments.map((comment) => <div>{comment.comment}</div>)}
        </div>
      )}
    </div>
  );
}
