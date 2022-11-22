import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MyNav from './components/common/MyNav';
import Home from './components/Home';
import Loading from './components/common/Loading';
import Reservation from './components/Reservation';
import Search from './components/Search';
import Notice from './components/Notice';
import ParkingHist from './components/ParkingHist';


function App() {

  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className="d-flex flex-column h-100">
        <div className="flex-shrink-0">
          <Routes>
            <Route exact path="/" element={<MyNav></MyNav>}/>
            <Route path="/reservation" element={<MyNav></MyNav>}/>
            <Route path="/search" element={<MyNav></MyNav>}/>
            <Route path="/notice" element={<MyNav></MyNav>}/>
          </Routes>  
          <Routes>
            <Route exact path="/" element={<Home></Home>}/>
            <Route path="/reservation" element={<Reservation></Reservation>}/>
            <Route path="/search" element={<Search></Search>}/>
            <Route path="/notice" element={<Notice></Notice>}/>
            <Route path="/ParkingHist" element={<ParkingHist setLoading={setLoading}></ParkingHist>}/>
          </Routes>
          <div>
            {loading ? <Loading /> : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
