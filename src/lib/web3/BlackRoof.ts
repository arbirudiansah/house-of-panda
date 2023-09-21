import Web3 from "web3";
import HouseOfPandaAbi from "@/lib/contracts/HouseOfPanda.json"
import StakerAbi from "@/lib/contracts/Staker.json"
import { AbiItem } from "ethereum-abi-types-generator";
import { BurnToken, CollectRewards, CreateProject, Holdinginfo, MintProject, StakeInfo, StakeProject, EthEvents } from "@/lib/types/Payload";
import { errorHandler } from "@/lib/ErrorHandler";
import erc20ABI from '@/lib/contracts/Erc20ABI.json';
import { ContractContext as ContractContext_ERC20, Erc20ABIWrapper } from '@/lib/types/Erc20ABIWrapper';
import { UNITS } from "@/lib/consts";
import { Account } from "web3-core/types"
import { HouseOfPandaWrapper, ContractContext as ContractContext_Hop, ProjectinfoResponse } from '../types/HouseOfPandaWrapper';
import { StakerWrapper, ContractContext as ContractContext_Staker } from '../types/StakerWrapper';
import Contract from "web3-eth-contract";
import moment from "moment";

const utils = Web3.utils
export const createProvider = (): Web3 => {
    return new Web3(process.env.NEXT_PUBLIC_WEB3_PROVIDER!)
}

export class BlackRoof {
    private web3: Web3
    private contract: HouseOfPandaWrapper
    private staker: StakerWrapper
    private erc20: Erc20ABIWrapper
    private signer: Account | undefined = undefined
    private gas: number = parseInt(process.env.NEXT_PUBLIC_GAS_LIMIT ?? '500000')
    public address: string = process.env.NEXT_PUBLIC_SMARTCONTRACT_ADDRESS!
    public stakerAddress: string = process.env.NEXT_PUBLIC_STAKER_ADDRESS!
    public stableCoinAddress: string = process.env.NEXT_PUBLIC_STABLE_COIN_ADDRESS!

    constructor(web3_: Web3, signer?: Account) {
        this.web3 = web3_;

        const contract = new web3_.eth.Contract(
            HouseOfPandaAbi.abi as AbiItem[],
            this.address,
        ) as unknown as ContractContext_Hop;

        const staker = new web3_.eth.Contract(
            StakerAbi.abi as AbiItem[],
            this.stakerAddress,
        ) as unknown as ContractContext_Staker;

        const erc20 = new web3_.eth.Contract(
            erc20ABI.abi as AbiItem[],
            this.stableCoinAddress,
        ) as unknown as ContractContext_ERC20;

        this.contract = contract.methods as HouseOfPandaWrapper;
        this.staker = staker.methods as StakerWrapper;
        this.erc20 = erc20.methods as Erc20ABIWrapper;

        this.signer = signer;
    }

