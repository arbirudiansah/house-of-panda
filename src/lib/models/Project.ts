import mongoose, { Schema } from "mongoose"
import IProject from "@/lib/types/Project"

const ProjectAddress = new Schema({
    fullAddress: {
        type: String,
        required: true,
    },
    province: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    postalCode: {
        type: String,
        required: true,
    },
    latitude: Number,
    longitude: Number,
    maps_url: String,
}, { _id: false })

const ProjectSpecification = new Schema({
    name: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
}, { _id: false })

const ProjectTimeline = new Schema({
    project_start: {
        type: Date,
        required: true,
    },
    funding_start: {
        type: Date,
        required: true,
    },
    funding_end: {
        type: Date,
        required: true,
    },
}, { _id: false })

const ProjectOnchainData = new Schema({
    projectId: {
        type: Number,
        required: true,
        default: 0,
    },
    typeId: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    authorizedOnly: {
        type: Boolean,
        default: false,
    },
    supplyLimit: {
        type: Number,
        required: true,
    },
    term: {
        type: Number,
        required: true,
    },
    apy: {
        type: Number,
        required: true,
    },
    stakedApy: {
        type: Number,
        required: true,
    },
    trxHash: String,
    status: {
        type: String,
        default: "pending",
    }
}, { _id: false })

const ProjectSchema = new Schema<IProject>({
    name: { type: String, required: true },
    location: ProjectAddress,
    specifications: [ProjectSpecification],
    selling_points: [String],
    image_urls: [String],
    blueprint: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        minlength: 300,
        maxlength: 5000,
    },
    prospectus: {
        type: String,
        required: true,
    },
    amountRequired: {
        type: Number,
        required: true,
    },
    timeline: ProjectTimeline,
    onchainData: ProjectOnchainData,
    whitelisted: {
        type: Boolean,
        default: false,
    },
    active: {
        type: Boolean,
        default: true,
    },
    status: {
        type: String,
        enum: ['0x00', '0x01', '0x02', '0x03', '0x04'],
        default: "0x01"
    }
}, { timestamps: true })

const Project = mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema)

export default Project


