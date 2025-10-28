import React from 'react'
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Header from './components/header/Header.jsx';
import Login from './pages/auth/Login.jsx';
import Verify from './pages/auth/Verify.jsx';
import Register from './pages/auth/Register.jsx';
import Footer from './components/footer/Footer.jsx';
import About from './pages/about/About.jsx';
import Account from './pages/account/Account.jsx';
import { UserData } from './context/UserContext.jsx';
import Loading from './components/loading/Loading.jsx';
import Courses from './pages/courses/Courses.jsx';
import CourseDescription from './pages/coursedescription/CourseDescription';
import PaymentSuccess from './pages/paymentsuccess/PaymentSuccess.jsx';
import DashBord from './pages/dashbord/DashBord.jsx';
import CourseStudy from './pages/coursestudy/CourseStudy.jsx';
import Lecture from './pages/lecture/Lecture.jsx';
import AdminDashboard from './admin/Dashboard/AdminDashboard.jsx';
import AdminCourses from './admin/Courses/AdminCourses.jsx';
import AdminUsers from './admin/Users/AdminUsers.jsx';
import PaymentDetails from './admin/Payments/PaymentDetails.jsx';



const App = () => {
  const { isAuth, user, loading } = UserData()
  return (
    <>
      {loading?(
      <Loading/>
      ):(
        <BrowserRouter>
       <Header isAuth={isAuth}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/account" element={isAuth?<Account user={user}/>:<Login/> } />
          <Route path="/register" element={isAuth?<Home/>:<Register />}/>
          <Route path="/login" element={isAuth?<Home/>:<Login />}/>
          <Route path="/verify" element={isAuth?<Home/>:<Verify />}/>
          <Route path="/course/:id" element={isAuth?<CourseDescription user={user}/>:<Login/>}/>
          <Route path="/payment-success/:id" element={isAuth?<PaymentSuccess 
          user={user} /> : <Login/>} />
          <Route path="/:id/dashbord" element={isAuth?<DashBord 
          user={user} /> : <Login/>} />
          <Route path="/course/study/:id" element={isAuth?<CourseStudy 
          user={user} /> : <Login/>} />
          <Route path="/lectures/:id" element={isAuth?<Lecture 
          user={user} /> : <Login/>} />
          <Route path="/admin/dashboard" element={isAuth ? <AdminDashboard user={user}/>:<Login/>} />
          <Route path="/admin/course" element={isAuth ? <AdminCourses user={user}/>:<Login/>} />
          <Route path="/admin/users" element={isAuth ? <AdminUsers user={user}/>:<Login/>} />
          <Route path="/admin/payments" element={isAuth ? <PaymentDetails user={user}/>:<Login/>} />
         

        </Routes>
        <Footer/>
      </BrowserRouter>
      )};
    </>
  )
};

export default App