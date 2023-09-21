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
  StakerWrapper,
  StakerWrapperMethodNames,
  StakerWrapperEventsContext,
  StakerWrapperEvents
>;
export type StakerWrapperEvents =
  | 'AdminChanged'
  | 'BalanceDeposit'
  | 'BalanceWithdraw'
  | 'CollectRewards'
  | 'OwnershipTransferred'
  | 'StakeEvent';
export interface StakerWrapperEventsContext {
  AdminChanged(
    parameters: {
      filter?: { admin?: string | string[] };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  BalanceDeposit(
    parameters: {
      filter?: { who?: string | string[]; amount?: string | string[] };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  BalanceWithdraw(
    parameters: {
      filter?: { who?: string | string[]; amount?: string | string[] };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  CollectRewards(
    parameters: {
      filter?: {
        staker?: string | string[];
        projectId?: string | number | string | number[];
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
  StakeEvent(
    parameters: {
      filter?: { staker?: string | string[] };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
}
export type StakerWrapperMethodNames =
  | 'new'
  | 'admin'
  | 'calculateRewards'
  | 'changeAdmin'
  | 'collectRewards'
  | 'collectRewardsBy'
  | 'getHoldingInfo'
  | 'getHoldingInfoRaw'
  | 'getStakingInfo'
  | 'getStakingInfoRaw'
  | 'isProjectEnd'
  | 'owner'
  | 'pause'
  | 'paused'
  | 'renounceOwnership'
  | 'setHoldingInfoData'
  | 'setProjectMan'
  | 'stake'
  | 'transferOwnership'
  | 'unstake'
  | 'withdrawTo';
export interface AdminChangedEventEmittedResponse {
  admin: string;
}
export interface BalanceDepositEventEmittedResponse {
  who: string;
  amount: string;
}
export interface BalanceWithdrawEventEmittedResponse {
  who: string;
  amount: string;
}
export interface CollectRewardsEventEmittedResponse {
  staker: string;
  projectId: string | number;
  amount: string;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface StakeEventEventEmittedResponse {
  staker: string;
  amount: string;
}
export interface CollectRewardsByRequest {
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
export interface SetHoldingInfoDataRequest {
  qty: string;
  startTime: string;
  accumRewards: string;
  claimedRewards: string;
}
export interface StakerWrapper {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param _stableCoin Type: address, Indexed: false
   * @param _admin Type: address, Indexed: false
   */
  'new'(_stableCoin: string, _admin: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  admin(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: pure
   * Type: function
   * @param _amount Type: uint256, Indexed: false
   * @param _startTime Type: uint64, Indexed: false
   * @param _endTime Type: uint64, Indexed: false
   * @param apy Type: uint256, Indexed: false
   */
  calculateRewards(
    _amount: string,
    _startTime: string,
    _endTime: string,
    apy: string
  ): MethodConstantReturnContext<string>;
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
   * @param projectId Type: uint32, Indexed: false
   * @param rewardType Type: uint16, Indexed: false
   */
  collectRewards(
    projectId: string | number,
    rewardType: string | number
  ): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param projectId Type: uint32, Indexed: false
   * @param amount Type: uint256, Indexed: false
   * @param nonce Type: uint64, Indexed: false
   * @param sig Type: tuple, Indexed: false
   */
  collectRewardsBy(
    projectId: string | number,
    amount: string,
    nonce: string,
    sig: CollectRewardsByRequest
  ): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param user Type: address, Indexed: false
   * @param projectId Type: uint32, Indexed: false
   */
  getHoldingInfo(
    user: string,
    projectId: string | number
  ): MethodConstantReturnContext<HoldinginfoResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param user Type: address, Indexed: false
   * @param projectId Type: uint32, Indexed: false
   */
  getHoldingInfoRaw(
    user: string,
    projectId: string | number
  ): MethodConstantReturnContext<HoldinginfoResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _staker Type: address, Indexed: false
   * @param projectId Type: uint32, Indexed: false
   */
  getStakingInfo(
    _staker: string,
    projectId: string | number
  ): MethodConstantReturnContext<StakeinfoResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param user Type: address, Indexed: false
   * @param projectId Type: uint32, Indexed: false
   */
  getStakingInfoRaw(
    user: string,
    projectId: string | number
  ): MethodConstantReturnContext<StakeinfoResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param id Type: uint32, Indexed: false
   */
  isProjectEnd(id: string | number): MethodConstantReturnContext<boolean>;
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
   * @param user Type: address, Indexed: false
   * @param projectId Type: uint32, Indexed: false
   * @param holding Type: tuple, Indexed: false
   */
  setHoldingInfoData(
    user: string,
    projectId: string | number,
    holding: SetHoldingInfoDataRequest
  ): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _projectMan Type: address, Indexed: false
   */
  setProjectMan(_projectMan: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param projectId Type: uint32, Indexed: false
   * @param qty Type: uint32, Indexed: false
   */
  stake(projectId: string | number, qty: string | number): MethodReturnContext;
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
   * @param projectId Type: uint32, Indexed: false
   * @param qty Type: uint32, Indexed: false
   */
  unstake(
    projectId: string | number,
    qty: string | number
  ): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param amount Type: uint256, Indexed: false
   * @param to Type: address, Indexed: false
   */
  withdrawTo(amount: string, to: string): MethodReturnContext;
}
