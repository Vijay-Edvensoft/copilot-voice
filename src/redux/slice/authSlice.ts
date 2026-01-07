import { api } from "@/config/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";
import type { FormType } from "@/pages/Onboarding/AuthVerification";




/* ------------------------------------------------------------------
 * ✅ Type Definitions
 * ------------------------------------------------------------------ */

// Type representing the structure of user Authentication
export interface UserType {
    user_id?: number;
    username?: string;
    email?: string;
    message?: string
}

// Redux slice state type for User Authentication
type InitialState = {
    status: "loading" | "success" | "failed" | "idle";
    user: UserType;
    message?: string

}

/* ------------------------------------------------------------------
 * ✅ CreateAsyncThunks for API (Axios CRUD Operations)
 * ------------------------------------------------------------------ */


export const registerUser = createAsyncThunk<UserType, FormType, { rejectValue: string }>("dbConfig/registerUser", async (user, thunkApi) => {
    try {

        const response = await api.post("/api/register/", user);
        if (response.status === 201) {

            return response.data;
        }
        else {
            return thunkApi.rejectWithValue("unexpected error")
        }

    } catch (error: any) {
        

        return thunkApi.rejectWithValue(error.message);
    }
})


/* ------------------------------------------------------------------
 * ✅ Default Values
 * ------------------------------------------------------------------ */

const storedUser = localStorage.getItem("user")

// Initial state for the auth slice
const initialState: InitialState = {
    status: "idle",
    user: storedUser ? JSON.parse(storedUser) : {
        user_id: 0,
        username: "",
        email: "",
        message: ""
    },
    message: ""

}




/* ------------------------------------------------------------------
 * ✅ Redux Slice: AuthState
 * ------------------------------------------------------------------ */

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Reset the entire User state to its initial value
        resetAuthState: () => initialState,
        // Reset only the status field to "idle" (used after API calls)
        resetAuthStatus: (state) => {
            state.status = "idle"
        }
    }, extraReducers(builder) {
        builder.addCase(registerUser.pending, (state) => {
            state.status = "loading"
            state.message = ""
        })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = "success"
                state.user = action.payload
                state.message = action.payload.message


            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = "failed"
                state.message = action?.payload
            })
    }
})


/* ------------------------------------------------------------------
 * ✅ Exports
 * ------------------------------------------------------------------ */

export default authSlice.reducer; // Export reducer to be added in configureStore
export const { resetAuthState, resetAuthStatus } = authSlice.actions // Export actions for components/thunks to dispatch
export const authState = (state: RootState) => state.auth