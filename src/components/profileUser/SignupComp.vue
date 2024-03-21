<template>
  <div>
    <div class="authentication-form">
      <div class="card">
        <div class="card2">
          <h1>Sign up</h1>
          <form @submit.prevent="signUp">
            <p class="parae">Nom</p>
            <p>
              <input
                type="nom"
                class="response-box"
                placeholder="Name"
                v-model.trim="name"
              />
              <br />
              <br />
              <span class="error-feedback" v-if="v$.name.$error">
                {{ v$.name.$errors[0].$message }}
              </span>
            </p>
            <p class="parae">Email</p>
            <p>
              <input
                type="email"
                class="response-box"
                placeholder="Email"
                v-model.trim="email"
              />
              <br />
              <span class="error-feedback" v-if="v$.email.$error">
                {{ v$.email.$errors[0].$message }}
              </span>
              <span class="error-feedback"
                >{{ errorMessage }} {{ successMessage }}</span
              >
            </p>
            <p class="parap">Password</p>
            <p>
              <input
                type="password"
                class="response-box"
                placeholder="Password"
                v-model.trim="password"
              />
              <br />
              <br />
              <span class="error-feedback" v-if="v$.password.$error">
                {{ v$.password.$errors[0].$message }}
              </span>
            </p>

            <button type="submit" @click="validatbeforesignup()">
              Sign Up
            </button>

            <p class="or">OR</p>
            <button @click="redirectToLogin">Log in with your account</button>
            <p>Have an account? <a href="#" class="terms">Sign in</a></p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import axios from "axios";

export default {
  name: "SignUp",
  data() {
    return {
      v$: useValidate(),
      name: "",
      email: "",
      password: "",
      userEmailExists: "",
      errorMessage: "",
      successMessage: "",
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(3) },
      password: { required, minLength: minLength(6) },
      email: { required, email },
    };
  },
  mounted() {
    this.fetchUserData();
  },
  methods: {
    ...mapActions(["redirectTo"]),
    async fetchUserData() {
      try {
        const response = await axios.get("http://localhost:3000/users/1");
        const userData = response.data;
        this.name = userData.name;
        this.email = userData.email;
        // Assuming you don't want to fetch password from the server for security reasons
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    redirectToLogin() {
      this.redirectTo({ val: "Login" });
    },
    async validatbeforesignup() {
      let res = await axios.get(
        `http://localhost:3000/users?email=${this.email}`
      );
      if ((res.status = 200)) {
        this.userEmailExists = res.data;
        if (this.userEmailExists.length != 1) {
          (this.errorMessage = ""), (this.successMessage = "loading...");
          this.signUp();
        } else {
          this.errorMessage = "must fill all fields";
          this.successMessage = "";
        }
      }

      this.errorMessage = "user already exists";
      this.successMessage = "";
    },
    async signUp() {
      this.v$.$validate();
      if (!this.v$.$error) {
        try {
          const response = await axios.post("http://localhost:3000/users", {
            name: this.name,
            password: this.password,
            email: this.email,
          });
          if (response.status === 201) {
            console.log("User successfully registered:", response.data);
            localStorage.setItem("user-info", JSON.stringify(response.data));
            this.redirectTo({ val: "home" });
          } else {
            console.error("Error registering user:", response.data);
          }
        } catch (error) {
          console.error("Error registering user:", error.message);
        }
      } else {
        console.log("Form validation failed.");
      }
    },
  },
};
</script>

<style scoped>
.card2 {
  margin: 5% auto 0;
}
</style>
