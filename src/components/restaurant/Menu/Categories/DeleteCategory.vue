<template>
  <NavbarComp />
  <div class="update-delete-form">
    <div class="update-delete-form">
      <h1>
        Delete Category # <span> {{ CatId }}</span>
      </h1>
      <div class="Delete-inputs-form">
        <input
          class="input-box-update"
          type="text"
          v-model.trim="categorieName"
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
      <button @click="deleteCategory" class="delete">Delete</button>
      <button @click="goback">Go Back</button>
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
    goback() {
      this.redirectTo({ val: "ShowListCatgoriesComp" });
    },
  },
};
</script>
