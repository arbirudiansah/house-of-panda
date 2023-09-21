import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { web3Actions } from "@/lib/store/slices/web3Provider";
import { Web3ReactProvider } from "@web3-react/core";
import { FC, ReactNode, useCallback } from "react";
import Web3 from "web3";

const Web3Wrapper: FC<{ children: ReactNode }> = ({ children }) => {
    const w3 = useAppSelector(({ web3Provider }) => web3Provider.web3)
    const dispatch = useAppDispatch()

    const getLibrary = useCallback((library: any) => {
        if (w3) return w3;

        const web3 = new Web3(library);
        dispatch(web3Actions.setWeb3Provider(web3))

        return web3;
    }, [dispatch, w3])

    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            {children}
        </Web3ReactProvider>
    );
}

export default Web3Wrapper;