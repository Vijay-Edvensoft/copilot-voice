import { api, } from "@/config/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";



export interface DashboardType {
    dashboard_id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Chart {
    chart_id: number;
}

export interface InitialState {
    dashboards: DashboardType[];
    activeDashboard: DashboardType | null;
    status: "loading" | "success" | "failed" | "idle";
    message: string;
    charts: any;

}

export interface PromptPayload {
    user_id: number;
    db_connection_id: number;
    query: string;
}



export const getDashboards = createAsyncThunk<DashboardType[], number, { rejectValue: string }>("dashboard/dashboardList", async (userId, thunkApi) => {
    try {
        const response = await api.get(`/api/dashboard/list/${userId}/`);

        if (response.status === 200) {
            const data = response.data.response

            if (data.length > 0) {
                thunkApi.dispatch(getCharts(data[0]?.dashboard_id))
            }

            return data;


        }

    } catch (error: any) {

        return thunkApi.rejectWithValue(error.message);
    }

})



export const getCharts = createAsyncThunk<any, number, { rejectValue: any }>("dashboard/getCharts", async (dashboardId, thunkApi) => {
    try {
        const state = thunkApi.getState() as RootState
        const response = await api.get(`/api/dashboard/${dashboardId}/charts/?user_id=${state.auth.user.user_id}`);

        if (response.status === 200) {

            return response.data.response;
        }

    } catch (error: any) {

        return thunkApi.rejectWithValue(error.message);
    }

})


export const createDashboard = createAsyncThunk<string, any, { rejectValue: any }>("dashboard/createDashboard", async (payload, thunkApi) => {
    try {


        const response = await api.post("/api/dashboard/create/", payload);

        if (response.status === 201) {


            // thunkApi.dispatch(setActiveDashboard(response.data))
            thunkApi.dispatch(getDashboards(payload.user_id));
            return response.data.message;
        } return thunkApi.rejectWithValue("Failed to generate response");
    } catch (error: any) {

        return thunkApi.rejectWithValue(error.message);
    }

})


export const addDashboardAndChart = createAsyncThunk<any, any, { rejectValue: any }>("dashboard/addDashboardAndChart", async (payload, thunkApi) => {
    try {
        const response = await api.post("/api/dashboard/create-with-chart/", payload);
        if (response.status === 201) {
            thunkApi.dispatch(getDashboards(payload.user_id))
            return response.data
        }
    } catch (error: any) {

        return thunkApi.rejectWithValue(error.message);
    }

})
export const addChart = createAsyncThunk<any, any, { rejectValue: any }>("dashboard/addChart", async (payload, thunkApi) => {
    try {

        const response = await api.post("/api/dashboard/add-chart/", payload);
        if (response.status === 201) {

            return response.data
        }
    } catch (error: any) {

        return thunkApi.rejectWithValue(error.message);
    }

})



export const removeChart = createAsyncThunk<string, any, { rejectValue: string }>("dashboard/removeChart", async (payload, thunkApi) => {
    try {
        // const state = thunkApi.getState() as RootState


        const response = await api.delete("/api/dashboard/remove-chart/", { data: payload })
        if (response.status === 200) {
            // console.log("queryIdsq", queryIds)

            thunkApi.dispatch(getCharts(payload.dashboard_id))
            console.log(response.data.message)
            return response.data.message;
        }
        return thunkApi.rejectWithValue("Delete failed");
    } catch (error: any) {

        return thunkApi.rejectWithValue(error.message);
    }

})

export const deleteDashboard = createAsyncThunk<string, any, { rejectValue: string }>("dashboard/deleteDashboard", async (payload, thunkApi) => {
    try {
        // const state = thunkApi.getState() as RootState


        const response = await api.delete("/api/dashboard/delete/", { data: payload })
        if (response.status === 200) {
            // console.log("queryIdsq", queryIds)

            thunkApi.dispatch(getDashboards(payload.user_id))

            return response.data.message;
        }
        return thunkApi.rejectWithValue("Delete failed");
    } catch (error: any) {

        return thunkApi.rejectWithValue(error.message);
    }

})

const initialState: InitialState = {
    dashboards: [],
    status: "idle",
    message: "",
    activeDashboard: null,
    charts: [],

}


const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {

        resetDashboardState: () => initialState,
        resetMessage: (state) => { state.message = "" },
        resetDashboardStatus: (state) => { state.status = "idle" },
        setActiveDashboard: (state, action) => {
            state.activeDashboard = action.payload
        }


    }, extraReducers(builder) {
        builder
            .addCase(getDashboards.pending, (state) => {
                state.status = "loading"
                state.message = ""
            })
            .addCase(getDashboards.fulfilled, (state, action) => {
                state.status = "success";
                state.dashboards = action.payload;
                state.activeDashboard = action.payload[0];
            })
            .addCase(getDashboards.rejected, (state, action) => {
                state.status = "failed"
                state.message = String(action.payload)
            })
            .addCase(createDashboard.pending, (state) => {
                state.status = "loading"
                state.message = ""
            })
            .addCase(createDashboard.fulfilled, (state, action) => {
                state.status = "success"
                state.message = action.payload

            })
            .addCase(createDashboard.rejected, (state, action) => {
                state.status = "failed"
                state.message = action.payload
            })
            .addCase(addDashboardAndChart.pending, (state) => {
                state.status = "loading"
                state.message = ""
            })
            .addCase(addDashboardAndChart.fulfilled, (state, action) => {
                state.status = "success"
                state.message = action.payload.message

            })
            .addCase(addDashboardAndChart.rejected, (state, action) => {
                state.status = "failed"
                state.message = action.payload
            })
            .addCase(removeChart.pending, (state) => {
                state.status = "loading"
                state.message = ""

            })
            .addCase(removeChart.fulfilled, (state, action) => {
                state.status = "success"
                state.message = action.payload

            })
            .addCase(removeChart.rejected, (state, action) => {
                state.status = "failed"
                state.message = action.payload || "unknown error"
            })
            .addCase(addChart.pending, (state) => {
                state.status = "loading"
                state.message = ""
            })
            .addCase(addChart.fulfilled, (state, action) => {
                state.status = "success"
                state.message = action.payload.message
            })
            .addCase(addChart.rejected, (state, action) => {
                state.status = "failed"
                state.message = action.payload
            })
            .addCase(getCharts.pending, (state) => {
                state.status = "loading"
                state.message = ""
            })
            .addCase(getCharts.fulfilled, (state, action) => {
                state.status = "success"
                state.message = action.payload
                state.charts = action.payload;

            })
            .addCase(getCharts.rejected, (state, action) => {
                state.status = "failed"
                state.message = action.payload
            })
    }
})


export default dashboardSlice.reducer;
export const dashboardState = (state: RootState) => state.dashboard;
export const { resetMessage, setActiveDashboard, resetDashboardState, resetDashboardStatus } = dashboardSlice.actions