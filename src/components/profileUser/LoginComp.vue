<template>
  <div class="authentication-form">
    <div class="card">
      <div class="card2">
        <h1>Login</h1>
        <form @click.prevent>
          <p class="parae">Email</p>
          <p>
            <input
              type="email"
              class="response-box"
              placeholder="Email"
              v-model.trim="state.email"
            />
            <br />
            <span class="error-feedback" v-if="v$.email.$error">
              {{ v$.email.$errors[0].$message }}
            </span>
          </p>
          <p class="parap">Password</p>
          <p>
            <input
              type="password"
              class="response-box"
              placeholder="Password"
              v-model.trim="state.password"
            />
            <br />
            <span class="error-feedback" v-if="v$.password.$error">
              {{ v$.password.$errors[0].$message }}
            </span>
            <br />
            <span class="error-feedback">{{ userNotfoundErr }}</span>
          </p>
          <p>
            <input type="checkbox" /> I agree to the
            <a href="#" class="terms">terms</a>
          </p>

          <a href="#"> <button @click="login()">login</button></a>

          <p class="or">OR</p>
          <a href="#">
            <button @click="redirectTo({ val: 'Signup' })">
              create your account
            </button>
          </a>
          <p>Don't have an account?<a href="#" class="terms"> Sign in</a></p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { mapActions } from "vuex";
import { required, email } from "@vuelidate/validators";
import { computed, reactive } from "vue";
import axios from "axios";
export default {
  //composition api
  setup() {
    const state = reactive({
      email: "",
      password: "",
    });
    const rules = computed(() => {
      return {
        email: { required, email },
        password: { required },
      };
    });
    const v$ = useVuelidate(rules, state);
    return {
      state,
      v$,
    };
  },
  data() {
    return {
      userNotfoundErr: "",
    };
  },
  //ila bghina nchofo wesh user deja kayn kaandiroo mounted
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      this.redirectTo({ val: "home" });
      console.log("user home");
    }
  },
  methods: {
    // signupage() {
    //   this.$router.push({ name: "Signup" });
    // },
    ...mapActions(["redirectTo"]),
    async login() {
      this.v$.$validate();
      if (!this.v$.$error) {
        const result = await axios.get(
          `http://localhost:3000/users?email=${this.state.email}`
        );
        if (result.status === 200 && result.data.length > 0) {
          const user = result.data[0];
          if (user.password === this.state.password) {
            // Password is correct, login successful
            localStorage.setItem("user-info", JSON.stringify(user));
            this.redirectTo({ val: "home" });
          } else {
            // Password is incorrect
            this.userNotfoundErr = "Incorrect password.";
          }
        } else {
          // User does not exist
          this.userNotfoundErr = "User not found.";
        }
      }
    },
  },
};
</script>

<style scoped>
.card2 {
  margin: 10% auto 0;
}
.card {
  height: 430px;
}
</style>
