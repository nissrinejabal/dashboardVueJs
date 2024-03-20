<template>
  <div>
    <!-- Profile display -->
    <div class="profile">
      <!-- Button to toggle the addrest form -->
      <div class="card">
        <div class="card2">
          <h1>add new restaurant</h1>
          <form @submit.prevent="add">
            <p class="parae">Restaurant name</p>
            <p>
              <input
                type="text"
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
                type="numero"
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
                type="address"
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

            <button type="submit" @click="addrest()">add</button> |
            <button @click="goback">go back home</button>
          </form>
        </div>
      </div>
      <!-- addrest form -->
      <div v-if="showaddrestForm" class="sign-up"></div>
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
      this.redirectTo({ val: "SignupView" });
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
          (this.errorMessage = ""),
            (this.successMessage = "rest daz w tajouta"),
            console.log("daz add new restaurant");

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
          console.log("madaztsh add new restant ");
          this.errorMessage = "rest not added";
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

<style>
/* Profile styles */
.profile {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.profile h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.profile-info {
  display: flex;
  align-items: center;
}

.avatar {
  margin-right: 20px;
}

.avatar img {
  width: 100px;
  border-radius: 50%;
}

.user-details p {
  margin-bottom: 10px;
}

.user-details p strong {
  margin-right: 5px;
}
</style>
