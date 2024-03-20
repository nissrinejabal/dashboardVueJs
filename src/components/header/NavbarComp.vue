<template>
  <div>
    <nav>
      <ul>
        <li class="nav-item">
          <router-link
            tag="li"
            :to="{ name: 'home', params: { pageTitle: 'home page' } }"
          >
            <a>Home</a>
          </router-link>
          <button @click="logout">Log Out</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions(["redirectTo"]),
    logout() {
      localStorage.clear();
      this.redirectTo({ val: "Login" });
    },
  },
};
</script>

<style scoped>
/* styles.css */
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

nav {
  background-color: hsl(0, 0%, 20%);
  padding: 30px;
}

nav ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  display: flex; /* Use flexbox layout for the nav items */
  align-items: center; /* Align items vertically */
  justify-content: center;
}

.nav-item > * {
  margin-right: 20px; /* Add space between the elements */
}

nav ul li a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

nav ul li a:hover {
  background-color: #555;
}
</style>
