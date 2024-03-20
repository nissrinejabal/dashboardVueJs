<template>
  <div>
    <NavbarComp />
    <UpdaterestComp />
  </div>
</template>

<script>
import NavbarComp from "@/components/header/NavbarComp.vue";
import UpdaterestComp from "@/components/restaurant/UpdaterestComp.vue";
export default {
  components: { NavbarComp, UpdaterestComp },
};
</script>

<style>
</style>