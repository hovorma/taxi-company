import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Container, Alert } from 'react-bootstrap';

function DriverFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [carId, setCarId] = useState('');
    const [cars, setCars] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/cars')
            .then(response => response.json())
            .then(data => setCars(data.cars));

        if (id) {
            fetch(`/api/drivers/${id}`)
                .then(response => response.json())
                .then(data => {
                    setName(data.name);
                    setBirthday(new Date(data.birthday).toISOString().split('T')[0]);
                    setCarId(data.car.id);
                });
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/drivers/${id}/edit` : `/api/drivers/new`;

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, birthday, car: carId }),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.error);
                    });
                }
                return response.json();
            })
            .then(() => navigate('/drivers'))
            .catch(error => {
                setError(error.message);
            });
    };

    const handleBack = () => {
        navigate('/drivers');
    };

    return (
        <Container className="mt-5">
            <Button variant="secondary" onClick={handleBack} className="mb-3">
                Назад к списку водителей
            </Button>
            <h2>{id ? 'Редактировать водителя' : 'Добавить водителя'}</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Имя</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите имя"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBirthday">
                    <Form.Label>Дата рождения</Form.Label>
                    <Form.Control
                        type="date"
                        value={birthday}
                        onChange={e => setBirthday(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCar">
                    <Form.Label>Машина</Form.Label>
                    <Form.Control
                        as="select"
                        value={carId}
                        onChange={e => setCarId(e.target.value)}
                        required
                    >
                        <option value="">Выберите машину</option>
                        {cars.map(car => (
                            <option key={car.id} value={car.id}>
                                {car.brand} {car.model}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Button variant="primary" type="submit">
                    {id ? 'Сохранить изменения' : 'Добавить водителя'}
                </Button>
            </Form>
        </Container>
    );
}

export default DriverFormPage;
