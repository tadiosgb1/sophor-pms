
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
        <h2 class="text-lg font-semibold text-gray-800">Add Sale</h2>
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
          <label class="block mb-1 text-sm font-medium text-gray-700"
            >Unit ID</label
          >
          <input
            v-model="form.unit_id"
            type="text"
            required
            class="input-field"
          />
        </div>

        <!-- Site ID -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700"
            >Site ID</label
          >
          <input
            v-model="form.site_id"
            type="text"
            required
            class="input-field"
          />
        </div>

        <!-- Buyer ID -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700"
            >Buyer ID</label
          >
          <input
            v-model="form.buyer_id"
            type="text"
            required
            class="input-field"
          />
        </div>

        <!-- Sale Price -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700"
            >Sale Price</label
          >
          <input
            v-model="form.sale_price"
            type="number"
            required
            class="input-field"
          />
        </div>

        <!-- Sale Date -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700"
            >Sale Date</label
          >
          <input
            v-model="form.sale_date"
            type="date"
            required
            class="input-field"
          />
        </div>

        <!-- Status -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700"
            >Status</label
          >
          <input
            v-model="form.status"
            type="text"
            required
            class="input-field"
          />
        </div>

        <!-- Notes -->
        <div class="sm:col-span-2">
          <label class="block mb-1 text-sm font-medium text-gray-700"
            >Notes</label
          >
          <textarea
            v-model="form.notes"
            rows="2"
            class="input-field resize-none"
          ></textarea>
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
        buyer_id: this.data?.buyer_id || '',
        sale_price: this.data?.sale_price || '',
        sale_date: this.data?.sale_date || '',
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
        const res= await this.$apiPost("/sale", this.form);
        if(res){
           this.$root.$refs.toast.showToast('Added successfully', 'success');
         }

        } else {
         const res= await this.$apiPut("/sale",this.data.id ,this.form);
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
</style>