import config from '../config.js'
import {render} from 'preact'
import {App} from './app.jsx'
import './assets/scss/main.scss';
import {configureStore} from '@reduxjs/toolkit'
import createRouter from "./core/Router/index.jsx";
import reducerMain from "./main/reducer.js";
import {Provider} from 'react-redux';
import AccountLoginPage from "./page/Account/index.jsx";
import WSSConnect from './core/WSS'
import LoginLayout from "./layouts/login/index.jsx";
const store = configureStore({
    reducer: {
        main: reducerMain.reducer
    }
})


// Still pass action objects to `dispatch`, but they're created for us
// store.dispatch(incremented())
// // {value: 1}
// store.dispatch(incremented())
// // {value: 2}
// store.dispatch(decremented())

export const WSS = new WSSConnect({host: config.wss.host});
window.WSS = WSS;

const Router = createRouter({
    '': App,
    'account/login': [AccountLoginPage, {layout: 'login'}]
});

const layouts = {
    'login': LoginLayout
}
render(
    <Provider store={store}>
        <Router layouts={layouts}/>
    </Provider>,
    document.getElementById('app'))
