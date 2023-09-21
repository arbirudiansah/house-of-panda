/**
 * @dev Creates a new project. This can only be done by the contract admin or owner.
 * @param typeId project type.
 * @param title Title of the project.
 * @param price Price to mint one NFT from this project (in wei). Cannot be zero if `authorizedOnly`=true.
 * @param authorizedOnly If true the project only mintable by admin.
 * @param supplyLimit Supply limit of the project. Minting will fail if max limit reached.
 * @param term Term of the project. 0: no term, 1: 1 month, 2: 3 months, 3: 6 months, 4: 1 year, 5: 2 years, 6: 3 years, 7: 4 years, 8: 5 years.
 * @param apy APY of the project.
 * @param stakedApy APY for staked NFT.
 */

import { toQueryString } from './utils'

export const ProjectTypes = ['House', 'Home Office', 'Land', 'Apartment']
export const ProjectTerms: { [key: number]: string } = {
  1: '1 Month',
  2: '2 Months',
  3: '3 Months',
  4: '4 Months',
  6: '6 Months',
  12: '1 Year',
  24: '2 Years',
  36: '3 Years',
  48: '4 Years',
  60: '5 Years',
}

export const UNITS = Math.pow(10, 6)

export const ProjectStatus: { [key: string]: string } = {
  '0x00': 'Not Active',
  '0x01': 'Active',
  '0x02': 'Unavailable',
  '0x03': 'Closed',
  '0x04': 'Paused',
}

export enum RewardType {
  Holding = 1,
  Staking = 2,
}

export const HoPLocations: {
  name: string
  to: string
  img: string
}[] = [
    {
      name: 'Jakarta',
      to: '/project/explore?' + toQueryString({ location: 'jakarta' }),
      img: '/img/regions/jakarta.jpg',
    },
    {
      name: 'Bogor',
      to: '/project/explore?' + toQueryString({ location: 'bogor' }),
      img: '/img/regions/bogor.jpg',
    },
    {
      name: 'Depok',
      to:
        '/project/explore?' +
        toQueryString({
          location: 'depok',
        }),
      img: '/img/regions/depok.jpg',
    },
    {
      name: 'Bekasi',
      to:
        '/project/explore?' +
        toQueryString({
          location: 'bekasi',
        }),
      img: '/img/regions/bekasi.jpg',
    },
    {
      name: 'Tangerang',
      to:
        '/project/explore?' +
        toQueryString({
          location: 'tangerang',
        }),
      img: '/img/regions/tangerang.jpg',
    },
    {
      name: 'South Tangerang',
      to:
        '/project/explore?' +
        toQueryString({
          location: 'Tangerang Selatan',
        }),
      img: '/img/regions/south-tangerang.jpg',
    },
  ]
