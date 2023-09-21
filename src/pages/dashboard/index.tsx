/* eslint-disable @next/next/no-img-element */
import FormTopup from "@/components/forms/FormTopup";
import FormWithdraw from "@/components/forms/FormWithdraw";
import { MoneyCircleIcon, PropertyIcon, TetherIcon, TopupIcon, TransactionIcon, UserIcon, WithdrawIcon } from "@/components/icons";
import EthIcon from "@/components/icons/EthIcon";
import Button from "@/components/widgets/Button";
import { getProjectsCount } from "@/lib/repository/ProjectRepository";
import { getMintedNFTs, getTransactionsCount, getUsersCount } from "@/lib/repository/TransactionRepository";
import { modal } from "@/lib/store/slices/modal";
import { getEthTetherPrice, getTetherPrice, maskAddress } from "@/lib/utils";
import { BlackRoof, createProvider } from "@/lib/web3/BlackRoof";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";

import dynamic from "next/dynamic"
const DashboardLayout = dynamic(() => import('@/components/layout/DashboardLayout'), { ssr: false })

interface Props {
	projectsCount: number;
	trxsCount: number;
	usersCount: number;
	mintedNFTs: number;
}

const blackRoof = new BlackRoof(createProvider())

const Dashboard: NextPage<{ data: Props }> = ({ data }) => {
	const { projectsCount, trxsCount, usersCount, mintedNFTs } = data
	const [balance, setBalance] = useState(0)
	const [ethBalance, setEthBalance] = useState(0)
	const [idrPrice, setIdrPrice] = useState(0)
	const [ethIdrPrice, setEthIdrPrice] = useState(0)
	const [owner, setOwner] = useState("")

	const withdraw = () => {
		modal.showModal(
			<FormWithdraw
				ownerAddress={owner}
				balance={balance}
				callback={() => {
					blackRoof.getSCBalance().then(setBalance)
				}}
			/>
		)
	}

	const topup = () => {
		modal.showModal(
			<FormTopup
				ownerAddress={owner}
				callback={() => {
					blackRoof.getSCBalance().then(setBalance)
				}}
			/>
		)
	}

	useEffect(() => {
		blackRoof.getSCBalance().then(setBalance)
		blackRoof.getETHBalance().then(setEthBalance)
		blackRoof.getAdminAddress().then(setOwner)
		getEthTetherPrice().then(([eth, tether]) => {
			setEthIdrPrice(eth)
			setIdrPrice(tether)
		})
	}, [])

	return (
		<>
			<Head>
				<title>Dashboard | House of Panda</title>
			</Head>

			<DashboardLayout>
				<div className="flex justify-between mb-6">
					<h1 className="text-2xl font-semibold leading-loose text-gray-800">Dashboard</h1>
				</div>
				<div className="grid grid-cols-3 gap-4">
					<div className="bg-white rounded-xl relative">
						<div className="flex h-full flex-col justify-between bg-primary bg-opacity-5 rounded-xl px-5 py-5 border border-primary">
							<div className="grid grid-cols-2 gap-4 justify-start items-center">
								<div>
									<p className="text-base text-gray-500 mb-2">Balance Details</p>
									<div className="flex flex-col">
										<div className="inline-flex items-center space-x-2 mb-1">
											<TetherIcon />
											<p className="text-xl font-semibold text-primary">{balance.toMoney()} USDT</p>
										</div>
										<p className="font-medium text-secondary">≈ Rp{(idrPrice * balance).toMoney()}</p>
									</div>
								</div>
								<div>
									<p className="text-base text-gray-500 mb-2">Admin Balance</p>
									<div className="flex flex-col">
										<div className="inline-flex items-center space-x-2 mb-1">
											<EthIcon width={24} height={24} />
											<p className="text-xl font-semibold text-primary">{ethBalance.toMoney()} ETH</p>
										</div>
										<p className="font-medium text-secondary">≈ Rp{(ethIdrPrice * ethBalance).toMoney()}</p>
									</div>
								</div>
							</div>
							<div className="my-5 inline-flex justify-between items-center">
								<div>
									<p className="text-xs text-gray-500">HoP Address</p>
									<a target="_blank" title="View Block Explorer" rel="noreferrer" href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}address/${blackRoof.address}`} className="text-primary text-lg">
										{maskAddress(blackRoof.address)}
									</a>
								</div>
								<div>
									<p className="text-xs text-gray-500">Staker Address</p>
									<a target="_blank" title="View Block Explorer" rel="noreferrer" href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}address/${blackRoof.stakerAddress}`} className="text-primary text-lg">
										{maskAddress(blackRoof.stakerAddress)}
									</a>
								</div>
								<div>
									<p className="text-xs text-gray-500">Admin Address</p>
									<a target="_blank" title="View Block Explorer" rel="noreferrer" href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}address/${owner}`} className="text-primary text-lg">
										{maskAddress(owner)}
									</a>
								</div>
							</div>
							<div className="flex gap-4 items-center mt-4">
								<Button
									title="Withdraw"
									onClick={withdraw}
									className="w-full justify-center bg-secondary"
									prefix={<WithdrawIcon width={16} height={16} />}
								/>
							</div>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-2">
						<div className="flex items-center gap-4 bg-white rounded-xl px-5 py-5 border">
							<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
								<MoneyCircleIcon />
							</div>
							<div>
								<p className="text-sm text-gray-400">Minted NFTs</p>
								<p className="text-2xl font-semibold text-primary">{mintedNFTs}</p>
							</div>
						</div>
						<div className="flex items-center gap-4 bg-white rounded-xl px-5 py-5 border">
							<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white">
								<PropertyIcon className="w-6 h-6" />
							</div>
							<div>
								<p className="text-sm text-gray-400">Total Projects</p>
								<p className="text-2xl font-semibold text-primary">{projectsCount}</p>
							</div>
						</div>
						<div className="flex items-center gap-4 bg-white rounded-xl px-5 py-5 border">
							<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white">
								<TransactionIcon className="w-6 h-6" />
							</div>
							<div>
								<p className="text-sm text-gray-400">Total Transactions</p>
								<p className="text-2xl font-semibold text-primary">{trxsCount.toLocaleString()}</p>
							</div>
						</div>
						<div className="flex items-center gap-4 bg-white rounded-xl px-5 py-5 border">
							<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white">
								<UserIcon className="w-6 h-6" />
							</div>
							<div>
								<p className="text-sm text-gray-400">Total Users</p>
								<p className="text-2xl font-semibold text-primary">{usersCount.toLocaleString()}</p>
							</div>
						</div>
					</div>
				</div>
			</DashboardLayout>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	try {
		const projectsCount = await getProjectsCount()
		const trxsCount = await getTransactionsCount()
		const usersCount = await getUsersCount()
		const mintedNFTs = await getMintedNFTs()

		return {
			props: {
				data: {
					projectsCount,
					trxsCount,
					usersCount,
					mintedNFTs,
				}
			}
		}
	} catch (error) {
		return {
			props: {
				data: {
					projectsCount: 0,
					trxsCount: 0,
					usersCount: 0,
					mintedNFTs: 0,
				}
			}
		}
	}
}

export default Dashboard;

