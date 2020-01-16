interface Api_cfg {
    url: string
    method: "GET" | "POST"
    data?: any
    headers?: {
        [propName: string]: any
    }
    [propName: string]: any
}

export default Api_cfg