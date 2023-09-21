import { errorHandler } from '@/lib/ErrorHandler';
import apiClient from "@/lib/FetchWrapper";
import { ResultEntries } from "@/lib/types/data";
import { CreateProject, ProjectQuery } from "@/lib/types/Payload";
import IProject, { ProjectOnchainData } from "@/lib/types/Project";
import { toQueryString } from "@/lib/utils";
import { BlackRoof, createProvider } from "@/lib/web3/BlackRoof";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from '../reducers';

interface ProjectState {
    isLoading: boolean
    projects: IProject[]
    count: number
}

const initialState: ProjectState = {
    isLoading: false,
    projects: [],
    count: 0,
}

const slice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        showLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setData: (state, action: PayloadAction<ResultEntries<IProject>>) => {
            const { entries, count } = action.payload
            state.projects = entries
            state.count = count
        },
        updateData: (state, action: PayloadAction<[number, string, string]>) => {
            const [projectId, trxHash, status] = action.payload
            state.projects = state.projects.map(d => {
                if (d.onchainData.projectId === projectId) {
                    return {
                        ...d,
                        onchainData: {
                            ...d.onchainData,
                            trxHash,
                            status,
                        }
                    }
                }

                return d
            })
        }
    },
})

export default slice.reducer

const { updateData, showLoading } = slice.actions
export const projectActions = {
    // getProjects: createAsyncThunk<any, [ProjectQuery, boolean?]>(
    //     "project/getProjects",
    //     async ([params, blockLoading = true], thunkAPI) => {
    //         thunkAPI.dispatch(showLoading(blockLoading))

    //         const getter = () => apiClient.get<ResultEntries<IProject>>(`/api/project/list?${toQueryString(params)}`)

    //         try {
    //             const result = await getter()
    //             thunkAPI.dispatch(slice.actions.setData(result))
    //         } catch (error) {
    //             return thunkAPI.rejectWithValue(error)
    //         } finally {
    //             thunkAPI.dispatch(showLoading(false))
    //         }
    //     }
    // ),
    checkPending: createAsyncThunk(
        "project/checkPending",
        async (_, __) => {
            const count = await apiClient.get<number>(`/api/project/check`)

            //should refresh
            return count > 0
        }
    ),
    // reCreate: createAsyncThunk<void, [string, ProjectOnchainData, [string, string]]>(
    //     "project/reCreate",
    //     async ([title, payload, [startTime, endTime]], { dispatch, rejectWithValue }) => {
    //         const blackRoof = new BlackRoof(createProvider())
    //         const initId = payload.projectId

    //         try {
    //             dispatch(updateData([initId, "", "creating"]))

    //             const projectId = await blackRoof.nextProjectIndex()

    //             const project = {
    //                 ...payload,
    //                 title,
    //                 startTime: new Date(startTime),
    //                 endTime: new Date(endTime),
    //             }

    //             await blackRoof.createProject(project, {
    //                 onTransactionHash: async (trxHash) => {
    //                     await apiClient.patch<IProject>(`/api/project/${initId}`, { trxHash, projectId })
    //                     dispatch(updateData([initId, trxHash, "pending"]))
    //                 },
    //                 onReceipt: async (trxHash) => {
    //                     await apiClient.patch<IProject>(`/api/project/${projectId}`, { trxHash })
    //                     dispatch(updateData([initId, trxHash, "success"]))
    //                 },
    //                 onError: async (error) => {
    //                     const { onchainData: { trxHash } } = await apiClient.patch<IProject>(`/api/project/${initId}`, { trxHash: '' })
    //                     dispatch(updateData([initId, trxHash, "failed"]))
    //                     rejectWithValue(errorHandler(error))
    //                 },
    //             })
    //         } catch (error) {
    //             console.log("🚀 ~ file: project.ts:119 ~ error:", error)
    //         }
    //     }
    // ),
    // changeStatus: createAsyncThunk<any, [string, string], { state: RootState }>(
    //     "project/changeStatus",
    //     async ([id, status], { dispatch, rejectWithValue }) => {
    //         dispatch(showLoading(true))
    //         try {
    //             const blackRoof = new BlackRoof(createProvider())
    //             const { onchainData } = await apiClient.post<IProject>(`/api/project/setStatus`, { id, status })
    //             const txHash = await blackRoof.setProjectStatus(onchainData.projectId, status)

    //             return txHash
    //         } catch (error) {
    //             rejectWithValue(errorHandler(error))
    //         } finally {
    //             dispatch(showLoading(false))
    //         }
    //     }
    // )
}