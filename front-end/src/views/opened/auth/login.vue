<template>
  <div class="min-h-screen flex flex-col relative overflow-hidden bg-slate-50">
    
    <div class="absolute inset-0 z-0">
      <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[70%] bg-primary/5 -rotate-12 transform"></div>
      <div class="absolute -bottom-[10%] -right-[10%] w-[50%] h-[60%] bg-secondary/5 rotate-12 transform"></div>
    </div>

    <section class="flex-1 flex items-center justify-center py-20 relative z-10 px-4">
      <div class="bg-white/80 backdrop-blur-md rounded-2xl w-full max-w-md p-10 shadow-2xl border border-gray-100">
        
        <div class="flex justify-center mb-8">
          <div class="w-24 h-24 flex items-center justify-center rounded-xl bg-white shadow-sm border border-gray-50 p-2">
            <img src="../../../assets/img/logo.png" alt="Company Logo" class="max-w-full h-auto" />
          </div>
        </div>

        <div class="text-center mb-10">
          <h2 class="text-3xl font-extrabold text-gray-800 tracking-tight">
            Welcome <span class="text-primary">Back</span>
          </h2>
          <p class="text-gray-500 mt-2 text-sm">Property Management Portal</p>
        </div>

        <form @submit.prevent="login" class="space-y-6">
          <div>
            <label class="block text-gray-600 text-sm font-bold mb-2" for="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              v-model="form.email"
              required
              placeholder="name@company.com"
              class="text-black w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          <div>
            <div class="flex justify-between mb-2">
              <label class="block text-gray-600 text-sm font-bold" for="password">
                Password
              </label>
              <router-link
                to="/forgot-password"
                class="text-xs text-secondary font-semibold hover:text-primary transition-colors"
              >
                Forgot Password?
              </router-link>
            </div>
            <input
              id="password"
              type="password"
              v-model="form.password"
              required
              placeholder="••••••••"
              class="text-black w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              minlength="2"
            />
          </div>

          <div v-if="error" class="bg-tertiary/10 border-l-4 border-tertiary p-3">
            <p class="text-tertiary text-xs font-bold">
              {{ error }}
            </p>
          </div>

          <button
            type="submit"
            class="w-full bg-primary hover:bg-green-600 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center"
            :disabled="loading"
          >
            <span v-if="!loading">Sign In</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Processing...
            </span>
          </button>
        </form>

        <p class="mt-8 text-center text-sm text-gray-500">
          Don't have an account?
          <router-link
            to="/register"
            class="text-secondary font-bold hover:underline ml-1"
          >
            Request Access
          </router-link>
        </p>
      </div>
    </section>

    <footer class="py-6 text-center relative z-10">
      <p class="text-gray-400 text-xs">© 2026 Property Management System. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
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
        const response = await this.$apiPost("/auth/login", payload);

        console.log("respoonse login",response);

        localStorage.setItem("access", response.accessToken);
        localStorage.setItem("refresh", response.refreshToken);
        localStorage.setItem("userId", response.id);
        localStorage.setItem("email", response.email);
        localStorage.setItem("name", response.name);

        localStorage.setItem("roles", response.roles);
        localStorage.setItem("permissions", response.permissions);

        this.$router.push({ path: "/dashboard/first-dash" });
      } catch (err) {
        console.log("error",err);
        this.error = err.response?.data?.message || "Invalid credentials. Please try again.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Custom subtle glass effect if needed */
.backdrop-blur-md {
  backdrop-filter: blur(12px);
}
</style>