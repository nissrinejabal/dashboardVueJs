<template>
  <NavbarComp />
  <!-- Profile display -->
  <div class="profile">
    <!-- Update form -->
    <div class="rule">
      <h1>dashboard</h1>
      <button @click="gobackMenu">home</button>
    </div>
    <div class="authentication-form">
      <div class="card">
        <div class="card2">
          <h1>add new restaurant</h1>
          <form @submit.prevent="add">
            <p class="parae">Restaurant name</p>
            <p>
              <input
                type="nom"
                class="response-box"
                placeholder="Restaurant name"
                v-model.trim.trim="state.restname"
              />
              <br />
              <br />
              <span class="error-feedback" v-if="v$.restname.$error">
                {{ v$.restname.$errors[0].$message }}
              </span>
            </p>
            <p class="parae">Phone number</p>
            <p>
              <input
                type="number"
                class="response-box"
                placeholder="phone number"
                v-model.trim.trim="state.phone"
              />
              <br />
              <br />
              <span class="error-feedback" v-if="v$.phone.$error">
                {{ v$.phone.$errors[0].$message }}
              </span>
            </p>
            <p class="parap">address</p>
            <p>
              <input
                type="adress"
                class="response-box"
                placeholder="address"
                v-model.trim.trim="state.address"
              />
              <br />
              <br />
              <span class="error-feedback" v-if="v$.address.$error">
                {{ v$.address.$errors[0].$message }}
              </span>
              <br />
              <span class="error-feedback"
                >{{ errorMessage }} {{ successMessage }}</span
              >
            </p>
            <div class="btn-profile">
              <button type="submit" @click="addrest()">add</button>
            </div>
          </form>
        </div>
      </div>
      <!-- <div v-if="showaddrestForm" class="sign-up"></div> -->
    </div>
  </div>
</template>

<script>
import NavbarComp from "../header/NavbarComp.vue";
import { mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, phone, minLength } from "@vuelidate/validators";
import axios from "axios";
import { computed, reactive } from "vue"; //to use composition api

export default {
  setup() {
    const state = reactive({
      restname: "",
      phone: "",
      address: "",
      errorMessage: "",
      successMessage: "",
    });
    // function katraja3 object
    const rules = computed(() => {
      return {
        restname: { required, minLength: minLength(3) },
        address: { required, minLength: minLength(2) },
        phone: { required, minLength: minLength(2) },
      };
    });
    const v$ = useValidate(rules, state);
    return {
      v$,
      state,
    };
  },
  data() {
    return {
      userId: "",
      errorMessage: "",
      successMessage: "",
    };
  },
  validations() {},
  components: { NavbarComp },
  mounted() {
    let user = localStorage.getItem("user-info");
    console.log("User data from local storage:", user);
    if (!user) {
      console.log("User not found. Redirecting to Signup.");
      this.redirectTo({ val: "Signup" });
    } else {
      const userData = JSON.parse(user);
      console.log("User ID from user data:", userData.id);
      this.userId = userData.id; // Parse userId as an integer //ila kayyn user jiblia user id
    }
  },

  methods: {
    ...mapActions(["redirectTo"]),
    async addrest() {
      // Validate the form
      this.v$.$validate();

      if (!this.v$.$error) {
        // If form validation succeeds
        try {
          // Check if the restaurant already exists
          const existingRestaurants = await axios.get(
            `http://localhost:3000/restaurants`
          );
          const existingRestaurant = existingRestaurants.data.find(
            (rest) => rest.restname === this.state.restname
          );

          if (!existingRestaurant) {
            // If the restaurant doesn't exist, generate a unique ID
            const newId =
              existingRestaurants.data.length > 0
                ? parseInt(
                    existingRestaurants.data[
                      existingRestaurants.data.length - 1
                    ].id
                  ) + 1
                : 1;

            // Add the new restaurant with the generated ID
            const result = await axios.post(
              `http://localhost:3000/restaurants`,
              {
                id: newId.toString(),
                restname: this.state.restname,
                phone: this.state.phone,
                address: this.state.address,
                userId: this.userId,
              }
            );

            if (result.status === 201) {
              // If the restaurant is successfully added
              this.errorMessage = "";
              this.successMessage = "Restaurant added successfully.";

              setTimeout(() => {
                // Redirect to home after 2 seconds
                this.redirectTo({ val: "home" });
                // Reset form fields and messages
                this.errorMessage = "";
                this.successMessage = "";
                this.state.restname = "";
                this.state.phone = "";
                this.state.address = "";
                this.v$.restname.$errors[0] = "";
                this.v$.phone.$errors[0] = "";
                this.v$.address.$errors[0] = "";
              }, 2000);
            } else {
              // If there's an error adding the restaurant
              this.errorMessage = "Failed to add restaurant.";
              this.successMessage = "";
            }
          } else {
            // If the restaurant already exists
            this.errorMessage = "Restaurant already exists.";
            this.successMessage = "";
          }
        } catch (error) {
          console.error("Error adding restaurant:", error);
          this.errorMessage = "Failed to add restaurant.";
          this.successMessage = "";
        }
      } else {
        // If form validation fails
        console.log("Form validation failed.");
        this.errorMessage = "Try again, refresh all fields.";
        this.successMessage = "";
      }
    },

    gobackMenu() {
      this.redirectTo({ val: "home" });
    },
  },
};
</script>

<style scoped>
.authentication-form {
  height: 60vh;
}
.btn-profile {
  justify-content: center;
}
</style>
