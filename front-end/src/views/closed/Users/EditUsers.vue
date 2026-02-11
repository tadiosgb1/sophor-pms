<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div
      class="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 md:p-8 text-sm overflow-y-auto"
      style="max-height: 90vh;"
    >
      <!-- Header -->
      <div class="flex justify-between items-center mb-4 border-b pb-2">
        <h2 class="text-lg font-semibold text-gray-800">Edit User</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <!-- User Fields -->
        <div>
          <label class="block mb-1 font-medium text-gray-700">First Name</label>
          <input v-model="form.first_name" type="text" class="input" required />
        </div>

        <div>
          <label class="block mb-1 font-medium text-gray-700">Middle Name</label>
          <input v-model="form.middle_name" type="text" class="input" />
        </div>

        <div>
          <label class="block mb-1 font-medium text-gray-700">Last Name</label>
          <input v-model="form.last_name" type="text" class="input" required />
        </div>

        <div>
          <label class="block mb-1 font-medium text-gray-700">Email</label>
          <input v-model="form.email" type="email" class="input" required />
        </div>

        <div>
          <label class="block mb-1 font-medium text-gray-700">Phone</label>
          <input v-model="form.phone" type="text" class="input" />
        </div>

        <div>
          <label class="block mb-1 font-medium text-gray-700">Address</label>
          <input v-model="form.address" type="text" class="input" />
        </div>

        <!-- Roles -->
        <div class="col-span-1">
          <label class="block mb-1 font-medium text-gray-700">Roles</label>
          <div class="border border-gray-300 rounded-lg p-2 max-h-40 overflow-y-auto">
            <div v-for="role in roles" :key="role.id" class="flex items-center mb-1">
              <input type="checkbox" :id="'role-' + role.id" :value="role.id" v-model="form.roleIds" class="mr-2">
              <label :for="'role-' + role.id">{{ role.name }}</label>
            </div>
          </div>
        </div>

        <!-- Permissions -->
        <div class="col-span-1">
          <label class="block mb-1 font-medium text-gray-700">Permissions</label>
          <div class="border border-gray-300 rounded-lg p-2 max-h-40 overflow-y-auto">
            <div v-for="perm in permissions" :key="perm.id" class="flex items-center mb-1">
              <input type="checkbox" :id="'perm-' + perm.id" :value="perm.id" v-model="form.permissionIds" class="mr-2">
              <label :for="'perm-' + perm.id">{{ perm.name }} ({{ perm.code }})</label>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="col-span-2 flex justify-end gap-3 mt-4">
          <button type="button" @click="$emit('close')" class="px-4 py-2 border rounded-lg">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-lg">Save</button>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: { type: Object, required: true } // includes Roles and effectivePermissions
  },
  data() {
    return {
      roles: [],          // all roles from backend
      permissions: [],    // all permissions from backend
      form: {
        first_name: this.data?.first_name || '',
        middle_name: this.data?.middle_name || '',
        last_name: this.data?.last_name || '',
        email: this.data?.email || '',
        phone: this.data?.phone || '',
        address: this.data?.address || '',
        roleIds: [],       // user’s roles
        permissionIds: [] // user’s effective permissions
      }
    };
  },
  async created() {
    await this.loadRolesAndPermissions();
    this.mapUserRolesAndPermissions();
  },
  methods: {
    async loadRolesAndPermissions() {
      try {
        // Fetch all roles from backend
        const rolesRes = await this.$apiGet("/roles");
        this.roles = rolesRes.data || [];

        // Fetch all permissions from backend
        const permsRes = await this.$apiGet("/permissions");
        this.permissions = permsRes.data || [];
      } catch (e) {
        console.error("Failed to load roles or permissions", e);
      }
    },

    mapUserRolesAndPermissions() {
      // Map roles assigned to user
      if (this.data?.Roles) {
        this.form.roleIds = this.data.Roles.map(r => r.id);
      }

      // Map effective permissions for user
      if (this.data?.effectivePermissions) {
        this.form.permissionIds = this.data.effectivePermissions.map(p => p.id);
      }

      // Ensure no duplicates
      this.form.permissionIds = [...new Set(this.form.permissionIds)];
    },

    async submitForm() {
      try {
        const payload = { ...this.form };
        const res = await this.$apiPatch(`/users`, this.data.id, payload);

        if (res) {
          this.$root.$refs.toast.showToast("User updated successfully", "success");
        }

        this.$emit("saved");
        this.$emit("close");
      } catch (e) {
        console.error("Update failed", e);
      }
    }
  }
};
</script>

<style>
.input {
  @apply border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-green-500 shadow-sm;
}
</style>
