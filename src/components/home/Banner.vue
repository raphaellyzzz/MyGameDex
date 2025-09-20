<template>
  <section class="banner-section">
    <img src="../../assets/banner_lis.webp" alt="Banner de Lis">
  </section>
</template>

<script>
export default {
  name: 'Banner'
}
</script>

<style scoped>
.banner-section {
  width: 100%;
  max-height: 450px;
  overflow: hidden;
  margin-top: 20px;
}

.banner-section img {
  width: 100%;
  height: auto;
  display: block;
}
</style>