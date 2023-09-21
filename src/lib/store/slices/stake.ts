import { ProjectParams } from '@/lib/types/Project';
import { errorHandler } from "@/lib/ErrorHandler"
import { StakeInfo } from "@/lib/types/Payload"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from ".."
import { trxActions } from "./transaction"
import apiClient from '@/lib/FetchWrapper';
import project from './project';
import { RewardType } from '@/lib/consts';

interface StakeState {
    isLoading: boolean
    trxHash: string | null
    stakeInfo: StakeInfo
    freeBalance: number
}

const initialState: StakeState = {
    isLoading: false,
    trxHash: null,
    stakeInfo: {
        qty: 0,
        term: 0,
        startTime: 0,
        accumRewards: 0,
        claimedRewards: 0
    },
    freeBalance: 0,
}

const slice = createSlice({
    name: 'stake',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setTrxHash: (state, action: PayloadAction<string | null>) => {
            state.trxHash = action.payload
        },
        setData: (state, action: PayloadAction<[number, StakeInfo]>) => {
            const [freeBalance, stakeInfo] = action.payload
            state.freeBalance = freeBalance
            state.stakeInfo = stakeInfo
        },
        clearData: (state) => {
            state.freeBalance = 0
            state.isLoading = false
            state.stakeInfo = initialState.stakeInfo
            state.trxHash = null
        }
    }
})

const { setLoading, setTrxHash, setData, clearData } = slice.actions

