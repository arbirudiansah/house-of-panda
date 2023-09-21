import apiClient from '@/lib/FetchWrapper';
import IProject, { FormProjectStep1, FormProjectStep2, FormProjectStep3, ProjectPayload, UpdateProjectPayload } from '@/lib/types/Project';
import { web3Upload } from '@/lib/utils/ipfs';
import LocalStorage from '@/lib/utils/localStorage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import imageCompression from 'browser-image-compression';
import { RootState } from '../reducers';

const ls = new LocalStorage()

interface FormProjectState {
    isLoading: boolean;
    trxHash?: string;
    step1Data: FormProjectStep1 | null;
    step2Data: FormProjectStep2 | null;
    step3Data: FormProjectStep3 | null;
}

const initialState: FormProjectState = {
    isLoading: false,
    step1Data: ls.get<FormProjectStep1>('step1Data'),
    step2Data: ls.get<FormProjectStep2>('step2Data'),
    step3Data: ls.get<FormProjectStep3>('step3Data')
}

const slice = createSlice({
    name: 'formProject',
    initialState,
    reducers: {
        addStep1: (state, action: PayloadAction<[FormProjectStep1, boolean]>) => {
            const [data, editMode] = action.payload
            state.step1Data = data
            if (!editMode) ls.set('step1Data', data)
        },
        addStep2: (state, action: PayloadAction<[FormProjectStep2, boolean]>) => {
            const [data, editMode] = action.payload
            state.step2Data = data
            if (!editMode) ls.set('step2Data', data)
        },
        addStep3: (state, action: PayloadAction<[FormProjectStep3, boolean]>) => {
            const [data, editMode] = action.payload
            state.step3Data = data
            if (!editMode) ls.set('step3Data', data)
        },
        clearData: (state) => {
            state.step1Data = null
            state.step2Data = null
            state.step3Data = null

            ls.remove('step1Data')
            ls.remove('step2Data')
            ls.remove('step3Data')
        },
        clearState: (state) => {
            state.step1Data = null
            state.step2Data = null
            state.step3Data = null
        },
        showLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        onTrxHash: (state, action: PayloadAction<string>) => {
            state.trxHash = action.payload
        }
    },
});
export default slice.reducer

const { addStep1, addStep2, addStep3, showLoading, clearData, clearState } = slice.actions

const options = {
    maxSizeMB: 1,
    useWebWorker: true
}

