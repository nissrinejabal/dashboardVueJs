<template>
  <div>
    <h2>Liste des éléments :</h2>
    <ul>
      <li v-for="(item, index) in items" :key="index">
        {{ item }}
      </li>
      <p>Message: {{ message }}</p>
    </ul>
  </div>
  <div>
    <h2>Created Example</h2>
    <p>Message: {{ message2 }}</p>
  </div>
  <div>
    <h2>beforeMount Example</h2>
    <p>Message: {{ message3 }}</p>
  </div>
  <div>
    <h2>Mounted Example</h2>
    <p>{{ message }}</p>
  </div>
  <div class="rim">nissrin</div>
  <div>
    <!-- Button to trigger the delete confirmation popup -->
    <button @click="showDeleteConfirmation">Delete All</button>

    <!-- Delete confirmation popup -->
    <div v-if="showPopup" class="popup-container">
      <div class="popup">
        <p>Are you sure you want to delete all items?</p>
        <!-- Button to confirm deletion -->
        <button @click="deleteAllItems">OK</button>
        <!-- Button to cancel deletion -->
        <button @click="cancelDeletion">No</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showPopup: false,
      message: "Hello, Vue.js!",
      items: ["Pomme", "Banane", "Orange", "Raisin"],
      message2: "Hello, Vue.js!",
      message3: "Hello, Vue.js!",
    };
  },
  methods: {
    // Method to show the delete confirmation popup
    showDeleteConfirmation() {
      this.showPopup = true;
    },
    // Method to delete all items
    deleteAllItems() {
      // Delete all items logic here
      console.log("All items deleted.");
      // Close the popup after deletion
      this.showPopup = false;
    },
    // Method to cancel deletion
    cancelDeletion() {
      // Close the popup without deleting
      this.showPopup = false;
    },
  },
  beforeCreate() {
    // Code executed before the component is created
    console.log("beforeCreate hook executed");
    // At this point, data and events/observers are not initialized
    console.log("Data:", this.message); // Outputs: undefined
  },
  created() {
    // Code executed after the instance is created
    console.log("created hook executed");
    // At this point, data has been observed and is available
    console.log("Message:", this.message2);
  },
  beforeMount() {
    // Code exécuté juste avant que le composant ne soit monté dans le DOM
    console.log("beforeMount hook executed");
    // À ce stade, le template a été compilé et le composant est sur le point d'être rendu
  },
};
</script>
<!--   mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.canUserAccessThisRestaurant({
        redirectToPage: "home",
        // hadi jebtha man store redirecto ri kan3yto liha nichan w sf
      });
    }
  },
  methods: {
    ...mapMutations(["canUserAccessThisRestaurant"]),
  } 
  //u use this in case you want to check inside of the rest/menu/categories we ad theUserId and theRestId fiha the userId and the restId
  ou cas ou zedt had juj i have to call the restid and userid dynamique man store we add this (look mora ay haja fiha******)
    mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.canUserAccessThisRestaurant({
        theUserId: this.userId,
        theRestId: this.RestId,
        redirectToPage: "home",
        // hadi jebtha man store redirecto ri kan3yto liha nichan w sf
      });
    }
  },


  ////////////////////////////////////////////////////////////////////////<template>
        // async AccessRestaurantuser() {
    //   let result = await axios.get(
    //     `http://localhost:3000/restaurants?id=${this.deleteRestaurant}&userId=${this.userId}`
    //   );
    //   if (result.status == 200 && result.data.length > 0) {
    //     this.RestaurantData = result.data;
    //     this.phone = this.RestaurantData[0].phone;
    //     this.address = this.RestaurantData[0].address;
    //     this.restname = this.RestaurantData[0].restname;
    //     console.log("Restaurant data loaded successfully.");
    //   } else {
    //     this.redirectTo({ val: "home" });
    //     console.log("Restaurant data not found.");
    //   }
    // },

    // async deleteAllItems() {
    //   console.log("khra");
    //   //   /////////////hadi delete all the categories  li 3andi////////////////////////////////
    //   let allCatsResults = [];
    //   for (var x = 0; x < this.AllICateIdIs.length; x++) {
    //     let result = await axios.delete(
    //       `http://localhost:3000/categories/${this.AllICateIdIs[x]}`
    //     );
    //     if (result.status == 200) {
    //       allCatsResults.push(true);
    //     } else {
    //       allCatsResults.push(false);
    //     }
    //     console.table(allCatsResults);
    //   }
    //   //   /////////////hadi delete all the items li 3andi/////////////////////////
    //   let allitemsResult = [];
    //   for (var z = 0; z < this.AllItemsIdIs.length; z++) {
    //     let result = await axios.delete(
    //       `http://localhost:3000/items/${this.AllItemsIdIs[z]}`
    //     );
    //     if (result.status == 200) {
    //       allitemsResult.push(true);
    //     } else {
    //       allitemsResult.push(false);
    //     }
    //     console.table(allitemsResult);
    //   }
    //   //   //////////////et hadi jam3ahom bjuj ila bjuj tsupprimaw cat w itels
    //   if (!allCatsResults.includes(false) && !allitemsResult.includes(false)) {
    //     this.errorMessage = "";
    //     this.successMessage =
    //       "Category and items are all deleted successfully.";
    //     setTimeout(() => {
    //       this.$router.push({
    //         name: "home",
    //         params: { RestId: this.RestId },
    //       });
    //     }, 2000);
    //   } else {
    //     this.errorMessage = "Failed to delete category and items.";
    //     this.successMessage = "";
    //   }
    // },
  </template>
  
  <script>
  export default {
  
  }
  </script>
  
  <style>
  
  </style>
-->

<style scoped>
/* Styles for the delete confirmation popup container */
.popup-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Styles for the delete confirmation popup */
.popup {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

/* Styles for the buttons in the delete confirmation popup */
.popup button {
  margin: 0 10px;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
{ "users": [ { "name": "admin", "password": "123456789", "email":
"admin@gmail.com", "id": "1" }, { "role": "user1", "name": "nissuser1rine2",
"password": "123", "email": "user1@gmail.com2", "id": "2" } ], "restaurants": [
{ "id": 1, "restname": "REST DU PARC", "phone": "667-76757", "address": "Media",
"userId": 1 }, { "id": 2, "restname": "REST DU PAR2", "phone": "667-76752",
"address": "Medi2", "userId": 1 }, { "id": 3, "restname": "Rest User 2",
"phone": "user2", "address": "User2", "userId": 2 } ], "categories": [ {
"categorieName": "nissrinef", "userId": 1, "RestId": 1, "id": "2" } ], "items":
[ { "itemname": "Burger", "price": "10.99", "description": "Delicious burger
with cheese and veggies", "qty": "5", "restaurantId": 1, "userId": 1, "CatId":
1, "id": "1" } ] }
