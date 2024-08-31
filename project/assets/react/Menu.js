import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

function Menu() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={Link} active={isActive('/')} to="/">Главная</Nav.Link>
                    <Nav.Link as={Link} active={isActive('/cars')} to="/cars">Автомобили</Nav.Link>
                    <Nav.Link as={Link} active={isActive('/drivers')} to="/drivers">Водители</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Menu;
