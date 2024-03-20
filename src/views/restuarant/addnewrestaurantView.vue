<template>
  <div>
    <NavbarComp />
    <AddnewrestComp />
  </div>
</template>
<script>
import NavbarComp from "@/components/header/NavbarComp.vue";
import AddnewrestComp from "@/components/restaurant/AddnewrestComp.vue";
export default {
  components: { NavbarComp, AddnewrestComp },
};
</script>

<style>
</style>