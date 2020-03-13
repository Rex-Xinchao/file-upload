const LENGTH = 10;

const createFileChunk = (file: any, length: number = LENGTH) => {
    const fileChunkList = [];
    const chunkSize = Math.ceil(file.size / length);
    let chunkSum = 0;
    while (chunkSum < file.size) {
        fileChunkList.push({ file: file.slice(chunkSum, chunkSum + chunkSize) })
        chunkSum += chunkSize
    }
    return { fileChunkList, chunkSize }
}

export { createFileChunk }