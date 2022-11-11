import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

const MyNav = () => {
    const [expanded, setExpanded] = useState(false);
    return (
      <Navbar collapseOnSelect bg="light" expand="lg" style={{zIndex:"999", width: "100vw", position: "fixed"}} expanded={expanded}> 
        <Container>
          {/* <Navbar.Brand as={Link} to="/" bsPrefix=""><a className="navbar-brand" href="/"><img className="logo" alt="" style={{width : "150px",height : "100%"}}/><b> 방문</b></a></Navbar.Brand> */}
          <Navbar.Brand as={Link} to="/" bsPrefix="logo"></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)}/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" style={{fontWeight:"bolder"}}>
              <Nav.Link as={Link} to="/reservation" onClick={() => setExpanded(false)}>방문신청</Nav.Link>
              <Nav.Link as={Link} to="/search" onClick={() => setExpanded(false)}>신청현황</Nav.Link>
              <Nav.Link href="http://172.16.4.2:8080/vrsAccessList" onClick={() => setExpanded(false)}>신청승인</Nav.Link>
              <Nav.Link as={Link} to="/notice" onClick={() => setExpanded(false)}>공지사항</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
}

export default MyNav;