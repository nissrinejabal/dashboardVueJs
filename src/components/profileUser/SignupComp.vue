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
                type="text"
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
              <span class="error-feedback">{{ errorMessage }}</span>
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
            <br />
            <br />
            <span class="loading-message" v-if="loading">Loading...</span>

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
      errorMessage: "",
      loading: false,
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(3) },
      password: { required, minLength: minLength(6) },
      email: { required, email },
    };
  },
  methods: {
    ...mapActions(["redirectTo"]),
    async validatbeforesignup() {
      this.loading = true;
      try {
        const response = await axios.get(
          `http://localhost:3000/users?email=${this.email}`
        );
        if (response.data.length === 0) {
          this.signUp();
        } else {
          this.errorMessage = "User already exists.";
          this.loading = false;
        }
      } catch (error) {
        console.error("Error checking user existence:", error);
        this.errorMessage = "An error occurred while checking user existence.";
        this.loading = false;
      }
    },
    async signUp() {
      this.v$.$validate();
      if (!this.v$.$error) {
        try {
          this.loading = true; // Set loading to true when signing up
          const response = await axios.post("http://localhost:3000/users", {
            name: this.name,
            password: this.password,
            email: this.email,
          });
          if (response.status === 201) {
            console.log("User successfully registered:", response.data);
            localStorage.setItem("user-info", JSON.stringify(response.data));
            setTimeout(() => {
              this.loading = false; // Set loading to false after a delay
              this.redirectTo({ val: "home" });
            }, 2000); // Adjust the timeout value as needed (in milliseconds)
          } else {
            console.error("Error registering user:", response.data);
            this.errorMessage = "An error occurred while registering user.";
          }
        } catch (error) {
          console.error("Error registering user:", error.message);
          this.errorMessage = "An error occurred while registering user.";
        }
      } else {
        console.log("Form validation failed.");
      }
    },

    redirectToLogin() {
      this.redirectTo({ val: "Login" });
    },
  },
};
</script>

<style scoped>
.loading-message {
  color: gray;
}
</style>
