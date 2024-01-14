import {createSelector} from "@reduxjs/toolkit";
import {useSelector} from "react-redux";

const select = (state) => state.app
const selectNotification = createSelector(select, state => state.currentUser)

function mainPage(){
    const currentUser = useSelector(selectNotification);
    console.log(currentUser);
    return currentUser.username;

}

export default mainPage;