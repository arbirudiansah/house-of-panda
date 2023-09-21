import { RewardType } from '@/lib/consts';
export interface CreateProject {
    typeId: number
    title: string
    price: number
    authorizedOnly: boolean
    supplyLimit: number
    term: number
    apy: number
    stakedApy: number
    startTime: Date
    endTime: Date
}

export interface EthEvents {
    onTransactionHash?: (hash: string) => void
    onReceipt?: (hash: string) => void
    onError?: (error: string) => void
}

export interface MintProject extends EthEvents {
    project: string
    from: string
    amount: number
    projectId: number
    mintPrice: number
    to?: string
    nonce?: number
    signature?: {
        r: string
        s: string
        v: string
    }
}

export interface StakeProject extends EthEvents {
    from: string
    amount: number
    projectId: number
}

export interface BurnToken extends EthEvents {
    from: string
    qty: number
    projectId: number
}

export interface CollectRewards extends EthEvents {
    from: string
    amount?: number
    projectId: number
    rewardType: RewardType
}

export interface BaseQuery {
    keyword?: string;
    limit?: number;
    offset?: number;
    sort?: string;
    startDate?: string;
    endDate?: string;
}

export interface ProjectQuery extends BaseQuery {
    active?: boolean;
    propertyType?: number;
    location?: string;
    startPrice?: number;
    endPrice?: number;
    public?: boolean;
    whitelisted?: boolean;
}

export interface CollectionParams extends BaseQuery {
    userId: string;
    propertyType?: number;
    location?: string;
    startPrice?: number;
    endPrice?: number;
    status?: string;
}

export interface StakeInfo {
    qty: number
    term: number
    startTime: number
    accumRewards: number
    claimedRewards: number
}

export interface Holdinginfo {
    qty: number;
    startTime: number;
    accumRewards: number;
    claimedRewards: number;
}

export enum MintStateValue {
    Loading,
    Iddle,
    Success,
    Failed
}