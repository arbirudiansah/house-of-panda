/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import moment from "moment"
import { useEffect, useRef, useState } from "react"
import * as z from 'zod'
import { ZodError } from "zod"
import { updateProfile } from "@/lib/store/slices/profile"
import { notify } from "@/lib/store/slices/message"
import IconButton from "@/components/widgets/IconButton"
import CheckIcon from "@/components/icons/CheckIcon"
import EditIcon from "@/components/icons/EditIcon"
import Head from "next/head"
import { modal } from "@/lib/store/slices/modal"
import ChangeEmailForm from "@/components/forms/FormChangeEmail"
import ChangePasswordForm from "@/components/forms/FormChangePassword"
import dynamic from "next/dynamic"
const DashboardLayout = dynamic(() => import('@/components/layout/DashboardLayout'), { ssr: false })

const fullNameVal = z.string()
    .min(5, { message: 'Full Name must be at least 5 characters' })
    .max(30, { message: 'Full Name cannot be longer than 30 characters' })
    .trim()

const ProfilePage: NextPage = () => {
    const { user } = useAppSelector((state) => state.profile)
    const dispatch = useAppDispatch()

    const fullNameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const [editable, setEditable] = useState(false)

    const handleFullNameEdit = async () => {
        if (fullNameRef.current && editable) {
            if (fullNameRef.current.value !== user?.fullName) {
                try {
                    const fullName = fullNameRef.current.value
                    await fullNameVal.parseAsync(fullName)
                    dispatch(updateProfile({ fullName }))
                        .unwrap()
                        .then(_ => notify.test('Profile updated'))
                    setEditable(false)
                } catch (error) {
                    if (error instanceof ZodError) {
                        notify.error(error.errors[0].message)
                    }
                }
            } else {
                setEditable(false)
            }
        } else {
            setEditable(true)
        }
    }

    const showEditEmailModal = () => modal.showModal(<ChangeEmailForm />)

    const showChangePasswordModal = () => modal.showModal(<ChangePasswordForm />)

    useEffect(() => {
        if (fullNameRef.current && user) {
            fullNameRef.current.value = user.fullName
        }
    }, [fullNameRef, user])

    return (
        <>
            <Head>
                <title>Profile | House of Panda</title>
            </Head>
            <DashboardLayout breadcrumbs={[{ title: 'Profile' }]}>
                <div className="flex justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-semibold leading-loose text-gray-800">Profile</h1>
                    </div>
                    <div>
                    </div>
                </div>
                <div>
                    <div className="mb-4 bg-white rounded-md px-8 py-5 shadow-sm grid items-center grid-cols-6">
                        <div className="col-span-2 text-base inline-block font-semibold text-secondary mb-2">Full Name</div>
                        <div className="flex gap-4 items-center col-span-4">
                            <input
                                ref={fullNameRef}
                                type={'text'}
                                disabled={!editable}
                                maxLength={30}
                                className={`border focus:ring focus:ring-opacity-50 border-gray-300 focus:border-gray-300 focus:ring-gray-200 w-4/5 md:w-2/4 text-base font-medium bg-transparent rounded-lg py-3 px-4`}
                            />
                            <IconButton
                                width=""
                                border={false}
                                type={editable ? "success" : "secondary"}
                                title={editable ? "Save" : "Edit"}
                                onClick={handleFullNameEdit}
                                icon={editable ? <CheckIcon /> : <EditIcon fill="#6A6581" />}
                            />
                        </div>
                    </div>
                    <div className="mb-4 bg-white rounded-md px-8 py-5 shadow-sm grid items-center grid-cols-6">
                        <div className="col-span-2 text-base inline-block font-semibold text-secondary mb-2">Email</div>
                        <div className="flex gap-4 items-center col-span-4">
                            <input
                                type={'text'}
                                disabled
                                ref={emailRef}
                                value={user?.email}
                                className={`border border-gray-300 focus:ring focus:ring-opacity-50 focus:border-gray-300 focus:ring-gray-200 w-4/5 md:w-2/4 text-base font-medium bg-transparent rounded-lg py-3 px-4`}
                            />
                            <IconButton width="" onClick={showEditEmailModal} type="secondary" title="Change" icon={<EditIcon fill="#6A6581" />} />
                        </div>
                    </div>
                    <div className="mb-8 bg-white rounded-md px-8 py-5 shadow-sm grid grid-cols-6 items-start">
                        <div className="text-base font-medium text-secondary mb-2 col-span-2 flex flex-col gap-4">
                            Password
                            <span className="text-[#868686] italic text-xs font-normal">Last updated {moment(user?.updatedAt).format("DD MMM YYYY HH:mm")}</span>
                        </div>
                        <div className="col-span-4 justify-start items-start">
                            <IconButton
                                width="w-fit"
                                border={false}
                                onClick={showChangePasswordModal}
                                type={editable ? "success" : "secondary"}
                                title={"Change Password"}
                                icon={<EditIcon fill="#6A6581" />}
                            />
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    )
}

export default ProfilePage