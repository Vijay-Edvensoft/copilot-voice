import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice"
import dbConfigReducer from "../slice/dbSlice"
import chatReducer from "../slice/chatSlice"
import dashboardReducer from "../slice/dashboardSlice"
import settingsReducer from "../slice/chatBotSettingsSlice";


// console.log(import.meta.env.VITE_API_URL)
const rootReducer = combineReducers({
    auth: authReducer,
    dbConfig: dbConfigReducer,
    chat: chatReducer,
    dashboard: dashboardReducer,
    chatBotSettings: settingsReducer
})

export const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== "production"
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch