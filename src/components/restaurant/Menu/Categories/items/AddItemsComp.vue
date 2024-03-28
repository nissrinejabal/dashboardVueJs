<template>
  <NavbarComp />
  <div class="profile">
    <div class="rule">
      <h1>dashboard</h1>
      <p>
        Restaurant id : <span>{{ RestId }}</span
        ><br />restname :
        <span>{{ restname }}</span>
      </p>
      <button @click="gobackhome">home</button>
    </div>

    <div class="authentication-form">
      <div class="card">
        <div class="card2">
          <h2>Add New item</h2>
          <form @submit.prevent="addItem">
            <div class="form-group">
              <p class="parae">Item Name:</p>
              <input
                type="text"
                class="response-box"
                v-model="itemname"
                placeholder="itemname"
              />
              <span class="error-feedback" v-if="v$?.itemname?.$error">
                {{ v$?.itemname?.$errors[0]?.$message }}
              </span>
            </div>

            <div class="form-group">
              <p class="parae">Description:</p>
              <textarea
                class="response-box"
                v-model="description"
                placeholder="description"
              ></textarea>
              <span class="error-feedback" v-if="v$?.description?.$error">
                {{ v$?.description?.$errors[0]?.$message }}
              </span>
            </div>
            <div class="form-group">
              <p class="parae">Price:</p>
              <input
                type="text"
                class="response-box"
                v-model="price"
                placeholder="Price"
              />
              <span class="error-feedback" v-if="v$?.price?.$error">
                {{ v$?.price?.$errors[0]?.$message }}
              </span>
            </div>
            <div class="form-group">
              <p class="parae">Quantity:</p>
              <input
                class="response-box"
                type="number"
                v-model.trim="Quantity"
                placeholder="Quantity"
                step="1"
              />
              <span class="error-feedback" v-if="v$?.Quantity?.$error">
                {{ v$?.Quantity?.$errors[0]?.$message }}
              </span>
            </div>
            <div class="form-group">
              <p class="parae">Select Category:</p>
              <select
                selected
                class="selected-items response-box"
                v-model.trim="pickedCategory"
                placeholder="Quantity"
              >
                <option disabled>Please select a category</option>
                <option
                  v-for="(Cat, i) in ListOfCategories"
                  :key="i"
                  :value="Cat.id"
                >
                  {{ Cat.categorieName }}
                  <!-- <h1>hhh id{{ pickedCategory }}</h1> -->
                </option>
              </select>
            </div>
            <span class="error-feedback" v-if="v$?.pickedCategory?.$error">
              {{ v$?.pickedCategory?.$errors[0]?.$message }}
            </span>
            <br />
            <span class="error-feedback"
              >{{ errorMessage }} {{ successMessage }}</span
            >
            <div class="btn-profile">
              <button type="submit">Add item</button>

              <button @click="gobackMenu" class="btn-menu">Menu</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarComp from "@/components/header/NavbarComp.vue";
