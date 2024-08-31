import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Container } from 'react-bootstrap';

function CarList() {
    const [cars, setCars] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/cars')
            .then(response => response.json())
            .then(data => setCars(data));
    }, []);

    const handleAddCar = () => {
        navigate('/cars/new');
    };

    const handleEditCar = (id) => {
        navigate(`/cars/${id}/edit`);
    };

    const handleDeleteCar = (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот автомобиль?')) {
            fetch(`/api/cars/${id}`, { method: 'DELETE' })
                .then(() => setCars(cars.filter(car => car.id !== id)));
        }
    };

    return (
        <Container className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Управление автомобилями</h2>
                <Button variant="primary" onClick={handleAddCar}>
                    Добавить автомобиль
                </Button>
            </div>
            <Table striped bordered hover responsive>
                <thead>
                <tr>
                    <th>Марка</th>
                    <th>Модель</th>
                    <th>Номер</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {cars.map(car => (
                    <tr key={car.id}>
                        <td>{car.brand}</td>
                        <td>{car.model}</td>
                        <td>{car.number}</td>
                        <td>
                            <Button
                                variant="warning"
                                size="sm"
                                onClick={() => handleEditCar(car.id)}
                                className="me-2"
                            >
                                Редактировать
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteCar(car.id)}
                            >
                                Удалить
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default CarList;
