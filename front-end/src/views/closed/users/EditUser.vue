<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 text-sm transform transition-all duration-300 border border-gray-200">
      
      <div class="border-b pb-3 mb-4 border-green-100">
          <h2 class="text-xl font-semibold text-gray-800">Edit User</h2>
      </div>

      <form @submit.prevent="updateUser">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
          
          <div class="sm:col-span-2">
            <label class="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input 
              v-model="form.email" 
              type="email" 
              class="border border-gray-300 rounded-lg w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" 
              required
            />
          </div>
          
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">First Name</label>
            <input 
              v-model="form.first_name" 
              type="text" 
              class="border border-gray-300 rounded-lg w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" 
            />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Middle Name</label>
            <input 
              v-model="form.middle_name" 
              type="text" 
              class="border border-gray-300 rounded-lg w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" 
            />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Last Name</label>
            <input 
              v-model="form.last_name" 
              type="text" 
              class="border border-gray-300 rounded-lg w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" 
            />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
            <input 
              v-model="form.phone_number" 
              type="text" 
              class="border border-gray-300 rounded-lg w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" 
            />
          </div>

          <div class="sm:col-span-2">
            <label class="block mb-1 text-sm font-medium text-gray-700">Address</label>
            <input 
              v-model="form.address" 
              type="text" 
              class="border border-gray-300 rounded-lg w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" 
            />
          </div>

        </div>

        <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button 
            type="button" 
            @click="$emit('close')" 
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150 text-sm font-medium"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition duration-150 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: ["user"],
  data() {
    return {
      form: {
        id: null,
        email: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        phone_number: "",
        address: "",
      },
    };
  },
  watch: {
    user: {
      immediate: true,
      handler(val) {
        // Ensure the form is populated when the user prop is available
        if (val) this.form = { ...val };
      },
    },
  },
  methods: {
    async updateUser() {
      try {
        // Keeping the original API call structure: /endpoint, id, data
        const res = await this.$apiPut(`/update_user`, this.form.id, this.form);
        if (res) {
          this.$root.$refs.toast.showToast(
            "User updated successfully",
            "success"
          );
        }
        this.$emit("saved");
        this.$emit("close");
      } catch (err) {
        console.error(err);
        this.$root.$refs.toast.showToast("Failed to update user", "error");
      }
    },
  },
};
</script>