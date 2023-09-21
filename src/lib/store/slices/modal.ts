import { createAsyncThunk, createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";
import store from "..";

interface ModalState {
    show: boolean;
    component: JSX.Element | null;
}

const initialState: ModalState = {
    show: false,
    component: null,
}

const slice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        setShowModal: (state, action: PayloadAction<JSX.Element>) => {
            state.show = true
            state.component = action.payload
        },
        setHideModal: (state) => {
            state.show = false
            state.component = null
        }
    }
})

export default slice.reducer

export const modal = {
    showModal: (component: JSX.Element) => store.dispatch(createAsyncThunk(
        "modal/showModal",
        async (component: JSX.Element, thunkAPI) => {
            thunkAPI.dispatch(slice.actions.setShowModal(component))
        }
    )(component)),
    hideModal: () => store.dispatch(createAsyncThunk(
        "modal/hideModal",
        async (_: any, thunkAPI) => {
            thunkAPI.dispatch(slice.actions.setHideModal())
        }
    )({})),
}