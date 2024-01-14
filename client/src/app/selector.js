import {createSelector} from "@reduxjs/toolkit";

const select = (state) => state.app
export const selectNotification = createSelector(select, state => state.notifications)
export const selectCurrentUser = createSelector(select, state => state.currentUser)