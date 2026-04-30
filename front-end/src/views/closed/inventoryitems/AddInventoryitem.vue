<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg text-sm overflow-hidden">

      <!-- Modal header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500">
            <i class="fas fa-box text-sm"></i>
          </div>
          <div>
            <h2 class="font-semibold text-gray-800">Add Inventory Item</h2>
            <p class="text-xs text-gray-400">Fill in the item details below</p>
          </div>
        </div>
        <button @click="$emit('close')"
          class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none">
          &times;
        </button>
      </div>

      <!-- Form body -->
      <form @submit.prevent="submitForm" class="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

        <!-- Description -->
        <div>
          <label class="form-label">Description <span class="text-red-400">*</span></label>
          <input v-model="form.description" type="text" required placeholder="e.g. Cement Bags, Paint (White)"
            class="form-input" />
        </div>

        <!-- Quantity + Unit (side by side) -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="form-label">Quantity <span class="text-red-400">*</span></label>
            <input v-model.number="form.quantity" type="number" min="0" step="0.01" required placeholder="0"
              class="form-input" />
          </div>
          <div>
            <label class="form-label">Unit <span class="text-red-400">*</span></label>
            <select v-model="form.unit" required class="form-input">
              <option value="">Select unit</option>
              <option v-for="u in unitOptions" :key="u" :value="u">{{ u }}</option>
            </select>
          </div>
        </div>

        <!-- Price per unit -->
        <div>
          <label class="form-label">Price per Unit (ETB) <span class="text-red-400">*</span></label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">ETB</span>
            <input v-model.number="form.price_per_unit" type="number" min="0" step="0.01" required placeholder="0.00"
              class="form-input pl-10" />
          </div>
        </div>

        <!-- Total value preview -->
        <div v-if="form.quantity && form.price_per_unit"
          class="flex items-center justify-between bg-orange-50 border border-orange-100 rounded-lg px-4 py-2.5">
          <span class="text-xs text-orange-600 font-medium">Estimated Total Value</span>
          <span class="text-sm font-bold text-orange-600">
            ETB {{ (form.quantity * form.price_per_unit).toLocaleString() }}
          </span>
        </div>

        <!-- Site -->
        <div>
          <label class="form-label">Site <span class="text-red-400">*</span></label>
          <select v-model="form.site_id" required class="form-input">
            <option value="">Select a site</option>
            <option v-for="site in sites" :key="site.id" :value="site.id">{{ site.name }}</option>
          </select>
          <p v-if="loadingSites" class="text-xs text-gray-400 mt-1">Loading sites…</p>
        </div>

      </form>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
        <button type="button" @click="$emit('close')"
          class="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
          Cancel
        </button>
        <button @click="submitForm" :disabled="submitting"
          class="px-5 py-2 text-sm bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
          <i v-if="submitting" class="fas fa-spinner fa-spin text-xs"></i>
          <i v-else class="fas fa-plus text-xs"></i>
          Add Item
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { data: Object },
  data() {
    return {
      form: {
        description: '',
        quantity: '',
        unit: '',
        price_per_unit: '',
        site_id: '',
        created_by: parseInt(localStorage.getItem('userId')) || null,
      },
      sites: [],
      loadingSites: false,
      submitting: false,
      unitOptions: ['pieces', 'bags', 'liters', 'meters', 'kg', 'tons', 'sets', 'boxes', 'rolls', 'sheets'],
    };
  },
  methods: {
    async fetchSites() {
      this.loadingSites = true;
      try {
        const res = await this.$apiGet('/site', { page_size: 200 });
        this.sites = res.data || [];
      } catch (e) { console.error(e); }
      finally { this.loadingSites = false; }
    },
    async submitForm() {
      this.submitting = true;
      try {
        await this.$apiPost('/inventoryitem', this.form);
        this.$emit('saved');
        this.$emit('close');
      } catch (e) { console.error(e); }
      finally { this.submitting = false; }
    },
  },
  mounted() { this.fetchSites(); },
};
</script>

<style scoped>
.form-label { @apply block text-xs font-medium text-gray-600 mb-1.5; }
.form-input { @apply w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors bg-white; }
</style>
