<template>
  <div>
    <!-- Profile display -->
    <div class="profile">
      <h1>Profile</h1>
      <div class="profile-info">
        <div class="avatar">
          <img :src="avatar" alt="User Avatar" />
        </div>
        <div class="user-details">
          <p><strong>Name:</strong> {{ name }}</p>
          <p><strong>Email:</strong> {{ email }}</p>
          <p><strong>Password:</strong> {{ password }}</p>
        </div>
      </div>
      <br />
      <!-- Button to toggle the update form -->
      <button @click="toggleUpdateForm">Update Your Profile</button>
      <button @click="goback">go back home</button>
      <!-- Update form -->
      <div v-if="showUpdateForm" class="sign-up">
        <div class="card">
          <div class="card2">
            <h1>Update Information</h1>
            <form @submit.prevent="update">
              <p class="parae">Nom</p>
              <p>
                <input
                  type="text"
                  class="response-box"
                  placeholder="Name"
                  v-model.trim="name"
                />
                <br />
                <br />
                <span class="error-feedback" v-if="v$.name.$error">
                  {{ v$.name.$errors[0].$message }}
                </span>
              </p>
              <p class="parae">Email</p>
              <p>
                <input
                  type="email"
                  class="response-box"
                  placeholder="Email"
                  v-model.trim="email"
                />
                <br />
                <br />
                <span class="error-feedback" v-if="v$.email.$error">
                  {{ v$.email.$errors[0].$message }}
                </span>
              </p>
              <p class="parap">Password</p>
              <p>
                <input
                  type="password"
                  class="response-box"
                  placeholder="Password"
                  v-model.trim="password"
                />
                <br />
                <br />
                <span class="error-feedback" v-if="v$.password.$error">
                  {{ v$.password.$errors[0].$message }}
                </span>
                <br />
                <span class="error-feedback">{{ UpdateErr }}</span>
              </p>
              <button type="submit" @click="update()">Update</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarComp from "../header/NavbarComp.vue";
import { mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import axios from "axios";

export default {
  data() {
    return {
      v$: useValidate(),
      name: "",
      email: "",
      password: "",
      avatar: "",
      showUpdateForm: false,
      userId: "",
      UpdateErr: "",
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(3) },
      password: { required, minLength: minLength(2) },
      email: { required, email },
    };
  },
  components: { NavbarComp },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "SignupView" });
      console.log("User not found");
    } else {
      const userData = JSON.parse(user);
      this.name = userData.name;
      this.email = userData.email;
      this.password = userData.password;
      this.avatar = require("@/assets/images/1.jpg");
      this.userId = userData.id;
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    async update() {
      this.v$.$validate();
      if (!this.v$.$error) {
        try {
          let result = await axios.put(
            `http://localhost:3000/users/${this.userId}`,
            {
              name: this.name,
              password: this.password,
              email: this.email,
            }
          );
          if (result.status === 200) {
            localStorage.setItem("user-info", JSON.stringify(result.data));
            // this.redirectTo({ val: "home" });
            window.location.reload();
            // this.$router.push({
            //   name: "home",
            //   params: { pageTitle: "profile page" },
            // });
          } else {
            console.log("profile not updated");
            this.UpdateErr = "user not updated";
          }
        } catch (error) {
          console.log("madazetsh lvalidation form");
          this.UpdateErr = "try again, refresh ";
        }
      }
    },
    toggleUpdateForm() {
      this.showUpdateForm = !this.showUpdateForm;
    },
    goback() {
      this.redirectTo({ val: "home" });
    },
  },
};
</script>

<style>
/* Profile styles */
.profile {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.profile h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.profile-info {
  display: flex;
  align-items: center;
}

.avatar {
  margin-right: 20px;
}

.avatar img {
  width: 100px;
  border-radius: 50%;
}

.user-details p {
  margin-bottom: 10px;
}

.user-details p strong {
  margin-right: 5px;
}
</style>
