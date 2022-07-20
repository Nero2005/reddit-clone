import { useSession } from "next-auth/react";
import React, { SyntheticEvent, useRef, useState } from "react";
import Avatar from "./Avatar";
import { LinkIcon, PhotographIcon } from "@heroicons/react/outline";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import client from "../apollo-client";
import {
  ADD_POST,
  ADD_SUBREDDIT,
  UPDATE_POST_IMAGE,
} from "../graphql/mutations";
import {
  GET_ALL_POSTS,
  GET_POSTS_BY_TOPIC,
  GET_SUBREDDIT_BY_TOPIC,
} from "../graphql/queries";
import toast from "react-hot-toast";
import { supabase } from "../supabase-client";
import { decode } from "base64-arraybuffer";
import { Post } from "../typings";

interface FormData {
  postTitle: string;
  postBody: string;
  postImage: string;
  subreddit: string;
}

interface Props {
  subreddit?: string;
  open: boolean;
}

function PostBox({ subreddit, open }: Props) {
  const { data: session } = useSession();
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: !subreddit
      ? [GET_ALL_POSTS, "getPostList"]
      : [GET_POSTS_BY_TOPIC, "getPostListUsingTopic"],
  });
  const [addSubreddit] = useMutation(ADD_SUBREDDIT);
  const [updatePost] = useMutation(UPDATE_POST_IMAGE, {
    refetchQueries: !subreddit
      ? [GET_ALL_POSTS, "getPostList"]
      : [GET_POSTS_BY_TOPIC, "getPostListUsingTopic"],
  });

  const [imageToPost, setImageToPost] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const filePickerRef = useRef<HTMLInputElement>(null!);
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (formData) => {
    console.log(formData);
    const notification = toast.loading("Creating new post");
    try {
      // Query for subreddit topic
      const {
        data: { getSubredditListByTopic },
      } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: {
          topic: subreddit || formData.subreddit,
        },
      });

      const subredditExists = getSubredditListByTopic.length > 0;
      let post: Post;
      if (!subredditExists) {
        // create subreddit
        console.log("Subreddit is new, creating a new subreddit");
        const {
          data: { insertSubreddit: newSubreddit },
        } = await addSubreddit({
          variables: {
            topic: formData.subreddit,
          },
        });
        console.log("Creating post...", formData);
        const image = formData.postImage || "";

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image,
            subreddit_id: newSubreddit.id,
            title: formData.postTitle,
            username: session?.user?.name,
          },
        });
        post = { ...newPost };
        console.log("New post added: ", newPost);
      } else {
        // use existing subreddit
        console.log("Using existing subreddit");
        console.log(getSubredditListByTopic);
        const image = formData.postImage || "";
        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image,
            subreddit_id: getSubredditListByTopic[0].id,
            title: formData.postTitle,
            username: session?.user?.name,
          },
        });
        post = { ...newPost };
        console.log("New post added: ", newPost);
      }

      if (imageToPost) {
        console.log("====================================");
        console.log(post);
        console.log("====================================");
        console.log(imageToPost);
        setUploading(true);
        const fileExt = imageToPost.name.split(".").pop();
        const timeOfUpload = new Date().toLocaleString().split("/").join("-");
        const filePath = `public/${timeOfUpload}-${post.id}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from("avatars")
          .upload(filePath, imageToPost);
        if (error) throw error;
        removeImage();
        await updatePost({
          variables: {
            id: post.id,
            image: filePath,
          },
        });
      }

      // After post added
      setValue("postBody", "");
      setValue("postTitle", "");
      setValue("postImage", "");
      setValue("subreddit", "");

      toast.success("New post created", {
        id: notification,
      });
    } catch (err) {
      console.log(err);
      toast.error("Whoops! Something went wrong", {
        id: notification,
      });
    } finally {
      setUploading(false);
    }
  });

  const addImageToPost = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      throw new Error("You must select an image to upload.");
    }
    setImageToPost(e.target.files![0]);
  };

  const removeImage = () => {
    setImageToPost(null);
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`sticky top-20 z-50 bg-white border rounded-md border-gray-200 p-2 ${
        open && "hidden"
      }`}
    >
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <Avatar />

        <input
          {...register("postTitle", { required: true })}
          type="text"
          placeholder={
            session
              ? subreddit
                ? `Create a post in r/${subreddit}`
                : `Create a post by entering a title`
              : `Sign in to post`
          }
          className="rounded-md flex-1 bg-gray-50 p-2 pl-5 outline-none truncate"
          disabled={!session}
        />

        <div
          onClick={() =>
            imageToPost ? removeImage() : filePickerRef.current.click()
          }
        >
          <PhotographIcon
            className={`h-6 text-gray-300 cursor-pointer ${
              imageToPost && "text-blue-300"
            }`}
          />
          <input
            type="file"
            hidden
            onChange={addImageToPost}
            ref={filePickerRef}
            disabled={uploading}
          />
        </div>
        <LinkIcon className={`h-6 text-gray-300`} />
      </div>

      {!!watch("postTitle") && (
        <div className="flex flex-col py-2">
          {/* Body */}
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Body</p>
            <input
              className="m-2 p-2 flex-1 bg-blue-50 outline-none"
              {...register("postBody")}
              type="text"
              placeholder="Text (optional)"
            />
          </div>

          {!subreddit && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Subreddit</p>
              <input
                className="m-2 p-2 flex-1 bg-blue-50 outline-none"
                {...register("subreddit", { required: true })}
                type="text"
                placeholder="i.e. Reactjs"
              />
            </div>
          )}

          {/* {imageBoxOpen && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Image URL</p>
              <input
                className="m-2 p-2 flex-1 bg-blue-50 outline-none"
                {...register("postImage")}
                type="text"
                placeholder="Optional..."
              />
            </div>
          )} */}

          {/* Errors */}
          {Object.keys(errors).length > 0 && (
            <div className="space-y-2 p-2 text-red-500">
              {errors.postTitle?.type === "required" && (
                <p>- A Post Title is required</p>
              )}

              {errors.subreddit?.type === "required" && (
                <p>- A Subreddit is required</p>
              )}
            </div>
          )}

          {!!watch("postTitle") && (
            <button
              type="submit"
              className="w-full rounded-full bg-blue-500 p-2 text-white"
              disabled={uploading}
            >
              Create Post
            </button>
          )}
        </div>
      )}
    </form>
  );
}

export default PostBox;
