const http = require("http");
const url = require("url");
const start = (route, handle) => {
    let postData = '';
    const onRequest = (req, res) => {
        console.log(req.url)
        /* url.parse(req.url) 包含protocol、salashes、auth、host、port、hostname、hash、search、query、pathname、path、href */
        const pathname = url.parse(req.url).pathname;
        console.log("Request for " + pathname + " received.");

        req.setEncoding("utf8");
        req.addListener("data", postDataChunk => {
            postData += postDataChunk;
        });
        req.addListener("end", () => {
            route(handle, pathname, res, postData);
        });



    }
    http.createServer(onRequest).listen(8888);
    console.log("Server has started.");
}
exports.start = start;