export default slice.reducer
export const stakeActions = {
    getInfo: createAsyncThunk<any, [string, number], { state: RootState }>(
        "stake/getInfo",
        async (params, thunkAPI) => {
            thunkAPI.dispatch(setLoading(true))
            try {
                const [account, projectId] = params
                const { blackRoof } = thunkAPI.getState().web3Provider
                if (!blackRoof) throw 'Wallet not connected!';
                const balance = await blackRoof.getNFTBalance(account, projectId)
                const stakeInfo = await blackRoof.getStakeInfo(account, projectId)

                thunkAPI.dispatch(setData([(balance - stakeInfo.qty), stakeInfo]))
            } catch (error) {
                return thunkAPI.rejectWithValue(errorHandler(error))
            } finally {
                thunkAPI.dispatch(setLoading(false))
            }
        }
    ),
    clear: createAsyncThunk(
        "stake/clear",
        async (params, thunkAPI) => {
            thunkAPI.dispatch(clearData())
        }
    ),
    collectRewards: createAsyncThunk<any, [string, ProjectParams, RewardType], { state: RootState }>(
        "stake/collectRewards",
        async ([from, project, rewardType], thunkAPI) => {
            thunkAPI.dispatch(setLoading(true))
            try {
                const { blackRoof } = thunkAPI.getState().web3Provider
                if (!blackRoof) throw 'Wallet not connected!';

                const result = await blackRoof.collectRewards({
                    from,
                    projectId: project.id,
                    rewardType,
                    onTransactionHash: (hash: string) => {
                        thunkAPI.dispatch(setTrxHash(hash))
                        thunkAPI.dispatch(trxActions.createPendingTrx({
                            trxHash: hash,
                            title: project.name,
                            ts: (new Date).getTime(),
                            source: 'local',
                            action: 'Stake',
                            status: 'waiting'
                        }))
                    },
                    onReceipt: (hash) => thunkAPI.dispatch(trxActions.removePendingTrx(hash)),
                    onError: (error: string) => thunkAPI.rejectWithValue(errorHandler(error))
                })

                return result
            } catch (error) {
                return thunkAPI.rejectWithValue(errorHandler(error))
            } finally {
                thunkAPI.dispatch(setLoading(false))
                setTimeout(() => {
                    thunkAPI.dispatch(setTrxHash(null))
                }, 8000);
            }
        }
    ),
    create: createAsyncThunk<any, [string, ProjectParams, number], { state: RootState }>(
        "stake/create",
        async (params, thunkAPI) => {
            thunkAPI.dispatch(setLoading(true))
            try {
                const [from, project, amount] = params
                const { blackRoof } = thunkAPI.getState().web3Provider
                if (!blackRoof) throw 'Wallet not connected!';

                const result = await blackRoof.stake({
                    from,
                    projectId: project.id,
                    amount,
                    onTransactionHash: (hash: string) => {
                        thunkAPI.dispatch(setTrxHash(hash))
                        thunkAPI.dispatch(trxActions.createPendingTrx({
                            trxHash: hash,
                            title: project.name,
                            ts: (new Date).getTime(),
                            source: 'local',
                            action: 'Stake',
                            status: 'waiting'
                        }))
                    },
                    onReceipt: (hash) => thunkAPI.dispatch(trxActions.removePendingTrx(hash)),
                    onError: (error: string) => thunkAPI.rejectWithValue(errorHandler(error))
                })

                return result
            } catch (error) {
                return thunkAPI.rejectWithValue(errorHandler(error))
            } finally {
                thunkAPI.dispatch(setLoading(false))
                setTimeout(() => {
                    thunkAPI.dispatch(setTrxHash(null))
                }, 8000);
            }
        }
    ),
    unstake: createAsyncThunk<any, [string, ProjectParams, number], { state: RootState }>(
        "stake/unstake",
        async (params, thunkAPI) => {
            thunkAPI.dispatch(setLoading(true))
            try {
                const [from, project, amount] = params
                const { blackRoof } = thunkAPI.getState().web3Provider
                if (!blackRoof) throw 'Wallet not connected!';

                const result = await blackRoof.unstake({
                    from,
                    projectId: project.id,
                    amount,
                    onTransactionHash: (hash: string) => {
                        thunkAPI.dispatch(setTrxHash(hash))
                        thunkAPI.dispatch(trxActions.createPendingTrx({
                            trxHash: hash,
                            title: project.name,
                            ts: (new Date).getTime(),
                            source: 'local',
                            action: 'Unstake',
                            status: 'waiting'
                        }))
                    },
                    onReceipt: (hash) => thunkAPI.dispatch(trxActions.removePendingTrx(hash)),
                    onError: (error: string) => thunkAPI.rejectWithValue(errorHandler(error))
                })

                return result
            } catch (error) {
                return thunkAPI.rejectWithValue(errorHandler(error))
            } finally {
                thunkAPI.dispatch(setLoading(false))
                setTimeout(() => {
                    thunkAPI.dispatch(setTrxHash(null))
                }, 8000);
            }
        }
    ),
    burn: createAsyncThunk<any, [string, ProjectParams & { pid: string; price: number }, number], { state: RootState }>(
        'mint/burn',
        async (params, thunkAPI) => {
            thunkAPI.dispatch(setLoading(true))
            try {
                const [from, project, qty] = params
                const { blackRoof } = thunkAPI.getState().web3Provider
                if (!blackRoof) throw 'Wallet not connected!';

                const result = await blackRoof.burn({
                    from,
                    projectId: project.id,
                    qty,
                    onTransactionHash: async (hash: string) => {
                        thunkAPI.dispatch(setTrxHash(hash))
                        await apiClient.post("/api/transaction/create", {
                            project: project.pid,
                            amount: -(project.price * qty),
                            minted: -qty,
                            trxHash: hash,
                            action: 'Burn',
                        })
                    },
                    onReceipt: (hash) => apiClient.post(`/api/transaction/${hash}`, {}),
                    onError: (error: string) => thunkAPI.rejectWithValue(errorHandler(error))
                })

                return result
            } catch (error) {
                return thunkAPI.rejectWithValue(errorHandler(error))
            } finally {
                thunkAPI.dispatch(setLoading(false))
                setTimeout(() => {
                    thunkAPI.dispatch(setTrxHash(null))
                }, 8000);
            }
        }
    ),
}