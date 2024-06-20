import { useEffect } from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/user/UserLogin.tsx";
import UserCreate from "./components/admin/CreateUser.tsx";
import ForgotPassword from "./components/user/UserForgotPassword.tsx";
import NavBar from "./components/generic/NavBar.tsx";
import Home from "./components/user/UserHome.tsx";
import UserSetting from "./components/user/UserSetting.tsx";
import ProtectedRoute from "./components/generic/ProtectedRoute.tsx";
import Admin from "./components/admin/Admin.tsx";
import ChangePassword from "./components/user/UserChangePassword.tsx";
import CreateHospital from "./components/admin/CreateHospital.tsx";
import UserProfile from "./components/user/UserProfile.tsx";
import ManageHospitals from "./components/admin/ManageHospitals.tsx";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Checking if access token exists in local storage
    // If access token exists, do nothing (user is already logged in)
    const Token = localStorage.getItem("accessToken");
    if (!Token) {
      navigate("/login");
    }
  }, []);

  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
      }}
      templateColumns={{
        base: "1fr",
      }}
      height="100vh"
    >
      <GridItem area="nav">
        <NavBar />
      </GridItem>
      <GridItem area="main">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/settings" element={<UserSetting />} />
          <Route path="/user-profile" element={<UserProfile />} />

          //only admin paths 
          <Route path="/admin" element={<Admin />} />
          <Route path="/create-user" element={<UserCreate />} />
          <Route path="/create-hospital" element={<CreateHospital />} />
          <Route path="/manage-hospital" element={<ManageHospitals />} />
          
          //protected route 
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </GridItem>
    </Grid>
  );
}

export default App;
