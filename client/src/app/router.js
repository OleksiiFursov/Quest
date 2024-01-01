import {App} from "../app.jsx";
import AccountLoginPage from "../page/Account/index.jsx";
import MainPage from "../page/Main/index.js";

const routes = {
    '': App,
    'account/login': [AccountLoginPage, {layout: 'login'}],
    'main': MainPage
}

export default routes;