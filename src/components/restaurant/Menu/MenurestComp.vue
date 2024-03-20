<template>
  <div>
    <h1>page menu</h1>
    <div class="page-menu">
      <router-link
        :to="{ name: 'ShowListCatgoriesComp', params: { RestId: RestId } }"
      >
        <button @click="viewAllCategories" class="btn-menu">
          View / add Category
        </button>
      </router-link>

      <router-link :to="{ name: 'AddItemsComp', params: { RestId: RestId } }">
        <button v-if="numOfCategories > 0" class="btn-menu">
          add new item
        </button>
      </router-link>
      <div v-if="ListOfUserCategories.length > 0">
        <button @click="showDeleteConfirmation">Delete All restaurant</button>
        <!-- Delete confirmation popup -->
        <div v-if="showPopup" class="popup-container">
          <div class="popup">
            <p>Are you sure you want to delete all items</p>
            <button @click="deleteAllItems">OK</button>
            <button @click="cancelDeletion">No</button>
          </div>
          <div class="inputs">
            {{ successMessage }}
            {{ errorMessage }}
          </div>
        </div>
      </div>
      <button @click="goback">go back</button>
    </div>

    <div class="restiteam">
      <h1>restaurant name : {{ restname }}</h1>
      <h2>restaurant adress :{{ address }}</h2>
    </div>

    <div class="restaurant-list">
      <h1>category List :</h1>
      {{ ListOfUserCategories.length }} is list of categories
      <ul class="category-list">
        <li
          v-for="Cat in ListOfUserCategories"
          :key="Cat.id"
          class="category-item"
        >
          <div class="category-info">
            <h1>{{ Cat.categorieName }}</h1>

            <div class="items-container">
              <div v-for="(item, h) in ListOfUserItems" :key="h" class="item">
                <div
                  v-show="Cat.id == item.CatId"
                  class="item-info"
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
                      <p class="price">
                        Price: {{ numberWithCommas(item.price) }}
                      </p>
                      <p class="quantity">
                        Qty: {{ numberWithCommas(item.Quantity) }}
                      </p>
                    </div>

                    <hr />
                    <div class="router-link">
                      <router-link
                        :to="{
                          name: 'UpadteItemsComp',
                          params: { itemsId: item.id, RestId: RestId },
                        }"
                      >
                        <button class="blue">Update Item <br /></button
                      ></router-link>
                      <router-link
                        :to="{
                          name: 'DeletetItemsComp',
                          params: { itemsId: item.id, RestId: RestId },
                        }"
                      >
                        <button class="red">delete Item <br /></button
                      ></router-link>
                    </div>

                    <hr />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>

  <!-- //// -->
  <!-- <div>is user logged in {{ IsUserloggedIn }}</div>
  <div>user id is {{ LoggedInUserId }}</div>
  <div>number of categories {{ numOfCategories }}</div>
  <div>categorie list {{ ListOfCategories }}</div> -->

  <!-- ////// -->
</template>

<script>
import axios from "axios";
import { mapState, mapMutations, mapActions } from "vuex";

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
    goback() {
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

<style>
.page-menu {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.btn-menu {
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
}

.btn-menu:hover {
  background-color: #45a049;
}

.listheader {
  font-size: 1.5rem;
}

.restiteam {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  border: 1px solid black;
  padding: 10px;
  text-align: center;
}

.restiteam h1,
.restiteam h2 {
  font-size: 16px;
  margin: 0;
}

ul.category-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-info {
  border: 1px solid #ccc;
  padding: 10px;
}

.item-info p {
  margin: 0;
  line-height: 2rem;
  font-size: 22px;
}
.items-container {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(250px, 1fr)
  ); /* Two columns with flexible width */
  gap: 20px; /* Gap between items */
}
.showitems {
  padding: 0.2rem;
  border: 2px solid #4caf50;
}

.router-link {
  display: flex;
  justify-content: space-between;
}
.red {
  color: white;
  transition: background-color 0.3s ease;
  background: #ff0000;
  padding: 1.3em 1em;
}
.blue {
  background: #2b547f;
}
.price-qty-container {
  display: flex;
  justify-content: space-between; /* Align items with space between */
  align-items: center; /* Align items vertically */
}

.price,
.quantity {
  margin: 0; /* Remove default margin */
}
</style>
