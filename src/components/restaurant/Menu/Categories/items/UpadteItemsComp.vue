<template>
  <NavbarComp />
  <!-- <div class="rule">
    <router-link :to="{ name: 'Menu', params: { RestId: RestId } }">
      <button @click="viewAllCategories" class="btn-menu">
        go to the menu
      </button>
    </router-link> 
  </div> -->
  <div class="update-delete-form">
    <div class="update-delete-form">
      <h1>
        Restaurant <span> {{ restname }}</span> id :<span>{{ RestId }}</span>
      </h1>
      <form @submit.prevent="updateItem">
        <div class="inputs-box">
          <p class="parae">Product Name:</p>
          <input
            type="text"
            class="input-box-update"
            v-model="itemname"
            placeholder="itemname"
          />
          <span class="error-feedback" v-if="v$?.itemname?.$error">
            {{ v$?.itemname?.$errors[0]?.$message }}
          </span>

          <p class="parae">Description:</p>
          <textarea
            class="input-box-update"
            v-model="description"
            placeholder="description"
          >
          </textarea>
          <span class="error-feedback" v-if="v$?.description?.$error">
            {{ v$?.description?.$errors[0]?.$message }}
          </span>

          <p class="parae">Price:</p>
          <input
            type="text"
            class="input-box-update"
            v-model="price"
            placeholder="Price"
          />
          <span class="error-feedback" v-if="v$?.price?.$error">
            {{ v$?.price?.$errors[0]?.$message }}
          </span>

          <p class="parae">Quantity:</p>
          <input
            class="input-box-update"
            type="number"
            v-model.trim="Quantity"
            placeholder="Quantity"
            step="1"
          />
          <span class="error-feedback" v-if="v$?.Quantity?.$error">
            {{ v$?.Quantity?.$errors[0]?.$message }}
          </span>

          <p class="parae">Select Category:</p>
          <select selected class="selected-items" v-model.trim="pickedCategory">
            <option disabled>Please select a category</option>
            <option
              class="input-box-update"
              v-for="(Cat, i) in ListOfCategories"
              :key="i"
              :value="Cat.id"
            >
              {{ Cat.categorieName }}
              <!-- <h1>hhh id{{ pickedCategory }}</h1> -->
            </option>
          </select>
          <span class="error-feedback" v-if="v$?.pickedCategory?.$error">
            {{ v$?.pickedCategory?.$errors[0]?.$message }}
          </span>
          <br />
          <span class="error-feedback"
            >{{ errorMessage }} {{ successMessage }}</span
          >
          <p>Are you sure you want to update?</p>
          <button type="submit">Update Product</button>
        </div>
      </form>
    </div>
    <div class="update-verif">
      <router-link :to="{ name: 'Menu', params: { RestId: RestId } }">
        <button @click="gobackMenu">menu</button>
      </router-link>
      <router-link :to="{ name: 'home', params: { RestId: RestId } }">
        <button @click="gobackMenu">home</button>
      </router-link>
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
            userId: this.userId,
            RestId: this.RestId,
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
};
</script>

<style scoped>
.selected-items {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 16px;
}
.selected-items {
  width: 109%;
}
</style>
