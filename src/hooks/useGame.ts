import useSWR from "swr";
import { fetcher } from "~/lib/swr";
import { GameResponse } from "~/pages/api/game";

export default function useGame() {
  const { data, error } = useSWR<GameResponse>(`/api/game`, fetcher, {
    onErrorRetry: (error) => {
      if (error.status === 500) return;
    },
  });

  return {
    game: data,
    isLoading: !error && !data,
    isError: error || data?.error,
  };
}
