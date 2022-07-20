import { useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Feed from "../components/Feed";
import Header from "../components/Header";
import PostBox from "../components/PostBox";
import SubredditRow from "../components/SubredditRow";
import { GET_SUBREDDITS_WITH_LIMIT } from "../graphql/queries";
import { Subreddit } from "../typings";

interface Props {
  open: boolean;
}

const Home = ({ open }: Props) => {
  const { data, error } = useQuery(GET_SUBREDDITS_WITH_LIMIT, {
    variables: {
      limit: 10,
    },
  });

  const subreddits: Subreddit[] = data?.getSubredditListWithLimit;

  return (
    <div className="max-w-5xl my-7 mx-auto">
      <Head>
        <title>Reddit 2.0 Clone</title>
      </Head>

      <PostBox open={open} />
      <div className="flex">
        <Feed />

        <div
          className="sticky top-36 mx-5 mt-5 hidden h-fit min-w-[300px]
        rounded-md border border-gray-300 bg-white lg:inline"
        >
          <p className="text-md mb-2 p-4 pb-3 font-bold">Top Communities</p>

          <div>
            {subreddits?.map((subreddit, index) => (
              <SubredditRow
                key={subreddit.id}
                index={index}
                topic={subreddit.topic}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
