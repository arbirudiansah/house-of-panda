import moment from "moment";
import { z } from "zod";
import { transformNumber } from "../utils";
import { ProjectTerms } from "../consts";

export const ProjectSpecificationSchema = z.object({
    name: z.string(),
    value: z.string(),
});

export const ProjectAddressSchema = z.object({
    fullAddress: z.string(),
    province: z.string(),
    city: z.string(),
    district: z.string(),
    postalCode: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    maps_url: z.string(),
});

export const ProjectTimelineSchema = z.object({
    project_start: z.string(),
    funding_start: z.string(),
    funding_end: z.string(),
});

export const ProjectParamsSchema = z.object({
    id: z.number(),
    name: z.string(),
});

export const ProjectOnchainDataSchema = z.object({
    projectId: z.number(),
    typeId: z.number(),
    price: z.number(),
    authorizedOnly: z.boolean(),
    supplyLimit: z.number(),
    term: z.number(),
    apy: z.number(),
    stakedApy: z.number(),
    trxHash: z.string(),
    status: z.string(),
});

export const ProjectPayloadSchema = z.object({
    name: z.string(),
    image_urls: z.array(z.string()),
    description: z.string(),
    location: ProjectAddressSchema,
    specifications: z.array(ProjectSpecificationSchema),
    selling_points: z.array(z.string()),
    blueprint: z.string(),
    prospectus: z.string(),
    amountRequired: z.number(),
    timeline: ProjectTimelineSchema,
    onchainData: ProjectOnchainDataSchema,
});

export const SetProjectStatusSchema = z.object({
    id: z.string(),
    status: z.enum([
        '0x00',
        '0x01',
        '0x02',
        '0x03',
        '0x04'
    ]),
})

export type ProjectSpecification = z.infer<typeof ProjectSpecificationSchema>;
export type ProjectAddress = z.infer<typeof ProjectAddressSchema>;
export type ProjectTimeline = z.infer<typeof ProjectTimelineSchema>;
export type ProjectParams = z.infer<typeof ProjectParamsSchema>;
export type ProjectOnchainData = z.infer<typeof ProjectOnchainDataSchema>;
export type ProjectPayload = z.infer<typeof ProjectPayloadSchema>;

export interface UpdateProjectPayload {
    name: string;
    image_urls: string[];
    description: string;
    location: ProjectAddress;
    specifications: ProjectSpecification[];
    selling_points: string[];
    blueprint: string;
    prospectus: string;
    timeline: ProjectTimeline;
}

interface IProject {
    id: string;
    name: string;
    image_urls: string[];
    description: string;
    location: ProjectAddress;
    specifications: ProjectSpecification[];
    selling_points: string[];
    blueprint: string;
    prospectus: string;
    amountRequired: number;
    timeline: ProjectTimeline;
    onchainData: ProjectOnchainData;
    active: boolean;
    status: string;
    whitelisted: boolean;
    createdAt: string;
    updatedAt: string;
    meta: any;
}

export const FormProjectStep1Schema = z.object({
    name: z.string()
        .min(8, { message: 'Project name cannot empty' })
        .max(50, { message: 'Project name max length is 50 characters' }),
    image_urls: z.any().refine((e: undefined | File[]) => e && e?.length > 0, {
        message: "Please select project image(s) to upload",
    }),
    description: z.string().min(300, {
        message: 'This field is requires at least 300 characters'
    }).max(5000, {
        message: 'This field max length is 5000 characters'
    }),
    location: z.object({
        fullAddress: z.string().min(10, { message: 'This field is requires at least 10 characters' }),
        province: z.string().refine(d => d !== 'null', { message: 'This field is required' }),
        city: z.string().refine(d => d !== 'null', { message: 'This field is required' }),
        district: z.string().refine(d => d !== 'null', { message: 'This field is required' }),
        postalCode: z.string().min(5, { message: 'Invalid postal code' }),
        latitude: z.any().transform(transformNumber),
        longitude: z.any().transform(transformNumber),
        maps_url: z.string().refine(url => {
            const latLng = /\/\@(.*),(.*),/.exec(url);
            return latLng !== null && latLng.length >= 3
        }, {
            message: "Google maps url is not valid",
        }),
    }).required(),
    typeId: z.string().refine(d => d !== 'null', {
        message: 'This field is required'
    }),
})

export const FormProjectStep2Schema = z.object({
    specifications: z.any().refine((e: undefined | ProjectSpecification[]) => e && e.length >= 3, {
        message: "Please add at least 3 specifications",
    }).refine((e: undefined | ProjectSpecification[]) => e && e.every(({ name, value }) => name && value), {
        message: "Invalid specification values"
    }),
    sellingPoints: z.any().refine((e: undefined | string[]) => e && e.length >= 3, {
        message: "Please add at least 3 selling points",
    }).refine((e: string[]) => e.every(d => d !== ''), {
        message: "Invalid selling point values"
    }),
    blueprint: z.any().refine((e: undefined | File) => e !== undefined, {
        message: 'Please select the project blueprint'
    }),
    prospectus: z.any().refine((e: undefined | File) => e !== undefined, {
        message: 'Please select the project prospectus'
    }),
})

const checkDate = (t: any, start: string, end: string) => {
    if (t === '0') return true

    const term = ProjectTerms[t]
    if (term) {
        const [amount, unit] = term.split(' ')
        const projDur = moment(start).add(
            parseInt(amount),
            unit.toLowerCase() as moment.unitOfTime.DurationConstructor
        ).add(-1, 'day')
        const fundEnd = moment(end)
        return fundEnd.isSameOrBefore(projDur)
    }

    return false
}

export const FormProjectStep3Schema = z.object({
    amount: z.any().transform(transformNumber),
    price: z.any().transform(transformNumber),
    authorizedOnly: z.boolean(),
    supplyLimit: z.any().transform(transformNumber),
    term: z.any().refine(t => t !== 'null', { message: 'Invalid project duration' }),
    apy: z.any().transform(transformNumber),
    stakedApy: z.any().transform(transformNumber),
    project_start: z.any().refine(d => moment(d, 'YYYY-MM-DD', true).isValid(), {
        message: "Invalid date value",
    }),
    funding_start: z.string().refine(d => moment(d, 'YYYY-MM-DD', true).isValid(), {
        message: "Invalid date value",
    }),
    funding_end: z.string().refine(d => moment(d, 'YYYY-MM-DD', true).isValid(), {
        message: "Invalid date value",
    }),
}).refine((check) => moment(check.funding_end).isAfter(check.funding_start), {
    message: 'Invalid date value',
    path: ['funding_start'],
}).refine((check) => checkDate(check.term, check.funding_start, check.funding_end), {
    message: 'Date must be between/same with the project duration',
    path: ['funding_end'],
})

export type FormProjectStep1 = z.infer<typeof FormProjectStep1Schema>;
export type FormProjectStep2 = z.infer<typeof FormProjectStep2Schema>;
export type FormProjectStep3 = z.infer<typeof FormProjectStep3Schema>;

export default IProject;