<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-sm">
      <div class="flex justify-between items-center mb-4 border-b pb-2">
        <h2 class="text-lg font-semibold text-gray-800">Edit Amenity</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Name (Editable) -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Name</label>
          <input 
            v-model="form.name" 
            type="text" 
            required 
            class="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-150" 
          />
        </div>

        <!-- Description (Editable) -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Description</label>
          <textarea 
            v-model="form.description" 
            rows="3"
            class="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-150"
          ></textarea>
        </div>

        <!-- Owner (Readonly Display) -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Owner</label>
          <div class="border border-gray-200 bg-gray-100 text-gray-600 rounded-lg px-4 py-2 text-sm select-none">
            {{ ownerName }}
          </div>
        </div>

        <!-- Created By (Readonly Display) -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Created By</label>
          <div class="border border-gray-200 bg-gray-100 text-gray-600 rounded-lg px-4 py-2 text-sm select-none">
            {{ creatorName }}
          </div>
        </div>

        <!-- Form Action Buttons -->
        <div class="flex justify-end gap-3 pt-2 border-t mt-4">
          <button 
            type="button" 
            @click="$emit('close')" 
            class="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700 transition duration-150"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-sm transition duration-150"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: { 
    data: {
      type: Object,
      required: true
    } 
  },
  data() {
    return {
      form: {
        name: this.data?.name || '',
        description: this.data?.description || '',
        owner_id: this.data?.owner_id || null,
        created_by: this.data?.created_by || null,
        updated_by: localStorage.getItem("userId")
      }
    };
  },
  computed: {
    ownerName() {
      if (!this.data?.owner) return '-';
      const u = this.data.owner;
      return [u.first_name, u.middle_name, u.last_name].filter(Boolean).join(" ") || u.email;
    },
    creatorName() {
      if (!this.data?.creator) return '-';
      const u = this.data.creator;
      return [u.first_name, u.middle_name, u.last_name].filter(Boolean).join(" ") || u.email;
    }
  },
  methods: {
    async submitForm() {
      try {
        const res = await this.$apiPut("/amenity", this.data.id, this.form);
        if (res) {
          if (this.$root.$refs.toast) {
            this.$root.$refs.toast.showToast('Amenity updated successfully', 'success');
          }
          this.$emit("saved");
          this.$emit("close");
        }
      } catch (e) { 
        console.error(e); 
      }
    }
  }
}
</script>