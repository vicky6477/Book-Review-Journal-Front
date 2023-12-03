import React from 'react';
import './App.css';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import store from "./reducers/store.js";
import { Provider } from "react-redux";
import Breadcrumb from './components/breadcrumb.jsx';
import Navbar from './components/universal/navbar.jsx';
import Homepage from './pages/homepage.jsx';
import Profile from './components/profile/profile.jsx';
import Signup from './components/auth/signup.jsx';
import Signin from './components/auth/signin.jsx';
import BookDetail from './pages/bookDetailPage.jsx';
import SearchPage from './pages/searchPage.jsx';

function App() {
    return (
        <Provider store={store}>
            <div className="w-full h-[100vh] items-center font-serif">
                <BrowserRouter>
                    <Navbar /> {/* Navbar is outside the Routes */}
                    <Breadcrumb />
                    <div className='mt-[60px] h-full'>
                        <Routes>
                            <Route path='/' element={<Homepage />} />
                            <Route path='/profile/*' element={<Profile />} />
                            <Route path='/signup' element={<Signup />} />
                            <Route path='/signin' element={<Signin />} />
                            <Route path='/book/:olid' element={<BookDetail />} />
                            <Route path='/search' element={<SearchPage />} />
                        </Routes>
                    </div>
                </BrowserRouter>
            </div>
        </Provider>
    );
}

export default App;
