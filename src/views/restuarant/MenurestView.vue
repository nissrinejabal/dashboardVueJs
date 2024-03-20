<template>
  <div>
    <NavbarCompVue />
    <MenurestComp />
  </div>
</template>

<script>
import NavbarCompVue from "@/components/header/NavbarComp.vue";
import MenurestComp from "@/components/restaurant/Menu/MenurestComp.vue";
export default {
  components: { NavbarCompVue, MenurestComp },
};
</script>

<style>
</style>