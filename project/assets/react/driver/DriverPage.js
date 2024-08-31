import React from 'react';
import Menu from '../Menu';
import DriverList from './DriverList';
import { Container } from 'react-bootstrap';

function DriverPage() {
    return (
        <Container className="mt-5">
            <Menu />
            <DriverList />
        </Container>
    );
}

export default DriverPage;
