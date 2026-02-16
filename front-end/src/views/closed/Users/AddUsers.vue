<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8 text-sm relative"
    >
      <!-- HEADER -->
      <div class="flex justify-between items-center mb-4 border-b pb-2 sticky top-0 bg-white z-20">
        <h2 class="text-xl font-semibold text-gray-800">Add User</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 text-2xl leading-none"
        >
          &times;
        </button>
      </div>

      <!-- FORM -->
      <form @submit.prevent="submitForm" class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- USER FIELDS -->
        <div>
          <label class="label">First Name</label>
          <input v-model="form.first_name" class="input" required />
        </div>

        <div>
          <label class="label">Middle Name</label>
          <input v-model="form.middle_name" class="input" />
        </div>

        <div>
          <label class="label">Last Name</label>
          <input v-model="form.last_name" class="input" required />
        </div>

        <div>
          <label class="label">Email</label>
          <input v-model="form.email" type="email" class="input" required />
        </div>

        <div>
          <label class="label">Phone</label>
          <input v-model="form.phone" class="input" />
        </div>

        <div>
          <label class="label">Address</label>
          <input v-model="form.address" class="input" />
        </div>

        <div>
          <label class="label">Password</label>
          <input v-model="form.password" type="password" class="input" required />
        </div>
      </form>

      <!-- ROLES + PERMISSIONS -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        
        <!-- ROLES -->
        <div class="p-4 border rounded-lg bg-gray-50">
          <h3 class="text-lg font-semibold mb-3">Assign Roles</h3>

          <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
            <label
              v-for="role in roles"
              :key="role.id"
              class="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                :value="role.id"
                v-model="form.roleIds"
                class="checkbox"
              />
              <span>{{ role.name }}</span>
            </label>
          </div>
        </div>

        <!-- PERMISSIONS -->
        <div class="p-4 border rounded-lg bg-gray-50">
          <h3 class="text-lg font-semibold mb-3">Assign Permissions</h3>

          <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
            <label
              v-for="perm in permissions"
              :key="perm.id"
              class="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                :value="perm.id"
                v-model="form.permissionIds"
                class="checkbox"
              />
              <span>{{ perm.name }}</span>
            </label>
          </div>
        </div>

      </div>

      <!-- FOOTER -->
      <div class="flex justify-end gap-4 mt-8 sticky bottom-0 bg-white py-3 border-t z-20">
        <button @click="$emit('close')" class="px-4 py-2 border rounded-lg">
          Cancel
        </button>

        <button
          @click="submitForm"
          class="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
        >
          Add User
        </button>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roles: [],
      permissions: [],
      form: {
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        password: "",

        roleIds: [],
        permissionIds: [],

        owner_id:localStorage.getItem('owner_id'),
        created_by:localStorage.getItem('userId'),

      }
    };
  },

  async created() {
    await this.loadRolesAndPermissions();
  },

  methods: {
    async loadRolesAndPermissions() {
      try {
        const rolesRes = await this.$apiGet("/roles");
        this.roles = rolesRes.data;

        const permRes = await this.$apiGet("/permissions");
        this.permissions = permRes.data;

      } catch (err) {
        console.error("Failed loading roles or permissions:", err);
      }
    },

    async submitForm() {
      try {

        console.log("the form",this.form);
        const res = await this.$apiPost("/auth/register", this.form);
        if (res) {
          this.$root.$refs.toast.showToast("User added successfully", "success");
        }

        this.$emit("saved");
        this.$emit("close");

      } catch (err) {
        console.error(err);
      }
    }
  }
};
</script>

<style>
.label {
  @apply block mb-1 font-medium text-gray-700;
}

.input {
  @apply border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-green-500 shadow-sm;
}

.checkbox {
  @apply w-4 h-4 text-green-600 border-gray-300 rounded;
}
</style>
