<template>
  <NavbarComp />
  <div class="update-delete-form">
    <div class="update-delete-form">
      <h1>
        Update Restaurant # <span>{{ RestId }}</span>
      </h1>
      <form @submit.prevent="add">
        <div class="inputs-box">
          <p>Restaurant name</p>
          <input
            class="input-box-update"
            type="text"
            v-model.trim="state.restname"
            placeholder="restaurant name"
          />
          <span class="error-feedback" v-if="v$.restname.$error">
            {{ v$.restname.$errors[0].$message }}
          </span>
          <p>Restaurant phone</p>
          <input
            class="input-box-update"
            type="text"
            v-model.trim="state.phone"
            placeholder="Phone"
          />
          <span class="error-feedback" v-if="v$.phone.$error">
            {{ v$.phone.$errors[0].$message }}
          </span>
          <!-- /////////////// -->
          <p>Restaurant address</p>
          <input
            class="input-box-update"
            type="text"
            v-model.trim="state.address"
            placeholder="address"
          />
          <span class="error-feedback" v-if="v$.address.$error">
            {{ v$.address.$errors[0].$message }}
          </span>
          <!-- ////////////////////////// -->

          <div class="error-feedback" v-if="successMessage.length > 0">
            {{ successMessage }}
          </div>
          <div class="error-feedback" v-if="errorMessage.length > 0">
            {{ errorMessage }}
          </div>
          <p>Are you sure you want to update?</p>
          <button @click="UpdateRest">Update</button>
        </div>
      </form>
    </div>
    <div class="update-verif">
      <button class="btn-menu" @click="gobackMenu">Menu</button>
      <button @click="goback">home</button>
    </div>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { mapActions } from "vuex";
import { required, email } from "@vuelidate/validators";
import { computed, reactive } from "vue";
import axios from "axios";
import NavbarComp from "../header/NavbarComp.vue";

export default {
  components: { NavbarComp },
  setup() {
    const state = reactive({
      restname: "",
      phone: "",
      address: "",
    });
    const rules = computed(() => {
      return {
        restname: { required },
        phone: { required },
        address: { required },
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
      RestId: "",
      userId: "",
      successMessage: "",
      errorMessage: "",
    };
  },
  validations() {},
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "home" });
    } else {
      const userData = JSON.parse(user);
      this.RestId = this.$route.params.RestId;
      this.userId = userData.id;
      this.AccessRestaurantuser();
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    goback() {
      this.redirectTo({ val: "home" });
    },
    async AccessRestaurantuser() {
      let result = await axios.get(
        `http://localhost:3000/restaurants?id=${this.RestId}&userId=${this.userId}`
      );
      if (result.status == 200 && result.data.length > 0) {
        this.RestaurantData = result.data;
        this.state.phone = this.RestaurantData[0].phone;
        this.state.restname = this.RestaurantData[0].restname;
        this.state.address = this.RestaurantData[0].address;
        console.log("Restaurant data loaded successfully.");
      } else {
        this.redirectTo({ val: "home" });
        console.log("Restaurant data not found.");
      }
    },
    async UpdateRest() {
      console.log("ehe");
      this.v$.$validate();
      if (!this.v$.$error) {
        console.log("validation right");
        let result = await axios.put(
          `http://localhost:3000/restaurants/${this.RestId}`,
          {
            restname: this.state.restname,
            phone: this.state.phone,
            address: this.state.address,
            // userId: this.userId,
            userId: parseInt(this.userId, 10),
          }
        );
        if (result.status == 200) {
          this.errorMessage = "";
          this.successMessage = "updated restaurant ";
          setTimeout(() => {
            this.redirectTo({ val: "home" });
          }, 2000);
        } else {
          this.successMessage = "";
          this.errorMessage = "not updated wit wit";
          console.log("smtgh went wrong ");
        }
      }
    },
  },
};
</script>
