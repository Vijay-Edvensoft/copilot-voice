import { api, } from "@/config/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";



export interface ChatMessage {
    generatedMessage?: string | undefined;
    query: string;
    response_text: string;
    created_at: string;
    // query_id?: number;
    query_id?: number;
}

export interface InitialState {

    chats: ChatMessage[];
    selectedChats: number[];
    activeChat: ChatMessage | null;
    status: "loading" | "success" | "failed" | "idle";
    message: string;

}

export interface PromptPayload {
    user_id: number;
    // db_connection_id: number;
    query: string;
}



export const getChatHistory = createAsyncThunk<ChatMessage[], number, { rejectValue: string }>("chat/chatHistory", async (userId, thunkApi) => {
    try {
        const response = await api.get(`/api/chatbot/history/${userId}/`);
        if (response.status === 200) {

            return response.data.response;
        }

    } catch (error: any) {

        // Non-Axios error fallback
        return thunkApi.rejectWithValue(error?.message);
    }

})


export const generateResponse = createAsyncThunk<ChatMessage, PromptPayload, { rejectValue: any }>("chat/generateResponse", async (promptPayload, thunkApi) => {
    try {
        const state = thunkApi.getState() as RootState
        const activeChat = state.chat.activeChat
        if (activeChat?.query_id) {
            const response = await api.put(`/api/chatbot/edit/${activeChat?.query_id}/`, { query: promptPayload.query });
            console.log(response)
            if (response.status === 200) {

                const newChat = { ...response.data, query_id: activeChat.query_id, query: promptPayload.query }
                thunkApi.dispatch(getChatHistory(Number(promptPayload.user_id)));
                thunkApi.dispatch(setActiveChat(newChat))
                console.log(newChat)

                return newChat;
            }
        } else {
            const response = await api.post("/api/chatbot/generate-response/", promptPayload);
            console.log(response)
            if (response.status === 200) {

                const newChat = { ...response.data, query: promptPayload.query }
                thunkApi.dispatch(getChatHistory(Number(promptPayload.user_id)));

                thunkApi.dispatch(setActiveChat(newChat))

                return newChat;
            }
        }
        return thunkApi.rejectWithValue("Failed to generate response");
    } catch (error: any) {

        // Non-Axios error fallback
        return thunkApi.rejectWithValue(error?.message);
    }

})

interface DeleteResponse {
    message: string;
    updatedChats: ChatMessage[]
}


export const deleteChat = createAsyncThunk<DeleteResponse, number[], { rejectValue: string }>("chat/deleteResponse", async (queryIds, thunkApi) => {
    try {
        const state = thunkApi.getState() as RootState
        const userId = state?.auth.user.user_id;

        const payload = {
            user_id: userId,
            query_ids: queryIds
        }

        const response = await api.delete("/api/chatbot/delete-chat/", { data: payload })
        if (response.status === 200) {
            // console.log("queryIdsq", queryIds)

            const updatedChats = state.chat.chats.filter(chat => !queryIds.includes(Number(chat.query_id)))

            return { message: response.data.message, updatedChats };
        }
        return thunkApi.rejectWithValue("Delete failed");
    } catch (error: any) {

        // Non-Axios error fallback
        return thunkApi.rejectWithValue(error?.message);
    }
})


export const retryQuestion = createAsyncThunk<ChatMessage, any, { rejectValue: any }>("chat/retryQuestion", async (queryId, thunkApi) => {
    try {
        const state = thunkApi.getState() as RootState
        // const activeChat = state.chat.activeChat
        const userId = state?.auth.user.user_id;

        const response = await api.post(`/api/chatbot/retry/${queryId}/`);
        console.log(response)
        if (response.status === 200) {

            const newChat = { ...response.data, created_at: new Date().toISOString(), query: state.chat.activeChat?.query }
            thunkApi.dispatch(setActiveChat(newChat))
            thunkApi.dispatch(getChatHistory(Number(userId)));
            return newChat;
        } return thunkApi.rejectWithValue("Failed to generate response");


    } catch (error: any) {
        return thunkApi.rejectWithValue(error?.message);
    }
})

export const regenerateChart = createAsyncThunk<any, number, { rejectValue: string }>("chat/regenerateChart", async (queryId, thunkApi) => {
    try {

        const response = await api.post(`/api/chatbot/regenerate-chart/${queryId}/`);
        if (response.status === 200 && response.data.chart_available) {
            return response.data
        }
        return thunkApi.rejectWithValue(response.data.message)

    } catch (error: any) {
        return thunkApi.rejectWithValue(error?.message);
    }
})

const initialState: InitialState = {
    chats: [],
    status: "idle",
    message: "",

    selectedChats: [],
    activeChat: null,


}


const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {

        resetChatState: () => initialState,

        resetChatStatus: (state) => { state.status = "idle" },
        resetChatMessage: (state) => { state.message = "" },
        setSelectedChats: (state, action) => { state.selectedChats = [...state.selectedChats, ...action.payload] },
        removeSelectedChats: (state, action) => { state.selectedChats = state.selectedChats.filter(chatId => chatId !== action.payload) },
        clearSelectedChats: (state) => { state.selectedChats = [] },
        setActiveChat: (state, action) => { state.activeChat = action.payload }


    }, extraReducers(builder) {
        builder
            .addCase(getChatHistory.pending, (state) => {
                state.status = "loading"
                state.message = ""
            })
            .addCase(getChatHistory.fulfilled, (state, action) => {
                state.status = "success";
                state.chats = action.payload;
            })
            .addCase(getChatHistory.rejected, (state, action) => {
                state.status = "failed"
                state.message = String(action.payload)
            })
            .addCase(generateResponse.pending, (state) => {
                state.status = "loading"
                state.message = ""
            })
            .addCase(generateResponse.fulfilled, (state, action) => {
                state.status = "success"
                // state.generatedMessage = action.payload?.response_text;
                // state.generatedQueryId = action.payload.query_id ? action.payload.query_id : null;
                state.chats = [action?.payload, ...state.chats];
            })
            .addCase(generateResponse.rejected, (state, action) => {
                state.status = "failed"
                state.message = action.payload
            }).addCase(retryQuestion.pending, (state) => {
                state.status = "loading"
                state.message = ""
            })
            .addCase(retryQuestion.fulfilled, (state, action) => {
                state.status = "success"
                // state.generatedMessage = action.payload?.response_text;
                // state.generatedQueryId = action.payload.query_id ? action.payload.query_id : null;
                state.chats = [action?.payload, ...state.chats];
            })
            .addCase(retryQuestion.rejected, (state, action) => {
                state.status = "failed"
                state.message = action.payload
            })
            .addCase(deleteChat.pending, (state) => {
                state.status = "loading"
                state.message = ""
            }).addCase(deleteChat.fulfilled, (state, action) => {
                state.status = "success"
                state.message = action.payload?.message
                state.chats = action.payload.updatedChats
            })
            .addCase(deleteChat.rejected, (state, action) => {
                state.status = "failed"
                state.message = action.payload || "unknown error"
            })
    }
})


export default chatSlice.reducer;
export const chatState = (state: RootState) => state.chat;
export const { setSelectedChats, resetChatMessage, removeSelectedChats, clearSelectedChats, setActiveChat, resetChatState, resetChatStatus } = chatSlice.actions