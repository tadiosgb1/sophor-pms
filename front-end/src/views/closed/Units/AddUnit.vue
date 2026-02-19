<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
    <!-- Modal container -->
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md lg:max-w-5xl p-6 text-sm">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6 border-b pb-2">
        <h2 class="text-xl font-semibold text-gray-800">Add Unit</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Name</label>
          <input v-model="form.name" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Description</label>
          <input v-model="form.description" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Type_id</label>
          <input v-model="form.type_id" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Floor</label>
          <input v-model="form.floor" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">House_number</label>
          <input v-model="form.house_number" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Block_number</label>
          <input v-model="form.block_number" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Bedrooms</label>
          <input v-model="form.bedrooms" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Bathrooms</label>
          <input v-model="form.bathrooms" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Size</label>
          <input v-model="form.size" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Price</label>
          <input v-model="form.price" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Status</label>
          <input v-model="form.status" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

   
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Owner_id</label>
          <input v-model="form.owner_id" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Manager_id</label>
          <input v-model="form.manager_id" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Staff_id</label>
          <input v-model="form.staff_id" type="text" required
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
type_id: this.data?.type_id || '',
floor: this.data?.floor || '',
house_number: this.data?.house_number || '',
block_number: this.data?.block_number || '',
bedrooms: this.data?.bedrooms || '',
bathrooms: this.data?.bathrooms || '',
size: this.data?.size || '',
price: this.data?.price || '',
status: this.data?.status || '',
site_id: this.data?.site_id || '',
owner_id: this.data?.owner_id || '',
manager_id: this.data?.manager_id || '',
staff_id: this.data?.staff_id || '',
created_by: this.data?.created_by || '',
updated_by: this.data?.updated_by || ''
      }
    };
  },
  methods: {
    async submitForm() {
      try {
        if ("Add" === "Add") {
        const res= await this.$apiPost("/unit", this.form);
        if(res){
           this.$root.$refs.toast.showToast('Added successfully', 'success');
         }

        } else {
         const res= await this.$apiPut("/unit",this.data.id ,this.form);
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
