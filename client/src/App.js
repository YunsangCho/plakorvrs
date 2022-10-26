import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MyNav from './components/common/MyNav';
import Home from './components/Home';
import Reservation from './components/Reservation';
import Search from './components/Search';
import SearchResult from './components/SearchResult';
//import AppLink from './components/AppLink';
import Notice from './components/Notice';

function App() {
  return (
    <>
    <Routes >
    {/* <Route path="/test" element={<AppLink></AppLink>}/> */}
    </Routes>
      <div className="d-flex flex-column h-100">
        <div className="flex-shrink-0">
          <MyNav></MyNav>
          <Routes>
            <Route exact path="/" element={<Home></Home>}/>
            <Route path="/reservation" element={<Reservation></Reservation>}/>
            <Route path="/search" element={<Search></Search>}/>
            <Route path="/searchResult" element={<SearchResult></SearchResult>}/>
            <Route path="/notice" element={<Notice></Notice>}/>
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
