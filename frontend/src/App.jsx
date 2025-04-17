import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css"
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Editior from './pages/Editior';
import GodChatbot from './pages/GodChatbot';
import AdminPage from './pages/AdminPage'; // Create an AdminPage component
import PublicProjectsPage from "./pages/PublicProjects";
import PostsPage from "./pages/issuepage";

const App = () => {
  // Existing check for logged in status
  let isLoggedIn = localStorage.getItem("isLoggedIn");
  // Retrieve the logged-in user's email (make sure you store this when the user logs in)
  let userId = localStorage.getItem("userId");

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={isLoggedIn ? <Home /> : <Navigate to="/login"/>} />
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/editior/:projectID' element={isLoggedIn ? <Editior /> : <Navigate to="/login"/>} />
        <Route path='/projects' element={<PublicProjectsPage />} />
        {/* <Route path="/issue" element={<Issue/>}/> */}
        
        <Route path='/issue' element={<PostsPage />}/>
        {/* Admin route protected by verifying the email */}
        <Route 
          path='/admin' 
          element={(isLoggedIn && userId === "67ff74e8960504808e45eb0e") 
            ? <AdminPage /> 
            : <Navigate to="/login" />} 
        />

        <Route path='/GodChatbot' element={<GodChatbot/>}/>
        <Route path="*" element={isLoggedIn ? <NoPage /> : <Navigate to="/login"/>} />
      </Routes>
      
    </BrowserRouter>
  )
}

export default App;
