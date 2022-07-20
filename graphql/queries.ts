import { gql } from "@apollo/client";

export const GET_SUBREDDIT_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getSubredditListByTopic(topic: $topic) {
      id
      topic
      created_at
    }
  }
`;

export const GET_SUBREDDITS_WITH_LIMIT = gql`
  query MyQuery7($limit: Int!) {
    getSubredditListWithLimit(limit: $limit) {
      created_at
      id
      topic
    }
  }
`;

/**
 * 
 * SELECT *, "post".id as id FROM "post"
      JOIN "subreddit" on "subreddit"."id" = "post"."subreddit_id"
      WHERE "subreddit"."topic" = $1
      ORDER BY "post"."created_at" DESC
 */

export const GET_POSTS_BY_TOPIC = gql`
  query MyQuery3($topic: String!) {
    getPostListUsingTopic(topic: $topic) {
      body
      created_at
      image
      id
      title
      username
      commentList {
        created_at
        id
        post_id
        text
        username
      }
      subreddit {
        created_at
        id
        topic
      }
      voteList {
        created_at
        id
        post_id
        upvote
        username
      }
    }
  }
`;

export const GET_COMMENTS_BY_POST_ID = gql`
  query MyQuery5($id: ID!) {
    getCommentUsingPost_id(id: $id) {
      id
      text
      created_at
      username
      post_id
    }
  }
`;

export const GET_POST_BY_ID = gql`
  query MyQuery4($id: ID!) {
    getPost(id: $id) {
      body
      created_at
      image
      id
      title
      username
      commentList {
        created_at
        id
        post_id
        text
        username
      }
      subreddit {
        created_at
        id
        topic
      }
      voteList {
        created_at
        id
        post_id
        upvote
        username
      }
    }
  }
`;

export const GET_ALL_VOTES_BY_POST_ID = gql`
  query MyQuery6($id: ID!) {
    getVoteUsingPost_id(id: $id) {
      id
      post_id
      upvote
      username
      created_at
    }
  }
`;

export const GET_ALL_POSTS = gql`
  query MyQuery2 {
    getPostList {
      body
      created_at
      image
      id
      title
      username
      commentList {
        created_at
        id
        post_id
        text
        username
      }
      subreddit {
        created_at
        id
        topic
      }
      voteList {
        created_at
        id
        post_id
        upvote
        username
      }
    }
  }
`;
