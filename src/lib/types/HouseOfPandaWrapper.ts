import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import {
  PromiEvent,
  TransactionReceipt,
  EventResponse,
  EventData,
  Web3ContractContext,
} from 'ethereum-abi-types-generator';

export interface CallOptions {
  from?: string;
  gasPrice?: string;
  gas?: number;
}

export interface SendOptions {
  from: string;
  value?: number | string | BN | BigNumber;
  gasPrice?: string;
  gas?: number;
}

export interface EstimateGasOptions {
  from?: string;
  value?: number | string | BN | BigNumber;
  gas?: number;
}

export interface MethodPayableReturnContext {
  send(options: SendOptions): PromiEvent<TransactionReceipt>;
  send(
    options: SendOptions,
    callback: (error: Error, result: any) => void
  ): PromiEvent<TransactionReceipt>;
  estimateGas(options: EstimateGasOptions): Promise<number>;
  estimateGas(
    options: EstimateGasOptions,
    callback: (error: Error, result: any) => void
  ): Promise<number>;
  encodeABI(): string;
}

export interface MethodConstantReturnContext<TCallReturn> {
  call(): Promise<TCallReturn>;
  call(options: CallOptions): Promise<TCallReturn>;
  call(
    options: CallOptions,
    callback: (error: Error, result: TCallReturn) => void
  ): Promise<TCallReturn>;
  encodeABI(): string;
}

export interface MethodReturnContext extends MethodPayableReturnContext {}

export type ContractContext = Web3ContractContext<
  HouseOfPandaWrapper,
  HouseOfPandaWrapperMethodNames,
  HouseOfPandaWrapperEventsContext,
  HouseOfPandaWrapperEvents
>;
export type HouseOfPandaWrapperEvents =
  | 'AdminChanged'
  | 'ApprovalForAll'
  | 'Burn'
  | 'MetaTransactionExecuted'
  | 'Mint'
  | 'OwnershipTransferred'
  | 'ProjectCreated'
  | 'ProjectStatusChanged'
  | 'TransferBatch'
  | 'TransferSingle'
  | 'URI';
