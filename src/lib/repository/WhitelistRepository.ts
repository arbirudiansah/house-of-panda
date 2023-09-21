import { Redis } from "ioredis";
import moment from "moment";

type WhitelistSetting = { start: number, end: number }

const getSetting = async (redis: Redis) => {
    try {
        const setting = await redis.get('whitelist_setting');

        if (!setting) return null;

        return JSON.parse(setting) as WhitelistSetting;
    } catch (error) {
        console.log("🚀 ~ file: WhitelistRepository.ts:12 ~ getSetting ~ error:", error)
        throw error;
    }
}

const setSetting = async (redis: Redis, setting: WhitelistSetting) => {
    try {
        await redis.set('whitelist_setting', JSON.stringify(setting));
        return true;
    } catch (error) {
        console.log("🚀 ~ file: WhitelistRepository.ts:22 ~ setSetting ~ error:", error)
        throw error;
    }
}

const getAddresses = async (redis: Redis, filterAddress?: string) => {
    try {
        let existingData = await redis.get('whitelist_addresses_cached');
        if (!existingData) {
            existingData = await redis.get('whitelist_addresses');
            if (!existingData) existingData = '[]';
        }

        const existingAddresses = JSON.parse(existingData) as string[];

        if (filterAddress) {
            return existingAddresses.filter(address => address.toLowerCase().includes(filterAddress.toLowerCase()));
        }

        return existingAddresses;
    } catch (error) {
        console.log("🚀 ~ file: WhitelistRepository.ts:44 ~ getAddresses ~ error:", error)
        throw error;
    }
}

const setAddresses = async (redis: Redis, addresses: string[]) => {
    try {
        // cache data setting an expiry of 1 hour
        // this means that the cached data will remain alive for 60 minutes
        // after that, we'll get fresh data from the DB
        const MAX_AGE = 60_000 * 60; // 1 hour
        const EXPIRY_MS = `PX`; // milliseconds

        // remove duplicate addresses
        addresses = [...new Set(addresses)];

        await redis.set('whitelist_addresses', JSON.stringify(addresses));
        await redis.set('whitelist_addresses_cached', JSON.stringify(addresses), EXPIRY_MS, MAX_AGE);
    } catch (error) {
        console.log("🚀 ~ file: WhitelistRepository.ts:69 ~ setAddresses ~ error:", error)
        throw error;
    }
}

const addAddresses = async (redis: Redis, addresses: string[]) => {
    try {
        const existingAddresses: string[] = await getAddresses(redis);

        const newAddresses = [...addresses, ...existingAddresses];
        await setAddresses(redis, newAddresses);

        return true;
    } catch (error) {
        console.log("🚀 ~ file: WhitelistRepository.ts:78 ~ addAddresses ~ error:", error)
        throw error;
    }
}

const removeAddresses = async (redis: Redis, addresses: string[]) => {
    try {
        const existingAddresses: string[] = await getAddresses(redis);

        const newAddresses = existingAddresses.filter((existingAddress) => !addresses.includes(existingAddress));
        await setAddresses(redis, newAddresses);

        return true;
    } catch (error) {
        console.log("🚀 ~ file: WhitelistRepository.ts:92 ~ removeAddresses ~ error:", error)
        throw error;
    }
}

const clearAddresses = async (redis: Redis) => {
    try {
        return await setAddresses(redis, []);
    } catch (error) {
        console.log("🚀 ~ file: WhitelistRepository.ts:92 ~ removeAddresses ~ error:", error)
        throw error;
    }
}

const updateAddress = async (redis: Redis, oldAddress: string, newAddress: string) => {
    try {
        const existingAddresses: string[] = await getAddresses(redis);

        const newAddresses = existingAddresses.map((existingAddress) => {
            if (existingAddress === oldAddress) return newAddress;
            return existingAddress;
        });

        await setAddresses(redis, newAddresses);

        return true;
    } catch (error) {
        console.log("🚀 ~ file: WhitelistRepository.ts:110 ~ updateAddresses ~ error:", error)
        throw error;
    }
}

const isInWhitelistPeriod = async (redis: Redis) => {
    try {
        const setting = await getSetting(redis);
        if (!setting) return false;

        const now = moment();
        const start = moment.unix(setting.start);
        const end = moment.unix(setting.end);

        return now.isBetween(start, end);
    } catch (error) {
        console.log("🚀 ~ file: WhitelistRepository.ts:44 ~ isInWhitelistPeriod ~ error:", error)
        return false;
    }
}

const addressIsWhitelisted = async (redis: Redis, address: string) => {
    try {
        const addresses = await getAddresses(redis);
        if (!addresses) return false;

        return addresses.includes(address);
    } catch (error) {
        console.log("🚀 ~ file: WhitelistRepository.ts:44 ~ isInWhitelistPeriod ~ error:", error)
        return false;
    }
}

const whitelistRepo = {
    getSetting,
    setSetting,
    getAddresses,
    addAddresses,
    removeAddresses,
    clearAddresses,
    updateAddress,
    isInWhitelistPeriod,
    addressIsWhitelisted,
}

export default whitelistRepo;