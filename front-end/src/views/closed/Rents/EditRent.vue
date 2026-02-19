<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full 
                max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl
                p-6 text-sm transition-all">

      <!-- Header -->
      <div class="flex justify-between items-center mb-4 border-b pb-2">
        <h2 class="text-lg font-semibold text-gray-800">Edit Rent</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 text-xl">
          &times;
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-4">

        <!-- Two columns on big screens -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

          <div>
            <label class="block mb-1 font-medium text-gray-700">Unit_id</label>
            <input v-model="form.unit_id" type="text" class="input-field" />
          </div>

          <div>
            <label class="block mb-1 font-medium text-gray-700">Site_id</label>
            <input v-model="form.site_id" type="text" class="input-field" />
          </div>

          <div>
            <label class="block mb-1 font-medium text-gray-700">Renter_id</label>
            <input v-model="form.renter_id" type="text" class="input-field" />
          </div>

          <div>
            <label class="block mb-1 font-medium text-gray-700">Rent_amount</label>
            <input v-model="form.rent_amount" type="text" class="input-field" />
          </div>

          <div>
            <label class="block mb-1 font-medium text-gray-700">Deposit_amount</label>
            <input v-model="form.deposit_amount" type="text" class="input-field" />
          </div>

          <div>
            <label class="block mb-1 font-medium text-gray-700">Rent_period</label>
            <input v-model="form.rent_period" type="text" class="input-field" />
          </div>

          <div>
            <label class="block mb-1 font-medium text-gray-700">Start_date</label>
            <input v-model="form.start_date" type="text" class="input-field" />
          </div>

          <div>
            <label class="block mb-1 font-medium text-gray-700">Next_due_date</label>
            <input v-model="form.next_due_date" type="text" class="input-field" />
          </div>

          <div>
            <label class="block mb-1 font-medium text-gray-700">Status</label>
            <input v-model="form.status" type="text" class="input-field" />
          </div>

          <div>
            <label class="block mb-1 font-medium text-gray-700">Notes</label>
            <input v-model="form.notes" type="text" class="input-field" />
          </div>

          <div>
            <label class="block mb-1 font-medium text-gray-700">Owner_id</label>
            <input v-model="form.owner_id" type="text" class="input-field" />
          </div>

          <div>
            <label class="block mb-1 font-medium text-gray-700">Created_by</label>
            <input v-model="form.created_by" type="text" class="input-field" />
          </div>

          <div class="lg:col-span-2">
            <label class="block mb-1 font-medium text-gray-700">Updated_by</label>
            <input v-model="form.updated_by" type="text" class="input-field" />
          </div>

        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-3 pt-2">
          <button type="button" @click="$emit('close')" class="px-4 py-2 border rounded-lg">
            Cancel
          </button>
          <button type="submit" class="px-4 py-2 bg-green-500 text-white rounded-lg">
            Edit
          </button>
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
        unit_id: this.data?.unit_id || '',
site_id: this.data?.site_id || '',
renter_id: this.data?.renter_id || '',
rent_amount: this.data?.rent_amount || '',
deposit_amount: this.data?.deposit_amount || '',
rent_period: this.data?.rent_period || '',
start_date: this.data?.start_date || '',
next_due_date: this.data?.next_due_date || '',
status: this.data?.status || '',
notes: this.data?.notes || '',
owner_id: this.data?.owner_id || '',
created_by: this.data?.created_by || '',
updated_by: this.data?.updated_by || ''
      }
    };
  },
  methods: {
    async submitForm() {
      try {
        if ("Edit" === "Add") {
        const res= await this.$apiPost("/rent", this.form);
        if(res){
           this.$root.$refs.toast.showToast('Added successfully', 'success');
         }

        } else {
         const res= await this.$apiPut("/rent",this.data.id ,this.form);
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


<style>
.input-field {
  @apply border border-gray-300 rounded-lg px-4 py-2 w-full 
         focus:outline-none focus:ring-2 focus:ring-green-500 
         shadow-sm transition duration-150;
}
</style>