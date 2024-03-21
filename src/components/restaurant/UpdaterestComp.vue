<template>
  <div class="info-list">
    <div class="global-info">
      <h1>Update Restaurant #{{ UpdateRestaurant }}</h1>
      <form @submit.prevent="add">
        <div class="inputs">
          <p>Restaurant name</p>
          <input
            type="text"
            v-model.trim="state.restname"
            placeholder="restaurant name"
          />
          <span class="error-feedback" v-if="v$.restname.$error">
            {{ v$.restname.$errors[0].$message }}
          </span>
          <p>Restaurant phone</p>
          <input type="text" v-model.trim="state.phone" placeholder="Phone" />
          <span class="error-feedback" v-if="v$.phone.$error">
            {{ v$.phone.$errors[0].$message }}
          </span>
          <!-- /////////////// -->
          <p>Restaurant address</p>
          <input
            type="text"
            v-model.trim="state.address"
            placeholder="address"
          />
          <span class="error-feedback" v-if="v$.address.$error">
            {{ v$.address.$errors[0].$message }}
          </span>
          <!-- ////////////////////////// -->

          <div class="error-feedback" v-if="UpdateRestSucc.length > 0">
            {{ UpdateRestSucc }}
          </div>
          <div class="error-feedback" v-if="UpdateRestErr.length > 0">
            {{ UpdateRestErr }}
          </div>
        </div>
        <div class="btn-class">
          <button @click="UpdateRest">Update</button>
          <button @click="goback">Go Back</button>
        </div>
      </form>
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
      UpdateRestSucc: "",
      UpdateRestErr: "",
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
          this.UpdateRestErr = "";
          this.UpdateRestSucc = "updated restaurant ";
          setTimeout(() => {
            this.redirectTo({ val: "home" });
          }, 2000);
        } else {
          this.UpdateRestSucc = "";
          this.UpdateRestErr = "not updated wit wit";
          console.log("smtgh went wrong ");
        }
      }
    },
  },
};
</script>

<style scoped>
.info-list {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  /* margin-bottom: 20px; */
  /* background-color: #f9f9f9; */
  /* box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); */
  flex-direction: column;
  align-content: center;
  align-items: center;
}

.global-info input[type="text"] {
  /* width: calc(100% - 22px); */
  display: flex;
  flex-direction: column;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 5px;
  background: #ededed;
}

.btn-class {
  margin-top: 20px;
  text-align: center;
  display: flex;
  margin-top: 20px;
  text-align: center;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.btn-class h1 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #333;
}

.btn-class p {
  color: #666;
  margin-bottom: 20px;
}

.inputs {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

button:hover {
  background-color: #cc0000;
}
</style>
