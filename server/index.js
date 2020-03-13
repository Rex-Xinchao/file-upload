const path = require('path');
const http = require('http');
const fse = require("fs-extra");
const multiparty = require("multiparty");


const server = http.createServer();
const UPLOAD_DIR = path.resolve(__dirname, "..", "uploadFile"); //存储目录

const resolvePost = req =>
    new Promise(resolve => {
        let chunk = '';
        req.on("data", data => {
            chunk += data
        })
        req.on("end", () => {
            resolve(JSON.parse(chunk))
        })
    })

const pipeStream = (path, writeStream) => {
    new Promise(resolve => {
        const readStream = fse.createReadStream(path);
        readStream.on("end", () => {
            fse.unlinkSync(path);
            resolve();
        });
        readStream.pipe(writeStream);
    })
}


const mergeFileChunk = async (filePath, filename, size) => {
    const chunkDir = path.resolve(UPLOAD_DIR, filename).split('.')[0];
    const chunkPaths = await fse.readdir(chunkDir);
    chunkPaths.sort((a, b) => a.split('-')[1] - b.split('-')[1]);
    await Promise.all(
        chunkPaths.map((chunkPath, index) =>
            pipeStream(
                path.resolve(chunkDir, chunkPath),
                // 指定位置创建可写流
                fse.createWriteStream(filePath, {
                    start: index * size,
                    end: (index + 1) * size
                })
            )
        )
    );
    await fse.remove(chunkDir)
}

server.on("request", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    if (req.method === "OPTIONS") {
        res.status = 200;
        res.end();
        return;
    }

    if (req.url === '/merge') {
        const data = await resolvePost(req);
        const { filename, size } = data;
        const filePath = path.resolve(UPLOAD_DIR, `${filename}`);
        await mergeFileChunk(filePath, filename, size);
        res.end(JSON.stringify({ code: 0, message: 'file merged success' }))
    }

    // 切片的上传处理
    const multipart = new multiparty.Form();
    multipart.parse(req, async (err, fields, files) => {
        if (err) {
            return
        }
        const [chunk] = files.chunk;
        const [hash] = fields.hash;
        const [filename] = fields.filename;
        const chunkDir = path.resolve(UPLOAD_DIR, filename).split('.')[0];
        if (!fse.existsSync(chunkDir)) {
            fse.mkdirsSync(chunkDir)
        }
        fse.moveSync(chunk.path, `${chunkDir}/${hash}`, { overwrite: true });
        res.end("received file chunk");
    })
})

server.listen(3000, () => console.log("server on 3000"))