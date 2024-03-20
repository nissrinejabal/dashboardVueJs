<template>
  <div>
    <NavbarComp />
    <div class="restaurant-item">
      <div class="restaurant-info">
        <h1>
          Delete Category {{ CatId }} <br />
          name category: {{ categorieName }}<br />
          i should delete category and its items
        </h1>
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
        <button @click="deleteCategory">
          Delete / delete categories and related items at once
        </button>
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
      userId: "",
      categorieName: "",
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
      this.canUserAccessThisCategory({
        theUserId: this.userId,
        theRestId: this.RestId,
        catIdIs: this.CatId,
        redirectToPage: "home",
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
      console.log(this.AllItemsIdIs.length);
      console.log("heheh");
      console.table(this.AllItemsIdIs);
    }
  },

  methods: {
    ...mapActions(["redirectTo"]),
    ...mapMutations(["canUserAccessThisCategory"]),

    goBack() {
      this.$router.push({
        name: "ShowListCatgoriesComp",
        params: { RestId: this.RestId },
      });
    },
    async deleteCategory() {
      let result = await axios.delete(
        `http://localhost:3000/categories/${this.CatId}`
      );
      let allResult = [];
      for (var i = 0; i < this.AllItemsIdIs.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/items/${this.AllItemsIdIs[i]}`
        );
        if (result.status == 200) {
          allResult.push(true);
        } else {
          allResult.push(false);
        }
        console.table(allResult);
      }

      if (result.status == 200 && !allResult.includes(false)) {
        this.errorMessage = "";
        this.successMessage = "Category deleted successfully.";
        setTimeout(() => {
          this.$router.push({
            name: "ShowListCatgoriesComp",
            params: { RestId: this.RestId },
          });
        }, 2000);
      } else {
        this.errorMessage = "Failed to delete category.";
        this.successMessage = "";
      }
    },
    // async deleteCategory() {
    //   let result = await axios.delete(
    //     `http://localhost:3000/categories/${this.CatId}`
    //   );
    //   let allResult = [];
    //   for (var i = 0; i < this.AllItemsIdIs.length; i++) {
    //     let result = await axios.delete(
    //       `http://localhost:3000/items/${this.AllItemsIdIs[i]}`
    //     );
    //     if (result.status == 200) {
    //       allResult.push(true);
    //     } else {
    //       allResult.push(false);
    //     }
    //     console.table(allResult);
    //   }

    //   if (result.status == 200 && !allResult.includes(false)) {
    //     this.errorMessage = "";
    //     this.successMessage = "Category deleted successfully.";
    //     setTimeout(() => {
    //       this.$router.push({
    //         name: "ShowListCatgoriesComp",
    //         params: { RestId: this.RestId },
    //       });
    //     }, 2000);
    //   } else {
    //     this.errorMessage = "Failed to delete category.";
    //     this.successMessage = "";
    //   }
    // },

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
</style>
