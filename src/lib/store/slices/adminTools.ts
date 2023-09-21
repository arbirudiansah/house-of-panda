import { errorHandler } from "@/lib/ErrorHandler"
import { BlackRoof, createProvider } from "@/lib/web3/BlackRoof"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from ".."

interface AdminToolsState {
    isLoading: boolean
    trxHash: string | null
    balance: number
    allowance: number
}

interface WithdrawParams {
    amount: number
    to: string
}

interface TopupParams {
    amount: number
    from: string
    useWallet: boolean
}

const initialState: AdminToolsState = {
    isLoading: false,
    trxHash: null,
    balance: 0,
    allowance: 0
}

const blackRoof = new BlackRoof(createProvider())

const slice = createSlice({
    name: 'adminTools',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = !state.isLoading
        },
        setTrxHash: (state, action: PayloadAction<string | null>) => {
            state.trxHash = action.payload
        },
        setBalance: (state, action: PayloadAction<[number, number]>) => {
            const [balance, allowance] = action.payload
            state.allowance = allowance
            state.balance = balance
        },
        clearData: (state) => {
            state.isLoading = false
            state.trxHash = null
            state.balance = 0
            state.allowance = 0
        }
    }
})

const { setLoading, setTrxHash, clearData, setBalance } = slice.actions

export default slice.reducer
export const adminActions = {
    clear: createAsyncThunk<void, void>(
        "adminTools/clear",
        async (_, thunkAPI) => {
            thunkAPI.dispatch(clearData())
        }
    ),
    getAdminBalance: createAsyncThunk<number, void>(
        "adminTools/getAdminBalance",
        async (_, __) => {
            return blackRoof.getETHBalance()
        }
    ),
    getBalance: createAsyncThunk<any, string>(
        "adminTools/getBalance",
        async (address, thunkAPI) => {
            thunkAPI.dispatch(setLoading())
            try {
                const balance = await blackRoof.getTokenBalance(address)
                const allowance = await blackRoof.checkAllowance(address)
                thunkAPI.dispatch(setBalance([balance, allowance]))
            } catch (error) {
                return thunkAPI.rejectWithValue(errorHandler(error))
            } finally {
                thunkAPI.dispatch(setLoading())
            }
        }
    ),
    approveToken: createAsyncThunk<any, { amount: number; account: string }, { state: RootState }>(
        'adminTools/approveToken',
        async (payload, thunkAPI) => {
            thunkAPI.dispatch(setLoading())
            try {
                const { balance } = thunkAPI.getState().adminTools
                await blackRoof.approveToken(payload.account, payload.amount)
                thunkAPI.dispatch(setBalance([balance, payload.amount]))
            } catch (error) {
                return thunkAPI.rejectWithValue(errorHandler(error))
            } finally {
                thunkAPI.dispatch(setLoading())
            }
        }
    ),
    withdraw: createAsyncThunk<any, WithdrawParams, { state: RootState }>(
        "adminTools/withdraw",
        async (params, thunkAPI) => {
            thunkAPI.dispatch(setLoading())
            try {
                const { amount, to } = params
                const result = await blackRoof.withdraw(amount, to, {
                    onTransactionHash: (hash) => thunkAPI.dispatch(setTrxHash(hash)),
                })

                return result
            } catch (error) {
                return thunkAPI.rejectWithValue(errorHandler(error))
            } finally {
                thunkAPI.dispatch(setLoading())
                setTimeout(() => {
                    thunkAPI.dispatch(setTrxHash(null))
                }, 8000)
            }
        }
    ),
    topup: createAsyncThunk<any, TopupParams, { state: RootState }>(
        "adminTools/topup",
        async (params, thunkAPI) => {
            thunkAPI.dispatch(setLoading())
            try {
                let result: any
                const provider = thunkAPI.getState().web3Provider
                const { amount, useWallet, from } = params
                const events = {
                    onTransactionHash: (hash: string) => thunkAPI.dispatch(setTrxHash(hash)),
                }

                if (useWallet) {
                    result = await provider.blackRoof?.topup(amount, from, useWallet, events)
                } else {
                    result = await blackRoof.topup(amount, from, useWallet, events)
                }

                return result
            } catch (error) {
                return thunkAPI.rejectWithValue(errorHandler(error))
            } finally {
                thunkAPI.dispatch(setLoading())
                setTimeout(() => {
                    thunkAPI.dispatch(setTrxHash(null))
                }, 8000)
            }
        }
    )
}