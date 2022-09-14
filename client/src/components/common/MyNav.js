import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Footer = () => {
    const [expanded, setExpanded] = useState(false);
    return (
      <Navbar bg="light" expand="lg" style={{zIndex:"999", width: "100vw", position: "fixed"}} onSelect expanded={expanded}>
        <Container>
          <Navbar.Brand as={Link} to="/"><a className="navbar-brand" href="/"><img src={process.env.PUBLIC_URL + '/resources/images/logo.png'} alt="" style={{width : "150px",height : "100%"}}/><b> 방문</b></a></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)}/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" style={{fontWeight:"bolder"}}>
              <Nav.Link as={Link} to="/reservation" onClick={() => setExpanded(false)}>방문신청</Nav.Link>
              <Nav.Link as={Link} to="/search" onClick={() => setExpanded(false)}>신청현황</Nav.Link>
              <Nav.Link href="http://172.16.4.2:8080/vrsAccessList" onClick={() => setExpanded(false)}>신청승인</Nav.Link>
              <Nav.Link as={Link} to="#" onClick={() => setExpanded(false)}>공지사항</Nav.Link>
              <Nav.Link as={Link} to="#" onClick={() => setExpanded(false)}>FAQ</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
}

export default Footer;