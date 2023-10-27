import { Routes, Route } from "react-router-dom";
import "./App.css";
import { UserProviderWrapper } from "./contexts/user.context.tsx";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <>
      <UserProviderWrapper>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
        </Routes>
      </UserProviderWrapper>
    </>
  );
}

export default App;
