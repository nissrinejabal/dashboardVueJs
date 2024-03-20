<template>
  <div class="menu"></div>
  <div class="main">
    <img src="../assets/images/error.png" alt="" class="avatar" />
    <p class="errorp">error</p>
    <router-link :to="{ name: 'home' }"
      ><button>go back home</button></router-link
    >
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.main {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  margin: 1rem;
}
.errorp {
  color: red;
  text-align: center;
  font-size: 4rem;
}
</style>