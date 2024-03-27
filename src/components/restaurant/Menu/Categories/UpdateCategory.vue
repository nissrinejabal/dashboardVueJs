<template>
  <NavbarComp />
  <div class="update-delete-form">
    <div class="update-delete-form">
      <h1>
        Update Category # <span>{{ CatId }}</span>
      </h1>
      <form @submit.prevent="add">
        <div class="inputs-box">
          <p>Category name</p>
          <input
            class="input-box-update"
            type="text"
            v-model.trim="categorieName"
            placeholder="Category name"
          />
          <span class="error-feedback" v-if="v$.categorieName.$error">
            {{ v$.categorieName.$errors[0].$message }}
          </span>

          <!-- ////////////////////////// -->
          <span class="error-feedback"
            >{{ errorMessage }} {{ successMessage }}</span
          >
          <p>Are you sure you want to update?</p>
          <button @click="updateCategory">Update</button>
        </div>
      </form>
    </div>
    <div class="update-verif">
      <button class="btn-menu" @click="gobackMenu">Menu</button>
      <button @click="goback">home</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarComp from "@/components/header/NavbarComp.vue";
import { mapActions, mapMutations, mapState } from "vuex";
import useValidate from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
export default {
  components: { NavbarComp },

  data() {
    return {
      v$: useValidate(),
      RestId: this.$route.params.RestId,
      CatId: this.$route.params.CatId,
      userId: "",
      restname: "",
      address: "",
      categorieName: "",
      errorMessage: "",
      successMessage: "",
      ListOfUserCategories: [],
      categoryInfo: [],
    };
  },
  validations() {
    return {
      categorieName: {
        required,
        minLength: minLength(4),
        maxlength: maxLength(15),
      },
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "Signup" });
    } else {
      const userData = JSON.parse(user);
      // this.restname = userData.restname;
      this.userId = userData.id;
      this.setIsUserloggedIn();
      this.displayAllCategories({
        theUserId: this.userId,
        theRestId: this.RestId,
      });
      this.canUserAccessThisRestaurant({
        theUserId: this.userId,
        theRestId: this.RestId,
        redirectToPage: "home",
        //redirectToPage: "home", hadi jebtha man store redirecto ri kan3yto liha nichan w sf
        //  hadi jabha bash  kayjib lia les information dyal restaurant
        // w hadi rah hia hadi this.getRestInfo(this.userId, this.RestId); donc n9dro nkhaliw ri had w sf
      });
      this.canUserAccessThisCategory({
        theUserId: this.userId,
        theRestId: this.RestId,
        catIdIs: this.CatId,
        redirectToPage: "home",
        // hadi jabha back kajib lia les info dyal category
      });
      this.getRestInfo(this.userId, this.RestId);
      this.DisplayUserCategories(this.userId, this.RestId);
      this.getCategoryInfo(this.userId, this.RestId, this.CatId);
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    ...mapMutations([
      "IsUserloggedIn",
      "setIsUserloggedIn",
      "displayAllCategories",
      "canUserAccessThisRestaurant",
      "canUserAccessThisCategory",
    ]),
    goback() {
      this.$router.go(-1);
    },
    async DisplayUserCategories(userId, restaurantId) {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${userId}&RestId=${restaurantId}`
      );
      if (result.status == 200) {
        this.ListOfUserCategories = result.data;
        console.log(result.data);
      }
    },
    async getRestInfo(userId, restaurantId) {
      let result = await axios.get(
        `http://localhost:3000/restaurants?userId=${userId}&id=${restaurantId}`
      );
      let RestDetails = [];
      if (result.status == 200) {
        RestDetails = result.data;
        this.restname = RestDetails[0].restname;
        this.address = RestDetails[0].address;
        // array fi object
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
    async updateCategory() {
      this.v$.$validate();
      // bghut ndur filterdyal ri les names
      let filterCategoryName = this.ListOfUserCategories.filter(
        (v) => v.categorieName.toLowerCase() == this.categorieName.toLowerCase()
        // db hna kaydir filter maj li 3andna li howa maktoub li yallah ktebt howa hadi  this.categorieName.toLocaleLowerCase()
      );
      console.table(filterCategoryName);
      if (!this.v$.$error) {
        if (filterCategoryName.length > 0) {
          this.errorMessage = "The category name already exists.";
          this.successMessage = "";
        } else {
          let result = await axios.put(
            `http://localhost:3000/categories/${this.CatId}`,
            {
              categorieName: this.categorieName,
              userId: parseInt(this.userId, 10),
              RestId: parseInt(this.RestId, 10),
            }
          );
          if (result.status == 200) {
            this.errorMessage = "";
            this.successMessage = "Category updated successfully.";

            setTimeout(() => {
              this.$router.push({
                name: "ShowListCatgoriesComp",
                params: { RestId: this.RestId },
              });
            }, 2000);
            // ila kant page west page fiha hadi :RestId ndiro liha
          } else {
            this.errorMessage = "Failed to update category.";
            this.successMessage = "";
          }
        }
      } else {
        this.errorMessage = "Please enter a category name.";
        this.successMessage = "";
      }
    },
  },
};
</script>
