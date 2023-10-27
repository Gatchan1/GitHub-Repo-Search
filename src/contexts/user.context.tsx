import { ReactNode, createContext } from "react";

type Props = {
  //children: string | JSX.Element | JSX.Element[] | (() => JSX.Element) //changeLater
  children: ReactNode
}

const userContext = createContext<ReactNode>(null);

function UserProviderWrapper({children}: Props):ReactNode {
  const patata = "patata linda";

  return <userContext.Provider value={{patata}}>{children}</userContext.Provider>
}

export {userContext, UserProviderWrapper};