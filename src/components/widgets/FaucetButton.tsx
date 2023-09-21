import { useAppDispatch } from "@/lib/store/hooks";
import { notify } from "@/lib/store/slices/message";
import { web3Actions } from "@/lib/store/slices/web3Provider";
import { BlackRoof, createProvider } from "@/lib/web3/BlackRoof";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import Button from "./Button";

const FaucetButton = () => {
    const { account } = useWeb3React()
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useAppDispatch()

    const getToken = async () => {
        setIsLoading(true)
        try {
            const blackRoof = new BlackRoof(createProvider())
            const result = await blackRoof.faucet(account!)
            console.log(result)
            setIsLoading(false)
            notify.info("Token transfered")
            dispatch(web3Actions.getTokenBalance({}))
        } catch (error: any) {
            setIsLoading(false)
            notify.error(error)
        }
    }

    return (
        <Button
            onClick={getToken}
            isLoading={isLoading}
            title="Get Test Token"
            className="rounded-full text-white text-sm md:text-base pl-4 pr-4 pt-2 pb-2"
        />
    )
}

export default FaucetButton;