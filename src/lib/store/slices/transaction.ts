import { errorHandler } from '@/lib/ErrorHandler';
import apiClient from "@/lib/FetchWrapper";
import { ResultEntries } from "@/lib/types/data";
import { ProjectTransaction } from "@/lib/types/Transaction";
import { toQueryString } from "@/lib/utils";
import { ContainerStorage } from '@/lib/utils/localStorage';
import { createAction, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from 'moment';
import { RootState } from '../reducers';

type Status = 'done' | 'failed' | 'waiting'
type Action = 'Mint' | 'Stake' | 'Unstake' | 'Burn' | 'Claim'

interface PendingTransaction {
    trxHash: string;
    title: string;
    ts: number;
    source: 'db' | 'local'
    action: Action;
    status: Status;
}

type Wrapped = Omit<ProjectTransaction, 'project'> & {
    project: { name: string }
}

interface TransactionState {
    isLoading: boolean
    pendingTrxs: PendingTransaction[]
}

const initialState: TransactionState = {
    isLoading: false,
    pendingTrxs: [],
}

const createPendingTrx = createAction<PendingTransaction>('trx/createPending')
const removePendingTrx = createAction<string>('trx/removePending')

let container: ContainerStorage<PendingTransaction> | undefined

if (typeof window !== 'undefined') {
    container = new ContainerStorage<PendingTransaction>('pendingTrxs', 'trxHash')
}

const slice = createSlice({
    name: 'trx',
    initialState,
    reducers: {
        showLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setData: (state, action: PayloadAction<PendingTransaction[]>) => {
            state.pendingTrxs = action.payload
        },
        addProcessedTrxs: (state, action: PayloadAction<[string, Status]>) => {
            const [trxHash, status] = action.payload
            state.pendingTrxs = state.pendingTrxs.map(trx => {
                const t = { ...trx }
                if (t.trxHash === trxHash) {
                    return { ...t, status, }
                }

                return t
            })
        },
        clearTrxHash: (state, action: PayloadAction<string>) => {
            state.pendingTrxs = state.pendingTrxs.filter(trx => trx.trxHash !== action.payload)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPendingTrx, (state, { payload }) => {
                state.pendingTrxs.push(payload)
                container?.insert(payload)
            })
            .addCase(removePendingTrx, (state, { payload }) => {
                container?.remove(payload)
            })
    },
})

export default slice.reducer

const { setData, addProcessedTrxs, clearTrxHash } = slice.actions
const getPendingTrxs = async () => {
    const { entries } = await apiClient.get<ResultEntries<Wrapped>>(`/api/transaction/pending?page=1&perPage=20`)
    const localTrxs = container?.getList() ?? []

    return [
        ...entries.map(e => ({
            trxHash: e.trxHash,
            title: e.project.name,
            ts: new Date(e.createdAt).getTime(),
            source: "db",
            action: e.meta.action ?? "Mint",
            status: "waiting",
        } as PendingTransaction)),
        ...localTrxs,
    ].sort((a, b) => b.ts - a.ts)
}

export const trxActions = {
    getPendingTrxs: createAsyncThunk<any, void, { state: RootState }>(
        "trx/getPending",
        async (_, thunkAPI) => {
            try {
                const { web3 } = thunkAPI.getState().web3Provider

                const pendingTrxs = await getPendingTrxs()
                thunkAPI.dispatch(setData(pendingTrxs))

                await Promise.all(pendingTrxs.map(async ({ trxHash, source }, i) => {
                    try {
                        await web3?.eth.getTransactionReceipt(trxHash, async (_, receipt) => {
                            if (receipt.status) {
                                if (source === 'db') {
                                    await apiClient.post(`/api/transaction/${trxHash}`, {})
                                } else if (source === 'local') {
                                    thunkAPI.dispatch(removePendingTrx(trxHash))
                                }

                                thunkAPI.dispatch(addProcessedTrxs([receipt.transactionHash, "done"]))
                            } else {
                                await apiClient.mDelete(`/api/transaction/${trxHash}`)
                                thunkAPI.dispatch(clearTrxHash(trxHash))
                            }
                        })
                    } catch (error) {
                        thunkAPI.dispatch(addProcessedTrxs([trxHash, "failed"]))
                        console.log("🚀 ~ file: transaction.ts:75 ~ getPendingTrxs ~ error:", error)
                        throw new Error(`Failed processing transactionHash: ${trxHash}`)
                    }
                }))
            } catch (error) {
                console.log("🚀 ~ file: transaction.ts:134 ~ error:", error)
                return thunkAPI.rejectWithValue(errorHandler(error))
            }
        }
    ),
    createPendingTrx,
    removePendingTrx,
}