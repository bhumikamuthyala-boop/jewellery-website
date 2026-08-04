import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';

export default function Layout(props) {
    return (
        <div className="app-root">
            <Header {...props} />
            <main>
                <Outlet />
            </main>
        </div>
    );
}
