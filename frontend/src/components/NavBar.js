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
        Home
      </Navbar.Brand>} 
      {role === 'USER' && <Navbar.Brand href="/user/home">
        Home
      </Navbar.Brand>}
      {role === 'REPAIR_DIAGNOSTIC' && <Navbar.Brand href="/repairerd/home">
        Home
      </Navbar.Brand>}
      {role === 'REPAIR_TROUBLESHOOTING' && <Navbar.Brand href="/repairert/home">
        Home
      </Navbar.Brand>}
      {role === null && <Navbar.Brand href="/">
        Home
      </Navbar.Brand>}
    
     <Nav className = 'me-auto'>
      
      {TokenService.getToken() ? (
        
        <Button className="btn-danger" onClick={() => AuthenticationService.logout()}>Log out</Button>
      ) : (
        <Nav.Link href="/login">
          Sign up
        </Nav.Link>
      )}
      {role === 'ADMIN' && <Nav.Link href="/admin/register">
          Create a new repairer account
        </Nav.Link>}
        {role === 'ADMIN' && <Nav.Link href="/admin/create/category">
          Create category
        </Nav.Link>}
        {role === 'ADMIN' && <Nav.Link href="/admin/create/device">
          Create device
        </Nav.Link>}
        {role === 'ADMIN' && <Nav.Link href="/admin/users/profiles">
          Show users profiles
        </Nav.Link>}
      {!TokenService.getToken() && <Nav.Link href="/user/register">
          Create a new account
      </Nav.Link> }
      {role === 'USER' && <NavDropdown title="Requests" id="nav-dropdown">
        <NavDropdown.Item eventKey="4.1" href="/user/diagnostic_requests/done">Done diagnostic requests</NavDropdown.Item>
        <NavDropdown.Item eventKey="4.2" href="/user/diagnostic_requests/wait">Wait diagnostic requests</NavDropdown.Item>
        <NavDropdown.Item eventKey="4.3" href="/user/troubleshooting_requests/done">Done troubleshooting requests</NavDropdown.Item>
        <NavDropdown.Item eventKey="4.3" href="/user/troubleshooting_requests/wait">Wait troubleshooting requests</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item eventKey="4.4">Separated link</NavDropdown.Item>
      </NavDropdown>} 
     </Nav> 
    
     
    </Navbar>
  );
};

export default NavBar;