type Blog = {
  blogId: number;
  title: string;
  cityId: number;
  creatorId: number;
  creatorFirstName: string;
  creatorLastName: string;
  description: string;
  numReactions: number;
  numberOfUniqueCommenters: number;
  categoryIds: number[];
  series: string;
  creationDate: string;
};

type User = {
  email: string;
  firstName: string;
  lastName: string;
};

type Comment = {
  commentId: number;
  commenterId: number;
  comment: string;
  commenterFirstName: string;
  commenterLastName: string;
  timeStamp: string;
  parentId: number;
};

type Reaction = {
  userId: number;
  reaction: string;
};

export type { Blog, User, Comment, Reaction };
