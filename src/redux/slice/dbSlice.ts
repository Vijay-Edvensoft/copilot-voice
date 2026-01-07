import { api, } from "@/config/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";





/* ------------------------------------------------------------------
 * ✅ Type Definitions
 * ------------------------------------------------------------------ */

// Type representing the structure of database connection configuration
export interface DbConfigType {

    db_type?: string;
    host: string;
    port: number;
    db_name: string;
    username: string;
    password: string;
    user?: number;
    display_name?: string


}

// Type representing a database column and its attributes
export interface ColumnType {
    column_name: string;
    column_type: string
    is_nullable: string
    column_key: string
    default: string | null,
    attributes: string
}



// Type representing a database table and its columns
export interface TableType {
    table_id: number;
    table_name?: string;
    collection_name?: string;
    columns?: ColumnType[];
    sample_document?: any
    is_configured: boolean;
}

export interface TableStatus {

    table_id: number;
    is_configured: boolean;
    name?: string;
}

export interface ConfigTable {

    tables: TableStatus[];
}

export interface SaveConfigResponse {
    message: string;
    db_connection_id: number;
    display_name: string;
}

export interface DataSourceType {
    db_connection_id: number;
    display_name: string;
    db_type: string;
    db_name: string;
    tables: TableType[]
}
// Redux slice state type for DB Configuration and Table metadata
interface InitialState {
    connectionStatus: "idle" | "loading"
    | "success" | "failed";
    dbConnections: DbConnectionType[];
    dbTables: TableType[]
    message: string
    activeTable: ColumnType[] | any
    dataSources: DataSourceType[]
}

export interface DbConnectionType {
    created_at: string;
    db_connection_id: number
    db_name: string
    db_type: string
    display_name: string
}

/* ------------------------------------------------------------------
 * ✅ CreateAsyncThunks for API (Axios CRUD Operations)
 * ------------------------------------------------------------------ */


/**
 * @description Tests the database connection with provided credentials.
 * @param {DbConfigType} dbConfig - Database configuration details.
 * @returns {string} - Success message on valid connection.
 */

export const testDbConfig = createAsyncThunk<string, DbConfigType, { rejectValue: string }>("dbConfig/testDbConfig", async (dbConfig, thunkApi) => {
    try {
        const response = await api.post("/api/database/test-connection/", dbConfig);
        if (response.status === 200) {


            return response.data.message;
        }
    } catch (error: any) {

        console.log(error?.message)
        // Non-Axios error fallback
        return thunkApi.rejectWithValue(error?.message);
    }
})


/**
 * @description Saves validated DB connection details to the backend.
 * @param {DbConfigType} dbConfig - Database configuration details.
 * @returns {string} - Confirmation message on successful save.
 */

export const saveDbConfig = createAsyncThunk<SaveConfigResponse, DbConfigType, { rejectValue: any }>("dbConfig/saveDbConfig", async (dbConfig, thunkApi) => {
    try {

        const response = await api.post("/api/database/save-db-connection/", dbConfig);

        if (response.status === 201) {
            // localStorage.setItem("dbConnectionId", response.data.db_connection_id)
            return response.data;
        }

    } catch (error: any) {

        // Non-Axios error fallback
        return thunkApi.rejectWithValue(error?.message);
    }


})



/**
 * @description Fetches all tables from the database for a given user.
 * @param {string} userId - The ID of the user whose tables are fetched.
 * @returns {TableType[]} - A list of database tables.
 */

// export const fetchTables = createAsyncThunk<TableType[], number, { rejectValue: any }>("dbConfig/fetchTables", async (userId, thunkApi) => {
//     try {


//         const response = await api.get(`/api/database/fetch-tables/${userId}/`);
//         if (response.status === 200) {
//             console.log(response.data.response)
//             return response?.data?.response;
//         }

//     } catch (error) {
//         console.log(error)
//         return thunkApi.rejectWithValue(error)
//     }

// })

