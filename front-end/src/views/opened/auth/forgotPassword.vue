<template>
  <div class="min-h-screen flex flex-col relative overflow-hidden bg-slate-50">
    
    <div class="absolute inset-0 z-0">
      <div class="absolute -top-[10%] -right-[10%] w-[40%] h-[70%] bg-primary/5 rotate-12 transform"></div>
      <div class="absolute -bottom-[10%] -left-[10%] w-[50%] h-[60%] bg-secondary/5 -rotate-12 transform"></div>
    </div>

    <section class="flex-1 flex items-center justify-center py-20 relative z-10 px-4">
      <Toast ref="toast" />
      
      <div v-if="showForm" class="bg-white/80 backdrop-blur-md rounded-2xl w-full max-w-md p-10 shadow-2xl border border-gray-100 transition-all duration-500">
        
        <div class="flex justify-center mb-8">
          <div class="w-20 h-20 flex items-center justify-center rounded-xl bg-white shadow-sm border border-gray-50 p-2">
            <img src="" alt="Company Logo" class="max-w-full h-auto" />
          </div>
        </div>

        <div class="text-center mb-10">
          <h2 class="text-2xl font-extrabold text-gray-800 tracking-tight">
            Reset <span class="text-primary">Password</span>
          </h2>
          <p class="text-gray-500 mt-2 text-sm">Enter your email to receive a recovery link.</p>
        </div>

        <form @submit.prevent="submitForm" class="space-y-6">
          <div>
            <label for="email" class="block text-gray-600 text-sm font-bold mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              v-model="email"
              required
              placeholder="name@company.com"
              class="text-black w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          <div v-if="message" :class="messageType === 'text-red-600' ? 'bg-tertiary/10 border-tertiary' : 'bg-primary/10 border-primary'" class="border-l-4 p-3">
            <p :class="messageType" class="text-xs font-bold leading-tight">
              {{ message }}
            </p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary hover:bg-green-600 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center disabled:opacity-60"
          >
            <span v-if="!loading" class="flex items-center">
              <i class="fas fa-paper-plane mr-2 text-sm"></i> Send Reset Link
            </span>
            <span v-else class="flex items-center">
              <svg class="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Processing...
            </span>
          </button>
        </form>

        <div class="mt-8 text-center">
          <router-link to="/" class="text-sm text-secondary font-bold hover:text-primary flex items-center justify-center transition-colors">
            <i class="fas fa-arrow-left mr-2 text-xs"></i> Back to Login
          </router-link>
        </div>
      </div>

      <div v-if="showRestInfo" class="max-w-md w-full animate-fade-in">
        <div class="bg-white rounded-2xl p-10 shadow-2xl border-t-8 border-primary text-center">
          <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="fas fa-envelope-open-text text-primary text-3xl"></i>
          </div>
          
          <h3 class="text-2xl font-bold text-gray-800 mb-4">Check Your Email</h3>
          <p class="text-gray-600 leading-relaxed mb-8">
            We've sent a secure password reset link to <span class="text-gray-900 font-semibold">{{ email }}</span>.
            Please follow the instructions in the email to regain access to your account.
          </p>

          <div class="bg-slate-50 rounded-lg p-4 mb-8 text-sm text-gray-500 italic">
            Tip: Check your <span class="text-secondary font-bold">Spam</span> or <span class="text-tertiary font-bold">Junk</span> folder if it doesn't arrive in 2 minutes.
          </div>

          <router-link to="/" class="inline-block bg-gray-800 hover:bg-black text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md">
            Return to Login
          </router-link>
        </div>
      </div>
    </section>

    <footer class="py-6 text-center relative z-10">
      <p class="text-gray-400 text-xs tracking-widest uppercase">PMS Portal Security</p>
    </footer>
  </div>
</template>

<script>
import axios from "axios";
import Toast from "../../../components/Toast.vue";

export default {
  components: { Toast },
  data() {
    return {
      showForm: true,
      showRestInfo: false,
      email: "",
      message: "",
      messageType: "text-primary",
      loading: false,
    };
  },
  methods: {
    async submitForm() {
      this.loading = true;
      this.message = "";
      const payload={
        email:this.email
      }

      try {
        const response = await this.$apiPost("/auth/forgot-password", payload);

        console.log("response",response);

        this.showForm = false;
        this.showRestInfo = true;
        this.$refs.toast.showSuccessToastMessage(response.data.message);
      } catch (error) {
        this.message = error.response?.data.message || "Something went wrong!";
        this.messageType = "text-red-600"; // Using your tertiary red contextually
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>