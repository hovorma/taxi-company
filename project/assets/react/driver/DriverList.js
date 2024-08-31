import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Container } from 'react-bootstrap';

function DriverList() {
    const [drivers, setDrivers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/drivers')
            .then(response => response.json())
            .then(data => setDrivers(data));
    }, []);

    const handleAddDriver = () => {
        navigate('/drivers/new');
    };

    const handleEditDriver = (id) => {
        navigate(`/drivers/${id}/edit`);
    };

    const handleDriverHistory = (id) => {
        navigate(`/drivers/${id}/history`);
    };

    const handleDeleteDriver = (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этого водителя?')) {
            fetch(`/api/drivers/${id}`, { method: 'DELETE' })
                .then(() => setDrivers(drivers.filter(driver => driver.id !== id)));
        }
    };

    return (
        <Container className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Управление водителями</h2>
                <Button variant="primary" onClick={handleAddDriver}>
                    Добавить водителя
                </Button>
            </div>
            <Table striped bordered hover responsive>
                <thead>
                <tr>
                    <th>Имя</th>
                    <th>Дата рождения</th>
                    <th>Машина</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {drivers.map(driver => (
                    <tr key={driver.id}>
                        <td>{driver.name}</td>
                        <td>{new Date(driver.birthday).toLocaleDateString()}</td>
                        <td>{driver.car.brand} {driver.car.model} ({driver.car.number})</td>
                        <td>
                            <Button
                                variant="warning"
                                size="sm"
                                onClick={() => handleEditDriver(driver.id)}
                                className="me-2"
                            >
                                Редактировать
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteDriver(driver.id)}
                                className="me-2"
                            >
                                Удалить
                            </Button>
                            <Button
                                variant="info"
                                size="sm"
                                onClick={() => handleDriverHistory(driver.id)}
                            >
                                История
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default DriverList;
