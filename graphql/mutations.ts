import { gql } from "@apollo/client";

export const ADD_POST = gql`
  mutation MyMutation(
    $body: String!
    $image: String!
    $subreddit_id: ID!
    $title: String!
    $username: String!
  ) {
    insertPost(
      body: $body
      image: $image
      subreddit_id: $subreddit_id
      title: $title
      username: $username
    ) {
      id
      body
      image
      subreddit_id
      title
      username
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation MyMutation4($text: String!, $username: String!, $post_id: ID!) {
    insertComment(post_id: $post_id, text: $text, username: $username) {
      id
      text
      created_at
      username
      post_id
    }
  }
`;

export const ADD_VOTE = gql`
  mutation MyMutation5($post_id: ID!, $upvote: Boolean!, $username: String!) {
    insertVote(post_id: $post_id, upvote: $upvote, username: $username) {
      id
      post_id
      upvote
      username
      created_at
    }
  }
`;

export const UPDATE_POST_IMAGE = gql`
  mutation MyMutation2($id: ID!, $image: String!) {
    updatePostImage(id: $id, image: $image) {
      id
    }
  }
`;

export const UPDATE_VOTE = gql`
  mutation MyMutation6($post_id: ID!, $username: String!, $upvote: Boolean!) {
    updateVote(post_id: $post_id, username: $username, upvote: $upvote) {
      id
    }
  }
`;

export const DELETE_VOTE = gql`
  mutation MyMutation6($post_id: ID!, $username: String!) {
    deleteVote(post_id: $post_id, username: $username) {
      id
    }
  }
`;

export const ADD_SUBREDDIT = gql`
  mutation MyMutation3($topic: String!) {
    insertSubreddit(topic: $topic) {
      id
      topic
      created_at
    }
  }
`;
