import {App} from "../app.jsx";
import AccountLoginPage from "../page/Account/login/index.jsx";
import AccountCreatePage from "../page/Account/create/index.jsx";
import MainPage from "../page/Main/index.js";

const routes = {
    '': App,
    'account/login': [AccountLoginPage, {layout: 'login'}],
    'account/create': [AccountCreatePage, {layout: 'login'}],
    'main': MainPage
}

export default routes;
