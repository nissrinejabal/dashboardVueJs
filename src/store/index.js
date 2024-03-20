import { createStore } from 'vuex'
import router from '@/router';
import axios from 'axios';

const state = {
  IsUserloggedIn: false,
  LoggedInUserId: "",
  numOfCategories: "",
  numOfItems: "",
  ListOfCategories: [],
  ListOfRestaurants: [],
  ListOfItems: [],
};

const mutations = {
  redirectTo(state, payload) {
    router.push({ name: payload })
  },
  setIsUserloggedIn(state) {
    let user = localStorage.getItem('user-info')
    if (user) {
      state.IsUserloggedIn = true
      state.LoggedInUserId = JSON.parse(user).id
    } else {
      state.IsUserloggedIn = false
    }
  },
  // payload :  bayanat li njibha l ay user (bayant dynamique)
  //theUserId hadi variable
  async displayAllCategories(state, payload) {
    let result = await axios.get(`http://localhost:3000/categories?userId=${payload.theUserId}&RestId=${payload.theRestId}`)
    if (result.status == 200) {
      state.ListOfCategories = result.data;
      state.numOfCategories = state.ListOfCategories.length;
    }
  },
  //
  async displayAllItems(state, payload) {
    let result = await axios.get(`http://localhost:3000/items?userId=${payload.theUserId}&RestId=${payload.theRestId}`)
    if (result.status == 200) {
      state.ListOfItems = result.data;
      state.numOfItems = state.ListOfItems.length;
    }
  },
  
  async canUserAccessThisRestaurant(state, payload) {
    let result = await axios.get(`http://localhost:3000/restaurants?userId=${payload.theUserId}&id=${payload.theRestId}`)
    if (result.status == 200) {
    state.ListOfRestaurants= result.data;
    if(state.ListOfRestaurants.length !== 1){ // not equal to 1
      this.commit("redirectTo",payload.redirectToPage)
    }
    // not equal to 1
    }
  },
  async canUserAccessThisCategory(state, payload) {
    let result = await axios.get(`http://localhost:3000/categories?userId=${payload.theUserId}&RestId=${payload.theRestId}&id=${payload.catIdIs}`)
    if (result.status == 200) {
    state.ListOfCategories= result.data;
    if(state.ListOfCategories.length !== 1){ // not equal to 1
      this.commit("redirectTo",payload.redirectToPage)
    }
    // not equal to 1
    }
  },
  async canUserAccessThisItem(state, payload) {
    let result = await axios.get(`http://localhost:3000/items?userId=${payload.theUserId}&RestId=${payload.theRestId}&id=${payload.itemsIdIs}`)
    if (result.status == 200) {
    state.ListOfItems= result.data;
    if(state.ListOfItems.length < 1){ // not equal to 1
      this.commit("redirectTo",payload.redirectToPage)
    }
    // not equal to 1
    }
  }
};

const actions = {
  redirectTo({ commit }, payload) {
    commit("redirectTo", payload.val)
  }
};

export default createStore({
  state,
  mutations,
  actions
});
