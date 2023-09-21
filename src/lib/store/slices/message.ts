import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import store from '..';

export interface Message {
    id?: number;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
type PendingAction = ReturnType<GenericAsyncThunk["pending"]>;
type FulfilledAction = ReturnType<GenericAsyncThunk["fulfilled"]>;
type RejectedAction = ReturnType<GenericAsyncThunk["rejected"]>;

const slice = createSlice({
    name: 'message',
    initialState: {
        messages: [] as Message[],
        isLoading: false,
    },
    reducers: {
        addMessage: (state, action) => {
            state.messages.push({
                ...action.payload,
                id: state.messages.length + 1,
            });
        },
        removeFirstMessage: (state) => {
            if (state.messages.length > 0) {
                state.messages.splice(0, 1);
            }
        },
        removeMessages: (state) => {
            state.messages = [];
        },
        removeMessageAt: (state, action) => {
            const msg = state.messages[action.payload];
            if (msg) {
                state.messages.splice(action.payload, 1);
            }
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher<PendingAction>(
            (action) => action.type.endsWith("/pending"),
            (state, _) => {
                state.isLoading = true;
            }
        );
        builder.addMatcher<FulfilledAction>(
            (action) => action.type.endsWith("/fulfilled"),
            (state, _) => {
                if (state.isLoading) state.isLoading = false;
            }
        );
        builder.addMatcher<RejectedAction>(
            (action) => action.type.endsWith("/rejected"),
            (state, action: PayloadAction<any>) => {
                if (action.payload?.toString().toLowerCase().includes('invalid authorization token')) {
                    if (state.isLoading) state.isLoading = false;
                    return
                }

                if (action.payload) {
                    state.messages.push({
                        message: action.payload.toString(),
                        type: 'error',
                    });
                }
                if (state.isLoading) state.isLoading = false;
            }
        );
    },
});
export default slice.reducer

const { addMessage, removeFirstMessage, removeMessageAt, removeMessages } = slice.actions;

const showMessage = createAsyncThunk(
    "message/showMessage",
    async (payload: Message, thunkAPI: any) => {
        thunkAPI.dispatch(addMessage(payload));
        // setTimeout(() => {
        //     thunkAPI.dispatch(removeFirstMessage());
        // }, 5000);
    }
);

export const removeMessage = createAsyncThunk(
    "message/removeMessage",
    async (index: number, thunkAPI: any) => {
        thunkAPI.dispatch(removeMessageAt(index));
    }
);

export const removeAllMessages = createAsyncThunk(
    "message/removeAllMessages",
    async (index: any, thunkAPI: any) => {
        thunkAPI.dispatch(removeMessages());
    }
);

export const notify = {
    success: (message: string) => store.dispatch(showMessage({ message, type: 'success' })),
    error: (message: string) => store.dispatch(showMessage({ message, type: 'error' })),
    warning: (message: string) => store.dispatch(showMessage({ message, type: 'warning' })),
    info: (message: string) => store.dispatch(showMessage({ message, type: 'info' })),
    test: (message: string) => store.dispatch(showMessage({ message, type: 'info' })),
}