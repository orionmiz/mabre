import useSWR from "swr";
import { fetcher } from "~/lib/swr";
import { ProfileResponse } from "~/pages/api/profile";

export default function useProfile() {
  const { data, error, mutate } = useSWR<ProfileResponse>(
    `/api/profile`,
    fetcher
  );

  return { profile: data, isLoading: !error && !data, isError: error, mutate };
}
