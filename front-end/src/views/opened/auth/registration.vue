<template>
  <Toast ref="toast" />
  <div class="min-h-screen bg-gray-200 flex items-center justify-center px-4 py-16">
    <!-- Responsive Row: logo/info + form -->
    <div class="w-full max-w-6xl flex flex-col lg:flex-row lg:items-start lg:space-x-10 space-y-4 lg:space-y-0">

      <!-- Left Side: Logo + Festival Info -->
<div class="flex flex-col items-center text-center space-y-4 px-4 mt-0 lg:mt-16 w-full lg:w-1/2">
  <!-- Logo -->
  <img
    src="../../../assets/img/logo.jpg"
    alt="Festival Logo"
    class="h-24 w-24 rounded-xl  "
  />

  <!-- Festival Info -->
  <div class="space-y-2">
    <!-- Title with gradient text -->
    <h2 class="text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent tracking-wide">
      NePAF Festival 2025
    </h2>

    <!-- Date and Location -->
    <p class="text-lg font-semibold bg-gradient-to-r from-blue-500 to-yellow-500 bg-clip-text text-transparent">
      August 20–25, Axum,Tigray,Ethiopia — A Week of Celebration 🌍🎶✨
    </p>

    <!-- Call to action -->
    <p class="text-base text-gray-700 dark:text-gray-300 font-medium">
      Register now and receive your exclusive digital festival pass.
    </p>
  </div>

 
</div>




      <!-- Right Side: Registration Form (Card) -->
      <div class="bg-white rounded-3xl shadow-lg w-full max-w-md p-8 mx-auto">
        <h2 class="text-3xl font-bold text-center mb-6 text-green-700">Register</h2>
        <form @submit.prevent="register" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                v-model="form.name"
                required
                placeholder="John Doe"
                class="text-black w-full px-4 py-2 border rounded-md focus:ring-green-400"
              />
            </div>
            <div>
              <label class="block text-gray-700 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                v-model="form.email"
                required
                placeholder="you@example.com"
                class="text-black w-full px-4 py-2 border rounded-md focus:ring-green-400"
              />
            </div>
          </div>
          <div>
            <label class="block text-gray-700 font-semibold mb-1">Phone Number</label>
            <input
              type="text"
              v-model="form.phoneNumber"
              required
              placeholder="Phone number"
              class="text-black w-full px-4 py-2 border rounded-md focus:ring-green-400"
            />
          </div>
          <div>
            <label class="block text-gray-700 font-semibold mb-1">Password</label>
            <input
              type="password"
              v-model="form.password"
              required
              placeholder="••••••••"
              class="text-black w-full px-4 py-2 border rounded-md focus:ring-green-400"
            />
          </div>
          <div>
            <label class="block text-gray-700 font-semibold mb-1">Confirm Password</label>
            <input
              type="password"
              v-model="form.confirmPassword"
              required
              placeholder="••••••••"
              class="text-black w-full px-4 py-2 border rounded-md focus:ring-green-400"
            />
          </div>
          <p v-if="error" class="text-red-600 text-sm font-semibold">{{ error }}</p>
          <button
            type="submit"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-md transition"
          >
            Register
          </button>
        </form>
        <p class="mt-6 text-center text-gray-600">
          Already have an account?
          <router-link to="/" class="text-green-700 font-semibold hover:underline ml-1">Login here</router-link>
        </p>
      </div>

    </div>
  </div>
</template>

<script>
import Toast from "../../../components/Toast.vue";


export default {
  name: "Registration",
  components: {
    Toast,
  },
  data() {
    return {
      form: {
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      },
      error: "",
    };
  },
  methods: {
    register() {
      if (this.form.password !== this.form.confirmPassword) {
        this.error = "Passwords do not match.";
        return;
      }

      const payload = {
        name: this.form.name,
        email: this.form.email,
        phoneNumber: this.form.phoneNumber,
        password: this.form.password,
      };

      this.$apiPost("/auth/register", payload)
        .then((response) => {
          const { role, token, id, email, name, phoneNumber } = response;

          this.$store.dispatch("login", { token });
          this.$store.dispatch("commitId", { userId: id });
          this.$store.dispatch("commitRole", { role });
          this.$store.dispatch("commitEmail", { email });
          this.$store.dispatch("commitName", { name });
          this.$store.dispatch("commitPhoneNumber", { phoneNumber });

          this.$refs.toast.showSuccessToastMessage(response.message);
          setTimeout(() => {
            this.$router.push("/dashboard/first-dash");
          }, 3000);
        })
        .catch((error) => {
          console.log("Registration error:", error);
          this.error = error.response?.data.message || "Something went wrong!";
        });
    },
  },
};
</script>
