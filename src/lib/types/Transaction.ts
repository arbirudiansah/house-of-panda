import { ProjectOnchainData, ProjectTimeline } from "./Project";

export interface SimpleProject {
    _id: string;
    name: string;
    location: string;
    onchainData: ProjectOnchainData;
    timeline: ProjectTimeline;
}

export interface Collection {
    amount: number;
    minted: number;
    lastTrx: Date;
    userId: string;
    status: string;
    project: SimpleProject;
}

export interface GroupedTransaction {
    projectId: string
    projectName: string
    projectTypeId: number
    amount: number
    minted: number
    lastTrx: string
    totalTrx: number
}

export interface ProjectTransaction {
    _id: string
    user: {
        _id: string
        address: string
    }
    project: string
    minted: number
    amount: number
    trxHash: string
    status: string
    createdAt: string
    updatedAt: string
    meta: {
        action?: string
    }
}