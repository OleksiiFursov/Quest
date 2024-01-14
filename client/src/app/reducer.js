import { createSlice } from '@reduxjs/toolkit'

const appState = createSlice({
    name: 'app',
    initialState: {
        token: null,
        currentUser: {},
        notifications: [],
    },
    reducers: {
        setToken: (state, value) => {
            state.token = value
        },
        setCurrentUser: (state, { payload }) => {
            state.currentUser = payload
        },
        setNotification: (state, { payload }) => {
            state.notifications.push(payload)
        },
        removeNotification: (state, { payload }) => {
            const findIndex = state.notifications.findIndex(v => typeof payload === 'number' ? v.id === payload: v.slug === payload);
            state.notifications.splice(findIndex, 1)
        },
    },
})



export default appState
