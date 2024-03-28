<template>
  <div><HeaderMenuComp /> <MenurestComp /></div>
</template>

<script>
import MenurestComp from "@/components/restaurant/Menu/MenurestComp.vue";
import HeaderMenuComp from "@/components/header/HeaderMenuComp.vue";
export default {
  components: { MenurestComp, HeaderMenuComp },
};
</script>

<style></style>
