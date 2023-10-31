import { Routes, Route } from "react-router-dom";
import "./App.css";
import { UserProviderWrapper } from "./contexts/user.context.tsx";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ErrorPage from "./pages/ErrorPage.tsx";

function App() {
  return (
    <>
      <UserProviderWrapper>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/notfound" element={<ErrorPage />} />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </UserProviderWrapper>
    </>
  );
}

export default App;