export const fetchTables = createAsyncThunk<TableType[], { userId: number, dbType?: string, dbConnectionId?: number }, { rejectValue: any }>("dbConfig/fetchTables", async ({ userId, dbType, dbConnectionId }, thunkApi) => {
    try {

        if (dbType == "mySQL") {

            const response = await api.get(`/api/database/fetch-tables/${userId}/${dbConnectionId}/`);
            if (response.status === 200) {

                return response?.data?.response;
            }
        }
        else if (dbType == "mongoDB") {
            const response = await api.get(`/api/database/mongo-collections/${userId}/${dbConnectionId}/`);
            if (response.status === 200) {

                return response?.data?.response;
            }
        }
    } catch (error: any) {

        return thunkApi.rejectWithValue(error.message);
    }


})


/**
 * @description Saves the configuration of selected tables (e.g., mark as configured).
 * @param {object} payload - The configuration payload (table_id, is_configured, etc.).
 * @returns {string} - Confirmation message after saving configuration.
 */

export const saveConfig = createAsyncThunk<string, { payload: ConfigTable, db_connection_id: number }, { rejectValue: any }>("dbConfig/saveConfig", async ({ payload, db_connection_id }, thunkApi) => {
    try {
        const state = thunkApi.getState() as RootState
        const userId = state?.auth.user.user_id;

        const response = await api.post(`/api/database/save-configured-tables/${userId}/${db_connection_id}/`, payload)
        if (response.status === 200) {



            return response.data?.response
        }
    } catch (error: any) {

        // Non-Axios error fallback
        return thunkApi.rejectWithValue(error?.message);
    }

})
export const editConfig = createAsyncThunk<string, ConfigTable, { rejectValue: any }>("dbConfig/saveConfig", async (payload, thunkApi) => {
    try {
        // const state = thunkApi.getState() as RootState
        // const userId = state?.auth.user.user_id;

        const response = await api.put(`/api/database/edit-configured-tables/`, payload)
        if (response.status === 200) {
            // Merge payload updates (based on table name or id)
            // thunkApi.dispatch(fetchTables(Number(userId)))

            return response.data?.message
        }
    } catch (error: any) {

        return thunkApi.rejectWithValue(error.message);
    }
})




export const getColumns = createAsyncThunk<TableType, { userId: number, tableId: number }>("dbConfig/getColumns", async ({ userId, tableId }, thunkApi) => {
    try {

        const response = await api.get(`/api/database/columns/${userId}/${tableId}/`)
        if (response.status === 200) {

            return response.data

        }

    } catch (error: any) {

        return thunkApi.rejectWithValue(error.message);
    }
})


export const getSchema = createAsyncThunk<TableType, { userId: number, tableId: number }>("dbConfig/getSchema", async ({ userId, tableId }, thunkApi) => {
    try {


        const response = await api.get(`/api/database/sample-doc/${userId}/${tableId}/`)
        if (response.status === 200) {

            return response.data

        }

    } catch (error: any) {

        return thunkApi.rejectWithValue(error.message);
    }
})


export const getDataSources = createAsyncThunk<DataSourceType[], number, { rejectValue: string }>("dbConfig/getDataSources", async (userId, thunkApi) => {
    try {
        const response = await api.get(`/api/database/data-sources/${userId}/`)
        if (response.status === 200) {

            return response?.data?.response
        }

    } catch (error: any) {

        return thunkApi.rejectWithValue(error.message);
    }

})


export const getDbConnections = createAsyncThunk<DbConnectionType[], number, { rejectValue: string }>("dbConfig/getDbConnections", async (userId, thunkApi) => {
    try {
        const response = await api.get(`/api/database/db-connection/${userId}/`)
        if (response.status === 200) {

            return response.data.response
        }

    } catch (error: any) {

        return thunkApi.rejectWithValue(error.message);
    }

})




/* ------------------------------------------------------------------
 * ✅ Default Values
 * ------------------------------------------------------------------ */

// const storedConfig = localStorage.getItem("dbConfig");

// Default database configuration object
export const dbConfig: DbConfigType = {
    host: "",
    db_name: "",
    username: "",
    password: "",
    port: 0,
    user: 0,
    db_type: "",
    display_name: ''
}

// Initial state for the dbConfig slice
const initialState: InitialState = {
    connectionStatus: "idle",
    dbConnections: [],
    dbTables: [],
    message: "",
    activeTable: null,
    dataSources: [],


}

