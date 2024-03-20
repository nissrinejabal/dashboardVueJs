<template>
  <div>
    <NavbarComp />
    <div class="restaurant-item">
      <div class="restaurant-info">
        <h1>
          Delete Items id: {{ itemsId }} <br />
          name Items: {{ itemname }}<br />
        </h1>
        <div class="restiteam">
          <h1>restaurant name : {{ restname }}</h1>
          <h2>restaurant adress :{{ address }}</h2>
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
        <button @click="deleteCategory">Delete</button>
        <button @click="goBack">Go Back</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarComp from "@/components/header/NavbarComp.vue";
import { mapActions, mapMutations } from "vuex";

export default {
  components: { NavbarComp },

  data() {
    return {
      RestId: this.$route.params.RestId,
      CatId: this.$route.params.CatId,
      itemsId: this.$route.params.itemsId,
      userId: "",
      address: "",
      restname: "",
      categorieName: "",
      itemname: "",
      errorMessage: "",
      successMessage: "",
      AllItemsIdIs: [],
    };
  },

  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "Signup" });
    } else {
      //   this.deleteCategory = this.$route.params.RestId;
      const userData = JSON.parse(user);
      this.userId = userData.id;
      this.AccessRestaurantuser();
      this.canUserAccessThisItem({
        theUserId: this.userId,
        theRestId: this.RestId,
        itemsIdIs: this.itemsId,
        redirectToPage: "home",
        // hadi jebtha man store redirecto ri kan3yto liha nichan w sf
      });
      this.getCategoryInfo(this.userId, this.RestId, this.CatId);
      let result = await axios.get(
        `http://localhost:3000/items?CatId=${this.CatId}`
      );
      console.log(result.data.length);
      let ResultLen = result.data.length;
      for (var i = 0; i < ResultLen; i++) {
        this.AllItemsIdIs.push(result.data[i].id);
      }
      this.getItemInfo(this.userId, this.RestId, this.itemsId);
    }
  },

  methods: {
    ...mapActions(["redirectTo"]),
    ...mapMutations(["canUserAccessThisCategory", "canUserAccessThisItem"]),

    goBack() {
      this.$router.push({
        name: "ShowListCatgoriesComp",
        params: { RestId: this.RestId },
      });
    },
    async AccessRestaurantuser() {
      let result = await axios.get(
        `http://localhost:3000/restaurants?id=${this.RestId}&userId=${this.userId}`
      );
      if (result.status == 200 && result.data.length > 0) {
        this.RestaurantData = result.data;
        this.address = this.RestaurantData[0].address;
        this.restname = this.RestaurantData[0].restname;
        console.log("Restaurant data loaded successfully.");
      } else {
        this.redirectTo({ val: "home" });
        console.log("Restaurant data not found.");
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
    async getItemInfo(userId, RestId, itemsId) {
      let result = await axios.get(
        `http://localhost:3000/items?userId=${userId}&RestId=${RestId}&id=${itemsId}`
      );
      let resultData = result.data[0];
      if (result.status == 200) {
        this.itemname = resultData.itemname;
        this.price = resultData.price;
        this.description = resultData.description;
        this.Quantity = resultData.Quantity;
        this.pickedCategory = resultData.CatId;
        // if (this.itemInfo.length > 0) {
        //   this.itemname = this.itemInfo[0].itemname;
        // }
      }
    },
    async deleteCategory() {
      let result = await axios.delete(
        `http://localhost:3000/items/${this.itemsId}`
      );
      if (result.status == 200) {
        this.errorMessage = "";
        this.successMessage = "item deleted successfully.";
        setTimeout(() => {
          this.$router.push({
            name: "Menu",
            params: { RestId: this.RestId },
          });
        }, 2000);
      } else {
        this.errorMessage = "Failed to delete item.";
        this.successMessage = "";
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
</style>
