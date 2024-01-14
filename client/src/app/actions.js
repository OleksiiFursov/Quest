import appState from "@/app/reducer.js";
import {map} from "@/helpers.js";
import {store} from "@/main.jsx";

export const {actions} = appState

export const setCurrentUser = data => store.dispatch(actions.setCurrentUser(map(data, value => value instanceof Date && isNaN(value) ? null : value )))