import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignupView from '../views/Profile/SignupView.vue'
import LoginView from "../views/Profile/LoginView.vue"
import ProfileView from "../views/Profile/ProfileView.vue"
import ErrorpageView from "../views/ErrorpageView.vue"
import addnewrestaurantView from "../views/restuarant/addnewrestaurantView.vue"
import DeleteRestaurant from "../views/restuarant/DeleteRestaurant.vue"
import ExampleView from "../views/ExampleView.vue"
import UpdaterestaurantView from "../views/restuarant/UpdaterestaurantView.vue"
import MenurestView from "../views/restuarant/MenurestView.vue"
import AddNewCatgoryComp from "../components/restaurant/Menu/Categories/AddNewCatgoryComp.vue"
import ShowListCatgoriesComp from "../components/restaurant/Menu/ShowListCatgoriesComp.vue"
import UpdateCategory from '@/components/restaurant/Menu/Categories/UpdateCategory.vue'
import DeleteCategory from '@/components/restaurant/Menu/Categories/DeleteCategory.vue'
import DeleteCategoryALL from '@/components/restaurant/Menu/Categories/DeleteCategoryALL.vue'

import UpadteItemsComp from'@/components/restaurant/Menu/Categories/items/UpadteItemsComp.vue'
import AddItemsComp from'@/components/restaurant/Menu/Categories/items/AddItemsComp.vue'
import DeletetItemsComp from'@/components/restaurant/Menu/Categories/items/DeletetItemsComp.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignupView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/Login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/Profile',
    name: 'Profile',
    component: ProfileView
  },
  {
    path: '/add',
    name: 'addres',
    component: addnewrestaurantView
  },
  {
    path: '/delete/:RestId',
    name: 'DeleteRestaurant',
    component: DeleteRestaurant
  },
  {
    path: '/UpdateRest/:RestId',
    name: 'Updaterestaurant',
    component: UpdaterestaurantView
  },
  {
    path: '/Restaurant/menu/:RestId',
    //params howa RestId look at page addItemsComp u will understand 
    name: 'Menu',
    component: MenurestView
  },
  {
    path: '/NewCategory/Restaurant/Catgories/:RestId',
    name: 'AddNewCatgoryComp',
    component: AddNewCatgoryComp
  },
  {
    path: '/Restaurant/menu/Catgories/:RestId',
    name: 'ShowListCatgoriesComp',
    component: ShowListCatgoriesComp
  },  
  {
    path: '/Restaurant/menu/Catgories/UpdateCategory/:RestId/:CatId',
    name: 'UpdateCategory',
    component: UpdateCategory
  },  {
    path: '/Restaurant/menu/Catgories/DeleteCategory/:RestId/item/:CatId',
    name: 'DeleteCategory',
    component: DeleteCategory
  },
  ,  {
    path: '/Restaurant/menu/Catgories/DeleteCategoryALL/all/:RestId',
    name: 'DeleteCategoryALL',
    component: DeleteCategoryALL
  },
  
  ,  {
    path: '/Restaurant/menu/Catgories/AddItemsComp/items/restaurantidIs/:RestId',
    name: 'AddItemsComp',
    component: AddItemsComp
  },
  
  {
    path: '/UpadteItemsComp/:itemsId/restaurantId/:RestId',
    name: 'UpadteItemsComp',
    component: UpadteItemsComp
  }
  
  
  ,  {
    path: '/DeletetItemsComp/:itemsId/resaurantId/:RestId',
    name: 'DeletetItemsComp',
    component: DeletetItemsComp
  },
  {

    path: '/:catcheAll(.*)',
    name: 'Errorpage',
    component: ErrorpageView
  },
  {
    path: '/ExampleView',
    name: 'ExampleView',
    component: ExampleView
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to, from, next) => {
  if (to.params.paragTitle !== undefined) {
    document.title = `${to.name} | ${to.params.paragTitle} | ${process.env.VUE_APP_TITLE}`
  } else {
    if (to.name == null) {
      document.title = `unknow page | ${process.env.VUE_APP_TITLE}`
    } else {
      document.title = `${to.name} |  ${process.env.VUE_APP_TITLE}`
    }
  }
  next()
  // console.log(to);
  // console.log(from);
  // console.log(next)
})

export default router