    private signTransaction = async (data: string, to: string, events?: EthEvents) => {
        return new Promise<string>((resolve, reject) => {
            try {
                if (!this.signer) throw Error('Signer is not initialized!');

                const tx = {
                    from: this.signer.address,
                    to,
                    data,
                    gas: this.gas,
                }

                const signing = this.signer.signTransaction(tx)
                signing.then((signedTx) => {
                    const sentTx = this.web3.eth.sendSignedTransaction(signedTx.rawTransaction!)
                    sentTx
                        .on('transactionHash', hash => events?.onTransactionHash?.(hash))
                        .on("receipt", receipt => {
                            events?.onReceipt?.(receipt.transactionHash)
                            resolve(receipt.transactionHash)
                        })
                        .on("error", err => {
                            events?.onError?.(errorHandler(err))
                            reject(err)
                        })
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    // @deprecated
    faucet = async (address: string) => {
        // try {
        //     const admin = await this.getAdmin()

        //     const balance = await this.getTokenBalance(address)
        //     if (balance > 100) throw 'You have enough token for testing'

        //     const from = admin.address

        //     const { eth } = this.web3
        //     const sendTx = {
        //         from,
        //         to: utils.toHex(address),
        //         value: utils.toWei('0.5', 'ether'),
        //         gas: this.gas,
        //     }
        //     const signedTx = await admin.signTransaction(sendTx)
        //     const ethTx = await eth.sendSignedTransaction(signedTx.rawTransaction!)

        //     const decimals = utils.toBN(UNITS)
        //     const usdtAmount = utils.toHex(utils.toBN(100_000).mul(decimals))
        //     const erc = this.erc20.transfer(utils.toHex(address), utils.toHex(usdtAmount)).encodeABI()
        //     const sendTx2 = {
        //         from,
        //         to: utils.toHex(this.stableCoinAddress),
        //         gas: this.gas,
        //         data: erc,
        //     }
        //     const signedTx2 = await admin.signTransaction(sendTx2)
        //     const usdtTx = await eth.sendSignedTransaction(signedTx2.rawTransaction!)

        //     return [ethTx.transactionHash, usdtTx.transactionHash]
        // } catch (error) {
        //     throw errorHandler(error)
        // }
    }

    // @deprecated
    topup = async (amount: number, from: string, useWallet: boolean, events?: EthEvents) => {
        // try {
        //     const { utils } = this.web3
        //     const decimals = utils.toBN(UNITS)
        //     const value = utils.toHex(utils.toBN(amount).mul(decimals))

        //     const topup = this.staker.topup(value)
        //     if (!useWallet) {
        //         return await this.signTransaction(topup.encodeABI(), events)
        //     }

        //     const receipt = await topup
        //         .send({ from, gas: this.gas })
        //         .on('transactionHash', hash => events?.onTransactionHash?.(hash))
        //         .on("receipt", receipt => events?.onReceipt?.(receipt.transactionHash))
        //         .on("error", err => events?.onError?.(errorHandler(err)))

        //     return receipt.transactionHash
        // } catch (error) {
        //     throw errorHandler(error)
        // }
    }

    // get admin address
    getAdminAddress = async () => {
        try {
            return this.contract.admin().call()
        } catch (error) {
            throw errorHandler(error)
        }
    }

    // get admin balance in ERC20
    getAdminBalance = async () => {
        try {
            const admin = await this.getAdminAddress()
            const value = await this.erc20.balanceOf(admin).call()
            return Number(parseInt(value) / UNITS)
        } catch (error) {
            throw errorHandler(error)
        }
    }

    // get admin balance in ETH
    getETHBalance = async () => {
        try {
            const admin = await this.getAdminAddress()
            const balance = await this.web3.eth.getBalance(admin)

            return parseFloat(utils.fromWei(balance, 'ether'))
        } catch (error) {
            return 0
        }
    }

    // get SC balance in ERC20
    getSCBalance = async (): Promise<number> => {
        try {
            const balance = await this.erc20.balanceOf(this.stakerAddress).call()
            return Number(parseFloat(balance) / UNITS)
        } catch (error) {
            throw errorHandler(error)
        }
    }

    withdraw = async (amount: number, to: string, events?: EthEvents) => {
        try {
            const decimals = utils.toBN(UNITS)
            const value = utils.toHex(utils.toBN(amount).mul(decimals))

            const data = this.staker.withdrawTo(value, utils.toHex(to)).encodeABI()
            return await this.signTransaction(data, this.stakerAddress, events)
        } catch (error) {
            throw errorHandler(error)
        }
    }

    createProject = async (payload: CreateProject, events?: EthEvents) => {
        try {
            const { title, term, authorizedOnly, startTime, endTime } = payload;

            const decimals = utils.toBN(UNITS)
            const typeId = utils.toHex(payload.typeId)
            const price = utils.toHex(utils.toBN(payload.price).mul(decimals))
            const supplyLimit = utils.toHex(utils.toBN(payload.supplyLimit))
            const apy = utils.toHex(utils.toBN(payload.apy))
            const stakedApy = utils.toHex(utils.toBN(payload.stakedApy))

            const data = this.contract.createProject(
                typeId,
                title,
                price,
                authorizedOnly,
                supplyLimit,
                term,
                apy,
                stakedApy,
                utils.toHex(startTime.getTime() / 1000),
                utils.toHex(endTime.getTime() / 1000),
            )
            return await this.signTransaction(data.encodeABI(), this.address, events)
        } catch (error) {
            throw errorHandler(error)
        }
    }

    setProjectStatus = async (projectId: number, status: string) => {
        try {
            const data = this.contract.setProjectStatus(utils.toHex(projectId), status)
            return await this.signTransaction(data.encodeABI(), this.address)
        } catch (error) {
            throw errorHandler(error)
        }
    }

    getAdminSignature = (projectId: number, qty: number, from: string, to: string) => {
        try {
            const signer = this.signer
            if (!signer) throw Error('Signer is not initialized!')

            const nonce = moment().add(1, 'm').unix()
            const message = utils.soliditySha3(
                { type: 'uint32', value: utils.toHex(projectId) },
                { type: 'address', value: from },
                { type: 'address', value: to },
                { type: 'uint32', value: utils.toHex(qty) },
                { type: 'uint64', value: utils.toHex(nonce) },
            );
            if (!message) throw Error('Message is not initialized!')

            const signature = signer.sign(message)

            const sig = {
                r: signature.r,
                s: signature.s,
                v: signature.v,
            }

            return { sig, nonce }
        } catch (error) {
            throw errorHandler(error)
        }
    }

    getProject = async (projectId: number) => {
        try {
            const project = await this.contract.getProject(utils.toHex(projectId)).call()
            return project
        } catch (error) {
            throw errorHandler(error)
        }
    }

    isProjectEnd = async (projectId: number) => {
        const isEnd = await this.staker.isProjectEnd(utils.toHex(projectId)).call()
        return isEnd
    }

    // @deprecated
    setCustomUri = async (projectId: number) => {
        // try {
        //     const uri = process.env.NEXT_PUBLIC_WEB_URL + `/api/meta/${projectId}`

        //     const data = this.contract.setCustomURI(projectId.toString(), uri)
        //     return await this.signTransaction(data.encodeABI(), this.address)
        // } catch (error) {
        //     throw errorHandler(error)
        // }
    }

    nextProjectIndex = async () => {
        try {
            const idx = await this.contract.projectIndex().call()
            return parseInt(idx) + 1
        } catch (error) {
            throw errorHandler(error)
        }
    }

    getTokenBalance = async (address: string) => {
        try {
            const value = await this.erc20.balanceOf(address).call()
            return Number(parseInt(value) / UNITS)
        } catch (error) {
            throw errorHandler(error)
        }
    }

    checkAllowance = async (address: string) => {
        try {
            const allowance = await this.erc20.allowance(address, this.address).call()

            return Number(parseInt(allowance) / UNITS)
        } catch (error) {
            throw errorHandler(error)
        }
    }

    approveToken = async (from: string, value: number) => {
        try {
            const amount = utils.toBN(value * UNITS)
            const gas = this.gas
            const approve = this.erc20.approve(this.address, utils.toHex(amount))

            return await approve.send({ from, gas })
        } catch (error) {
            throw errorHandler(error)
        }
    }

    mintProject = async (params: MintProject) => {
        try {
            const { projectId, amount, from, onTransactionHash, onError } = params
            return await this.contract.mint(projectId, amount, from)
                .send({
                    from,
                    gas: this.gas,
                })
                .on("transactionHash", (hash: string) => onTransactionHash?.(hash))
                .on("error", (error: Error) => onError?.(errorHandler(error)))
        } catch (error) {
            throw errorHandler(error)
        }
    }

    authorizedMint = async (params: MintProject) => {
        try {
            const { projectId, amount, from, to, signature, nonce, onTransactionHash, onError } = params
            if (!to || !nonce || !signature) throw new Error('Missing params')

            return await this.contract.authorizedMint(utils.toHex(projectId), utils.toHex(amount), to, utils.toHex(nonce), signature)
                .send({
                    from,
                    gas: this.gas,
                })
                .on("transactionHash", (hash: string) => onTransactionHash?.(hash))
                .on("error", (error: Error) => onError?.(errorHandler(error)))
        } catch (error) {
            throw errorHandler(error)
        }
    }

    calculateReward = async (value: number, startTime: Date, apy: number) => {
        try {
            const now = new Date()
            const amount = utils.toBN(value * UNITS)

            const reward = await this.staker.calculateRewards(
                utils.toHex(amount),
                utils.toHex(startTime.getTime()),
                utils.toHex(now.getTime()),
                utils.toHex(apy),
            ).call()

            return Number(parseInt(reward) / UNITS)
        } catch (error) {
            throw errorHandler(error)
        }
    }

    collectRewards = async (params: CollectRewards) => {
        try {
            const { projectId, rewardType, from, onTransactionHash, onReceipt, onError } = params

            const result = await this.staker
                .collectRewards(utils.toHex(projectId), utils.toHex(rewardType))
                .send({ from, gas: this.gas })
                .on("transactionHash", (hash: string) => onTransactionHash?.(hash))
                .on("receipt", ({ transactionHash }) => onReceipt?.(transactionHash))
                .on("error", (error: Error) => onError?.(errorHandler(error)))
            return result.transactionHash
        } catch (error) {
            throw errorHandler(error)
        }
    }

    getHoldingInfo = async (address: string, projectId: number): Promise<Holdinginfo> => {
        try {
            const result = await this.staker.getHoldingInfo(this.web3.utils.toHex(address), projectId).call()
            const info = { ...result }
            return {
                qty: parseInt(info.qty),
                startTime: parseInt(info.startTime),
                accumRewards: parseFloat(info.accumRewards) / UNITS,
                claimedRewards: parseFloat(info.claimedRewards) / UNITS
            }
        } catch (error) {
            throw errorHandler(error)
        }
    }

    stake = async (params: StakeProject) => {
        try {
            const { projectId, amount, from, onTransactionHash, onReceipt, onError } = params
            const result = await this.staker
                .stake(utils.toHex(projectId), utils.toHex(amount))
                .send({ from, gas: this.gas })
                .on("transactionHash", (hash: string) => onTransactionHash?.(hash))
                .on("receipt", ({ transactionHash }) => onReceipt?.(transactionHash))
                .on("error", (error: Error) => onError?.(errorHandler(error)))
            return result.transactionHash
        } catch (error) {
            throw errorHandler(error)
        }
    }

    unstake = async (params: StakeProject) => {
        try {
            const { projectId, amount, from, onTransactionHash, onReceipt, onError } = params

            const result = await this.staker
                .unstake(utils.toHex(projectId), utils.toHex(amount))
                .send({ from, gas: this.gas })
                .on("transactionHash", (hash: string) => onTransactionHash?.(hash))
                .on("receipt", ({ transactionHash }) => onReceipt?.(transactionHash))
                .on("error", (error: Error) => onError?.(errorHandler(error)))
            return result.transactionHash
        } catch (error) {
            throw errorHandler(error)
        }
    }

    getStakeInfo = async (staker: string, projectId: number): Promise<StakeInfo> => {
        try {
            const result = await this.staker.getStakingInfo(utils.toHex(staker), utils.toHex(projectId)).call()
            const info = { ...result }

            return {
                qty: parseInt(info.qty),
                term: parseInt(info.term),
                startTime: parseInt(info.startTime),
                accumRewards: parseInt(info.accumRewards) / UNITS,
                claimedRewards: parseInt(info.claimedRewards) / UNITS
            }
        } catch (error) {
            throw errorHandler(error)
        }
    }

    getAssetAlloc = async (investor: string, projectId: number): Promise<{ holding: Holdinginfo, stake: StakeInfo, claimedRewards: number }> => {
        try {
            const result = (await this.contract.getAssetAlloc(utils.toHex(investor), utils.toHex(projectId)).call()) as unknown as { [key: number]: any }
            const holdingInfo = { ...result[0] }
            const stakeInfo = { ...result[1] }

            return {
                holding: {
                    qty: parseInt(holdingInfo.qty),
                    startTime: parseInt(holdingInfo.startTime),
                    accumRewards: parseInt(holdingInfo.accumRewards) / UNITS,
                    claimedRewards: parseInt(holdingInfo.claimedRewards) / UNITS
                },
                stake: {
                    qty: parseInt(stakeInfo.qty),
                    term: parseInt(stakeInfo.term),
                    startTime: parseInt(stakeInfo.startTime),
                    accumRewards: parseInt(stakeInfo.accumRewards) / UNITS,
                    claimedRewards: parseInt(stakeInfo.claimedRewards) / UNITS
                },
                claimedRewards: (parseInt(holdingInfo.claimedRewards) + parseInt(stakeInfo.claimedRewards)) / UNITS
            }
        } catch (error) {
            throw errorHandler(error)
        }
    }

    burn = async (params: BurnToken) => {
        try {
            const { from, qty, projectId, onTransactionHash, onReceipt, onError } = params

            const result = await this.contract
                .burn(utils.toHex(projectId), utils.toHex(qty))
                .send({ from, gas: this.gas })
                .on("transactionHash", (hash: string) => onTransactionHash?.(hash))
                .on("receipt", ({ transactionHash }) => onReceipt?.(transactionHash))
                .on("error", (error: Error) => onError?.(errorHandler(error)))

            return result.transactionHash
        } catch (error) {
            throw errorHandler(error)
        }
    }

    getNFTBalance = async (address: string, projectId: number): Promise<any> => {
        try {
            const result = await this.contract.balanceOf(utils.toHex(address), utils.toHex(projectId)).call()
            return parseInt(result)
        } catch (error) {
            throw errorHandler(error)
        }
    }

    getNFTSupply = async (projectId: number) => {
        try {
            const limit = await this.getSupplyLimit(projectId)
            const supply = await this.contract.supplyFor(projectId).call()
            return [parseInt(supply), limit]
        } catch (error) {
            throw errorHandler(error)
        }
    }

    getSupplyLimit = async (projectId: number) => {
        try {
            const project: ProjectinfoResponse = await this.contract.getProject(projectId).call()
            return parseInt(project.supplyLimit)
        } catch (error) {
            throw errorHandler(error)
        }
    }

    getSymbol = async (): Promise<string> => {
        try {
            return await this.contract.symbol().call()
        } catch (error) {
            return 'NFT'
        }
    }
}

function solidityKeccak(abiTypes: string[], values: any[]): string | null {
    const web3 = new Web3();
    if (abiTypes.length !== values.length) {
        throw new Error(`Length mismatch between provided abi types and values. Got ${abiTypes.length} types and ${values.length} values.`);
    }

    const hexString = '0x' + abiTypes.map((abiType, index) => {
        const encodedValue = web3.eth.abi.encodeParameter(abiType, values[index]);
        return encodedValue.slice(2); // Remove '0x' prefix
    }).join('');

    return web3.utils.keccak256(hexString);
}