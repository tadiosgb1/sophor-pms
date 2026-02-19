
<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
  >
    <div
      class="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6 text-sm mx-auto my-6"
    >
      <!-- Header -->
      <div
        class="flex justify-between items-center mb-4 border-b pb-2 sticky top-0 bg-white z-10"
      >
        <h2 class="text-lg font-semibold text-gray-800">Add Rent</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 text-xl"
        >
          &times;
        </button>
      </div>

      <form @submit.prevent="submitForm" class="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <!-- Unit ID -->
        <div>
          <label class="form-label">Unit ID</label>
          <input v-model="form.unit_id" type="text" required class="input-field" />
        </div>

        <!-- Site ID -->
        <div>
          <label class="form-label">Site ID</label>
          <input v-model="form.site_id" type="text" required class="input-field" />
        </div>

        <!-- Renter ID -->
        <div>
          <label class="form-label">Renter ID</label>
          <input v-model="form.renter_id" type="text" required class="input-field" />
        </div>

        <!-- Rent Amount -->
        <div>
          <label class="form-label">Rent Amount</label>
          <input v-model="form.rent_amount" type="number" required class="input-field" />
        </div>

        <!-- Deposit Amount -->
        <div>
          <label class="form-label">Deposit Amount</label>
          <input v-model="form.deposit_amount" type="number" required class="input-field" />
        </div>

        <!-- Rent Period -->
        <div>
          <label class="form-label">Rent Period</label>
          <input v-model="form.rent_period" type="text" required class="input-field" />
        </div>

        <!-- Start Date -->
        <div>
          <label class="form-label">Start Date</label>
          <input v-model="form.start_date" type="date" required class="input-field" />
        </div>

        <!-- Next Due Date -->
        <div>
          <label class="form-label">Next Due Date</label>
          <input v-model="form.next_due_date" type="date" required class="input-field" />
        </div>

        <!-- Status -->
        <div>
          <label class="form-label">Status</label>
          <input v-model="form.status" type="text" required class="input-field" />
        </div>

        <!-- Notes -->
        <div class="sm:col-span-2">
          <label class="form-label">Notes</label>
          <textarea v-model="form.notes" rows="2" class="input-field resize-none"></textarea>
        </div>

        <!-- Owner ID -->
        <div>
          <label class="form-label">Owner ID</label>
          <input v-model="form.owner_id" type="text" required class="input-field" />
        </div>

        <!-- Created By -->
        <div>
          <label class="form-label">Created By</label>
          <input v-model="form.created_by" type="text" required class="input-field" />
        </div>

        <!-- Updated By -->
        <div>
          <label class="form-label">Updated By</label>
          <input v-model="form.updated_by" type="text" required class="input-field" />
        </div>

        <!-- Buttons -->
        <div class="sm:col-span-2 flex justify-end gap-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Add
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
        owner_id: localStorage.getItem("owner_id"),
        created_by: localStorage.getItem("userId"),
        updated_by: localStorage.getItem("userId"),
      }
    };
  },
  methods: {
    async submitForm() {
      try {
        if ("Add" === "Add") {
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

<style scoped>
.input-field {
  @apply border border-gray-300 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition;
}
.form-label {
  @apply block mb-1 text-sm font-medium text-gray-700;
}
</style>