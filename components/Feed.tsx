import { useQuery } from "@apollo/client";
import React from "react";
import { GET_ALL_POSTS, GET_POSTS_BY_TOPIC } from "../graphql/queries";
import { Post } from "../typings";
import PostC from "./Post";

interface Props {
  topic?: string;
}

function Feed({ topic }: Props) {
  const { data, error } = !topic
    ? useQuery(GET_ALL_POSTS)
    : useQuery(GET_POSTS_BY_TOPIC, {
        variables: {
          topic: topic,
        },
      });

  const posts: Post[] = !topic
    ? data?.getPostList
    : data?.getPostListUsingTopic;
  return (
    <div className="mt-5 space-y-4">
      {posts?.map((post) => (
        <PostC key={post.id} post={post} />
      ))}
    </div>
  );
}

export default Feed;
