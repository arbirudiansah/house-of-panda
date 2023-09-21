/* eslint-disable @next/next/no-img-element */
import Footer from "@/components/Footer"
import OnViewTransition, { variant } from "@/components/animations/OnViewTransition"
import ProjectCard from "@/components/cards/ProjectCard"
import { HelpIcon2, InvestIcon, NFTIcon, PriceIcon, ProjectIcon } from "@/components/icons"
import MainNavbar from "@/components/layout/MainNavbar"
import Button from "@/components/widgets/Button"
import OutlinedButton from "@/components/widgets/OutlinedButton"
import * as db from "@/lib/Database"
import * as projectRepo from "@/lib/repository/ProjectRepository"
import IProject from "@/lib/types/Project"
import { motion } from "framer-motion"
import { GetServerSideProps, NextPage } from "next"
import { NextSeo } from "next-seo"
import Link from "next/link"
import { useRouter } from "next/router"
import { HoPLocations } from "../lib/consts"
import whitelistRepo from "@/lib/repository/WhitelistRepository"

const LandingPage: NextPage<{ data: IProject[] }> = ({ data = [] }) => {
	const router = useRouter()


	const fundingRoadmaps: {
		title: string,
		description: string | JSX.Element,
		delay: number,
		icon: JSX.Element
	}[] = [
			{
				icon: InvestIcon(),
				delay: 0.65,
				title: 'Borrowers take loans',
				description: 'Your investment gives borrowers capital to support short-term real estate developments'
			},
			{
				icon: ProjectIcon(),
				title: 'Rights are issued in the form of NFTs',
				description: 'NFTs will be given as proof of your investment',
				delay: 0.7
			},
			{
				icon: NFTIcon(),
				title: 'HOP manages & collects the payments',
				description: 'Borrowers pay monthly interest on their real estate loans',
				delay: 0.75
			},
			{
				icon: PriceIcon(),
				title: 'You get paid',
				description: <>
					You receive your share of those monthly payments, along with others who invest in the project.
					<br />
					<br />
					You can sell the rights by the project’s end or reinvest them into another project
				</>,
				delay: 0.8
			}
		]





	return (
		<>
			<NextSeo />

			<>
				<MainNavbar />
				<main className="w-full overflow-x-hidden">
					<motion.div
						key={"main"}
						className="p-4 md:p-16 relative bg-no-repeat md:mb-28"
						style={{
							backgroundImage: "url('/img/bg-0.svg')",
							backgroundPosition: "right 30%",
							backgroundSize: "90%"
						}}
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.35 }}
					>
						<div className="text-gray-800 py-6 md:py-20 text-center md:text-left">
							<OnViewTransition>
								<h1 className="text-4xl md:text-6xl font-bold md:w-[45%]">
									Welcome to The Future of <span className="text-primary">Real Estate Investing</span>
								</h1>
							</OnViewTransition>
							<OnViewTransition transition={{ delay: 0.6 }}>
								<div className="my-6">
									<h2 className="text-base font-light md:max-w-[35%]">
										House of Panda is an NFT-based real estate investment platform that gives you access to yield, short-term loans. Choose which real estate projects you want to fund. As the developers pay back their loans, you make money. It&apos;s that easy!
									</h2>
								</div>
							</OnViewTransition>
							<OnViewTransition transition={{ delay: 0.65 }}>
								<div className="inline-flex space-x-4">
									<OutlinedButton onClick={() => router.push('/about-us')} title="Learn More" />
									<Button onClick={() => router.push('/project/explore')} title="Explore" />
								</div>
							</OnViewTransition>
						</div>

						<div className="absolute bottom-0 right-0 hidden md:block">
							<OnViewTransition variants={variant.fadeInLeft}>
								<img src="/img/house-1.png" className="w-full" alt="" />
							</OnViewTransition>
						</div>
					</motion.div>

					<div className="p-4 md:px-16 md:py-20">
						<div className="mb-10">
							<OnViewTransition>
								<div className="flex justify-between items-center mb-10">
									<h1 className="text-2xl md:text-4xl font-semibold text-gray-800">
										Top Property Today
									</h1>
									<Link href="/project/explore">
										<a className="border py-3 px-4 rounded-md hover:bg-primary hover:border-primary hover:text-white">
											All Property
										</a>
									</Link>
								</div>
							</OnViewTransition>
							<div className="grid grid-cols-1 md:grid-cols-4 gap-5">
								{data.map((item, i) => {
									return (
										<div key={i}>
											<OnViewTransition transition={{ duration: 0.5 + (i / 10) }}>
												<ProjectCard item={item} />
											</OnViewTransition>
										</div>
									)
								})}
							</div>
						</div>

						<div className="mb-6 md:mb-10">
							<div className="p-0 md:p-10">
								<OnViewTransition>
									<h1 className="text-center text-3xl md:text-5xl font-semibold">
										Your Funding Roadmap
									</h1>
								</OnViewTransition>
								<OnViewTransition transition={{ delay: 0.6 }}>
									<p className="py-6 md:py-10 px-0 md:px-80 text-center text-base text-gray-400 font-light">
										A funding roadmap can help the organization to communicate its funding needs and goals to potential investors and stakeholders, and to track its progress towards meeting those goals.
									</p>
								</OnViewTransition>
							</div>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-5">
								{fundingRoadmaps.map((item, id) => (
									<OnViewTransition key={id} transition={{ delay: item.delay }}>
										<div className="border h-full p-6 rounded-md flex flex-col text-center md:text-left items-center md:items-start">
											<div className="mb-3">
												{item.icon}
											</div>
											<h2 className="mb-3 text-xl font-semibold text-gray-700">{item.title}</h2>
											<p className="text-sm text-gray-400">
												{item.description}
											</p>
										</div>
									</OnViewTransition>
								))}
							</div>
						</div>

						<div className="mb-4 md:mb-10">
							<div className="p-0 md:p-10">
								<OnViewTransition>
									<h1 className="text-center text-3xl md:text-5xl font-semibold">
										Nurturing communities, one property at a time
									</h1>
								</OnViewTransition>
								<OnViewTransition transition={{ delay: 0.6 }}>
									<p className="py-6 md:py-10 px-0 md:px-80 text-center text-base text-gray-400 font-light">
										Choose which cities you would like to invest in. Your investment supports borrowers in enhancing their property, creating jobs and nourishing local communities.
									</p>
								</OnViewTransition>
							</div>
							<OnViewTransition>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-5 h-[235px]">
									{HoPLocations.map((item, i) => (
										<div key={i} onClick={() => router.push(item.to)} className="transition-all ease-in-out hover:cursor-pointer hover:opacity-75 rounded-lg bg-center bg-no-repeat h-full bg-cover"
											style={{
												backgroundImage: `url('${item.img}')`
											}}
										>
											<div className="flex justify-center h-full items-center">
												<span className="text-lg text-white font-semibold">
													{item.name}
												</span>
											</div>
										</div>
									))}
								</div>
							</OnViewTransition>
						</div>
					</div>

					<div className="w-full bg-gray-800">
						<div className="py-8 md:py-12 px-4 md:px-40 flex flex-col-reverse md:flex-row items-center bg-no-repeat justify-between" style={{
							backgroundImage: "url('/img/bg-1.svg')",
							backgroundPosition: "right top",
							backgroundSize: "50%"
						}}>
							<OnViewTransition variants={variant.fadeInRight}>
								<div className="text-center md:text-left">
									<div className="mb-5">
										<h1 className="text-2xl md:text-5xl font-semibold text-white">
											Stake Your Property <br />
											& Claim <span className="text-pink-500">Rewards</span>
										</h1>
									</div>
									<div className="mb-5 md:max-w-[60%]">
										<span className="text-sm text-gray-400">
											HOP allows you to expand and enhance your funding options for your real estate project, connecting you with investors all across the globe. Hop in to find out more.
										</span>
									</div>
									<div className="flex items-center justify-center md:justify-start space-x-4">
										<Button onClick={() => router.push('/project/explore')} title="Start Earning" className="text-black bg-white" />
										<button>
											<HelpIcon2 width={22} height={22} />
										</button>
									</div>
								</div>
							</OnViewTransition>
							<OnViewTransition variants={variant.fadeInLeft}>
								<div className="md:-mb-10 flex justify-center bg-no-repeat">
									<img src="/img/house-2.png" alt="" className="w-[60%] md:w-full" />
								</div>
							</OnViewTransition>
						</div>
					</div>
					<Footer />
				</main>
			</>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	try {
		await db.createConnection()
		const user = req.cookies['user'] ? JSON.parse(req.cookies['user']) : null
		let addressIsWhitelisted = false

		const redis = await db.createRedisConnection()
		const isInWhitelistPeriod = await whitelistRepo.isInWhitelistPeriod(redis)
		if (user) {
			addressIsWhitelisted = await whitelistRepo.addressIsWhitelisted(redis, user.address)
		}

		const whitelistActive = isInWhitelistPeriod && addressIsWhitelisted

		const { entries } = await projectRepo.getProjectList({ limit: 4, active: true, public: true })
		const data = entries.map((item) => {
			return {
				...item,
				whitelisted: whitelistActive && item.whitelisted,
			}
		})

		return { props: { data: JSON.parse(JSON.stringify(data)) } }
	} catch (error) {
		return { props: { data: [] } }
	}
}

export default LandingPage