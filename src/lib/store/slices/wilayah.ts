import { OptionValue } from "@/components/widgets/FormSelect";
import { getWilayah } from "@/lib/utils/address";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WilayahState {
    provinces: OptionValue[]
    regencies: OptionValue[]
    districts: OptionValue[]
}

const initialState: WilayahState = {
    provinces: [],
    regencies: [],
    districts: []
}

const slice = createSlice({
    name: "wilayah",
    initialState,
    reducers: {
        setProvinces: (state, action: PayloadAction<OptionValue[]>) => {
            state.provinces = action.payload
        },
        setRegencies: (state, action: PayloadAction<OptionValue[]>) => {
            state.regencies = action.payload
        },
        setDistricts: (state, action: PayloadAction<OptionValue[]>) => {
            state.districts = action.payload
        }
    },
})

export default slice.reducer

export const wilayahActions = {
    getProvinces: createAsyncThunk(
        "wilayah/getProvinces",
        async (_: any, thunkAPI) => {
            try {
                const result = await getWilayah()
                const data: OptionValue[] = result.map(d => {
                    return {
                        value: d.id,
                        label: d.name,
                    }
                })

                thunkAPI.dispatch(slice.actions.setProvinces(data))
            } catch (error) {
                return thunkAPI.rejectWithValue(error)
            }
        }
    ),
    getRegencies: createAsyncThunk(
        "wilayah/getRegencies",
        async (provinceId: string, thunkAPI) => {
            try {
                const result = await getWilayah({ provinceId })
                const data: OptionValue[] = result.map(d => {
                    return {
                        value: d.id,
                        label: d.name,
                    }
                })

                thunkAPI.dispatch(slice.actions.setRegencies(data))
            } catch (error) {
                return thunkAPI.rejectWithValue(error)
            }
        }
    ),
    getDistricts: createAsyncThunk(
        "wilayah/getDistricts",
        async (regencyId: string, thunkAPI) => {
            try {
                const result = await getWilayah({ regencyId })
                const data: OptionValue[] = result.map(d => {
                    return {
                        value: d.id,
                        label: d.name,
                    }
                })

                thunkAPI.dispatch(slice.actions.setDistricts(data))
            } catch (error) {
                return thunkAPI.rejectWithValue(error)
            }
        }
    ),
}