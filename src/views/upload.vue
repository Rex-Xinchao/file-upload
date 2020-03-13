<template>
  <div class="upload">
    <div class="main-container">
      <div class="operation-container">
        <input class="upload-file" type="file" @change="onFileUpload" />
        <button class="upload-start" @click="uploadStart">开始</button>
        <button class="upload-pause" @click="uploadPause">暂停</button>
      </div>
      <div class="progress-container">
        <p>计算文件hash：{{`${progress.hash}%`}}</p>
        <p>总进度：{{`${progress.sum}%`}}</p>
        <p
          v-for="(item, index) in uploadList"
          :key="index"
        >{{`${item.name}：${item.size}（KB） ${item.progress}%`}}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { $api, $postFile } from "@utils/index";
import { createFileChunk } from "@utils/chunk";
import { Component, Prop, Vue } from "vue-property-decorator";

interface Progress {
  [propName: string]: number;
}

@Component
export default class Upload extends Vue {
  progress: Progress = {
    hash: 0,
    sum: 0
  };
  file: any = null;
  chunkSize: number = null;
  fileChunkList: any[] = [];
  uploadList: any[] = [];

  onFileUpload(e: any) {
    const [file] = e.target.files;
    if (!file) return;
    this.file = file;
  }
  async uploadStart() {
    let {fileChunkList, chunkSize} = createFileChunk(this.file);
    this.fileChunkList = fileChunkList
    this.chunkSize = chunkSize
    this.uploadList = this.fileChunkList.map(({ file }, index: number) => ({
      chunk: file,
      hash: `${this.file.name}-${index}`
    }));
    await this.uploadChunks();
  }
  async uploadChunks() {
    const requestList = this.uploadList
      .map(({ chunk, hash }) => {
        const formData = new FormData();
        formData.append("chunk", chunk);
        formData.append("hash", hash);
        formData.append("filename", this.file.name);
        return { formData };
      })
      .map(async ({ formData }) => $postFile("/api/upload", "POST", formData));
    await Promise.all(requestList);
    await this.mergeRequest();
  }
  mergeRequest() {
    $api("/api/merge", "POST", JSON.stringify({ filename: this.file.name, size: this.chunkSize }));
  }
  uploadPause() {}
  mounted() {}
}
</script>

<style scoped lang="scss">
@import "@style/upload.scss";
</style>
