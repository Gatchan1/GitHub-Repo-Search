import { useContext } from "react";
import { userContext } from "../contexts/user.context";

export default function UserInfo() {
  const contextValues = useContext(userContext);
  const user = contextValues?.userInfo;

  return (
    <div id="UserInfo">
      <div id="avatar">
        <img src={user?.avatar_url} alt={`${user?.login} avatar image`} />
      </div>
      <h2>{user?.name}</h2>
      <h3>{user?.login}</h3>
      <p id="bio">{user?.bio}</p>
      <div id="follows"><p>{user?.followers} followers</p><p>{user?.following} following</p></div>
    </div>
  );
}
