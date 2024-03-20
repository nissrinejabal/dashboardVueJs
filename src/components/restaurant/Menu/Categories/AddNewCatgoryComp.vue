<template>
  <NavbarComp />
  <div class="routere">
    <div>Restaurant id is {{ RestId }}</div>
    <button @click="goback">Go back home</button>
  </div>
  <div class="category-container">
    <h2>Add New Category</h2>
    <form @submit.prevent="addCategory">
      <div class="form-group">
        <label>Category Name:</label>
        <input
          type="text"
          placeholder="Category name"
          v-model.trim="categorieName"
        />
        <span class="error-feedback" v-if="v$?.categorieName?.$error">
          {{ v$?.categorieName?.$errors[0]?.$message }}
        </span>
        <span class="error-feedback"
          >{{ errorMessage }} {{ successMessage }}</span
        >
      </div>
      <div class="form-group2">
        <button type="submit">Add Category</button>
      </div>
    </form>
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
      restname: "",
      userId: "",
      address: "",
      categorieName: "",
      errorMessage: "",
      successMessage: "",
      ListOfUserCategories: [],
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
      this.restname = userData.restname;
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
        // hadi jebtha man store redirecto ri kan3yto liha nichan w sf
      });
      this.getRestInfo(this.userId, this.RestId);
      this.DisplayUserCategories(this.userId, this.RestId);
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    ...mapMutations([
      "setIsUserloggedIn",
      "displayAllCategories",
      "canUserAccessThisRestaurant",
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
        console.log("hehe");
        RestDetails = result.data;
        this.restname = RestDetails[0].restname;
        this.address = RestDetails[0].address;
        // array fi object
      }
    },
    async addCategory() {
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
          let result = await axios.post(`http://localhost:3000/categories`, {
            categorieName: this.categorieName,
            userId: parseInt(this.userId, 10),
            RestId: parseInt(this.RestId, 10),
          });
          if (result.status == 201) {
            this.errorMessage = "";
            this.successMessage = "Category added successfully.";

            setTimeout(() => {
              this.$router.push({
                name: "ShowListCatgoriesComp",
                params: { RestId: this.RestId },
              });
            }, 2000);
            // ila kant page west page fiha hadi :RestId ndiro liha
          } else {
            this.errorMessage = "Failed to add category.";
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

<style>
.category-container {
  display: flex;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  flex-direction: column;
  align-items: center;
}

.category-container h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.form-group2 {
  text-align: center;
  margin: 20px;
}

label {
  font-weight: bold;
}

input[type="text"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
