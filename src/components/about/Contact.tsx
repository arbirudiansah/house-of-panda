/* eslint-disable @next/next/no-img-element */
import { faker } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import * as z from 'zod';
import OnViewTransition, { variant } from "../animations/OnViewTransition";
import Button from "../widgets/Button";
import FormInput from "../widgets/FormInput";
import FormTextarea from "../widgets/FormTextarea";

const schema = z.object({
    name: z.string()
        .min(5, { message: 'Name requires at least 5 characters' })
        .trim(),
    email: z.string()
        .email({ message: 'Email address is not valid' })
        .trim(),
    phoneNum: z.string()
        .regex(/^\(?([0-9]{4})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{2,4})$/, {
            message: 'Phone Number is not valid',
        })
        .trim(),
    subject: z.string().nullable(),
    message: z.string()
        .min(10, { 'message': 'Message requires at least 10 characters' })
        .trim(),
})

type FormType = z.infer<typeof schema>;

const Contact = () => {
    const forms = useForm<FormType>({ resolver: zodResolver(schema) })

    const onSubmit = async (data: FormType) => {

    }

    return (
        <div id="contact" className="w-full py-4 flex flex-col lg:py-20 lg:grid lg:grid-cols-2 gap-8 md:gap-16 mb-4">
            <OnViewTransition variants={variant.fadeInRight}>
                <div className="flex flex-col gap-6">
                    {/* <div className="flex justify-center lg:justify-start">
                        <img src="/img/contact.svg" alt="contact" className="w-[60%] mb-4" />
                    </div> */}
                    <div className="inline-flex space-x-5 items-center">
                        <div className="w-12 min-w-[48px] h-12 bg-primary rounded-full text-white flex justify-center items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-semibold">Address</h3>
                            <p className="text-xl text-secondary">
                                51 GoldHill Plaza, #07-10/11, Singapore 308900
                            </p>
                        </div>
                    </div>
                    <div className="inline-flex space-x-5 items-center">
                        <div className="w-12 h-12 bg-primary rounded-full text-white flex justify-center items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-semibold">Email</h3>
                            <p className="text-xl text-secondary">info@houseofpanda.co</p>
                        </div>
                    </div>
                    <div className="inline-flex space-x-5 items-center">
                        <div className="w-12 h-12 bg-primary rounded-full text-white flex justify-center items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0l6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-semibold">Phone Number</h3>
                            <p className="text-xl text-secondary">+62 21 2696 3218 (Fixed Line)</p>
                            <p className="text-xl text-secondary">+62 851-8633-7744 (Whatsapp)</p>
                        </div>
                    </div>
                    <div className="inline-flex space-x-5 items-center">
                        <div className="w-12 h-12 bg-primary rounded-full text-white flex justify-center items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-semibold">Company</h3>
                            <p className="text-xl text-secondary">IGMX International PTE. LTD. (m.k.al)</p>
                            <p className="text-xl text-secondary">
                                51 GoldHill Plaza, #07-10/11, Singapore 308900
                            </p>
                        </div>
                    </div>
                </div>
            </OnViewTransition>
            <div>
                <OnViewTransition variants={variant.fadeInLeft}>
                    <div className="mb-6">
                        <p className="text-primary">Contact Us Now</p>
                        <h1 className="text-secondary text-3xl font-bold">Write a Message</h1>
                    </div>
                    <FormProvider {...forms}>
                        <form onSubmit={forms.handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-2 gap-4 md:gap-4 mb-2">
                                <FormInput type="text" label="" placeholder="Full Name" name="name" />
                                <FormInput type="email" label="" placeholder="Email Address" name="email" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 md:gap-4 mb-2">
                                <FormInput type="text" label="" placeholder="Phone Number" name="phoneNum" />
                                <FormInput type="text" label="" placeholder="Subject" name="subject" />
                            </div>
                            <div className="mb-6">
                                <FormTextarea label="" placeholder="Message" name="message" rows={6} />
                            </div>
                            <Button title="Send Message" className="pb-4 pt-4 text-xl text-white font-semibold" />
                        </form>
                    </FormProvider>
                </OnViewTransition>
            </div>
        </div>
    )
}

export default Contact;