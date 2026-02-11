<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 text-sm max-h-[90vh] overflow-y-auto">
      
      <!-- Header -->
      <div class="flex justify-between items-center mb-4 border-b pb-2">
        <h2 class="text-lg font-semibold text-gray-800">Edit Company</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">&times;</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-4">

        <!-- 2 Columns on Large Screens -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Name</label>
            <input v-model="form.name" type="text" required class="border w-full border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
          </div>
          
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Address</label>
            <input v-model="form.address" type="text" required class="border w-full border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Latitude</label>
            <input v-model="form.latitude" type="text" required class="border w-full border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Longitude</label>
            <input v-model="form.longitude" type="text" required class="border w-full border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Phone</label>
            <input v-model="form.phone" type="text" required class="border w-full border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Official Email</label>
            <input v-model="form.official_email" type="text" required class="border w-full border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Website</label>
            <input v-model="form.website" type="text" required class="border w-full border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Logo</label>
            <input v-model="form.logo" type="text" required class="border w-full border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Facebook</label>
            <input v-model="form.facebook" type="text" required class="border w-full border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Instagram</label>
            <input v-model="form.instagram" type="text" required class="border w-full border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Linkedin</label>
            <input v-model="form.linkedin" type="text" required class="border w-full border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Twitter</label>
            <input v-model="form.twitter" type="text" required class="border w-full border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Telegram</label>
            <input v-model="form.telegram" type="text" required class="border w-full border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" />
          </div>
          <div class="md:col-span-2">
            <label class="block mb-1 text-sm font-medium text-gray-700">Description</label>
            <textarea v-model="form.description" required class="border w-full border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"></textarea>
          </div>
        </div>
        <!-- Buttons -->
        <div class="flex justify-end gap-3 pt-2">
          <button type="button" @click="$emit('close')" class="px-4 py-2 border rounded-lg">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-green-500 text-white rounded-lg">Edit</button>
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
address: this.data?.address || '',
latitude: this.data?.latitude || '',
longitude: this.data?.longitude || '',
phone: this.data?.phone || '',
official_email: this.data?.official_email || '',
website: this.data?.website || '',
logo: this.data?.logo || '',
facebook: this.data?.facebook || '',
instagram: this.data?.instagram || '',
linkedin: this.data?.linkedin || '',
twitter: this.data?.twitter || '',
telegram: this.data?.telegram || '',
description: this.data?.description || '',
owner_id: this.data?.owner_id || ''
      }
    };
  },
  methods: {
    async submitForm() {
      try {
        if ("Edit" === "Add") {
        const res= await this.$apiPost("/company", this.form);
        if(res){
           this.$root.$refs.toast.showToast('Added successfully', 'success');
         }

        } else {
         const res= await this.$apiPut("/company",this.data.id ,this.form);
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
