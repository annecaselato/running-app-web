import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SignIn } from "./pages/SignIn";
import { Home } from "./pages/Home";
import { SignUp } from "./pages/SignUp";

export const AppRoutes = () => {
  return(
  <BrowserRouter>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
    </Routes>
    </BrowserRouter>
  )
};
