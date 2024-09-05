import './App.css';
import { Route, Router, Routes } from "react-router-dom";
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import ClassDetails from './Pages/ClassDetails';
import StudentProfile from './Pages/StudentProfile';
import TeacherProfile from './Pages/TeacheProfile';
import ClassAnalytics from './Pages/ClassAnalytics';


function App() {
  return (
    <>
    <Navbar />
    <Routes>
    <Route path="/signup" exact element={<Signup />} />
    <Route path="/login" exact element={<Login />} />
    <Route path="/" exact element={<Home />} />
    <Route path="/class/:id" exact element={<ClassDetails />} />
    <Route path="/classanalytics/:id" exact element={<ClassAnalytics />} />
    <Route path="/student/:id" exact element={<StudentProfile />} />
    <Route path="/teacher/:id" exact element={<TeacherProfile />} />
    </Routes>
    </>
  );
}

export default App;
