<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center p-4 sm:p-6"
  >
    <div
      class="bg-white w-full max-w-lg sm:max-w-2xl rounded-lg shadow-lg p-4 sm:p-6 md:p-8 relative"
    >
      <button
        @click="$emit('close')"
        class="absolute top-3 right-3 text-2xl text-gray-500 hover:text-red-500"
      >
        ×
      </button>
      <h2 class="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
        Register User
      </h2>

      <form
        @submit.prevent="submitForm"
        class="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div>
          <input
            v-model="form.first_name"
            placeholder="First Name"
            class="custom-input"
            required
          />
        </div>
        <div>
          <input
            v-model="form.middle_name"
            placeholder="Middle Name"
            class="custom-input"
          />
        </div>
        <div>
          <input
            v-model="form.last_name"
            placeholder="Last Name"
            class="custom-input"
            required
          />
        </div>
        <div>
          <input
            v-model="form.email"
            type="email"
            placeholder="Email"
            class="custom-input"
            required
          />
          <p v-if="emailExistsError" class="text-red-600 text-sm mt-1">
            {{ emailExistsError }}
          </p>
        </div>
        <div>
          <input
            v-model="form.phone_number"
            type="number"
            placeholder="Phone Number"
            class="custom-input"
          />
        </div>
        <!-- <div>
          <input v-model="form.address" placeholder="Address" class="custom-input" />
        </div> -->

        <!-- Password -->
        <div class="sm:col-span-2 mb-2">
          <label
            for="password"
            class="block text-gray-700 text-sm font-bold mb-1"
            >Password</label
          >
          <input
            v-model="form.password"
            id="password"
            type="password"
            name="password"
            required
            class="custom-input"
          />
        </div>

        <!-- Confirm Password -->
        <div class="sm:col-span-2 mb-2">
          <label
            for="confirmPassword"
            class="block text-gray-700 text-sm font-bold mb-1"
            >Confirm Password</label
          >
          <input
            v-model="form.confirmPassword"
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            required
            class="custom-input"
          />
          <p v-if="passwordMismatch" class="text-red-600 text-sm mt-1">
            Passwords do not match.
          </p>
        </div>

        <div>
          <label class="block text-gray-700 mb-1">Start Date</label>
          <input v-model="form.start_date" type="date" class="custom-input" />
        </div>

        <div>
          <label class="block text-gray-700 mb-1">End Date</label>
          <input v-model="form.end_date" type="date" class="custom-input" />
        </div>

        <div class="sm:col-span-2 text-right mt-2">
          <button
            type="submit"
            class="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    visible: Boolean,
    selectedPlan: Number,
  },
  data() {
    return {
      form: {
        plan: this.selectedPlan || null,
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        start_date: "",
        end_date: "",
        password: "",
        confirmPassword: "",
      },
      passwordMismatch: false,
      emailExistsError: "",
    };
  },
  watch: {
    selectedPlan(newVal) {
      this.form.plan = newVal;
    },
  },
  methods: {
    async submitForm() {
      this.passwordMismatch = false;
      this.emailExistsError = "";

      // Validate password confirmation
      if (this.form.password !== this.form.confirmPassword) {
        this.passwordMismatch = true;
        return;
      }

      try {
        // Prepare payload
        const payload = { ...this.form };
        delete payload.confirmPassword; // don't send confirmPassword to backend

        // Axios POST request to registration API
        const response = await axios.post(
          "https://alphapms.sunriseworld.org/api/sign_up",
          payload
        );
        console.log("User registered successfully:", response.data);

        // Optionally send password reset email
        if (response.data?.email) {
          const resetPayload = { email: this.form.email };
          const resetResponse = await axios.post(
            "https://alphapms.sunriseworld.org/api/send_password_reset_email",
            resetPayload
          );
          console.log("Password reset email sent:", resetResponse.data);
        }

        // Close modal
        this.$emit("close");
      } catch (error) {
        // Handle errors
        const errorMsg = error.response?.data?.error;

        if (errorMsg === "This email already exists in the system") {
          this.emailExistsError = errorMsg;
        } else {
          this.emailExistsError = "";
          alert(errorMsg || "Registration failed.");
        }
      }
    },
  },
};
</script>


<style scoped>
.custom-input {
  @apply w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500;
}
</style>
