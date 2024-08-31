import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {Button, Form, Container, Alert} from 'react-bootstrap';

function CarFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [number, setNumber] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetch(`/api/cars/${id}`)
                .then(response => response.json())
                .then(data => {
                    setNumber(data.number);
                    setBrand(data.brand);
                    setModel(data.model);
                });
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/cars/${id}/edit` : '/api/cars/new';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ number, brand, model }),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.error);
                    });
                }
                return response.json();
            })
            .then(() => navigate('/cars'))
            .catch(error => {
                setError(error.message);
            });
    };

    const handleBack = () => {
        navigate('/cars');
    };

    return (
        <Container className="mt-5">
            <Button variant="secondary" onClick={handleBack} className="mb-3">
                Назад к списку автомобилей
            </Button>
            <h2>{id ? 'Редактировать автомобиль' : 'Добавить автомобиль'}</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBrand">
                    <Form.Label>Марка</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите марку"
                        value={brand}
                        onChange={e => setBrand(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formModel">
                    <Form.Label>Модель</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите модель"
                        value={model}
                        onChange={e => setModel(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formNumber">
                    <Form.Label>Номер</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите номер"
                        value={number}
                        onChange={e => setNumber(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    {id ? 'Сохранить изменения' : 'Добавить автомобиль'}
                </Button>
            </Form>
        </Container>
    );
}

export default CarFormPage;
