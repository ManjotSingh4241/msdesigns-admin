import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './App.css';
import Signup from "./pages/signup"
import Landing from "./pages/landing"
import AccountRequests from "./pages/accountRequests"
import ManageProducts from "./pages/manageProducts"
import DeleteAccounts from "./pages/deleteAccounts"
import CreateUser from "./pages/createUser"

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/Landing" element={<Landing />} />
          <Route path="/AccountRequests" element={<AccountRequests />} />
          <Route path="/ManageProducts" element={<ManageProducts/>}/>
          <Route path="/DeleteAccounts" element={<DeleteAccounts/>}/>
          <Route path="/CreateUser" element={<CreateUser/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
