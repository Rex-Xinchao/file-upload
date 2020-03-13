import Api_cfg from '@interface/Api_cfg';

const $api = (url: string, method: string = 'POST', data: any = {}) => {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader("content-type", "application/json")
        xhr.send(data);
        xhr.onload = (e: any) => {
            resolve({
                data: e.target.response
            });
        };
    });
}

const $postFile = (url: string, method: string = 'POST', onProgress = (e: any) => e, data: any = {}) => {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = onProgress;
        xhr.open(method, url);
        xhr.send(data);
        xhr.onload = (e: any) => {
            resolve({
                data: e.target.response
            });
        };
    });
}

export { $api, $postFile }