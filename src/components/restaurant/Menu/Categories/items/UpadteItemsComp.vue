<template>
  <NavbarComp />
  <div class="header">
    Restaurant id is {{ RestId }} and restname:{{ restname }}
  </div>
  <div class="routere">
    <h1>Update New Item</h1>
    <router-link :to="{ name: 'Menu', params: { RestId: RestId } }">
      <button @click="viewAllCategories" class="btn-menu">
        go to the menu
      </button>
    </router-link>
    <button @click="goback">Go back home</button>
    <button @click="goback">Go back</button>
  </div>
  <div class="category-container">
    <h2>Update New item</h2>
    <form @submit.prevent="updateItem">
      <div class="form-group">
        <label>Item Name:</label>
        <input
          type="text"
          id="itemname"
          v-model="itemname"
          placeholder="itemname"
        />
        <span class="error-feedback" v-if="v$?.itemname?.$error">
          {{ v$?.itemname?.$errors[0]?.$message }}
        </span>
      </div>

      <div class="form-group">
        <label>Description:</label>
        <textarea
          id="description"
          v-model="description"
          placeholder="description"
        ></textarea>
        <span class="error-feedback" v-if="v$?.description?.$error">
          {{ v$?.description?.$errors[0]?.$message }}
        </span>
      </div>
      <div class="form-group">
        <label>Price:</label>
        <input type="text" id="price" v-model="price" placeholder="Price" />
        <span class="error-feedback" v-if="v$?.price?.$error">
          {{ v$?.price?.$errors[0]?.$message }}
        </span>
      </div>
      <div class="form-group">
        <label>Quantity:</label>
        <input
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
        <label>Select Category:</label>
        <select selected class="selected-items" v-model.trim="pickedCategory">
          <option disabled>Please select a category</option>
          <option v-for="(Cat, i) in ListOfCategories" :key="i" :value="Cat.id">
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
      <div class="form-group2">
        <button type="submit">Update item</button>
      </div>
    </form>
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
      itemsId: this.$route.params.itemsId,
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
        maxlength: maxLength(150),
      },

      price: {
        required,
        min: minValue(0),
        minLength: minLength(4),
        maxlength: maxLength(150),
      },
      description: {
        required,
        minLength: minLength(4),
        maxlength: maxLength(150),
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
      "ListOfItems",
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
      this.canUserAccessThisItem({
        theUserId: this.userId,
        theRestId: this.RestId,
        itemsIdIs: this.itemsId,
        redirectToPage: "home",
        // hadi jebtha man store redirecto ri kan3yto liha nichan w sf
      });

      this.getRestInfo(this.userId, this.RestId);
      this.DisplayUserCategories(this.userId, this.RestId);
      this.getItemInfo(this.userId, this.RestId, this.itemsId);
    }
  },

  methods: {
    ...mapActions(["redirectTo"]),
    ...mapMutations([
      "setIsUserloggedIn",
      "ListOfCategories",
      "displayAllCategories",
      "canUserAccessThisRestaurant",
      "canUserAccessThisItem",
    ]),
    goback() {
      this.$router.go(-1);
    },
    async DisplayUserCategories(userId, restaurantId) {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${userId}&RestId=${restaurantId}`
      );
      if (result.status == 200) {
        this.ListOfUserCategories = result.data;
        console.log(result.data);
      }
    },
    async getRestInfo(userId, restaurantId) {
      let result = await axios.get(
        `http://localhost:3000/restaurants?userId=${userId}&id=${restaurantId}`
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
    async getItemInfo(userId, RestId, itemsId) {
      let result = await axios.get(
        `http://localhost:3000/items?userId=${userId}&RestId=${RestId}&id=${itemsId}`
      );
      let resultData = result.data[0];
      if (result.status == 200) {
        this.itemname = resultData.itemname;
        this.price = resultData.price;
        this.description = resultData.description;
        this.Quantity = resultData.Quantity;
        this.pickedCategory = resultData.CatId;
        // if (this.itemInfo.length > 0) {
        //   this.itemname = this.itemInfo[0].itemname;
        // }
      }
    },

    async updateItem() {
      this.v$.$validate();
      if (!this.v$.$error) {
        let result = await axios.put(
          `http://localhost:3000/items/${this.itemsId}`,
          {
            itemname: this.itemname,
            price: parseFloat(this.price).toFixed(2), //ntaj3o float
            description: this.description,
            Quantity: this.Quantity,
            phone: this.phone,
            userId: parseInt(this.userId, 10),
            restaurantId: parseInt(this.RestId, 10),
            CatId: this.pickedCategory,

            // userId: this.userId, //this bash kola user kaydkhl l rest dyalo mashi dyal lakhr
          }
        );
        console.log("form validation daz");
        // get or put status khas ikon 200
        if (result.status == 200) {
          (this.errorMessage = ""),
            (this.successMessage = "item daz w tajouta"),
            console.log("daz update new item");

          setTimeout(() => {
            this.$router.push({
              name: "Menu",
              params: { RestId: this.RestId },
            });
          }, 2000);
        } else {
          console.log("madaztsh update new item ");
          this.errorMessage = "item not updateed";
          this.successMessage = "";
        }
      } else {
        console.log("ma²daztsh from validation ");
        this.errorMessage = "try again, refresh  3mr ga3 fields";
        this.successMessage = "";
      }
    },
  },
  gobackMenu() {
    this.$router.push({ name: "Menu", params: { RestId: this.RestId } });
  },
  goback() {
    this.$router.go(-1);
  },
};
</script>

<style scoped>
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
</style>
