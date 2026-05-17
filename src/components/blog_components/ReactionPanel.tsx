import type { Blog } from "../../types";
import { useState } from "react";
import { useBlogReactions } from "../../hooks/blog/useBlogReactions";

import {
  Smile,
  Heart,
  PartyPopper,
  Star,
  ThumbsUp,
  MessageCircle,
  SmilePlus,
} from "lucide-react";

type ReactionPanelProps = {
  cookies: { userId?: string };
  id: string | undefined;
  isLoggedIn: boolean;
  blog: Blog | null;
  setShowAccessModal: (v: boolean) => void;
};

export function ReactionPanel({
  cookies,
  id,
  isLoggedIn,
  blog,
  setShowAccessModal,
}: ReactionPanelProps) {
  // HOOKS
  const { reactions, userReaction, reactToBlog, removeReaction } =
    useBlogReactions({ id, cookies });
  const [showReactions, setShowReactions] = useState(false);

  // CONDITIONS
  const canClick = String(cookies.userId) !== String(blog?.creatorId);

  return (
    <>
      <div
        className={`flex mt-2 ${String(cookies.userId) !== String(blog?.creatorId) || !isLoggedIn ? "justify-between" : "justify-end"}`}
      >
        {canClick && (
          <div
            className="relative"
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setShowReactions(false)}
          >
            {userReaction === "REACTION_1" ? (
              <Smile
                className="text-amber-300 amber-glow selected-emoji"
                onClick={() => removeReaction("REACTION_1")}
              />
            ) : userReaction === "REACTION_2" ? (
              <PartyPopper
                className="text-purple-300 purple-glow selected-emoji"
                onClick={() => removeReaction("REACTION_2")}
              />
            ) : userReaction === "REACTION_3" ? (
              <Heart
                className="text-pink-300 pink-glow selected-emoji"
                onClick={() => removeReaction("REACTION_3")}
              />
            ) : userReaction === "REACTION_4" ? (
              <ThumbsUp
                className="text-sky-300 blue-glow selected-emoji"
                onClick={() => removeReaction("REACTION_4")}
              />
            ) : userReaction === "REACTION_5" ? (
              <Star
                className="text-yellow-200 yellow-glow selected-emoji"
                onClick={() => removeReaction("REACTION_5")}
              />
            ) : (
              <SmilePlus className="text-white" />
            )}

            {/* REACTIONS PANEL */}
            {showReactions && (
              <div className="absolute bottom-6 left-0 flex gap-2 rounded-xl rounded-bl-none z-50 glass p-1">
                <Smile
                  className="text-amber-300 cursor-pointer hover:scale-125 transition-transform amber-glow"
                  onClick={() =>
                    isLoggedIn
                      ? reactToBlog("REACTION_1")
                      : setShowAccessModal(true)
                  }
                />
                <PartyPopper
                  className="text-purple-300 cursor-pointer hover:scale-125 transition-transform purple-glow"
                  onClick={() =>
                    isLoggedIn
                      ? reactToBlog("REACTION_2")
                      : setShowAccessModal(true)
                  }
                />
                <Heart
                  className="text-pink-300 cursor-pointer hover:scale-125 transition-transform pink-glow"
                  onClick={() =>
                    isLoggedIn
                      ? reactToBlog("REACTION_3")
                      : setShowAccessModal(true)
                  }
                />
                <ThumbsUp
                  className="text-sky-300 cursor-pointer hover:scale-125 transition-transform blue-glow"
                  onClick={() =>
                    isLoggedIn
                      ? reactToBlog("REACTION_4")
                      : setShowAccessModal(true)
                  }
                />
                <Star
                  className="text-yellow-200 cursor-pointer hover:scale-125 transition-transform yellow-glow"
                  onClick={() =>
                    isLoggedIn
                      ? reactToBlog("REACTION_5")
                      : setShowAccessModal(true)
                  }
                />
              </div>
            )}
          </div>
        )}
        <div className="flex gap-2">
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
          <div className="flex text-white gap-1">
            <MessageCircle className="text-white" />
            {blog?.numberOfUniqueCommenters}
          </div>
        </div>
      </div>
    </>
  );
}
