<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-5xl p-6 md:p-8 overflow-y-auto" style="max-height: 90vh;">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4 border-b pb-2">
        <h2 class="text-lg font-semibold text-gray-800">Permissions for Role</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
      </div>

      <!-- Permissions List -->
      <div class="space-y-4">
        <div v-if="loading" class="text-center text-gray-500 py-6">Loading...</div>
        <div v-else>
          <div v-if="permissions.length === 0" class="text-center text-gray-400 py-6 italic">No permissions assigned.</div>
          <div v-else class="grid md:grid-cols-2 gap-4">
            <div v-for="perm in permissions" :key="perm.id" class="border border-gray-200 rounded-xl p-4 shadow-sm hover:bg-green-50 transition">
              <div class="font-semibold text-gray-800">{{ perm.name }}</div>
              <div class="text-gray-600 text-sm">{{ perm.code }}</div>
              <div class="text-gray-500 text-xs mt-1">{{ perm.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Close Button -->
      <div class="mt-6 flex justify-end">
        <button @click="$emit('close')" class="px-4 py-2 bg-green-600 text-white rounded-lg">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { roleId: { type: [String, Number], required: true } },
  data() {
    return {
      permissions: [],
      loading: false,
    };
  },
  watch: {
    roleId: { immediate: true, handler() { this.fetchPermissions(); } }
  },
  methods: {
    async fetchPermissions() {
      this.loading = true;
      try {
        const res = await this.$apiGet(`/roles/${this.roleId}/permissions`);
        this.permissions = res.permissions || [];
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style>
/* Optional custom scrollbar for modal */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(107, 114, 128, 0.5);
  border-radius: 4px;
}
</style>
