import { ReactNode, createContext, useState } from "react";
import { Octokit } from "@octokit/core";

interface userContextT {
  userInfo: null | userInfo;
  user: string;
  getUser: (userTry: string) => Promise<void>;
  error: string;
  loading: boolean;
  setError: React.Dispatch<React.SetStateAction<string>>
}

type Props = {
  children: ReactNode;
};

interface userInfo {
  login: string;
  id: number;
  avatar_url: string;
  bio: string | null;
  name: string | null;
  following: number;
  followers: number;
  public_repos: number;
}

const userContext = createContext<null | userContextT>(null);

function UserProviderWrapper({ children }: Props): ReactNode {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState("");
  const [userInfo, setUserInfo] = useState<null | userInfo>(null);
  const [error, setError] = useState("");
  // const octokit = new Octokit();
  const octokit = new Octokit({ auth: `${import.meta.env.VITE_GITHUB_TOKEN}` });

  async function getUser(userTry: string) {
    setError("");
    if (userTry != "") {
      const getUser = octokit.request("GET /users/{username}", {
        username: userTry,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
      getUser
        .then((resp) => {
          setUserInfo(resp.data);
          setUser(userTry);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
        });
    }
  }

  const exposedValues = {
    userInfo,
    user,
    getUser,
    loading,
    error,
    setError
  };

  return <userContext.Provider value={exposedValues}>{children}</userContext.Provider>;
}

export { userContext, UserProviderWrapper };
