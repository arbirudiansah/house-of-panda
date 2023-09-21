interface Wilayah {
    id: string;
    province_id?: string;
    regency_id?: string;
    name: string;
}

interface Payload {
    provinceId?: string;
    regencyId?: string;
}

export const getWilayah = async (payload?: Payload) => {
    try {
        let wilayah: Wilayah[] = []
        if (!payload) {
            wilayah = await fetch("/api/indonesia/provinces")
                .then(res => res.json())
        } else if (payload && payload.provinceId) {
            wilayah = await fetch(`/api/indonesia/regencies/${payload.provinceId}`)
                .then(response => response.json())
        } else if (payload && payload.regencyId) {
            wilayah = await fetch(`/api/indonesia/districts/${payload.regencyId}`)
                .then(response => response.json())
        }

        return wilayah
    } catch (error: any) {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();
        return Promise.reject(message)
    }
}