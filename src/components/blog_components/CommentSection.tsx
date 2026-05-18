import type { Comment } from "../../types";
import { path } from "../../App";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import defaultPfp from "../../assets/default_pfp.png";
import { MessageCircle, MessageCirclePlus, ArrowUp } from "lucide-react";

type CommentSectionProps = {
  comments: Comment[];
  commentOnBlog: (v: string, v2: number | null) => void;
  setShowAccessModal: (v: boolean) => void;
  isLoggedIn: boolean;
};

export function CommentSection({
  comments,
  commentOnBlog,
  setShowAccessModal,
  isLoggedIn,
}: CommentSectionProps) {
  const navigate = useNavigate();
  const [expandedComments, setExpandedComments] = useState<number[]>([]);
  const [replyComment, setReplyComment] = useState<Comment | null>(null);
  const [commentString, setCommentString] = useState("");

  const toggleReplies = (commentId: number) => {
    if (expandedComments.includes(commentId)) {
      setExpandedComments(expandedComments.filter((id) => id !== commentId));
    } else {
      setExpandedComments([...expandedComments, commentId]);
    }
  };

  return (
    <>
      {/* COMMENTS SECTION */}
      <div className="flex flex-col overflow-y-auto flex-1 gap-2 pb-2 w-full">
        {comments
          .filter((comment) => comment.parentId === null)
          .map((comment) => {
            const replies = comments
              .filter((child) => child.parentId === comment.commentId)
              .reverse();
            const isExpanded = expandedComments.includes(comment.commentId);
            return (
              <div key={comment.commentId} className="flex flex-col w-full">
                <div className="flex flex-row glass rounded-2xl rounded-bl-none p-1 w-full gap-1">
                  <img
                    className="w-7 h-7 rounded-full object-cover shrink-0 cursor-pointer"
                    src={`${path}/users/${comment.commenterId}/image`}
                    onError={(e) => (e.currentTarget.src = defaultPfp)}
                    onClick={() => navigate(`/profile/${comment.commenterId}`)}
                  />
                  <div className="flex flex-col items-start gap-1 min-w-0 flex-1">
                    <div className="flex flex-col items-start">
                      <p
                        className="text-xs text-white hover:text-amber-300 cursor-pointer"
                        onClick={() =>
                          navigate(`/profile/${comment.commenterId}`)
                        }
                      >
                        {comment.commenterFirstName} {comment.commenterLastName}
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
                        className={`flex items-center gap-1 cursor-pointer hover:text-amber-300 ${expandedComments.includes(comment.commentId) ? "text-amber-300" : "text-white"}`}
                        onClick={() => toggleReplies(comment.commentId)}
                      >
                        <MessageCircle size={16} />
                        <p className="text-xs">{replies.length}</p>
                      </div>

                      {/* REPLY COMMENT */}
                      <div
                        className={`flex items-center gap-1 cursor-pointer ${replyComment?.commentId == comment.commentId ? "text-amber-300" : "text-white"} hover:text-amber-300`}
                        onClick={() =>
                          isLoggedIn
                            ? replyComment
                              ? setReplyComment(null)
                              : setReplyComment(comment)
                            : setShowAccessModal(true)
                        }
                      >
                        <MessageCirclePlus size={16} className="" />
                        <button className="text-xs ">Reply</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COMMENT REPLIES */}
                {isExpanded && (
                  <div className="flex flex-col items-end mt-2 gap-2 w-full">
                    {replies.map((childComment) => (
                      <div
                        key={childComment.commentId}
                        className="flex flex-row glass rounded-2xl rounded-br-none p-1 gap-1"
                        style={{ maxWidth: "90%" }}
                      >
                        <img
                          className="w-7 h-7 rounded-full object-cover shrink-0 cursor-pointer"
                          src={`${path}/users/${childComment.commenterId}/image`}
                          onError={(e) => (e.currentTarget.src = defaultPfp)}
                          onClick={() =>
                            navigate(`/profile/${childComment.commenterId}`)
                          }
                        />
                        <div className="flex flex-col items-start gap-1 min-w-0 flex-1">
                          <div className="flex flex-col items-start">
                            <p
                              className="text-xs text-white cursor-pointer hover:text-amber-300"
                              onClick={() =>
                                navigate(`/profile/${childComment.commenterId}`)
                              }
                            >
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

      {/* COMMENT BAR*/}
      <div className="flex sticky bottom-0 glass rounded-2xl items-center p-1 w-full mt-2">
        <div className="flex flex-1 items-center min-w-0">
          {replyComment !== null && (
            <button
              onClick={() => setReplyComment(null)}
              className="glass rounded-2xl px-2 shrink-0 text-amber-300 text-sm hover:text-gray-300"
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
          onClick={() => {
            if (isLoggedIn) {
              commentOnBlog(commentString, replyComment?.commentId ?? null);
              setCommentString("");
              setReplyComment(null);
            } else {
              setShowAccessModal(true);
            }
          }}
          size={25}
          className="glass rounded-2xl shrink-0 ml-2 text-white cursor-pointer hover:text-amber-300"
        />
      </div>
    </>
  );
}
