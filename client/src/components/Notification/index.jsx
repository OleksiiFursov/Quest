import appState from "../../app/reducer.js";
import {store} from "../../main.jsx";
import './notification.scss';

const {setNotification} = appState.actions;

let id = 0;

const notification = {
    base(type, message, title=null, options = {}) {
        store.dispatch(setNotification({
            id,
            type,
            message,
            title,
            ...options
        }));
        id++;
    },
    error(message, title=null, delayClose = false) {
        return this.base('error', message, title, {delayClose})
    },
    success(message, title=null) {
        return this.base('success', message, title)
    }
}

export default notification
