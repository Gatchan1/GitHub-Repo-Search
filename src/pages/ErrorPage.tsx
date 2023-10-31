import { useContext, useEffect } from "react";
import { userContext } from "../contexts/user.context";
import { Link } from "react-router-dom"

export default function ErrorPage() {
  const contextValues = useContext(userContext);

  useEffect(()=>{
    if (contextValues) {
      if (contextValues.error != "") {
        contextValues.setError("");
      }
    }
  },[])

  return (
    <div id="ErrorPage">
      <p>Oops! Nothing to see here.</p>
      <p>Go back to <Link to="/">Home Page</Link>.</p>
    </div>
  )
}
