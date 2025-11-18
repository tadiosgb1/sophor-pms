<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-r from-blue-50 via-white to-green-50">
    <!-- Header -->
    <Header />

    <!-- Login Section -->
    <section class="flex-1 flex items-center justify-center py-20 ">
      <div class="bg-white rounded-2xl w-full max-w-md p-8 border border-gray-300 mt-16 ">
        <!-- Title -->
        <h2 class="text-3xl font-bold text-center mb-6 text-green-700">
          Login
        </h2>

        <!-- Form -->
        <form @submit.prevent="login" class="space-y-5">
          <!-- Email -->
          <div>
            <label class="block text-gray-700 font-semibold mb-1" for="email">
              Email Address / Username
            </label>
            <input
              id="email"
              type="email"
              v-model="form.email"
              required
              placeholder="you@example.com or username"
              class="text-black w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-gray-700 font-semibold mb-1" for="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              v-model="form.password"
              required
              placeholder="••••••••"
              class="text-black w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              minlength="2"
            />
            <div class="text-right mt-1">
              <router-link
                to="/forgot-password"
                class="text-sm text-green-600 font-semibold hover:underline"
              >
                Forgot your password?
              </router-link>
            </div>
          </div>

          <!-- Error -->
          <p v-if="error" class="text-red-600 text-sm font-semibold">
            {{ error }}
          </p>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-md transition flex items-center justify-center"
            :disabled="loading"
          >
            <span v-if="!loading">Login</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Logging in...
            </span>
          </button>
        </form>

        <!-- Register Link -->
        <p class="mt-5 text-center text-sm text-gray-600">
          Don't have an account?
          <router-link
            to="/register"
            class="text-green-700 font-semibold hover:underline ml-1"
          >
            Register
          </router-link>
        </p>
      </div>
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import Header from '../landing/header.vue';
import Footer from '../landing/footer.vue';

export default {
  name: "LoginPage",
  components: { Header, Footer },
  data() {
    return {
      form: { email: "", password: "" },
      error: "",
      loading: false,
    };
  },
  methods: {
    async login() {
      this.error = "";
      this.loading = true;
      try {
        const payload = { ...this.form };
        const response = await this.$apiPost("/token", payload);

        console.log("response",response);

        localStorage.setItem("access", response.access);
        localStorage.setItem("refresh", response.refresh);
        localStorage.setItem("userId", response.user);
        localStorage.setItem("email", response.email);

       this.$router.push({ path: "/dashboard/first-dash" });
      } catch (err) {
        this.error = err.response?.data?.message || "Login failed. Check your credentials.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
body {
  font-family: "Poppins", sans-serif;
}
</style>