import { mapActions, mapMutations, mapState } from "vuex";
import useValidate from "@vuelidate/core";
import {
  required,
  minLength,
  maxLength,
  number,
  minValue,
  integer,
  between,
} from "@vuelidate/validators";
export default {
  components: { NavbarComp },

  data() {
    return {
      v$: useValidate(),
      RestId: this.$route.params.RestId,
      restname: "",
      userId: "",
      address: "",
      categorieName: "",
      itemname: "",
      pickedCategory: "",
      price: 1,
      description: "",
      Quantity: 1,
      errorMessage: "",
      successMessage: "",
      ListOfUserCategories: [],
    };
  },

  validations() {
    return {
      itemname: {
        required,
        minLength: minLength(4),
        maxlength: maxLength(15),
      },

      price: {
        required,
        min: minValue(0),
        minLength: minLength(4),
        maxlength: maxLength(15),
      },
      description: {
        required,
        minLength: minLength(4),
        maxlength: maxLength(15),
      },
      Quantity: {
        required,
        between: between(1, 1000),
      },
      pickedCategory: { required },
    };
  },
  computed: {
    ...mapState([
      "ListOfCategories",
      "IsUserloggedIn",
      "numOfCategories",
      "ListOfRestaurants",
    ]),
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "Signup" });
    } else {
      const userData = JSON.parse(user);
      this.restname = userData.restname;
      this.userId = userData.id;
      this.setIsUserloggedIn();
      this.displayAllCategories({
        theUserId: this.userId,
        theRestId: this.RestId,
      });
      this.canUserAccessThisRestaurant({
        theUserId: this.userId,
        theRestId: this.RestId,
        redirectToPage: "home",
        // hadi jebtha man store redirecto ri kan3yto liha nichan w sf
      });

      this.getRestInfo(this.userId, this.RestId);
      this.DisplayUserCategories(this.userId, this.RestId);
    }
  },

  methods: {
    ...mapActions(["redirectTo"]),
    ...mapMutations([
      "setIsUserloggedIn",
      "ListOfCategories",
      "displayAllCategories",
      "canUserAccessThisRestaurant",
    ]),

    async DisplayUserCategories(userId, RestId) {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${userId}&RestId=${RestId}`
      );
      if (result.status == 200) {
        this.ListOfUserCategories = result.data;
        console.log(result.data);
      }
    },
    async getRestInfo(userId, RestId) {
      let result = await axios.get(
        `http://localhost:3000/restaurants?userId=${userId}&id=${RestId}`
      );
      let RestDetails = [];
      if (result.status == 200) {
        console.log("hehe");
        RestDetails = result.data;
        this.restname = RestDetails[0].restname;
        this.address = RestDetails[0].address;
        // array fi object
      }
    },
    gobackhome() {
      this.$router.push({ name: "home", params: { RestId: this.RestId } });
    },
    gobackMenu() {
      this.$router.push({ name: "Menu", params: { RestId: this.RestId } });
    },
    async addItem() {
      this.v$.$validate();
      if (!this.v$.$error) {
        let result = await axios.post(`http://localhost:3000/items`, {
          itemname: this.itemname,
          price: parseFloat(this.price).toFixed(2), //ntaj3o float
          description: this.description,
          Quantity: this.Quantity,
          phone: this.phone,
          userId: parseInt(this.userId, 10),
          RestId: parseInt(this.RestId, 10),
          CatId: this.pickedCategory,

          // userId: this.userId, //this bash kola user kaydkhl l rest dyalo mashi dyal lakhr
        });
        console.log("form validation daz");
        if (result.status == 201) {
          (this.errorMessage = ""),
            (this.successMessage = "item daz w tajouta"),
            console.log("daz add new item");

          setTimeout(() => {
            this.$router.push({
              name: "Menu",
              params: { RestId: this.RestId },
            });
          }, 2000);
        } else {
          console.log("madaztsh add new item ");
          this.errorMessage = "item not added";
          this.successMessage = "";
        }
      } else {
        console.log("ma²daztsh from validation ");
        this.errorMessage = "try again, refresh  3mr ga3 fields";
        this.successMessage = "";
      }
    },
  },
};
</script>
<style scoped>
.authentication-form {
  height: 72vh;
}
.card {
  height: 602px;
}
</style>
<!-- <style scoped>
.header {
  text-align: center;
  font-size: 1.5rem;
  line-height: 5rem;
}
.add-item {
  display: flex;
  border: 2px solid;
  max-width: 385px;
  margin: 0px auto;
  padding: 20px;
  flex-direction: column;
  align-items: center;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.form {
  /* Added this class to style the form container */
  display: flex;
  flex-direction: column;
}

.input-group {
  margin-bottom: 15px;
}

label {
  margin-bottom: 5px;
}

input[type="text"],
input[type="number"],
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

textarea {
  resize: vertical;
}

/* button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
} */

/* button:hover {
  background-color: #0056b3;
} */

.error-feedback {
  color: red;
  margin-top: 5px;
}
.selected-items {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}
</style> -->
