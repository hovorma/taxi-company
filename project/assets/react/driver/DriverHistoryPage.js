import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Container, Button } from 'react-bootstrap';

function DriverHistoryPage() {
    const { id } = useParams();
    const [history, setHistory] = useState([]);
    const [driverName, setDriverName] = useState('');

    useEffect(() => {
        fetch(`/api/drivers/${id}/history`)
            .then(response => response.json())
            .then(data => {
                setDriverName(data.driverName);
                setHistory(data.history);
            })
            .catch(error => console.error('Ошибка при получении истории водителя:', error));
    }, [id]);

    return (
        <Container className="mt-5">
            <Button variant="secondary" href={`/drivers`} className="mb-4">
                Назад к списку водителей
            </Button>
            <h2>История автомобилей для водителя: {driverName}</h2>
            <Table striped bordered hover responsive className="mt-3">
                <thead>
                <tr>
                    <th>Автомобиль</th>
                    <th>Дата начала</th>
                    <th>Дата окончания</th>
                </tr>
                </thead>
                <tbody>
                {history.map((entry, index) => (
                    <tr key={index}>
                        <td>{entry.carBrand} {entry.carModel}</td>
                        <td>{new Date(entry.createdAt).toLocaleDateString()}</td>
                        <td>{new Date(entry.updatedAt).toLocaleDateString()}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default DriverHistoryPage;
