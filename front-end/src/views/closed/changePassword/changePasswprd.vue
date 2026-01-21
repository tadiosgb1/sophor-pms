<template>
  <div  class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-sm">
      <div class="flex justify-between items-center mb-4 border-b pb-2">
        <h2 class="text-lg font-semibold text-gray-800">Change Password</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">&times;</button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Old Password</label>
          <input
            v-model="form.oldPassword"
            type="password"
            required
            class="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition"
          />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">New Password</label>
          <input
            v-model="form.newPassword"
            type="password"
            required
            class="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition"
          />
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button type="button" @click="$emit('close')" class="px-4 py-2 border rounded-lg">
            Cancel
          </button>
          <button type="submit" class="px-4 py-2 bg-green-500 text-white rounded-lg">
            Change
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        oldPassword: '',
        newPassword: ''
      }
    };
  },
  methods: {
    async submitForm() {
      try {
        const res = await this.$apiPost('/auth/change-password', this.form);
        if (res) {
          this.$root.$refs.toast.showToast('Password changed successfully', 'success');
          this.$emit('saved');
          this.$emit('close');
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
};
</script>
