<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-sm">
      <div class="flex justify-between items-center mb-4 border-b pb-2">
        <h2 class="text-lg font-semibold text-gray-800 ">Add SaleDocument</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">&times;</button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-4" enctype="multipart/form-data">
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Sale ID</label>
          <input v-model="form.sale_id" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-150" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Document Name</label>
          <input v-model="form.document_name" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-150" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Document File</label>
          <input @change="handleFile" type="file" required
            class="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-150" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Owner ID</label>
          <input v-model="form.owner_id" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-150" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Created By</label>
          <input v-model="form.created_by" type="text" required
            class="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-150" />
        </div>

        <div class="flex justify-end gap-3 pt-2">
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
        sale_id: this.data?.sale_id || "",
        document_name: this.data?.document_name || "",
        owner_id: this.data?.owner_id || "",
        created_by: this.data?.created_by || ""
      },
      documentFile: null // store the selected file
    };
  },
  methods: {
    handleFile(event) {
      this.documentFile = event.target.files[0];
    },
    async submitForm() {
      try {
        const formData = new FormData();
        formData.append("sale_id", this.form.sale_id);
        formData.append("document_name", this.form.document_name);
        formData.append("owner_id", this.form.owner_id);
        formData.append("created_by", this.form.created_by);

        if (this.documentFile) {
          formData.append("document_url", this.documentFile); // append file
        }


        const headers={
          "Content-Type": "multipart/form-data"
        }
        let res;
        if ("Add" === "Add") {
          res = await this.$apiPost("/saledocument", formData, 
            headers
        );
          if (res) this.$root.$refs.toast.showToast("Added successfully", "success");
        } else {
          res = await this.$apiPut(`/saledocument/${this.data.id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          if (res) this.$root.$refs.toast.showToast("Edited successfully", "success");
        }

        this.$emit("saved");
        this.$emit("close");
      } catch (e) {
        console.error(e);
      }
    }
  }
};
</script>