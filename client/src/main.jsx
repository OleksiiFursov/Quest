import {render} from 'preact'
import "preact/debug";
import config from '../config.js'
import './assets/scss/main.scss';
import {configureStore} from '@reduxjs/toolkit'
import createRouter from "./core/Router/index.jsx";
import reducerMain from "./app/reducer.js";
import {Provider} from 'react-redux';
import WSSConnect from './core/WSS'
import LoginLayout from "./layouts/login/index.jsx";
import routes from "./app/router.js";
import NotificationList from "./app/NotificationList.js";

export const store = configureStore({
    reducer: {
        app: reducerMain.reducer
    }
});


export const WSS = new WSSConnect({host: config.wss.host});
window.WSS = WSS;

const Router = createRouter(routes);

const layouts = {
    'login': LoginLayout
}

render(
    <Provider store={store}>
        <NotificationList />
        <Router layouts={layouts}/>
    </Provider>,
    document.getElementById('app')
)
