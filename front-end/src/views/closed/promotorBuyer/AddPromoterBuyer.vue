<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-sm transform transition-all duration-300 border border-gray-200">
      
      <div class="border-b pb-3 mb-4 border-green-100">
          <h2 class="text-xl font-semibold text-gray-800">Add Promoter Buyer</h2>
      </div>

      <form @submit.prevent="saveItem" class="space-y-4">
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Promoter</label>
          <div class="relative">
            <input
              v-model="promoterSearch"
              @input="searchPromoters"
              placeholder="Search promoter (e.g., ID or Name)..."
              class="border border-gray-300 rounded-lg w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
              list="promoterList"
              required
            />
            <datalist id="promoterList">
              <option
                v-for="user in promoters"
                :key="user.id"
                :value="user.id + ' - ' + (user.first_name || '') + ' ' + (user.last_name || '')"
              />
            </datalist>
          </div>
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Buyer</label>
          <div class="relative">
            <input
              v-model="buyerSearch"
              @input="searchBuyers"
              placeholder="Search buyer (e.g., ID or Name)..."
              class="border border-gray-300 rounded-lg w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
              list="buyerList"
              required
            />
            <datalist id="buyerList">
              <option
                v-for="user in buyers"
                :key="user.id"
                :value="user.id + ' - ' + (user.first_name || '') + ' ' + (user.last_name || '')"
              />
            </datalist>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition duration-150 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
// No need to explicitly import axios if all calls use $apiGet/Post/etc.
// import axios from "axios"; 

export default {
  data() {
    return {
      form: { promoter: "", buyer: "" },
      promoterSearch: "",
      buyerSearch: "",
      promoters: [],
      buyers: [],
      typingTimeout: null,
    };
  },
  methods: {
    // Helper to extract ID from the search string (e.g., "123 - John Doe")
    extractId(searchString) {
        const match = searchString.match(/^(\d+)\s*-/);
        return match ? parseInt(match[1]) : null;
    },

    // 🔹 SEARCH PROMOTERS
    async searchPromoters() {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = setTimeout(async () => {
        if (this.promoterSearch.length < 2) {
            this.form.promoter = this.extractId(this.promoterSearch) || "";
            return;
        }

        try {
          const params = { search: this.promoterSearch };
          const res = await this.$apiGet("/get_users", params);
          this.promoters = res.data || [];
        } catch (err) {
          console.error("Error searching promoters:", err);
        }

        // Check for match after search
        const match = this.promoters.find(
          (u) =>
            `${u.id} - ${u.first_name || ""} ${u.last_name || ""}`.trim() ===
            this.promoterSearch.trim()
        );
        this.form.promoter = match ? match.id : "";
      }, 400);
    },

    // 🔹 SEARCH BUYERS (Updated to use $apiGet for consistency)
    async searchBuyers() {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = setTimeout(async () => {
        if (this.buyerSearch.length < 2) {
            this.form.buyer = this.extractId(this.buyerSearch) || "";
            return;
        }

        try {
            // Using $apiGet instead of raw axios call for consistency
            const params = { search: this.buyerSearch };
            const res = await this.$apiGet("/get_users", params); 
            this.buyers = res.data || [];
        } catch (err) {
          console.error("Error searching buyers:", err);
        }

        // Check for match after search
        const match = this.buyers.find(
          (u) =>
            `${u.id} - ${u.first_name || ""} ${u.last_name || ""}`.trim() ===
            this.buyerSearch.trim()
        );
        this.form.buyer = match ? match.id : "";
      }, 400);
    },

    // 🔹 SAVE FORM
    async saveItem() {
        // Final check to see if an ID was successfully extracted from the input
        this.form.promoter = this.extractId(this.promoterSearch) || "";
        this.form.buyer = this.extractId(this.buyerSearch) || "";

      if (!this.form.promoter || !this.form.buyer) {
        this.$root.$refs.toast.showToast(
          "Please select both promoter and buyer using their ID or full name from the list.",
          "error"
        );
        return;
      }

      try {
        const res = await this.$apiPost("/post_promoter_buyer", this.form);
        if (res) this.$root.$refs.toast.showToast("Saved successfully", "success");
        this.$emit("saved");
        this.$emit("close");
      } catch (err) {
        console.error("Save failed:", err);
        this.$root.$refs.toast.showToast("Save failed", "error");
      }
    },
  },
};
</script>