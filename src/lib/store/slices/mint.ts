import { errorHandler } from '@/lib/ErrorHandler';
import apiClient from "@/lib/FetchWrapper"
import { MintProject, MintStateValue } from "@/lib/types/Payload"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from ".."

interface MintState {
    isLoading: boolean
    state: MintStateValue
    trxHash: string | null
    tokenAllowance: number
}

interface MintStatePayload {
    state: MintStateValue
    trxHash?: string | null
}

const initialState: MintState = {
    isLoading: false,
    state: MintStateValue.Iddle,
    tokenAllowance: 0,
    trxHash: null
}

const slice = createSlice({
    name: 'mint',
    initialState,
    reducers: {
        updateState: (state, action: PayloadAction<MintStateValue>) => {
            state.state = action.payload
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setTrxHash: (state, action: PayloadAction<string>) => {
            state.trxHash = action.payload
        },
        setAllowance: (state, action: PayloadAction<number>) => {
            state.tokenAllowance = action.payload
            state.isLoading = false
        },
        clearState: (state) => {
            state.isLoading = false
            state.state = MintStateValue.Iddle
            state.trxHash = null
        }
    }
})

export default slice.reducer
export const mintActions = {
    checkAllowance: createAsyncThunk<any, string, { state: RootState }>(
        'mint/checkAllowance',
        async (address, thunkAPI) => {
            thunkAPI.dispatch(slice.actions.setLoading(true))
            try {
                const { blackRoof } = thunkAPI.getState().web3Provider
                const allowance = await blackRoof!.checkAllowance(address)
                thunkAPI.dispatch(slice.actions.setAllowance(allowance))
            } catch (error) {
                return thunkAPI.rejectWithValue(errorHandler(error))
            } finally {
                thunkAPI.dispatch(slice.actions.setLoading(false))
            }
        }
    ),
    approveToken: createAsyncThunk<any, { value: number; account: string }, { state: RootState }>(
        'mint/approveToken',
        async (payload, thunkAPI) => {
            thunkAPI.dispatch(slice.actions.setLoading(true))
            try {
                const { blackRoof } = thunkAPI.getState().web3Provider
                await blackRoof!.approveToken(payload.account, payload.value)
                thunkAPI.dispatch(slice.actions.setAllowance(payload.value))
            } catch (error) {
                return thunkAPI.rejectWithValue(errorHandler(error))
            } finally {
                thunkAPI.dispatch(slice.actions.setLoading(false))
            }
        }
    ),
    mintProject: createAsyncThunk<any, MintProject, { state: RootState }>(
        'mint/mintProject',
        async (payload, thunkAPI) => {
            thunkAPI.dispatch(slice.actions.updateState(MintStateValue.Loading))
            try {
                let trxHash = null
                const { blackRoof } = thunkAPI.getState().web3Provider
                payload.onTransactionHash = async (hash) => {
                    thunkAPI.dispatch(slice.actions.setTrxHash(hash))
                    await apiClient.post("/api/transaction/create", {
                        project: payload.project,
                        amount: payload.mintPrice * payload.amount,
                        minted: payload.amount,
                        trxHash: hash,
                    })
                }
                payload.onError = (error) => {
                    thunkAPI.rejectWithValue(error)
                    thunkAPI.dispatch(slice.actions.updateState(MintStateValue.Failed))
                }

                const { to, signature, nonce } = payload

                if (to && signature && nonce) {
                    const tx = await blackRoof!.authorizedMint(payload)
                    trxHash = tx.transactionHash
                } else {
                    const tx = await blackRoof!.mintProject(payload)
                    trxHash = tx.transactionHash
                }


                thunkAPI.dispatch(slice.actions.updateState(MintStateValue.Success))

                await apiClient.post(`/api/transaction/${trxHash}`, {})
                return trxHash
            } catch (error) {
                thunkAPI.dispatch(slice.actions.updateState(MintStateValue.Failed))
                return thunkAPI.rejectWithValue(errorHandler(error))
            }
        }
    ),
    setMintState: createAsyncThunk<void, MintStatePayload>(
        "mint/setMintState",
        async (payload, thunkAPI) => {
            thunkAPI.dispatch(slice.actions.updateState(payload.state))
            if (payload.trxHash) {
                thunkAPI.dispatch(slice.actions.setTrxHash(payload.trxHash))
            }
        }
    ),
    clearState: createAsyncThunk(
        "mint/clearState",
        async (_: any, thunkAPI) => {
            thunkAPI.dispatch(slice.actions.clearState())
        }
    ),
}