<template>
  <div class="upload">
    <div class="main-container">
      <div class="operation-container">
        <input class="upload-file" type="file" @change="onFileUpload" />
        <button class="upload-start" @click="uploadStart">开始</button>
        <button class="upload-pause" @click="uploadPause">暂停</button>
      </div>
      <div class="progress-container">
        <p>总进度：{{`${sum}%`}}</p>
        <p
          v-for="(item, index) in uploadList"
          :key="index"
        >{{`${item.hash}：${(item.chunk.size / 1000).toFixed(1)}（KB） ${item.percentage}%`}}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { $api, $postFile } from "@utils/index";
import { createFileChunk } from "@utils/chunk";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Upload extends Vue {
  file: any = null;
  chunkSize: number = null; // 切片单位大小
  fileChunkList: any[] = [];
  uploadList: any[] = [];

  get sum(): number {
    // 计算属性的get
    if (!this.file || !this.uploadList.length) {
      return 0;
    }
    const loaded = this.uploadList
      .map(item => item.chunk.size * item.percentage)
      .reduce((acc, cur) => acc + cur);
    return parseInt((loaded / this.file.size).toFixed(2));
  }

  onFileUpload(e: any) {
    const [file] = e.target.files;
    if (!file) return;
    this.file = file;
  }
  async uploadStart() {
    let { fileChunkList, chunkSize } = createFileChunk(this.file);
    this.fileChunkList = fileChunkList;
    this.chunkSize = chunkSize;
    this.uploadList = this.fileChunkList.map(({ file }, index: number) => ({
      chunk: file,
      hash: `${this.file.name}-${index}`,
      index,
      percentage: 0
    }));
    await this.uploadChunks();
  }
  async uploadChunks() {
    const requestList = this.uploadList
      .map(({ chunk, hash, index }) => {
        const formData = new FormData();
        formData.append("chunk", chunk);
        formData.append("hash", hash);
        formData.append("filename", this.file.name);
        return { formData, index };
      })
      .map(async ({ formData, index }) =>
        $postFile(
          "/api/upload",
          "POST",
          this.createProgressHandler(this.uploadList[index]),
          formData
        )
      );
    await Promise.all(requestList);
    await this.mergeRequest();
  }
  mergeRequest() {
    $api(
      "/api/merge",
      "POST",
      JSON.stringify({ filename: this.file.name, size: this.chunkSize })
    );
  }
  createProgressHandler(item: any) {
    return (e: any) => {
      item.percentage = parseInt(String((e.loaded / e.total) * 100));
    };
  }
  uploadPause() {}
  mounted() {}
}
</script>

<style scoped lang="scss">
@import "@style/upload.scss";
</style>
