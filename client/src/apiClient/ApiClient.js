import getOrder from "./getOrder"

class ApiClient {
    static getOrder(orderId){
        return getOrder(orderId)
    }
}

export default ApiClient