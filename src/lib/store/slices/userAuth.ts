import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { userAccess } from '@/lib/UserAccess';
import * as apiClient from '@/lib/FetchWrapper';
import { User } from '@/lib/types/User';
import Web3 from 'web3';
import { RootState } from '..';
import { errorHandler } from '@/lib/ErrorHandler';
import adminAccess from '@/lib/AdminAccess';

interface UserAuthState {
    isLoggedIn: boolean;
}

interface SignedData {
    address: string;
    signature: string;
}

const initialState: UserAuthState = {
    isLoggedIn: userAccess.tokenValue != null,
}

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state) => {
            state.isLoggedIn = true;
        },
        logoutSuccess: (state) => {
            state.isLoggedIn = false;
        },
    },
});
export default slice.reducer

const { logoutSuccess, loginSuccess } = slice.actions


const handleSignMessage = (web3: Web3, user: User) => {
    return new Promise<SignedData>((resolve, reject) => {
        const callback = (err: Error, signature: string) => {
            if (err) return reject(errorHandler(err))

            return resolve({ address: user.address, signature })
        }

        web3.eth.personal.sign(
            web3.utils.utf8ToHex(`I am signing to House of Panda site with my one-time nonce: ${user.nonce}`),
            user.address,
            '',
            callback,
        )
    })
}

const handleAuthenticate = async ({ address, signature }: SignedData) => {
    return await apiClient.post(`/api/user/${address}`, { signature })
}

const login = createAsyncThunk<any, [string, string | null], { state: RootState }>(
    "auth/login",
    async (params, thunkAPI) => {
        userAccess.logout();
        adminAccess.logout();
        thunkAPI.dispatch(logoutSuccess())

        const [address, provider] = params

        try {
            const { web3 } = thunkAPI.getState().web3Provider
            if (!web3) throw 'Please connect to wallet first'

            try {
                await apiClient.get<User>(`/api/user/${address}`)
                    .then(user => handleSignMessage(web3, user))
                    .then(data => handleAuthenticate(data))
                    .then(auth => {
                        userAccess.authenticate(auth, provider)
                        thunkAPI.dispatch(loginSuccess())
                    })
            } catch (error) {
                throw errorHandler(error)
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(errorHandler(error))
        }
    }
)

const logout = createAsyncThunk(
    "auth/logout",
    async (_: any, thunkAPI: any) => {
        try {
            userAccess.logout();
            return thunkAPI.dispatch(logoutSuccess())
        } catch (e: any) {
            return console.error(e.message);
        }
    }
)

export const authActions = { login, logout }