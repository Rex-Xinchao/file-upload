import Api_cfg from '@interface/Api_cfg';

const $api = (cfg: Api_cfg) => {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open(cfg.method, cfg.url);
        Object.keys(cfg.headers).forEach(key =>
            xhr.setRequestHeader(key, cfg.headers[key])
        );
        xhr.send(cfg.data);
        xhr.onload = (e: any) => {
            resolve({
                data: e.target.response
            });
        };
    });
}

export { $api }