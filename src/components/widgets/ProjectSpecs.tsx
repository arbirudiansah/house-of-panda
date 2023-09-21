import { BathroomIcon, BedIcon, BuildingAreaIcon, CarportIcon, ElectricalIcon, MapIcon } from '@/components/icons'
import CertificateIcon from '@/components/icons/CertificateIcon'
import FullFurnishedIcon from '@/components/icons/FullFurnishedIcon'
import GardenIcon from '@/components/icons/GardenIcon'
import PropertyConditionIcon from '@/components/icons/PropertyConditionIcon'
import SwimmingPoolIcon from '@/components/icons/SwimmingPoolIcon'

export const ProjectSpecs: { text: string, icon?: () => JSX.Element }[] = [
    { text: "Bedrooms", icon: BedIcon },
    { text: "Bathrooms", icon: BathroomIcon },
    { text: "Carport", icon: CarportIcon },
    { text: "Certificate", icon: CertificateIcon },
    { text: "Building Area", icon: BuildingAreaIcon },
    { text: "Land Size", icon: MapIcon },
    { text: "Power", icon: ElectricalIcon },
    { text: "Property Condition", icon: PropertyConditionIcon },
    { text: "Full Furnished", icon: FullFurnishedIcon },
    { text: "Swimming Pool", icon: SwimmingPoolIcon },
    { text: "Garden", icon: GardenIcon },
]