interface Api_cfg {
    url: string
    method: "GET" | "POST"
    data?: {
        [propName: string]: any
    }
    headers?: {
        [propName: string]: any
    }
    [propName: string]: any
}

export { Api_cfg }