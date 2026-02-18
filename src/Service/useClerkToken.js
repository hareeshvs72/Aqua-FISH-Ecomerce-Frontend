import { useAuth } from "@clerk/clerk-react";

export const useClerkToken = () => {
  const { getToken } = useAuth();

  const handleToken = async () => {
    const token = await getToken();
    return token;
  };

  return { handleToken };
};
