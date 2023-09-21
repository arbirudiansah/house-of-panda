import type { NextPage } from "next";
import * as z from 'zod';
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as adminAuth from "@/lib/store/slices/adminAuth";
import HopLogo from "@/components/icons/HopLogo";
import FormInput from "@/components/widgets/FormInput";
import Button from "@/components/widgets/Button";
import { MessageError } from "@/components/widgets/MessageError";
import Head from "next/head";

const schema = z.object({
	email: z.string().email({
		message: 'Invalid email address'
	}).trim(),
	password: z.string({
		required_error: 'Password is required'
	}).min(8, {
		message: 'Password requires 8 characters',
	}).trim(),
});

const Login: NextPage = () => {
	const { isLoading, authError } = useAppSelector((state) => state.adminAuth)
	const dispatch = useAppDispatch()
	const router = useRouter();

	const forms = useForm({ resolver: zodResolver(schema) });

	const onSubmit = async (data: any) => {
		dispatch(adminAuth.login(data)).unwrap().then((res: any) => {
			if (res) {
				router.push(`${router.query.redirectUrl ?? '/dashboard'}`);
			}
		});
	}

	return (
		<>
			<Head>
				<title>Admin Login | House of Panda</title>
			</Head>

			<div className="h-screen">
				<div className="grid grid-cols-12 items-center h-screen">
					<div className="box-border py-16 rounded-r-3xl bg-primary h-screen col-span-3 hidden md:block">
						<div className="flex flex-col my-36">
							<div className="p-10">
								<div className="mb-5">
									<HopLogo fill="white" white={true} />
								</div>
								<div className="box-border w-96 h-auto">
									<div className="my-4">
										<h1 className="text-4xl text-white font-bold">Welcome Back, To Admin Panel</h1>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="col-span-12 md:col-span-9">
						<div className="max-w-xl mx-auto">
							<div className="px-16 md:px-20">
								<div className="mb-5 block md:hidden">
									<HopLogo />
								</div>
								<h1 className="text-3xl text-black font-bold">
									Login
								</h1>
								<div className="mb-4 mt-2 mr-5">
									<p>
										Join with us and growth your business.
									</p>
								</div>
								<FormProvider {...forms}>
									<form onSubmit={forms.handleSubmit(onSubmit)}>
										<FormInput type={"email"} label={"Email Address"} name={"email"} className="mb-4" required />
										<FormInput type={"password"} label={"Password"} name={"password"} className="mb-4" required />

										<MessageError message={authError} />

										<Button title="Login" className="w-full justify-center" isLoading={isLoading} />
									</form>
								</FormProvider>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Login;