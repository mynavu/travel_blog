import { useEffect, useState } from "react";
import axios from "axios";
import { path } from "../../App";
import type { Reaction } from "../../types";

type UseBlogReactionsProps = {
  id?: string;
  cookies: { token?: string; userId?: string };
};

export function useBlogReactions({ id, cookies }: UseBlogReactionsProps) {
  const defaultReactions = {
    REACTION_1: 0,
    REACTION_2: 0,
    REACTION_3: 0,
    REACTION_4: 0,
    REACTION_5: 0,
  };

  const [reactions, setReactions] =
    useState<Record<string, number>>(defaultReactions);

  const [userReaction, setUserReaction] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    // Reset state immediately when id changes
    setReactions(defaultReactions);
    setUserReaction(null);

    const load = async () => {
      const reactionRes = await axios.get(`${path}/blogs/${id}/react`);

      const reactionList: Reaction[] = reactionRes.data;

      // reactions
      const reactionCount: Record<string, number> = { ...defaultReactions };

      reactionList.forEach((r) => {
        reactionCount[r.reaction]++;
        if (r.userId === Number(cookies.userId)) {
          setUserReaction(r.reaction);
        }
      });

      setReactions(reactionCount);
    };

    load();
    console.log("REACTIONS RENDER");
  }, [id, cookies.userId]);

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

  return {
    reactions,
    userReaction,
    reactToBlog,
    removeReaction,
  };
}
