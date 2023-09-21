import { combineReducers } from "@reduxjs/toolkit";
import web3Provider from "./slices/web3Provider";
import adminAuth from "./slices/adminAuth";
import userAuth from "./slices/userAuth";
import profile from "./slices/profile";
import message from "./slices/message";
import formProject from "./slices/formProject";
import wilayah from "./slices/wilayah";
import project from "./slices/project";
import modal from "./slices/modal";
import mint from "./slices/mint";
import stake from "./slices/stake";
import adminTools from "./slices/adminTools";
import transaction from "./slices/transaction";

const rootReducer = combineReducers({
    web3Provider,
    adminAuth,
    userAuth,
    message,
    formProject,
    profile,
    wilayah,
    project,
    modal,
    mint,
    stake,
    adminTools,
    transaction,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;