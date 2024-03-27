<template>
  <div>
    test menu
    <MenurestComp /><NavbarComp />
  </div>
</template>

<script>
import NavbarComp from "@/components/header/NavbarComp.vue";
import MenurestComp from "@/components/restaurant/Menu/MenurestComp.vue";
export default {
  components: { MenurestComp },
};
</script>

<style></style>
