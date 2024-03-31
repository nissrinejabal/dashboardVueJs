<template>
  <NavbarComp />

  <div class="profile">
    <div class="rule">
      <h1>dashboard</h1>
      <p>
        Restaurant id : <span>{{ RestId }}</span
        ><br />restname :
        <span>{{ restname }}</span>
      </p>
      <button @click="gobackMenu">Menu</button>
    </div>

    <div class="authentication-form">
      <div class="card">
        <div class="card2">
          <h2>add new Category</h2>
          <form @submit.prevent="addCategory">
            <p class="parae">Category name</p>
            <p>
              <input
                type="nom"
                class="response-box"
                placeholder="Category name"
                v-model.trim="categorieName"
              />
              <br />
              <br />
              <span class="error-feedback" v-if="v$.categorieName.$error">
                {{ v$.categorieName.$errors[0].$message }}
              </span>
              <span class="error-feedback"
                >{{ errorMessage }} {{ successMessage }}</span
              >
            </p>
          </form>
          <div class="btn-profile">
            <button type="submit" @click="addCategory()">add</button>
            <button @click="gobackhome">Go back home</button>
          </div>
        </div>
      </div>
      <!-- <div v-if="showaddrestForm" class="sign-up"></div> -->
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
    console.log("User data from local storage:", user);
    if (!user) {
      console.log("User not found. Redirecting to Signup.");
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
      console.log("User ID from user data:", userData.id);
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    ...mapMutations([
      "setIsUserloggedIn",
      "displayAllCategories",
      "canUserAccessThisRestaurant",
    ]),

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
      // Filter the user categories to check if the category name already exists
      let filterCategoryName = this.ListOfUserCategories.filter(
        (v) =>
          v.categorieName.toLowerCase() === this.categorieName.toLowerCase()
      );

      console.table(filterCategoryName);

      if (!this.v$.$error) {
        if (filterCategoryName.length > 0) {
          this.errorMessage = "The category name already exists.";
          this.successMessage = "";
        } else {
          try {
            // Fetch all existing categories
            const existingCategories = await axios.get(
              `http://localhost:3000/categories`
            );

            // Generate a unique ID for the new category
            const newId =
              existingCategories.data.length > 0
                ? parseInt(
                    existingCategories.data[existingCategories.data.length - 1]
                      .id
                  ) + 1
                : 1;

            // Add the new category with the generated ID
            let result = await axios.post(`http://localhost:3000/categories`, {
              id: newId.toString(),
              categorieName: this.categorieName,
              userId: parseInt(this.userId, 10),
              RestId: parseInt(this.RestId),
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
            } else {
              this.errorMessage = "Failed to add category.";
              this.successMessage = "";
            }
          } catch (error) {
            console.error("Error adding category:", error);
            this.errorMessage = "Failed to add category.";
            this.successMessage = "";
          }
        }
      } else {
        this.errorMessage = "Please enter a category name.";
        this.successMessage = "";
      }
    },

    gobackMenu() {
      this.$router.push({ name: "Menu", params: { RestId: this.RestId } });
    },
    gobackhome() {
      this.$router.push({ name: "home", params: { RestId: this.RestId } });
    },
  },
};
</script>
<style scoped>
.authentication-form {
  height: 35vh;
}
.card {
  height: 250px;
}
</style>
