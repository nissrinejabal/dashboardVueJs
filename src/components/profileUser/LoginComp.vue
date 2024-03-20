<template>
  <!-- v-model.trim="state.email"
  v-model.trim="state.password" -->
  <div>
    <div class="login">
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
              <a href="#" class="si">terms</a>
            </p>
            <a href="#"> <button @click="login()">login</button></a>

            <p class="or">OR</p>
            <a href="#">
              <button @click="redirectTo({ val: 'Signup' })">
                create your account
              </button>
            </a>
            <p>Have an account?<a href="#" class="si"> Sign in</a></p>
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
body {
  margin: 0;
  padding: 0;
  background: #524a4e;
  color: #fdeff4;
  font-family: sans-serif;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='1440' height='800' preserveAspectRatio='none' viewBox='0 0 1440 800'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1029%26quot%3b)' fill='none'%3e%3crect width='1440' height='800' x='0' y='0' fill='rgba(31%2c 34%2c 34%2c 1)'%3e%3c/rect%3e%3cpath d='M-247.02 431.51C-59.94 445.69 125.83 800.93 397.75 815.51 669.67 830.09 634.41 930.78 720.14 932.57' stroke='rgba(51%2c121%2c194%2c0.58)' stroke-width='2'%3e%3c/path%3e%3cpath d='M-20.06 520.24C99.27 520.8 213.31 620.24 446.68 620.24 680.05 620.24 671.82 518.08 913.42 520.24 1155.02 522.4 1235.48 851.79 1380.16 870.54' stroke='rgba(51%2c121%2c194%2c0.58)' stroke-width='2'%3e%3c/path%3e%3cpath d='M-215.22 298.91C-31.01 310.83 139.21 629.26 429.44 658.91 719.67 688.56 644.84 931.32 751.77 952.12' stroke='rgba(51%2c121%2c194%2c0.58)' stroke-width='2'%3e%3c/path%3e%3cpath d='M-161.92 275.5C26.04 283.34 140.78 578.18 519.14 595.5 897.51 612.82 1009.77 929.29 1200.21 938.82' stroke='rgba(51%2c121%2c194%2c0.58)' stroke-width='2'%3e%3c/path%3e%3cpath d='M-177.45 215.96C-8.4 221.86 90.19 466.7 442.06 487.96 793.94 509.22 877.86 872.06 1061.58 889.06' stroke='rgba(51%2c121%2c194%2c0.58)' stroke-width='2'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1029'%3e%3crect width='1440' height='800' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e");
}
.login {
  text-align: center;
  width: 400px;
  /* padding: 20px; */
  margin: 6% auto 0;
}
.card {
  width: 390px;
  height: 480px;
  background-image: linear-gradient(163deg, #00ff75 0%, #3700ff 100%);
  border-radius: 20px;
  transition: all 0.3s;
  padding: 0px;
  margin: 8% auto 0;
}

.card2 {
  width: 391px;
  height: 481px;
  background-color: #1f2222;
  border-radius: 20px;
  transition: all 0.2s;
  padding: 0px;
  margin: 8% auto 0;
}

/* .card2:hover {
  transform: scale(0.97);
  border-radius: 20px;
} */

/* .card:hover {
  box-shadow: 0px 0px 30px 1px rgba(0, 255, 117, 0.3);
} */
h2 {
  font-family: sans-serif;
  color: rgb(221, 204, 204);
  margin-bottom: 30px;
  margin-top: 30px;
  margin: 10px 0;
}

button {
  padding: 1.3em 3em;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 500;
  color: #000;
  background-color: #fff;
  border: none;
  border-radius: 45px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
}

button:hover {
  background-color: #2ee59d;
  box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
  color: #fff;
  transform: translateY(-7px);
}

button:active {
  transform: translateY(-1px);
}

.response-box {
  border-radius: 20px;
  padding: 10px;
  width: 80%;
  border: 1px solid #a1b57d;
}
.si {
  text-decoration: #00ff75;
  color: #00ff75;
}

h1 {
  font-family: "Gill Sans", "Gill Sans MT", Calibri, sans-serif;
  font-size: 24px;
  font-style: normal;
  font-variant: normal;
  font-weight: 700;
  line-height: 26.4px;
  text-transform: uppercase;
}
p {
  color: white;
}

h1,
h2,
h3 {
  color: white;
}

a {
  color: white;
}
</style>
