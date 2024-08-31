import React from 'react';
import Menu from './Menu';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function HomePage() {
    return (
        <div className="container mt-5">
            <Menu />
            <div className="jumbotron text-center rounded">
                <h1 className="display-4">Добро пожаловать в Панель управления</h1>
                <p className="lead">Это центральный узел для управления автомобилями и водителями в вашей системе.</p>
                <hr className="my-4"/>
                <p>Используйте навигацию выше, чтобы начать работу.</p>
            </div>
        </div>
    );
}

export default HomePage;
