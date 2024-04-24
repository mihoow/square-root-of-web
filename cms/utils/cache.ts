export async function invalidateCache(name: string, args: Record<string, unknown>) {
    const response = await fetch(`${process.env.ORIGIN_URL}/action/invalidate-cache`, {
        method: 'DELETE',
        body: JSON.stringify({ name, ...args })
    })

    if (!response.ok) {
        throw new Error('Network error')
    }

    const invalidationResponse = await response.json()

    if (!invalidationResponse.ok) {
        throw new Error(invalidationResponse.message)
    }
}
