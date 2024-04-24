import { useEffect, useState } from "react";

type CachedData = { updatedAt: string; }

export function useCachedData<D extends CachedData>(providedData: D): D {
    const [data, setData] = useState(providedData)

    useEffect(() => {
        setData((prevData) => {
            if (prevData.updatedAt === providedData.updatedAt) {
                return prevData
            }

            return providedData
        })
    }, [providedData])

    return data
}
