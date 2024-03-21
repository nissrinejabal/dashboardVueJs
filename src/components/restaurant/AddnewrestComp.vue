<template>
  <!-- Profile display -->
  <div class="profile">
    <!-- Update form -->
    <h1>dashboard</h1>
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
              <span class="error-feedback">{{ UpdateErr }}</span>
            </p>
            <div class="btn-profile">
              <button type="submit" @click="addrest()">add</button>
              <button @click="goback">go back home</button>
              <br />
              <br />
              <br />
              <span class="error-feedback"
                >{{ errorMessage }} {{ successMessage }}</span
              >
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
    if (!user) {
      this.redirectTo({ val: "Signup" });
      console.log("User not found");
    } else {
      const userData = JSON.parse(user);
      this.userId = userData.id; // Parse userId as an integer
      //ila kayyn user jiblia user id
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    async addrest() {
      this.v$.$validate();
      if (!this.v$.$error) {
        let result = await axios.post(`http://localhost:3000/restaurants`, {
          restname: this.state.restname,
          phone: this.state.phone,
          address: this.state.address,
          userId: parseInt(this.userId, 10),
          // userId: this.userId, //this bash kola user kaydkhl l rest dyalo mashi dyal lakhr
        });
        console.log("form validation daz");
        if (result.status == 201) {
          this.errorMessage = "";
          this.successMessage = "restaurant added successfully.";

          setTimeout(() => {
            this.redirectTo({ val: "home" });
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
          this.errorMessage = "Failed to add restaurant.";
          this.successMessage = "";
        }
      } else {
        console.log("ma²daztsh from validation ");
        this.errorMessage = "try again, refresh  3mr ga3 fields";
        this.successMessage = "";
      }
    },

    goback() {
      this.redirectTo({ val: "home" });
    },
  },
};
</script>

<style scoped>
.authentication-form {
  height: 60vh;
}
</style>