export const formProjectActions = {
    saveStep1: createAsyncThunk<boolean, [FormProjectStep1, boolean]>(
        "formProject/saveStep1",
        async (params, thunkAPI) => {
            let imageUrls: string[] = []

            const [payload, editMode] = params
            thunkAPI.dispatch(showLoading(true))

            try {
                const ts = new Date().toISOString()
                const data = { ...payload }

                for (const [i, file] of payload.image_urls.entries()) {
                    let url = ''
                    if (file instanceof File) {
                        const compressedFile = await imageCompression(file, options);
                        url = await web3Upload([compressedFile], ts + `${i}`)
                    } else {
                        url = file
                    }

                    imageUrls.push(url)
                }
                data.image_urls = imageUrls
                thunkAPI.dispatch(addStep1([data, editMode]))
                return true
            } catch (error) {
                return thunkAPI.rejectWithValue(error)
            } finally {
                thunkAPI.dispatch(showLoading(false))
            }
        }
    ),
    saveStep2: createAsyncThunk<boolean, [FormProjectStep2, boolean]>(
        "formProject/saveStep2",
        async (params, thunkAPI) => {
            thunkAPI.dispatch(showLoading(true))

            const [payload, editMode] = params

            try {
                const ts = new Date().toISOString()
                const data = { ...payload }
                if (payload.blueprint instanceof File) {
                    const compressedFile = await imageCompression(payload.blueprint, options);
                    data.blueprint = await web3Upload([compressedFile], ts + `-blueprint`)
                }

                if (payload.prospectus instanceof File) {
                    data.prospectus = await web3Upload([payload.prospectus], ts + `-prospectus`)
                }

                thunkAPI.dispatch(addStep2([data, editMode]))
                return true
            } catch (error) {
                return thunkAPI.rejectWithValue(error)
            } finally {
                thunkAPI.dispatch(showLoading(false))
            }
        }
    ),
    saveStep3: createAsyncThunk<void, [FormProjectStep3, boolean]>(
        "formProject/saveStep3",
        async (params, thunkAPI) => {
            const [payload, editMode] = params
            thunkAPI.dispatch(addStep3([payload, editMode]))
        }
    ),
    createProject: createAsyncThunk<ProjectPayload, FormProjectStep3, { state: RootState }>(
        "formProject/createProject",
        async (arg, thunkAPI) => {
            thunkAPI.dispatch(showLoading(true))
            const { step1Data, step2Data } = thunkAPI.getState().formProject

            try {
                if (step1Data && step2Data) {
                    const { name, image_urls, description, location, typeId } = step1Data
                    const { specifications, sellingPoints, blueprint, prospectus } = step2Data
                    const { project_start, funding_start, funding_end, price, amount, authorizedOnly } = arg

                    const onchainData = {
                        typeId: parseInt(typeId),
                        price,
                        authorizedOnly,
                        projectId: 0,
                        supplyLimit: arg.supplyLimit,
                        term: arg.term ? parseInt(arg.term) : 0,
                        apy: arg.apy,
                        stakedApy: arg.stakedApy,
                        trxHash: "",
                        status: "creating",
                    }
                    const project = {
                        name,
                        image_urls,
                        description,
                        location,
                        specifications,
                        selling_points: sellingPoints,
                        blueprint,
                        prospectus,
                        amountRequired: amount,
                        timeline: {
                            project_start,
                            funding_start,
                            funding_end
                        },
                        onchainData,
                    }

                    thunkAPI.dispatch(clearData())

                    return project;

                    // const created = await apiClient.post<IProject>('/api/project/create', project)

                    // if (created) {
                    //     return new Promise((resolve, reject) => {
                    //         const data = {
                    //             ...onchainData,
                    //             title: name,
                    //             startTime: new Date(funding_start),
                    //             endTime: new Date(funding_end),
                    //         }

                    //         blackRoof.createProject(data, {
                    //             onTransactionHash: (trxHash) => {
                    //                 apiClient
                    //                     .patch(`/api/project/${projectId}`, { trxHash })
                    //                     .then(() => {
                    //                         thunkAPI.dispatch(clearData())
                    //                         thunkAPI.fulfillWithValue(trxHash)
                    //                         console.log("🚀 ~ trxHash:", trxHash)
                    //                         resolve(trxHash)
                    //                     })
                    //             },
                    //             onReceipt: async (trxHash) => {
                    //                 await apiClient.patch(`/api/project/${projectId}`, { trxHash })
                    //                 thunkAPI.dispatch(projectActions.getProjects([{}, false]))
                    //             },
                    //             onError: async (error) => {
                    //                 apiClient.patch(`/api/project/${projectId}`, { trxHash: "" })
                    //                     .then(() => {
                    //                         reject(thunkAPI.rejectWithValue(error))
                    //                         thunkAPI.dispatch(projectActions.getProjects([{}, false]))
                    //                     })
                    //             },
                    //         })
                    //     })
                    // }
                }

                throw new Error("Missing input data")
            } catch (error) {
                return thunkAPI.rejectWithValue(error)
            } finally {
                thunkAPI.dispatch(showLoading(false))
            }
        }
    ),
    updateProject: createAsyncThunk<any, [string, FormProjectStep3], { state: RootState }>(
        "formProject/updateProject",
        async (arg, thunkAPI) => {
            thunkAPI.dispatch(showLoading(true))
            const { step1Data, step2Data } = thunkAPI.getState().formProject

            try {
                if (step1Data && step2Data) {
                    const { name, image_urls, description, location } = step1Data
                    const { specifications, sellingPoints, blueprint, prospectus } = step2Data
                    const { project_start, funding_start, funding_end } = arg[1]

                    const project: UpdateProjectPayload = {
                        name,
                        image_urls,
                        description,
                        location,
                        specifications,
                        selling_points: sellingPoints,
                        blueprint,
                        prospectus,
                        timeline: {
                            project_start,
                            funding_start,
                            funding_end
                        },
                    }

                    await apiClient.post<IProject>(`/api/project/${arg[0]}`, project)

                    thunkAPI.dispatch(showLoading(false))
                    thunkAPI.dispatch(clearData())
                }
            } catch (error) {
                thunkAPI.dispatch(showLoading(false))
                return thunkAPI.rejectWithValue(error)
            }
        }
    ),
    clearData: createAsyncThunk<void, void>(
        "formProject/clearData",
        async (_, thunkAPI) => {
            thunkAPI.dispatch(clearState())
        }
    ),
}