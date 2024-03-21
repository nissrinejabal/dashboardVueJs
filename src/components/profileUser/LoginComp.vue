<template>
  <!-- v-model.trim="state.email"
  v-model.trim="state.password" -->
  <div>
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
            <p class="parap">password</p>
            <p>
              <input
                type="password"
                class="response-box"
                placeholder="password"
                v-model.trim="state.password"
              />
              <br />
              <br />
              <span class="error-feedback" v-if="v$.password.$error">
                {{ v$.password.$errors[0].$message }}
              </span>
              <br />
              <span class="error-feedback">{{ userNotfoundErr }}</span>
            </p>
            <p>
              <span>
                <input type="checkbox" id="_checkbox" /> I agree to the
              </span>
              <a href="#" class="terms">terms</a>
            </p>
            <a href="#"> <button @click="login()">login</button></a>

            <p class="or">OR</p>
            <a href="#">
              <button @click="redirectTo({ val: 'Signup' })">
                create your account
              </button>
            </a>
            <p>Have an account?<a href="#" class="terms"> Sign in</a></p>
          </form>
        </div>
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
        console.log("dazet lvalidation form ");
        let result = await axios.get(
          `http://localhost:3000/users?email=${this.state.email}&password=${this.state.password}`
        );
        if (result.status == 200 && result.data.length > 0) {
          localStorage.setItem("user-info", JSON.stringify(result.data[0]));
          console.log("logged in");
          this.redirectTo({ val: "home" });
        } else {
          console.log("no user found");
          this.userNotfoundErr = "user not found";
        }
      } else {
        console.log("madazetsh lvalidation form");
      }
    },
  },
};
</script>

<style scoped>
.card2 {
  margin: 15% auto 0;
}
</style>
