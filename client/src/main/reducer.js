import {createSlice} from "@reduxjs/toolkit";

export default  createSlice({
    name: 'app',
    initialState: {
        token: null
    },
    reducers: {
        setToken: (state, value) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            console.log(value);
            state.token = value
        },
    }
})
