import { useContext } from "react";
import { userContext } from "../contexts/user.context";

export default function Alert({ message }: { message: string }) {
  const contextValues = useContext(userContext);
  const dismissErrorHandler = () => {
    contextValues?.setError("");
  };

  return (
    <div id="Alert">
      <p>{message}</p>
      <button type="button" onClick={dismissErrorHandler}>
        Okay
      </button>
    </div>
  );
}
