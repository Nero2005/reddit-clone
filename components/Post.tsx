import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/solid";
import React, { useEffect, useRef, useState } from "react";
import { Post, Vote } from "../typings";
import Avatar from "./Avatar";
import TimeAgo from "react-timeago";
import { supabase } from "../supabase-client";
import {
  BookmarkIcon,
  ChatAltIcon,
  ChatIcon,
  DotsHorizontalIcon,
  GiftIcon,
  ShareIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
import { Jelly } from "@uiball/loaders";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_VOTES_BY_POST_ID } from "../graphql/queries";
import { ADD_VOTE, DELETE_VOTE, UPDATE_VOTE } from "../graphql/mutations";

interface Props {
  post: Post;
}

function Post({ post }: Props) {
  const { data: session } = useSession();
  const [vote, setVote] = useState<boolean | undefined>(undefined);

  const { data, loading } = useQuery(GET_ALL_VOTES_BY_POST_ID, {
    variables: {
      id: post?.id,
    },
  });

  const [addVote] = useMutation(ADD_VOTE, {
    refetchQueries: [GET_ALL_VOTES_BY_POST_ID, "getVoteUsingPost_id"],
  });

  const [updateVote] = useMutation(UPDATE_VOTE, {
    refetchQueries: [GET_ALL_VOTES_BY_POST_ID, "getVoteUsingPost_id"],
  });

  const [deleteVote] = useMutation(DELETE_VOTE, {
    refetchQueries: [GET_ALL_VOTES_BY_POST_ID, "getVoteUsingPost_id"],
  });

  const upvote = async (isUpvote: boolean) => {
    if (!session) {
      toast("You'll need to sign in to vote!");
      return;
    }
    console.log(vote);
    console.log(isUpvote);

    if (vote === isUpvote) {
      await deleteVote({
        variables: {
          post_id: post?.id,
          username: session?.user?.name,
        },
      });
      setVote(undefined);
      return;
    }
    if (vote !== isUpvote && vote !== undefined) {
      await updateVote({
        variables: {
          post_id: post?.id,
          username: session?.user?.name,
          upvote: isUpvote,
        },
      });
      setVote(isUpvote);
      return;
    }
    console.log("Voting...", isUpvote);

    const {
      data: { insertVote: newVote },
    } = await addVote({
      variables: {
        post_id: post?.id,
        username: session?.user?.name,
        upvote: isUpvote,
      },
    });
    console.log(isUpvote);
    console.log(newVote);
    setVote(isUpvote);
  };

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const downloadImage = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data!);
      setImageUrl(url);
    } catch (error: any) {
      console.log("Error downloading image: ", error);
    }
  };

  useEffect(() => {
    post && post.image && downloadImage(post.image);
    const votes: Vote[] = data?.getVoteUsingPost_id;

    const vote = votes?.find(
      (vote) => vote.username == session?.user?.name
    )?.upvote;
    console.log(vote);
    setVote(vote);
  }, [post, data]);

  const displayVotes = (data: any) => {
    const votes: Vote[] = data?.getVoteUsingPost_id;
    const displayNumber = votes?.reduce(
      (total, vote) => (vote.upvote ? (total += 1) : (total -= 1)),
      0
    );

    if (votes?.length == 0) return 0;
    if (displayNumber == 0) {
      return votes[0]?.upvote ? 1 : 0;
    }

    return displayNumber;
  };

  if (!post)
    return (
      <div className="flex w-full items-center justify-center p-10 text-xl">
        <Jelly size={50} color="#ff4501" />
      </div>
    );

  return (
    <Link href={`/post/${post.id}`}>
      <div
        className="flex cursor-pointer border border-gray-300 
    bg-white shadow-sm hover:border hover:border-gray-600 rounded-md group-hover:border
    group-hover:border-gray-600"
      >
        {/* Votes */}
        <div
          className="flex flex-col items-center justify-start space-y-1 
      rounded-l-md bg-gray-50 p-4 text-gray-400"
        >
          <ArrowUpIcon
            onClick={() => upvote(true)}
            className={`voteButtons hover:text-blue-400 ${
              vote && "text-blue-400"
            }`}
          />
          <p className={`text-black font-bold text-xs`}>{displayVotes(data)}</p>
          <ArrowDownIcon
            onClick={() => upvote(false)}
            className={`voteButtons hover:text-red-400 ${
              vote === false && "text-red-400"
            }`}
          />
        </div>
        <div className="p-3 pb-1">
          {/* Header */}
          <div className="flex items-center space-x-2">
            <Avatar seed={post.subreddit[0]?.topic} />
            <p className="text-xs text-gray-400">
              <Link href={`/subreddit/${post.subreddit[0]?.topic}`}>
                <span className="font-bold text-black hover:text-blue-400 hover:underline">
                  r/{post.subreddit[0]?.topic}
                </span>
              </Link>{" "}
              • Posted by u/
              {post.username} <TimeAgo date={post.created_at} />
            </p>
          </div>
          {/* Body */}
          <div className="py-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-sm font-light">{post.body}</p>
          </div>
          {/* Image */}
          <img src={imageUrl ? imageUrl : ""} className="w-full" alt="" />
          {/* Footer */}
          <div className="flex space-x-4 text-gray-400">
            <div className="postButtons">
              <ChatAltIcon className="h-6 w-6" />
              <p className="text-xs md:text-sm">
                {post.commentList.length}{" "}
                {post.commentList.length === 1 ? "Comment" : "Comments"}
              </p>
            </div>
            <div className="postButtons">
              <GiftIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Award</p>
            </div>
            <div className="postButtons">
              <ShareIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Share</p>
            </div>
            <div className="postButtons">
              <BookmarkIcon className="h-6 w-6" />
              <p className="hidden sm:inline">Save</p>
            </div>
            <div className="postButtons">
              <DotsHorizontalIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Post;
