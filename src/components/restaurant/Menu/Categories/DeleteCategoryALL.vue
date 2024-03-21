<template>
  <div>
    <NavbarComp />
    <div>
      <div class="delete-form">
        <div class="delete-form">
          <h1 class="red">delete category and its items</h1>
          <div class="inputs">
            <input
              type="text"
              v-model.trim="restname"
              placeholder="Restaurant Name"
              disabled
            />
            <input
              type="text"
              v-model.trim="address"
              placeholder="Address"
              disabled
            />
            <div class="error-feedback" v-if="successMessage.length > 0">
              {{ successMessage }}
            </div>
            <div class="error-feedback" v-if="errorMessage.length > 0">
              {{ errorMessage }}
            </div>
          </div>
          <div class="delete-verif">
            <p>Are you sure you want to delete?</p>
            <button @click="deleteallcategory">
              Delete all categories, related items at once
            </button>
            <button @click="goBack">Go Back</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarComp from "@/components/header/NavbarComp.vue";
import { mapActions } from "vuex";

export default {
  components: { NavbarComp },

  data() {
    return {
      RestId: this.$route.params.RestId,

      userId: "",
      restname: "",
      address: "",
      categorieName: "",
      errorMessage: "",
      successMessage: "",
      AllItemsIdIs: [],
      AllICatgoriesIdIs: [],
    };
  },

  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "Signup" });
    } else {
      const userData = JSON.parse(user);
      this.userId = userData.id;
      this.getRestInfo(this.userId, this.RestId);

      // Fetch items
      let itemsResult = await axios.get(
        `http://localhost:3000/items?RestId=${this.RestId}`
      );
      let itemsData = itemsResult.data;
      for (var i = 0; i < itemsData.length; i++) {
        this.AllItemsIdIs.push(itemsData[i].id);
      }

      // Fetch categories
      let categoriesResult = await axios.get(
        `http://localhost:3000/categories?RestId=${this.RestId}`
      );
      let categoriesData = categoriesResult.data;
      for (var y = 0; y < categoriesData.length; y++) {
        this.AllICatgoriesIdIs.push(categoriesData[y].id);
      }
    }
  },

  methods: {
    ...mapActions(["redirectTo"]),

    goBack() {
      this.$router.push({
        name: "ShowListCatgoriesComp",
        params: { RestId: this.RestId },
      });
    },

    async deleteallcategory() {
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

      if (!allCatsResult.includes(false) && !allItemsResult.includes(false)) {
        this.errorMessage = "";
        this.successMessage =
          "Category and related items are all  deleted successfully.";
        setTimeout(() => {
          this.$router.push({
            name: "home",
            params: { RestId: this.RestId },
          });
        }, 2000);
      } else {
        this.errorMessage =
          "Failed to delete Category and related items are all .";
        this.successMessage = "";
      }
    },

    async getRestInfo(userId, restaurantId) {
      let result = await axios.get(
        `http://localhost:3000/restaurants?userId=${userId}&id=${restaurantId}`
      );
      let RestDetails = [];
      if (result.status == 200) {
        console.log("hehe");
        RestDetails = result.data;
        this.restname = RestDetails[0].restname;
        this.address = RestDetails[0].address;
      }
    },
    async getCategoryInfo(userId, restaurantId, CatId) {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${userId}&RestId=${restaurantId}&id=${CatId}`
      );
      if (result.status == 200) {
        this.categoryInfo = result.data;
        if (this.categoryInfo.length > 0) {
          this.categorieName = this.categoryInfo[0].categorieName;
        }
      }
    },
  },
};
</script>
