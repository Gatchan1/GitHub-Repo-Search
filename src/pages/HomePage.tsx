import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const redirectToUser = (): void => {
    if (user != "") navigate(`/profile/${user}`);
  };

  return (
    <div id="HomePage">
        <form>
          <label htmlFor="userInput">Input GitHub User:</label>
          <input id="userInput" type="text" placeholder="username" onChange={(e) => setUser(e.target.value)} />
          <button className="submit" onClick={redirectToUser}>Submit</button>
        </form>
    </div>
  );
}