export interface HouseOfPandaWrapperEventsContext {
  AdminChanged(
    parameters: {
      filter?: { admin?: string | string[] };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  ApprovalForAll(
    parameters: {
      filter?: { account?: string | string[]; operator?: string | string[] };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  Burn(
    parameters: {
      filter?: {
        projectId?: string | number | string | number[];
        qty?: string | string[];
        burner?: string | string[];
      };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  MetaTransactionExecuted(
    parameters: {
      filter?: {};
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  Mint(
    parameters: {
      filter?: {
        projectId?: string | number | string | number[];
        qty?: string | string[];
        to?: string | string[];
      };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  OwnershipTransferred(
    parameters: {
      filter?: {
        previousOwner?: string | string[];
        newOwner?: string | string[];
      };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  ProjectCreated(
    parameters: {
      filter?: { id?: string | number | string | number[] };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  ProjectStatusChanged(
    parameters: {
      filter?: {
        projectId?: string | number | string | number[];
        status?: string | number[] | string | number[][];
      };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  TransferBatch(
    parameters: {
      filter?: {
        operator?: string | string[];
        from?: string | string[];
        to?: string | string[];
      };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  TransferSingle(
    parameters: {
      filter?: {
        operator?: string | string[];
        from?: string | string[];
        to?: string | string[];
      };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  URI(
    parameters: {
      filter?: { id?: string | string[] };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
}
export type HouseOfPandaWrapperMethodNames =
  | 'new'
  | 'ERC712_VERSION'
  | 'admin'
  | 'adminBurn'
  | 'authorizedMint'
  | 'balanceOf'
  | 'balanceOfBatch'
  | 'burn'
  | 'changeAdmin'
  | 'createProject'
  | 'executeMetaTransaction'
  | 'getAssetAlloc'
  | 'getChainId'
  | 'getDomainSeperator'
  | 'getHoldingInfo'
  | 'getNonce'
  | 'getProject'
  | 'isApprovedForAll'
  | 'mint'
  | 'name'
  | 'owner'
  | 'pause'
  | 'paused'
  | 'projectExists'
  | 'projectIndex'
  | 'renounceOwnership'
  | 'safeBatchTransferFrom'
  | 'safeTransferFrom'
  | 'setApprovalForAll'
  | 'setCustomURI'
  | 'setProjectStatus'
  | 'setURI'
  | 'staker'
  | 'supplyFor'
  | 'supportsInterface'
  | 'symbol'
  | 'transferOwnership'
  | 'updateStaker'
  | 'uri';
export interface AdminChangedEventEmittedResponse {
  admin: string;
}
export interface ApprovalForAllEventEmittedResponse {
  account: string;
  operator: string;
  approved: boolean;
}
export interface BurnEventEmittedResponse {
  projectId: string | number;
  qty: string;
  burner: string;
}
export interface MetaTransactionExecutedEventEmittedResponse {
  userAddress: string;
  relayerAddress: string;
  functionSignature: string | number[];
}
export interface MintEventEmittedResponse {
  projectId: string | number;
  qty: string;
  minter: string;
  to: string;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface ProjectCreatedEventEmittedResponse {
  id: string | number;
}
export interface ProjectStatusChangedEventEmittedResponse {
  projectId: string | number;
  status: string | number[];
}
export interface TransferBatchEventEmittedResponse {
  operator: string;
  from: string;
  to: string;
  ids: string[];
  values: string[];
}
export interface TransferSingleEventEmittedResponse {
  operator: string;
  from: string;
  to: string;
  id: string;
  value: string;
}
export interface URIEventEmittedResponse {
  value: string;
  id: string;
}
export interface AuthorizedMintRequest {
  r: string | number[];
  s: string | number[];
  v: string | number;
}
export interface HoldinginfoResponse {
  qty: string;
  startTime: string;
  accumRewards: string;
  claimedRewards: string;
}
export interface StakeinfoResponse {
  qty: string;
  term: string;
  startTime: string;
  accumRewards: string;
  claimedRewards: string;
}
export interface GetAssetAllocResponse {
  result0: HoldinginfoResponse;
  result1: StakeinfoResponse;
}
export interface ProjectinfoResponse {
  id: string;
  title: string;
  creator: string;
  typeId: string;
  price: string;
  authorizedOnly: boolean;
  status: string;
  term: string;
  supplyLimit: string;
  apy: string;
  stakedApy: string;
  startTime: string;
  endTime: string;
}
export interface HouseOfPandaWrapper {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param _admin Type: address, Indexed: false
   * @param _baseUri Type: string, Indexed: false
   * @param _stableCoin Type: address, Indexed: false
   * @param _staker Type: address, Indexed: false
   * @param _proxyAddress Type: address, Indexed: false
   */
  'new'(
    _admin: string,
    _baseUri: string,
    _stableCoin: string,
    _staker: string,
    _proxyAddress: string
  ): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  ERC712_VERSION(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  admin(): MethodConstantReturnContext<string>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param projectId Type: uint32, Indexed: false
   * @param qty Type: uint32, Indexed: false
   * @param to Type: address, Indexed: false
   */
  adminBurn(
    projectId: string | number,
    qty: string | number,
    to: string
  ): MethodPayableReturnContext;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param projectId Type: uint32, Indexed: false
   * @param qty Type: uint32, Indexed: false
   * @param to Type: address, Indexed: false
   * @param nonce Type: uint64, Indexed: false
   * @param sig Type: tuple, Indexed: false
   */
  authorizedMint(
    projectId: string | number,
    qty: string | number,
    to: string,
    nonce: string,
    sig: AuthorizedMintRequest
  ): MethodPayableReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param account Type: address, Indexed: false
   * @param id Type: uint256, Indexed: false
   */
  balanceOf(account: string, id: string): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param accounts Type: address[], Indexed: false
   * @param ids Type: uint256[], Indexed: false
   */
  balanceOfBatch(
    accounts: string[],
    ids: string[]
  ): MethodConstantReturnContext<string[]>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param projectId Type: uint32, Indexed: false
   * @param qty Type: uint32, Indexed: false
   */
  burn(projectId: string | number, qty: string | number): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newAdmin_ Type: address, Indexed: false
   */
  changeAdmin(newAdmin_: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param typeId Type: uint16, Indexed: false
   * @param title Type: string, Indexed: false
   * @param price Type: uint256, Indexed: false
   * @param authorizedOnly Type: bool, Indexed: false
   * @param supplyLimit Type: uint128, Indexed: false
   * @param term Type: uint16, Indexed: false
   * @param apy Type: uint256, Indexed: false
   * @param stakedApy Type: uint256, Indexed: false
   * @param startTime Type: uint64, Indexed: false
   * @param endTime Type: uint64, Indexed: false
   */
  createProject(
    typeId: string | number,
    title: string,
    price: string,
    authorizedOnly: boolean,
    supplyLimit: string,
    term: string | number,
    apy: string,
    stakedApy: string,
    startTime: string,
    endTime: string
  ): MethodReturnContext;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param userAddress Type: address, Indexed: false
   * @param functionSignature Type: bytes, Indexed: false
   * @param sigR Type: bytes32, Indexed: false
   * @param sigS Type: bytes32, Indexed: false
   * @param sigV Type: uint8, Indexed: false
   */
  executeMetaTransaction(
    userAddress: string,
    functionSignature: string | number[],
    sigR: string | number[],
    sigS: string | number[],
    sigV: string | number
  ): MethodPayableReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param investor Type: address, Indexed: false
   * @param projectId Type: uint32, Indexed: false
   */
  getAssetAlloc(
    investor: string,
    projectId: string | number
  ): MethodConstantReturnContext<GetAssetAllocResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getChainId(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getDomainSeperator(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param account Type: address, Indexed: false
   * @param projectId Type: uint32, Indexed: false
   */
  getHoldingInfo(
    account: string,
    projectId: string | number
  ): MethodConstantReturnContext<HoldinginfoResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param user Type: address, Indexed: false
   */
  getNonce(user: string): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param projectId Type: uint32, Indexed: false
   */
  getProject(
    projectId: string | number
  ): MethodConstantReturnContext<ProjectinfoResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _owner Type: address, Indexed: false
   * @param _operator Type: address, Indexed: false
   */
  isApprovedForAll(
    _owner: string,
    _operator: string
  ): MethodConstantReturnContext<boolean>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param projectId Type: uint32, Indexed: false
   * @param qty Type: uint32, Indexed: false
   * @param to Type: address, Indexed: false
   */
  mint(
    projectId: string | number,
    qty: string | number,
    to: string
  ): MethodPayableReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  name(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  owner(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _paused Type: bool, Indexed: false
   */
  pause(_paused: boolean): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  paused(): MethodConstantReturnContext<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param projectId Type: uint32, Indexed: false
   */
  projectExists(
    projectId: string | number
  ): MethodConstantReturnContext<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  projectIndex(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  renounceOwnership(): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param from Type: address, Indexed: false
   * @param to Type: address, Indexed: false
   * @param ids Type: uint256[], Indexed: false
   * @param amounts Type: uint256[], Indexed: false
   * @param data Type: bytes, Indexed: false
   */
  safeBatchTransferFrom(
    from: string,
    to: string,
    ids: string[],
    amounts: string[],
    data: string | number[]
  ): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param from Type: address, Indexed: false
   * @param to Type: address, Indexed: false
   * @param id Type: uint256, Indexed: false
   * @param amount Type: uint256, Indexed: false
   * @param data Type: bytes, Indexed: false
   */
  safeTransferFrom(
    from: string,
    to: string,
    id: string,
    amount: string,
    data: string | number[]
  ): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param operator Type: address, Indexed: false
   * @param approved Type: bool, Indexed: false
   */
  setApprovalForAll(operator: string, approved: boolean): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _tokenId Type: uint256, Indexed: false
   * @param _newURI Type: string, Indexed: false
   */
  setCustomURI(_tokenId: string, _newURI: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param projectId Type: uint32, Indexed: false
   * @param status Type: bytes1, Indexed: false
   */
  setProjectStatus(
    projectId: string | number,
    status: string | number[]
  ): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newURI Type: string, Indexed: false
   */
  setURI(_newURI: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  staker(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param projectId Type: uint32, Indexed: false
   */
  supplyFor(projectId: string | number): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param interfaceId Type: bytes4, Indexed: false
   */
  supportsInterface(
    interfaceId: string | number[]
  ): MethodConstantReturnContext<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  symbol(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newOwner Type: address, Indexed: false
   */
  transferOwnership(newOwner: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _staker Type: address, Indexed: false
   */
  updateStaker(_staker: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _projectId Type: uint256, Indexed: false
   */
  uri(_projectId: string): MethodConstantReturnContext<string>;
}
