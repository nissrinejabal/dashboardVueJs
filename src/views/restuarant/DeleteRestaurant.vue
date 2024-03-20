<template>
  <div>
    <NavbarComp />
    <DeleteRestaurantComp />
  </div>
</template>

<script>
import DeleteRestaurantComp from "@/components/restaurant/DeleteRestaurantComp.vue";
import NavbarComp from "@/components/header/NavbarComp.vue";
export default {
  components: { DeleteRestaurantComp, NavbarComp },
};
</script>

<style>
</style>