import "./App.css";

import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./component/Header";
import Contact from "./component/Contact";
import Home from "./component/Home";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/contact" element={<Contact />} /> {/* Use element prop */}
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
