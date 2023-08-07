import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SignIn } from "./pages/SignIn";
import { PrivateRoute } from "./components/PrivateRoute";
import { Home } from "./pages/Home";
import { SignUp } from "./pages/SignUp";

export const AppRoutes = () => {
  return(
  <BrowserRouter>
    <Routes>
        {/* Public routes */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        {/* Private routes */}
        <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
        </Route>
    </Routes>
    </BrowserRouter>
  )
};
