<template>
  <div class="delete-form">
    <div class="delete-form">
      <h1>Delete Restaurant #{{ deleteRestaurant }}</h1>
      <div class="inputs">
        <input
          type="text"
          v-model.trim="restname"
          placeholder="Restaurant Name"
          disabled
        />
        <input type="text" v-model.trim="phone" placeholder="Phone" disabled />
        <input
          type="text"
          v-model.trim="address"
          placeholder="Address"
          disabled
        />
        <input
          type="text"
          v-model.trim="userId"
          placeholder="User ID"
          disabled
        />

        <div class="error-feedback" v-if="successMessage.length > 0">
          {{ successMessage }}
        </div>
        <div class="error-feedback" v-if="errorMessage.length > 0">
          {{ errorMessage }}
        </div>
      </div>
    </div>
    <div class="delete-verif">
      <p>Are you sure you want to delete?(this rest its cat its items)</p>
      <button @click="deleteRest" class="delete">Delete</button>

      <button @click="goback">Go Back</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      phone: "",
      address: "",
      userId: "",
      restname: "",
      deleteRestaurant: "",
      RestaurantData: [],
      AllItemsIdIs: [],
      AllICatgoriesIdIs: [],
      successMessage: "",
      errorMessage: "",
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "home" });
    } else {
      const userData = JSON.parse(user);
      this.deleteRestaurant = this.$route.params.RestId; // Corrected variable name
      this.userId = userData.id;
      this.AccessRestaurantuser();
      // Fetch items
      let itemsResult = await axios.get(
        `http://localhost:3000/items?restaurantId=${this.deleteRestaurant}` // Corrected variable name
      );
      let itemsData = itemsResult.data;
      for (var i = 0; i < itemsData.length; i++) {
        this.AllItemsIdIs.push(itemsData[i].id);
      }

      // Fetch categories
      let categoriesResult = await axios.get(
        `http://localhost:3000/categories?RestId=${this.deleteRestaurant}` // Corrected variable name
      );
      let categoriesData = categoriesResult.data;
      for (var y = 0; y < categoriesData.length; y++) {
        this.AllICatgoriesIdIs.push(categoriesData[y].id);
      }
    }
  },

  methods: {
    ...mapActions(["redirectTo"]),
    goback() {
      this.redirectTo({ val: "home" });
    },
    async AccessRestaurantuser() {
      let result = await axios.get(
        `http://localhost:3000/restaurants?id=${this.deleteRestaurant}&userId=${this.userId}`
      );
      if (result.status == 200 && result.data.length > 0) {
        this.RestaurantData = result.data;
        this.phone = this.RestaurantData[0].phone;
        this.address = this.RestaurantData[0].address;
        this.restname = this.RestaurantData[0].restname;
        console.log("Restaurant data loaded successfully.");
      } else {
        this.redirectTo({ val: "home" });
        console.log("Restaurant data not found.");
      }
    },
    async deleteRest() {
      ///for restaurant
      let result = await axios.delete(
        `http://localhost:3000/restaurants/${this.deleteRestaurant}`
      );
      //for categories
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
      //for items
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

      /////for rest cat
      if (
        result.status == 200 &&
        !allCatsResult.includes(false) &&
        !allItemsResult.includes(false)
      ) {
        this.errorMessage = "";
        this.successMessage = "tms7 mskine";
        setTimeout(() => {
          this.redirectTo({ val: "home" });
        }, 2000);
      } else {
        this.successMessage = "";
        this.errorMessage = "diksi matms7sh";
        console.log("smtgh went wrong ");
      }
    },
  },
};
</script>

<style>
.delete-verif {
  margin-top: 20px;
  text-align: center;
  display: flex;
  margin-top: 20px;
  text-align: center;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.delete-verif h1 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #333;
}

.delete-verif p {
  color: #666;
  margin-bottom: 20px;
}

.delete-form .inputs {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.delete:hover {
  background-color: #cc0000;
}
</style>
