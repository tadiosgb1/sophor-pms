<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
    <!-- Modal container -->
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md lg:max-w-5xl p-6 text-sm">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6 border-b pb-2">
        <h2 class="text-xl font-semibold text-gray-800">Add Site</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Name -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Name</label>
          <input v-model="form.name" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

        <!-- Description -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Description</label>
          <input v-model="form.description" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

        <!-- Site_type -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Site_type</label>
          <input v-model="form.site_type" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

        <!-- Status -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Status</label>
          <input v-model="form.status" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

        <!-- Latitude -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Latitude</label>
          <input v-model="form.latitude" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

        <!-- Longitude -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Longitude</label>
          <input v-model="form.longitude" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

        <!-- Country -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Country</label>
          <input v-model="form.country" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

        <!-- State -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">State</label>
          <input v-model="form.state" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

        <!-- City -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">City</label>
          <input v-model="form.city" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

        <!-- Sub_city -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Sub_city</label>
          <input v-model="form.sub_city" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

        <!-- Street -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Street</label>
          <input v-model="form.street" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

        <!-- Owner_id -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Owner_id</label>
          <input v-model="form.owner_id" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

        <!-- Created_by -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Created_by</label>
          <input v-model="form.created_by" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

        <!-- Updated_by -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Updated_by</label>
          <input v-model="form.updated_by" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

        <!-- Buttons span two columns -->
        <div class="col-span-1 lg:col-span-2 flex justify-end gap-3 pt-4">
          <button type="button" @click="$emit('close')" class="px-4 py-2 border rounded-lg">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-green-500 text-white rounded-lg">Add</button>
        </div>
      </form>
    </div>
  </div>
</template>


<script>
export default {
  props: { data: Object },
  data() {
    return {
      form: {
        name: this.data?.name || '',
description: this.data?.description || '',
site_type: this.data?.site_type || '',
status: this.data?.status || '',
latitude: this.data?.latitude || '',
longitude: this.data?.longitude || '',
country: this.data?.country || '',
state: this.data?.state || '',
city: this.data?.city || '',
sub_city: this.data?.sub_city || '',
street: this.data?.street || '',
owner_id: this.data?.owner_id || '',
created_by: this.data?.created_by || '',
updated_by: this.data?.updated_by || ''
      }
    };
  },
  methods: {
    async submitForm() {
      try {
        if ("Add" === "Add") {
        const res= await this.$apiPost("/site", this.form);
        if(res){
           this.$root.$refs.toast.showToast('Added successfully', 'success');
         }

        } else {
         const res= await this.$apiPut("/site",this.data.id ,this.form);
         if(res){
           this.$root.$refs.toast.showToast('Edited successfully', 'success');
         }
        }
        this.$emit("saved");
        this.$emit("close");
      } catch (e) { console.error(e); }
    }
  }
}
</script>
