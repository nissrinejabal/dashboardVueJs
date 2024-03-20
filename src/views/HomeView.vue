<template>
  <div class="home">
    <!-- hada comp parent -->
    <NavbarComp />
    <div class="rule">
      <p class="text">Welcome home {{ role }}</p>
      <router-link :to="{ name: 'Profile' }">
        <button type="button">Profile</button>
      </router-link>
      <router-link :to="{ name: 'addres' }">
        <button type="button">add new restaurant</button>
      </router-link>
      <!-- <router-link :to="{ name: 'addnewrestaurantView' }">
        <button type="button">add rest</button>
      </router-link> -->
    </div>
    <ShowlistComp :allRestaurant="listOfRestaurant" />
    <!-- hadi ktasama props :allRestaurant="listOfRestaurant" aray  pros fiha all aray list -->
  </div>
</template>

<script>
import { mapActions } from "vuex";
import NavbarComp from "../components/header/NavbarComp.vue";
import ShowlistComp from "@/components/restaurant/ShowlistRestComp.vue";
import axios from "axios";

export default {
  components: { NavbarComp, ShowlistComp },
  data() {
    return {
      name: "",
      password: "",
      role: "",
      userId: "",
      listOfRestaurant: [], //array hadi liste li ghadi n7ato fiha hadok les information man page akhra
    };
  },
  // 3lesh async hadi kat3ni matdkhl  hadshi li kayn lta7t hta let result tjib lia les informations
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "Signup" });
      console.log("User not found in localStorage");
    } else {
      const userData = JSON.parse(user);
      this.name = userData.name;
      this.password = userData.password;
      this.role = userData.role;
      this.userId = userData.id;
    }
    let result = await axios.get(
      `http://localhost:3000/restaurants?userId=${this.userId}`
    );
    if (result.status == 200 && result.data.length > 0) {
      console.log(result);
      this.listOfRestaurant = result.data;
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
  },
};
</script>

<style scoped>
.rule {
  display: flex;
  justify-content: space-between;
  margin: 10px;
}
</style>
