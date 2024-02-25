import { useEffect, useMemo, useState } from "react";

import { fetcher } from "@/lib/fetcher";
import { User } from "@/types";

export const useUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = (await fetcher(`/api/user/${userId}`)) as User;
      setUser(fetchedUser);
    };

    fetchUser();
  }, [userId]); // Include userId in the dependency array

  // Memoize the user state
  const memoizedUser = useMemo(() => user, [user]);

  return memoizedUser;
};
