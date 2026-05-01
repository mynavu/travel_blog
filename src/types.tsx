type Blog = {
  blogId: number;
  title: string;
  cityId: number;
  creatorId: number;
  creatorFirstName: string;
  creatorLastName: string;
  numReactions: number;
  categoryIds: number[];
  series: string;
  creationDate: string;
};

type User = {
  email: string;
  firstName: string;
  lastName: string;
};

export type { Blog, User };
