<template>
  <div>
    <NavbarComp />
    <div class="rule">
      <router-link
        :to="{ name: 'ShowListCatgoriesComp', params: { RestId: RestId } }"
      >
        <button @click="viewAllCategories">View Categories</button>
      </router-link>
      <router-link :to="{ name: 'AddItemsComp', params: { RestId: RestId } }">
        <button v-if="numOfCategories > 0">add new item</button>
      </router-link>
      <button @click="gobackhome">home</button>
    </div>
    <div class="info-list-first">
      <h1 class="header">products List</h1>

      <div class="mycla">
        <p v-if="ListOfUserCategories.length > 0">
          list of categories ({{ ListOfUserCategories.length }})
          <!-- hadi for all the resturant i have -->
        </p>
        <div v-else class="norestadded">no categories added</div>

        <p>
          restaurant :<span>{{ restname }}</span> <br />
          adress : <span>{{ address }}</span>
        </p>

        <div>
          <button @click="showDeleteConfirmation">Delete All items</button>
          <!-- Delete confirmation popup -->
          <div v-if="showPopup" class="popup-container">
            <div class="popup">
              <p>
                Are you sure you want to delete all items/products ?
                (rest,cat,items)
              </p>
              <br />
              <button @click="deleteAllItems">OK</button>
              <button @click="cancelDeletion">No</button>
            </div>
          </div>
        </div>
      </div>
      <!-- <ul class="category-list"> -->
      <ul>
        <li v-for="Cat in ListOfUserCategories" :key="Cat.id" class="info-list">
          <div class="global-info">
            <h1>{{ Cat.categorieName }}</h1>
            <div v-for="(item, h) in ListOfUserItems" :key="h">
              <div
                v-show="Cat.id == item.CatId"
                :class="{ showitems: Cat.id == item.CatId }"
              >
                <div
                  v-if="Cat.id == item.CatId"
                  :class="{ showitems: Cat.id == item.CatId }"
                >
                  <h2>Name item: {{ item.itemname }}</h2>
                  <p>item ID: {{ item.id }}</p>
                  <p>{{ item.description }}</p>
                  <div class="price-qty-container">
                    <p>Price: {{ numberWithCommas(item.price) }}</p>
                    <p>Qty: {{ numberWithCommas(item.Quantity) }}</p>
                  </div>

                  <hr />
                  <div class="button-container">
                    <router-link
                      :to="{
                        name: 'UpadteItemsComp',
                        params: { itemsId: item.id, RestId: RestId },
                      }"
                    >
                      <button>Update</button>
                    </router-link>
                    <router-link
                      :to="{
                        name: 'DeletetItemsComp',
                        params: { itemsId: item.id, RestId: RestId },
                      }"
                    >
                      <button class="delete-btn">delete</button>
                    </router-link>
                  </div>

                  <hr />
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- //// -->
    <!-- <div>is user logged in {{ IsUserloggedIn }}</div>
  <div>user id is {{ LoggedInUserId }}</div>
  <div>number of categories {{ numOfCategories }}</div>
  <div>categorie list {{ ListOfCategories }}</div> -->

    <!-- ////// -->
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapMutations, mapActions } from "vuex";
import NavbarComp from "@/components/header/NavbarComp.vue";
export default {
  data() {
    return {
      itemsId: this.$route.params.itemsId,
      RestId: this.$route.params.RestId,
      CatId: "",
      userId: "",
      userName: "",
      address: "",
      restname: "",
      categorieName: "",
      itemname: "",
      showPopup: false,
      ListOfUserCategories: [],
      ListOfUserItems: [],
      // AllRestaurantId: [],
      AllItemsIdIs: [],
      myResult: "",
      // AllICateIdIs: [],
    };
  },
  computed: {
    ...mapState([
      "IsUserloggedIn",
      "LoggedInUserId",
      "numOfCategories",
      "numOfItems",
      "ListOfCategories",
      "ListOfItems",
    ]),
  },

  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "Signup" });
    } else {
      const userData = JSON.parse(user);
      this.userId = userData.id;
      this.name = userData.name;
      this.displayAllCategories({
        theUserId: this.userId,
        theRestId: this.RestId,
      });
      this.canUserAccessThisRestaurant({
        theUserId: this.userId,
        theRestId: this.RestId,
        // redirectToPage: "home",
        // hadi jebtha man store redirecto ri kan3yto liha nichan w sf
      });
      this.getRestInfo(this.userId, this.RestId);
      this.getCategoryInfo(this.userId, this.RestId);
      this.getItemInfo(this.userId, this.RestId);
      let result = await axios.get(
        `http://localhost:3000/items?userId=${this.userId}&RestId=${this.RestId}`
      );
      // console.log(result.data.length);
      this.myResult = result.data;
      let ResultLen = this.myResult.length;
      for (var i = 0; i < ResultLen; i++) {
        this.AllItemsIdIs.push(result.data[i].id);
      }
      this.getItemInfo(this.userId, this.RestId, this.itemsId);
    }
  },
  methods: {
    ...mapMutations([
      "setIsUserloggedIn",
      "displayAllCategories",
      "displayAllItems",
      "canUserAccessThisRestaurant",
    ]),
    ...mapActions(["redirectTo"]),

    viewCategory() {},
    gobackhome() {
      this.redirectTo({ val: "home" });
    },

    async getRestInfo(userId, restaurantId) {
      let result = await axios.get(
        `http://localhost:3000/restaurants?userId=${userId}&id=${restaurantId}`
      );
      let RestDetails = [];
      if (result.status == 200) {
        RestDetails = result.data;
        this.restname = RestDetails[0].restname;
        this.address = RestDetails[0].address;
        // array fi object
      }
    },
    async getCategoryInfo(userId, RestId) {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${userId}&RestId=${RestId}`
      );
      if (result.status == 200) {
        this.ListOfUserCategories = result.data;
        // console.table(this.ListOfUserCategories);
        // console.log("hehe lis of ");
      }

      // not equal to 1
    },
    async getItemInfo(userId, RestId) {
      let result = await axios.get(
        `http://localhost:3000/items?userId=${userId}&RestId=${RestId}`
      );
      if (result.status == 200) {
        this.ListOfUserItems = result.data;
        // console.table(this.ListOfUserItems);
        // console.log("hehe lis of ");
      }
    },
    numberWithCommas(n) {
      return n.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    },
    async deleteAllItems() {
      let allItemsResult = [];
      for (var z = 0; z < this.AllItemsIdIs.length; z++) {
        let itemResult = await axios.delete(
          `http://localhost:3000/items/${this.AllItemsIdIs[z]}`
        );
        if (itemResult.status == 200) {
          allItemsResult.push(true);
        } else {
          allItemsResult.push(false);
        }
      }

      // Check if all items were deleted successfully
      if (!allItemsResult.includes(false)) {
        this.successMessage = "All items deleted successfully.";
        window.location.reload();
        // Update ListOfUserItems by fetching the updated list from the server
        await this.getItemInfo(this.userId, this.RestId);
      } else {
        this.errorMessage = "Failed to delete all items.";
      }

      // Hide the popup after deletion
      this.showPopup = false;
    },

    showDeleteConfirmation() {
      this.showPopup = true;
    },
    cancelDeletion() {
      this.showPopup = false;
    },
  },
};
</script>
