import config from '../config.js'
import {render} from 'preact'
import {App} from './app.jsx'

import {configureStore} from '@reduxjs/toolkit'
import createRouter from "./core/Router/index.jsx";
import reducerMain from "./main/reducer.js";
import {Provider} from 'react-redux';
import AccountLoginPage from "./page/Account/index.jsx";
import WSS from './core/WSS'
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

window.WSS = new WSS({host: config.wss.host});

const Router = createRouter({
    '': App,
    'account/login': AccountLoginPage
});

render(
    <Provider store={store}>
        <Router/>
    </Provider>,
    document.getElementById('app'))
