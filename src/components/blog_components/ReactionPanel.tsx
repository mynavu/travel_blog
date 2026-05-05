import type { Blog } from "../../types";

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
  cookies: { userId?: any };
  isLoggedIn: boolean;
  setShowReactions: (v: boolean) => void;
  showReactions: boolean;
  removeReaction: (v: string) => void;
  blog: Blog | null;
  userReaction: string | null;
  reactions: Record<string, number>;
  reactToBlog: (v: string) => void;
};

export function ReactionPanel({
  cookies,
  isLoggedIn,
  setShowReactions,
  showReactions,
  removeReaction,
  blog,
  userReaction,
  reactions,
  reactToBlog,
}: ReactionPanelProps) {
  // CONDITIONS
  const canReact =
    isLoggedIn && String(cookies.userId) !== String(blog?.creatorId);

  return (
    <>
      <div
        className={`flex mt-2 ${String(cookies.userId) !== String(blog?.creatorId) || !isLoggedIn ? "justify-between" : "justify-end"}`}
      >
        {canReact && (
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
            {blog?.numberOfUniqueCommenters}
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
    </>
  );
}