/* ------------------------------------------------------------------
 * ✅ Redux Slice: dbConfigSlice
 * ------------------------------------------------------------------ */

const dbConfigSlice = createSlice({
    name: "dbConfig",
    initialState,
    reducers: {

        // Reset the entire DB config state to its initial values
        resetDbState: () => initialState,
        // Reset only the status field to "idle" (used after API calls)
        resetDbStatus: (state) => { state.connectionStatus = "idle" },
        resetDbMessage: (state) => { state.message = "" },
        setActiveTable: (state, action) => { state.activeTable = action.payload },
        resetActiveTable: (state) => state.activeTable = initialState.activeTable

    },
    extraReducers(builder) {
        builder
            .addCase(testDbConfig.pending, (state) => {
                state.connectionStatus = "loading"
                state.message = ""
            })
            .addCase(testDbConfig.fulfilled, (state, action) => {
                state.connectionStatus = "success"
                state.message = action.payload
            }).addCase(testDbConfig.rejected, (state, action) => {
                state.connectionStatus = "failed"
                state.message = action?.payload || "Not reachable"
            })
            .addCase(saveDbConfig.pending, (state) => {
                state.connectionStatus = "loading";
                state.message = ""

            })
            .addCase(saveDbConfig.fulfilled, (state, action) => {
                state.connectionStatus = "success"
                state.message = action.payload.message
            })
            .addCase(saveDbConfig.rejected, (state, action) => {
                state.connectionStatus = "failed"
                state.message = action.payload
            })
            .addCase(fetchTables.pending, (state) => {
                state.connectionStatus = "loading"; state.message = ""

            })
            .addCase(fetchTables.fulfilled, (state, action) => {
                state.connectionStatus = "success"

                state.dbTables = action.payload
            })
            .addCase(fetchTables.rejected, (state, action) => {
                state.connectionStatus = "failed"
                state.message = action.payload
            })
            .addCase(saveConfig.pending, (state) => {
                state.connectionStatus = "loading"; state.message = ""

            })
            .addCase(saveConfig.fulfilled, (state) => {
                state.connectionStatus = "success"
            })
            .addCase(saveConfig.rejected, (state) => {
                state.connectionStatus = "failed"
            })
            .addCase(getDataSources.pending, (state) => {
                state.connectionStatus = "loading"
            })
            .addCase(getDataSources.fulfilled, (state, action) => {
                state.connectionStatus = "success"

                state.dataSources = action.payload

            })
            .addCase(getDataSources.rejected, (state, action) => {
                state.connectionStatus = "failed"
                state.message = action.payload || ""
            })
            .addCase(getDbConnections.pending, (state) => {
                state.connectionStatus = "loading"
            })
            .addCase(getDbConnections.fulfilled, (state, action) => {
                state.connectionStatus = "success"
                localStorage.setItem("dbConnectionId", String(action?.payload[0]?.db_connection_id));
                state.dbConnections = action.payload
            })
            .addCase(getDbConnections.rejected, (state) => {
                state.connectionStatus = "failed"
            })
            .addCase(getColumns.pending, (state) => {
                state.connectionStatus = "loading"
            })
            .addCase(getColumns.fulfilled, (state) => {
                state.connectionStatus = "success"
            })
            .addCase(getColumns.rejected, (state, action) => {
                state.connectionStatus = "failed"
                state.message = String(action.payload)
            }).addCase(getSchema.pending, (state) => {
                state.connectionStatus = "loading"
            })
            .addCase(getSchema.fulfilled, (state) => {
                state.connectionStatus = "success"
            })
            .addCase(getSchema.rejected, (state, action) => {
                state.connectionStatus = "failed"
                state.message = String(action.payload)
            })



    },
})


/* ------------------------------------------------------------------
 * ✅ Exports
 * ------------------------------------------------------------------ */

export default dbConfigSlice.reducer; // Export reducer to be added in configureStore
export const { resetDbState, resetDbStatus, resetDbMessage, setActiveTable, resetActiveTable } = dbConfigSlice.actions // Export actions for components/thunks to dispatch
export const dbConfigState = (state: RootState) => state.dbConfig