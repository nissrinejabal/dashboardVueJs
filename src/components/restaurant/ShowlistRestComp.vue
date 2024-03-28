<template>
  <NavbarComp />
  <div class="info-list-first">
    <!-- hada comp child wlidat  -->
    <h1 class="header">Restaurant List</h1>
    <div class="mycla">
      <p v-if="allRestaurant.length > 0">
        list of restaurant ({{ allRestaurant.length }})
        <!-- hadi for all the resturant i have -->
      </p>
      <div v-else class="norestadded"><p>no categories added</p></div>
      <div>
        <button
          v-if="allRestaurant.length > 0"
          @click="showDeleteConfirmation"
          class="delete-btn"
        >
          Delete All restaurant
        </button>

        <!-- Delete confirmation popup -->
        <div v-if="showPopup" class="popup-container">
          <div class="popup">
            <p>
              Are you sure you want to delete all restaurants ? (rest,cat,items)
            </p>
            <br />
            <button @click="deleteAllItems">OK</button>
            <button @click="cancelDeletion">No</button>
          </div>
        </div>
      </div>
    </div>
    <!-- <p>{{ allRestaurant }}</p> -->
    <ul>
      <li v-for="rest in allRestaurant" :key="rest.id" class="info-list">
        <div class="global-info">
          <h2>{{ rest.restname }}</h2>
          <p>
            <strong>phone:</strong><br />
            {{ rest.phone }}
          </p>
          <p><strong>address:</strong> <br />{{ rest.address }}</p>
          <p>
            <strong>user id:</strong><br />
            {{ rest.userId }}
          </p>
          <!-- <p><strong>rest id:</strong> {{ rest.id }}</p> -->
        </div>

        <div class="button-container">
          <router-link
            :to="{
              name: 'DeleteRestaurant',
              params: { RestId: rest.id },
            }"
          >
            <button class="delete-btn">delete</button>
          </router-link>
          <router-link
            :to="{
              name: 'Updaterestaurant',
              params: { RestId: rest.id },
            }"
          >
            <button>Update</button>
          </router-link>
          <router-link
            :to="{
              name: 'Menu',
              params: { RestId: rest.id },
            }"
          >
            <button class="Menu-btn">Menu</button>
          </router-link>
        </div>
      </li>
    </ul>
  </div>
  <div class="body">hh</div>
</template>
<!-- <li v-for="(rest, i) in allRestaurant" :key="i" class="info-list">
        <div class="global-info">
          <h2>{{ rest.restname }}</h2>
          <p><strong>phone:</strong> {{ rest.phone }}</p>
          <p><strong>address:</strong> {{ rest.address }}</p>
          <p><strong>user id:</strong> {{ rest.userId }}</p>
        </div>
      </li> -->
<!-- <tbody>
      <tr v-for="(rest, i) in allRestaurant" :key="i">
        <th>{{ rest.phone }}</th>
        <th>{{ rest.address }}</th>
        <th>{{ rest.restname }}</th>
      </tr>
    </tbody> -->
<script>
import NavbarComp from "../header/NavbarComp.vue";

import axios from "axios";
export default {
  props: ["allRestaurant"],
  data() {
    return {
      restaurants: [],
      showPopup: false,
      userId: "",
      AllRestaurantId: [],
      AllItemsIdIs: [],
      AllICatgoriesIdIs: [],
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "home" });
    } else {
      this.userId = JSON.parse(user).id;
      // Fetch restaurant data
      let result = await axios.get(
        `http://localhost:3000/restaurants?userId=${this.userId}`
      );
      console.log(result.data.length);
      let ResultLen = result.data.length;
      for (var i = 0; i < ResultLen; i++) {
        this.AllRestaurantId.push(result.data[i].id);
      }
      // Fetch categories and items associated with each restaurant
      for (let restaurantId of this.AllRestaurantId) {
        // Fetch categories
        let categoriesResult = await axios.get(
          `http://localhost:3000/categories?RestId=${restaurantId}`
        );
        let categoriesData = categoriesResult.data;
        for (var y = 0; y < categoriesData.length; y++) {
          this.AllICatgoriesIdIs.push(categoriesData[y].id);
        }
        // Fetch items
        let itemsResult = await axios.get(
          `http://localhost:3000/items?restaurantId=${restaurantId}`
        );
        let itemsData = itemsResult.data;
        for (var i = 0; i < itemsData.length; i++) {
          this.AllItemsIdIs.push(itemsData[i].id);
        }
      }
      console.log(this.AllRestaurantId.length);
      console.log("heheh");
      console.table(this.AllRestaurantId);
    }
  },

  methods: {
    MenuRestaurant() {
      console.log("Menuing restaurant with id:");
    },
    showDeleteConfirmation() {
      this.showPopup = true;
    },
    async deleteAllItems() {
      //fetch restaurants
      let allResult = [];
      for (var i = 0; i < this.AllRestaurantId.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/restaurants/${this.AllRestaurantId[i]}`
        );
        if (result.status == 200) {
          allResult.push(true);
        } else {
          allResult.push(false);
        }
      }
      //fetch categories
      let allCatsResult = [];
      for (var x = 0; x < this.AllICatgoriesIdIs.length; x++) {
        let catResult = await axios.delete(
          `http://localhost:3000/categories/${this.AllICatgoriesIdIs[x]}`
        );
        if (catResult.status == 200) {
          allCatsResult.push(true);
        } else {
          allCatsResult.push(false);
        }
        console.table(allCatsResult);
      }
      //fetch items
      let allItemsResult = [];
      for (var z = 0; z < this.AllItemsIdIs.length; z++) {
        let itemResult = await axios.delete(
          `http://localhost:3000/items/${this.AllItemsIdIs[z]}`
        );
        if (itemResult.status == 200) {
          allItemsResult.push(true);
        } else {
          allItemsResult.push(false);
        }
        console.table(allItemsResult);
      }

      console.table(allResult);
      if (
        !allResult.includes(false) &&
        !allCatsResult.includes(false) &&
        !allItemsResult.includes(false)
      ) {
        console.log("All items deleted.");
        setTimeout(() => {
          this.showPopup = false;
          window.location.reload();
        }, 1000);
      } else {
        console.log("smtgh went wrong ");
      }
    },

    cancelDeletion() {
      this.showPopup = false;
    },
  },
};
</script>
