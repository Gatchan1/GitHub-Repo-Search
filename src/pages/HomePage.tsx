import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../contexts/user.context";
import Alert from "../components/Alert";

export default function HomePage() {
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState("");  
  const navigate = useNavigate();

  const contextValues = useContext(userContext);

  useEffect(()=>{
    if (contextValues) {
      if (contextValues.error != "") {
        setError("This username doesn't seem to exist");
      }
      if (contextValues.user != "") {
        navigate(`/profile/${contextValues.user}`)}
    }
  },[contextValues?.loading, contextValues?.error])
  

  return (
    <div id="HomePage">
        <form>
          <label htmlFor="userInput">Input GitHub User:</label>
          <input id="userInput" type="text" placeholder="username" onChange={(e) => {setUserInput(e.target.value)}} />
          <button type="button" onClick={()=>{contextValues?.getUserHomePage(userInput)}}>Submit</button>
          {error != "" && <div className="alert"><Alert message={error} setError={setError}/></div>}
        </form>
    </div>
  );
}