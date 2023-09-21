import { errorHandler } from '@/lib/ErrorHandler';
import { BlackRoof } from "@/lib/web3/BlackRoof";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Web3 from "web3";
import { RootState } from "..";

export interface Web3ProviderState {
    web3: Web3 | null;
    blackRoof: BlackRoof | null;
    tokenBalance: number;
    isLoading: boolean;
}

const initialState: Web3ProviderState = {
    web3: null,
    blackRoof: null,
    isLoading: false,
    tokenBalance: 0,
}

const slice = createSlice({
    name: 'web3',
    initialState,
    reducers: {
        setProvider: (state, action) => {
            const { web3, blackRoof, balance } = action.payload;
            state.web3 = web3;
            state.blackRoof = blackRoof;
            state.tokenBalance = balance;
        },
        setBalance: (state, action) => {
            state.tokenBalance = action.payload;
        },
        removeProvider: (state) => {
            state.web3 = null;
            state.blackRoof = null;
            state.tokenBalance = 0
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    },
})

export default slice.reducer

const actions = slice.actions

export const web3Actions = {
    setWeb3Provider: createAsyncThunk(
        "web3/setWeb3Provider",
        async (web3: Web3, thunkAPI) => {
            const blackRoof = new BlackRoof(web3)
            thunkAPI.dispatch(actions.setProvider({ web3, blackRoof }))

            const accounts = await web3.eth.getAccounts()
            const balance = await blackRoof.getTokenBalance(accounts[0])
            thunkAPI.dispatch(actions.setBalance(balance))
        }
    ),
    getEthBalance: createAsyncThunk<number, void, { state: RootState }>(
        "web3/getNativeTokenBalance",
        async (_, thunkAPI) => {
            const { web3 } = thunkAPI.getState().web3Provider

            const accounts = await web3!.eth.getAccounts()
            const balance = await web3!.eth.getBalance(accounts[0])
            const value = Web3.utils.fromWei(balance, 'ether')
            return parseFloat(value)
        }
    ),
    getTokenBalance: createAsyncThunk<number, any, { state: RootState }>(
        "web3/getTokenBalance",
        async (_: any, thunkAPI) => {
            const { web3, blackRoof } = thunkAPI.getState().web3Provider

            const accounts = await web3!.eth.getAccounts()
            const balance = await blackRoof!.getTokenBalance(accounts[0])
            thunkAPI.dispatch(actions.setBalance(balance))
            return balance
        }
    ),
    getBalances: createAsyncThunk<[number, number], void, { state: RootState }>(
        "web3/getBalances",
        async (_, thunkAPI) => {
            try {
                const { web3, blackRoof } = thunkAPI.getState().web3Provider
                if (!web3) throw 'Not ready'

                const accounts = await web3.eth.getAccounts()
                const eth = await web3.eth
                    .getBalance(accounts[0])
                    .then((balance) => {
                        const value = Web3.utils.fromWei(balance, 'ether')
                        return parseFloat(value)
                    })
                const usdt = await blackRoof!.getTokenBalance(accounts[0])

                return [eth, usdt]
            } catch (err) {
                return thunkAPI.rejectWithValue(errorHandler(err))
            }
        }
    ),
    removeWeb3Provider: createAsyncThunk(
        "web3/removeWeb3Provider",
        async (_: any, thunkAPI) => {
            thunkAPI.dispatch(actions.removeProvider())
        }
    ),
}