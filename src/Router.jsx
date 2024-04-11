import React, {useRef} from "react"
import { Routes, Route, Link } from "react-router-dom";
import {SnackbarProvider} from "notistack"
import { Auth } from "./pages/auth/Auth";
import { Layout } from "./components/layout/Layout";

import { Signin } from "./pages/auth/Signin";
import { Signup } from "./pages/auth/Signup";

import { Home } from "./pages/home/Home"
import { Chat } from "./pages/chat/Chat"
import { Profile } from "./pages/profile/Profile"


export const Router = () => {
  const notistackRef = useRef();
  return (
    <SnackbarProvider maxSnack={3} ref={notistackRef}
  action={(key) => ( <button onClick={() => notistackRef.current.closeSnackbar(key)} style={styleNoti} >✖</button>)}>
    <Routes>
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<Auth />}>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat/:id" element={<Chat />} />
        </Route>
      </Route>
      <Route path='*' element={<NotFound/>}/>
    </Routes>
    </SnackbarProvider>
  );
};

const NotFound = () => {
  return (
    <div>
    <h1>404</h1>
    <Link to="/">Go Home</Link>
    </div>
  )
}

const styleNoti = { color: '#fff', fontSize: '20px', background: "transparent", border: "none" }