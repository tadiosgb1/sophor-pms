<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div
      class="bg-white rounded-xl shadow-2xl w-full max-w-sm sm:max-w-xl lg:max-w-5xl p-6 text-sm"
    >
      <!-- Header -->
      <div class="flex justify-between items-center mb-4 border-b pb-2">
        <h2 class="text-lg font-semibold text-gray-800">
          Add Role
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 text-xl"
        >
          &times;
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <!-- Role Details -->
          <div class="space-y-4">
            <div>
              <label class="block mb-1 font-medium text-gray-700">Name</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label class="block mb-1 font-medium text-gray-700">
                Description
              </label>
              <textarea
                v-model="form.description"
                rows="4"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <!-- Permissions -->
          <div>
            <label class="block mb-2 font-medium text-gray-700">
              Permissions
            </label>

            <div
              class="border border-gray-300 rounded-lg p-4 max-h-72 overflow-y-auto space-y-2"
            >
              <div
                v-for="permission in permissions"
                :key="permission.id"
                class="flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  :value="permission.id"
                  v-model="form.permissions"
                  class="accent-green-500"
                />
                <span class="text-gray-700">
                  {{ permission.code}}
                </span>
              </div>

              <div v-if="loading" class="text-center text-gray-400">
                Loading permissions...
              </div>

              <div
                v-if="!loading && permissions.length === 0"
                class="text-center text-gray-400"
              >
                No permissions found
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Add Role
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddRoleModal",
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      permissions: [],
      form: {
        name: "",
        description: "",
        permissions: []
      }
    };
  },
  mounted() {
    this.fetchPermissions();
  },
  methods: {
    async fetchPermissions() {
      this.loading = true;
      try {
        const response = await this.$apiGet("/permissions");
        this.permissions = response.data || [];


      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },

    async submitForm() {
      try {
        const payload = {
          name: this.form.name,
          description: this.form.description,
          permissionIds: this.form.permissions
        };

        console.log("role payload",payload);

        const res = await this.$apiPost("/roles", payload);

        if (res) {
          this.$root.$refs.toast.showToast(
            "Role added successfully",
            "success"
          );
          this.$emit("saved");
          this.$emit("close");
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
};
</script>
