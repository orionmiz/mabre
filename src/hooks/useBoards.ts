import useSWR from "swr";
import { fetcher } from "~/lib/swr";
import { BoardResponse } from "~/pages/api/boards";

export default function useBoards() {
  const { data, error } = useSWR<BoardResponse>("/api/boards", fetcher);

  return { data, isLoading: !error && !data, isError: error };
}
