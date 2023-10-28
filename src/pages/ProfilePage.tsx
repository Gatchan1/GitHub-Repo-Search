import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import Repos from '../components/Repos';
import { userContext } from "../contexts/user.context";

export default function ProfilePage() {
  const { username } = useParams();
  const contextValues = useContext(userContext);

  useEffect(()=>{
    if (contextValues?.loading && typeof username == "string")
    contextValues?.getUserProfilePage(username)
  },[])

  return (
    <div>
        {!(contextValues?.loading) && <div>{contextValues?.userInfo?.name}</div>}
        
    </div>
  )
}
//<Repos />