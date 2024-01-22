import {render} from 'preact'
import "preact/debug";
import config from '../config.js'
import './assets/scss/main.scss';
import {configureStore} from '@reduxjs/toolkit'
import reducerMain from "./app/reducer.js";
import {Provider} from 'react-redux';
import WSSConnect from './core/WSS'
import Init from './init.jsx'

export const store = configureStore({
    reducer: {
        app: reducerMain.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});


export const WSS = new WSSConnect({
    host: config.wss.host,
    onError: console.log
});
window.WSS = WSS;


render(
    <Provider store={store}>
        <Init />
    </Provider>,
    document.getElementById('app')
)
