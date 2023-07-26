const getOrder = async (orderId) => {
    try {
        const response = await fetch(`/api/v1/orders/${orderId}`)
        if (!response.ok) {
            const errorMessage = `${response.status} (${response.statusText})`
            const error = new Error(errorMessage)
            throw error
        }
        const orderData = await response.json()

        return orderData

    } catch (error) {
        console.error(`Error in fetch: ${error.message}`)
        return `Error in fetch: ${error.message}`
    }
}

export default getOrder