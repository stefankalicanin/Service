import React from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import NavDropdown from 'react-bootstrap/NavDropdown';

import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import { TokenService } from "../services/TokenService";
import { AuthenticationService } from "../services/AuthenticationService";

const NavBar = () => {

  const role = AuthenticationService.getRole();

  return (
    <Navbar bg="dark" variant="dark">
       
      {role === 'ADMIN' && <Navbar.Brand as={Link} to="/admin/home">
      Početna
      </Navbar.Brand>} 
      {role === 'USER' && <Navbar.Brand href="/user/home">
      Početna
      </Navbar.Brand>}
      {role === 'REPAIR_DIAGNOSTIC' && <Navbar.Brand href="/repairerd/home">
      Početna
      </Navbar.Brand>}
      {role === 'REPAIR_TROUBLESHOOTING' && <Navbar.Brand href="/repairert/home">
      Početna
      </Navbar.Brand>}
      {role === null && <Navbar.Brand href="/">
      Početna
      </Navbar.Brand>}
    
     <Nav className = 'me-auto'>
      
      {TokenService.getToken() ? (
        
        <Button className="btn-danger" onClick={() => AuthenticationService.logout()}>Log out</Button>
      ) : (
        <Nav.Link href="/login">
         Prijava
        </Nav.Link>
      )}
      {role === 'ADMIN' && <Nav.Link href="/admin/register">
          Registracija servisera
        </Nav.Link>}
        {role === 'ADMIN' && <Nav.Link href="/admin/create/category">
          Kreiranje kategorije
        </Nav.Link>}
        {role === 'ADMIN' && <Nav.Link href="/admin/create/device">
          Kreiranje uredjaja
        </Nav.Link>}
        {role === 'ADMIN' && <Nav.Link href="/admin/users/profiles">
          Prikaz profila korisnika
        </Nav.Link>}
        {role === 'ADMIN' && <Nav.Link href="/admin/travelwarrant">
          Putni nalozi
          </Nav.Link>}
      {!TokenService.getToken() && <Nav.Link href="/user/register">
          Registracija
      </Nav.Link> }
      {role === 'USER' && <NavDropdown title="Requests" id="nav-dropdown">
        <NavDropdown.Item eventKey="4.1" href="/user/diagnostic_requests/done">Zahtevi za dijagnostiku - završeni</NavDropdown.Item>
        <NavDropdown.Item eventKey="4.2" href="/user/diagnostic_requests/wait">Zahtevi za dijagnostiku - na čekanju</NavDropdown.Item>
        <NavDropdown.Item eventKey="4.3" href="/user/troubleshooting_requests/done">Zahtevi za popravku - završeni</NavDropdown.Item>
        <NavDropdown.Item eventKey="4.3" href="/user/troubleshooting_requests/wait">Zahtevi za popravku - na čekanju</NavDropdown.Item>
        <NavDropdown.Divider />
      </NavDropdown>}
      {role === 'USER' && <Nav.Link href="/user/repairer/profiles">
        Prikaz profila servisera
        </Nav.Link>} 
     </Nav> 
    
     
    </Navbar>
  );
};

export default NavBar;