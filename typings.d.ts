export interface Post {
  body: string;
  created_at: string;
  id: number;
  image: string;
  subreddit_id: number;
  title: string;
  username: string;
  commentList: Comments[];
  voteList: Vote[];
  subreddit: Subreddit[];
}

export interface Comments {
  created_at: string;
  id: number;
  post_id: number;
  text: string;
  username: string;
}

export interface Vote {
  id: number;
  created_at: string;
  post_id: number;
  upvote: boolean;
  username: string;
}

export interface Subreddit {
  created_at: string;
  id: number;
  topic: string;
}
