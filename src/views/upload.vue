<template>
  <div class="upload">
    <h1>hello</h1>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { $api } from "@utils/index";

@Component
export default class HelloWorld extends Vue {
  mounted() {
    console.log($api);
  }
}
</script>

<style scoped lang="scss">
@import "@style/upload.scss";
</style>
