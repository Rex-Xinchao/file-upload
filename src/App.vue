<template>
  <div id="app">
    <Upload></Upload>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Upload from "@page/upload.vue";

@Component({
  components: {
    Upload
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import "@style/main.scss";
</style>
