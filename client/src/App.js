import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MyNav from './components/common/MyNav';
import Home from './components/Home';
import Reservation from './components/Reservation';
import Search from './components/Search';
import Notice from './components/Notice';

function App() {
  return (
    <>
      <div className="d-flex flex-column h-100">
        <div className="flex-shrink-0">
          <MyNav></MyNav>
          <Routes>
            <Route exact path="/" element={<Home></Home>}/>
            <Route path="/reservation" element={<Reservation></Reservation>}/>
            <Route path="/search" element={<Search></Search>}/>
            <Route path="/notice" element={<Notice></Notice>}/>
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
