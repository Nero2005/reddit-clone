import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React from "react";
import { GET_COMMENTS_BY_POST_ID, GET_POST_BY_ID } from "../../graphql/queries";
import { Post } from "../../typings";
import PostC from "../../components/Post";
import { GetServerSideProps, GetStaticProps } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ADD_COMMENT } from "../../graphql/mutations";
import TimeAgo from "react-timeago";
import Avatar from "../../components/Avatar";

interface FormData {
  comment: string;
}

function PostPage() {
  const {
    query: { id },
  } = useRouter();
  const { data: session } = useSession();
  const { data, error } = useQuery(GET_POST_BY_ID, {
    variables: {
      id,
    },
  });
  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [GET_POST_BY_ID, "getPost"],
  });
  const post: Post = data?.getPost;
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (formData) => {
    console.log(formData);
    const notification = toast.loading("Adding your comment...");
    try {
      await addComment({
        variables: {
          post_id: id,
          username: session?.user?.name,
          text: formData.comment,
        },
      });

      setValue("comment", "");
      toast.success("Comment successfully added!", {
        id: notification,
      });
    } catch (err) {
      console.log(err);
      toast.error("Whoops! Something went wrong", {
        id: notification,
      });
    }
  });

  return (
    <div className="mx-auto my-7 max-w-5xl group">
      <Head>
        <title>{post && post.title}</title>
      </Head>
      <PostC post={post} />

      <div
        className={`${
          !post && "hidden"
        } -mt-1 group-hover:border group-hover:border-gray-600 
        group-hover:border-t-0 rounded-b-md border border-t-0 
        border-gray-300 bg-white p-5 pl-16`}
      >
        <p className="text-sm">
          Comment as <span className="text-red-500">{session?.user?.name}</span>
        </p>

        <form onSubmit={onSubmit} className="flex flex-col space-y-2">
          <textarea
            {...register("comment", { required: true })}
            disabled={!session}
            className="h-24 rounded-md border border-gray-200 p-2 pl-4 
          outline-none disabled:bg-gray-50"
            placeholder={
              session ? "What are your thoughts?" : "Please sign in to comment"
            }
          />
          <button
            type="submit"
            disabled={!session}
            className="rounded-full bg-red-500 p-3 font-semibold text-white
            disabled:bg-gray-200"
          >
            Comment
          </button>
        </form>
      </div>

      <div
        className={`${
          !post && "hidden"
        } -my-5 rounded-b-md border border-t-0 border-gray-300 
      bg-white py-5 px-10 group-hover:border group-hover:border-gray-600 group-hover:border-t-0`}
      >
        <hr className="py-2" />

        {post?.commentList.map((comment) => (
          <div
            className="relative flex items-center space-x-2 space-y-5"
            key={comment.id}
          >
            <hr className="absolute top-10 h-16 border left-7 z-0" />

            <div className="z-40">
              <Avatar seed={comment.username} />
            </div>

            <div className="flex flex-col">
              <p className="py-2 text-xs text-gray-400">
                <span className="font-semibold text-gray-600">
                  {comment.username}
                </span>{" "}
                • <TimeAgo date={comment.created_at} />
              </p>
              <p>{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostPage;
