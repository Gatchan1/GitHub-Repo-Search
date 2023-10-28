import { ReactNode, createContext, useState } from "react";
import { Octokit } from "@octokit/core";

interface userContextT {
  userInfo: null | userInfo;
  user: string;
  getUserHomePage: (userTry: string) => Promise<void>;
  getUserProfilePage: (userTry: string) => Promise<void>;
  error: string;
  //apiInfo: null | ApiInfoItem[];
  loading: boolean;
}

type Props = {
  //children: string | JSX.Element | JSX.Element[] | (() => JSX.Element) //changeLater
  children: ReactNode
}

interface userInfo {
  id: number;
  login: string;
  name: string | null;
}

const userContext = createContext<null | userContextT>(null);

function UserProviderWrapper({children}: Props):ReactNode {
 // const [apiInfo, setApiInfo] = useState<null | ApiInfoItem[]>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState("");
  const [userInfo, setUserInfo] = useState<null | userInfo>(null);
  const [error, setError] = useState("");
  const octokit = new Octokit();
 
  async function getUserHomePage(userTry: string) {
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
          console.log("data de getUserHomePage:",resp.data)
        })
        .catch((err) => {
          setError(err);
        });
    }
  }

  async function getUserProfilePage(userTry: string) {
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
          console.log("data de getUserProfilePage:",resp.data)
        })
        .catch((err) => {
          console.log("user en context: ", user)
          setError(err);
        });
    }
  }

  const exposedValues = {
    userInfo,
    user,
    getUserHomePage,
    getUserProfilePage,
   // apiInfo,
    loading,
    error
  }

  return <userContext.Provider value={exposedValues}>{children}</userContext.Provider>
}

export {userContext, UserProviderWrapper};