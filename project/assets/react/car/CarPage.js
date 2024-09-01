import React from 'react';
import Menu from '../Menu';
import CarList from './CarList';
import { Container } from 'react-bootstrap';

function CarPage() {

    return (
        <Container className="mt-5">
            <Menu />
            <CarList />
        </Container>
    );
}

export default CarPage;
