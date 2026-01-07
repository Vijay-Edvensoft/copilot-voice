import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";
import { api } from "@/config/config";
// import type { resetMessage } from "./dashboardSlice";

export type SettingsInitialState = {
  context_time_window: "last_month" | "always" | "last_week" | "custom";
  context_custom_days: number | null,
  enable_genbi: boolean;
  enable_auto_synonyms: boolean;
  out_of_context_behavior: "ask_clarification" | "refuse_ambiguous";
  enable_auto_join: boolean;
  knowledge_refresh_interval: "realtime" | "hourly" | "daily" | "weekly";
  response_tone: "business" | "technical" | "casual" | "concise";
}


type InitialState = {
  status: "idle" | "loading" | "success" | "failed"
  settings: SettingsInitialState | null
  updatedSettings: Partial<SettingsInitialState>
  message: string
}

const initialState: InitialState = {
  status: "idle",
  settings: null,
  updatedSettings: {},
  message: ""
};

export const getSettings = createAsyncThunk<SettingsInitialState, void, { rejectValue: string }>("settings/getSettings", async (_, thunkApi) => {
  try {
    const state = thunkApi.getState() as RootState
    // const activeChat = state.chat.activeChat
    const userId = state?.auth.user.user_id;
    const res = await api.get(`/api/chatbot/settings/${userId}/`)
    if (res.status === 200) {
      return res.data.response;
    }

  } catch (error: any) {
    return thunkApi.rejectWithValue(error)
  }
})


export const updateSettings = createAsyncThunk<any, Partial<SettingsInitialState>, { rejectValue: string }>("settings/updateSettings", async (payload, thunkApi) => {
  try {

    const state = thunkApi.getState() as RootState
    // const activeChat = state.chat.activeChat
    const userId = state?.auth.user.user_id;
    const updatedPayload = { ...payload, context_custom_days: payload.context_time_window !== "custom" ? null : payload.context_custom_days }

    const res = await api.put(`/api/chatbot/settings/update/${userId}/`, updatedPayload)
    if (res.status === 200) {
      return res.data;
    }


  } catch (error: any) {
    return thunkApi.rejectWithValue(error)
  }
})

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setUpdateSettings: (state, action) => {
      console.log(action.payload)
      state.updatedSettings = { ...state.updatedSettings, ...action.payload }
    },
    resetUpdates: (state) => {
      state.updatedSettings = {};
    },
    resetSettingsStatus: (state) => { state.status = "idle" },
    resetSettingsMessage: (state) => { state.message = "" }
  },
  extraReducers(builder) {
    builder
      .addCase(getSettings.pending, (state) => {
        state.status = "loading"
        state.message = ""
      })
      .addCase(getSettings.fulfilled, (state, action) => {
        state.status = "success"
        state.settings = action.payload
      })
      .addCase(getSettings.rejected, (state, action) => {
        state.status = "failed"
        state.message = String(action.payload)
      })
      .addCase(updateSettings.pending, (state) => {
        state.status = "loading"
        state.message = ""
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.status = "success"
        state.settings = action.payload.settings
        console.log(action.payload.settings)
        state.message = action.payload.message
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.status = "failed"
        state.message = String(action.payload)
      })
  },
});

export const { setUpdateSettings, resetUpdates, resetSettingsMessage, resetSettingsStatus } = settingsSlice.actions;
export default settingsSlice.reducer;
export const settingsState = (state: RootState) => state.chatBotSettings;
