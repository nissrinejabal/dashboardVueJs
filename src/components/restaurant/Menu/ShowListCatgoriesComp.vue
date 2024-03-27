<template>
  <NavbarComp />
  <h1>page show list categorie</h1>
  <div class="routere">
    <router-link
      :to="{ name: 'AddNewCatgoryComp', params: { RestId: RestId } }"
    >
      <button @click="viewAllCategories">add Category</button>
    </router-link>

    <router-link :to="{ name: 'Menu', params: { RestId: RestId } }">
      <button @click="viewCategory">go back menu(rja3 bmo)</button>
    </router-link>
  </div>
  <div class="info-list-first">
    <h1>Categories List :</h1>
    <div class="mycla">
      <p class="listheader" v-if="numOfCategories > 0">
        list of Categories ({{ numOfCategories }})
      </p>
      <div v-else>no Category added</div>
      <router-link
        :to="{
          name: 'DeleteCategoryALL',
          params: { RestId: RestId },
        }"
      >
        <button class="delete-btn">Delet all</button>
      </router-link>
    </div>

    <ul>
      <li v-for="Cat in ListOfCategories" :key="Cat.id" class="info-list">
        <div class="global-info">
          <h2>{{ Cat.categorieName }}</h2>
        </div>
        <div class="button-container">
          <router-link
            :to="{
              name: 'UpdateCategory',
              params: { CatId: Cat.id, RestId: Cat.RestId },
            }"
          >
            <button class="showbtn">Update</button>
          </router-link>
          <router-link
            :to="{
              name: 'DeleteCategory',
              params: { CatId: Cat.id, RestId: Cat.RestId },
            }"
          >
            <button class="delete-btn showbtn">
              delete <br />
              categories and related items
            </button>
          </router-link>
          <router-link :to="{ name: 'home', params: { RestId: Cat.RestId } }">
            <button class="Menu-btn showbtn">home</button>
          </router-link>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import NavbarComp from "@/components/header/NavbarComp.vue";
import { mapActions, mapMutations, mapState } from "vuex";
export default {
  components: { NavbarComp },
  data() {
    return {
      RestId: this.$route.params.RestId,
      CatId: this.$route.params.CatId,
      userId: "",
      categorieName: "",
      restname: "",
      showPopup: false,
      AllRestaurantId: [],
      AllItemsIdIs: [],
      AllICateIdIs: [],
    };
  },
  computed: {
    ...mapState([
      "IsUserloggedIn",
      "LoggedInUserId",
      "numOfCategories",
      "ListOfCategories",
    ]),
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "Signup" });
    } else {
      const userData = JSON.parse(user);
      this.userId = userData.id;
      this.canUserAccessThisRestaurant({
        theUserId: this.userId,
        theRestId: this.RestId,
        redirectToPage: "home",
      });
      this.displayAllCategories({
        theUserId: this.userId,
        theRestId: this.RestId,
      });
      this.getRestInfo(this.userId, this.RestId);
      this.getCategoryInfo(this.userId, this.RestId, this.CatId);
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    ...mapMutations(["canUserAccessThisRestaurant", "displayAllCategories"]),
    goback() {
      this.$router.go(-1);
    },
    showDeleteConfirmation() {
      this.showPopup = true;
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
      }
    },
    async getCategoryInfo(userId, restaurantId, CatId) {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${userId}&RestId=${restaurantId}&id=${CatId}`
      );
      if (result.status == 200) {
        this.categoryInfo = result.data;
        if (this.categoryInfo.length > 0) {
          this.categorieName = this.categoryInfo[0].categorieName;
        }
      }
    },
    deleteAllItems() {
      console.log("all deteled");
    },
    cancelDeletion() {
      this.showPopup = false;
    },
  },
};
</script>

<style scoped>
.routere {
  display: flex;
  justify-content: space-between;
}
.popup {
  background: #b90000;
  display: flex;
  padding: 1rem;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  border-radius: 4rem;
}
</style>
