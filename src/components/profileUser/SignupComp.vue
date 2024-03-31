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
            </p>
            <span class="error-feedback" v-if="v$.name.$error">
              {{ v$.name.$errors[0].$message }}
            </span>
            <p class="parae">Email</p>
            <p>
              <input
                type="email"
                class="response-box"
                placeholder="Email"
                v-model.trim="email"
              />
            </p>
            <span class="error-feedback" v-if="v$.email.$error">
              {{ v$.email.$errors[0].$message }}
            </span>
            <span class="error-feedback">{{ errorMessage }}</span>
            <p class="parap">Password</p>
            <p>
              <input
                type="password"
                class="response-box"
                placeholder="Password"
                v-model.trim="password"
              />
            </p>
            <span class="error-feedback" v-if="v$.password.$error">
              {{ v$.password.$errors[0].$message }}
            </span>

            <!-- <button type="submit" @click="validatbeforesignup()"> -->

            <br />
            <br />
            <button type="submit">Sign Up</button>
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
      usersFetshData: [], // Initialize users array
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(1) },
      password: { required, minLength: minLength(1) },
      email: { required, email },
    };
  },
  async mounted() {
    const response = await axios.get("http://localhost:3000/users");
    this.usersFetshData = response.data;
  },
  methods: {
    ...mapActions(["redirectTo"]),
    async signUp() {
      this.v$.$validate();
      if (!this.v$.$error) {
        this.loading = true;
        const existingUser = this.usersFetshData.find(
          (user) => user.email === this.email
        );
        if (!existingUser) {
          // Generate unique ID for the new user
          const id =
            this.usersFetshData.length > 0
              ? parseInt(
                  this.usersFetshData[this.usersFetshData.length - 1].id
                ) + 1
              : 1;

          // Make POST request to add the new user with the generated ID
          const result = await axios.post("http://localhost:3000/users", {
            id: id.toString(),
            name: this.name,
            password: this.password,
            email: this.email,
          });
          if (result.status == 201) {
            console.log("User successfully registered:", result.data);
            localStorage.setItem("user-info", JSON.stringify(result.data));
            console.log(result);
            this.redirectTo({ val: "home" });
          } else {
            this.errorMessage = "";
            this.loading = false;
          }
        } else {
          this.errorMessage = "User already exists.";
          this.loading = false;
        }
      } else {
        console.error("Form validation failed.");
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
