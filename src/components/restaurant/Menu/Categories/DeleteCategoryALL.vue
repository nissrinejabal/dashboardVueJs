<template>
  <div>
    <NavbarComp />
    <div class="restaurant-item">
      <div class="restaurant-info">
        <!-- <h1>
          Delete Category
          {{ CatId }} <br />
          name category: {{ categorieName }}<br />
        </h1> -->
        <p class="red">delete category and its items</p>

        <div class="restinfo">
          <h1>
            restname:{{ restname }} <br />
            address:{{ address }}
          </h1>
        </div>
        <div class="inputs">
          <div class="error-feedback" v-if="successMessage.length > 0">
            {{ successMessage }}
          </div>
          <div class="error-feedback" v-if="errorMessage.length > 0">
            {{ errorMessage }}
          </div>
        </div>
      </div>
      <div class="btn-class">
        <p>Are you sure you want to delete?</p>
        <button @click="deleteallcategory">
          Delete/ delete all categories and all related items at once
        </button>
        <button @click="goBack">Go Back</button>
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

<style scoped>
.restaurant-item {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  flex-direction: column;
  align-content: center;
  align-items: center;
}

.error-feedback {
  color: red;
}

.success-feedback {
  color: green;
}

.inputs {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.btn-class {
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

.btn-class h1 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #333;
}

.btn-class p {
  color: #666;
  margin-bottom: 20px;
}

button:hover {
  background-color: #cc0000;
}
.red {
  color: red;
  font-size: 2rem;
}
.restinfo h1 {
  line-height: 2rem;
  text-align: justify;
}
</style>
