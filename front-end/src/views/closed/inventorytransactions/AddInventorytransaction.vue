<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg text-sm overflow-hidden">

      <!-- Modal header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500">
            <i class="fas fa-arrow-right-arrow-left text-sm"></i>
          </div>
          <div>
            <h2 class="font-semibold text-gray-800">Add Transaction</h2>
            <p class="text-xs text-gray-400">Record a stock movement</p>
          </div>
        </div>
        <button @click="$emit('close')"
          class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none">
          &times;
        </button>
      </div>

      <!-- Form body -->
      <form @submit.prevent="submitForm" class="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

        <!-- Action type — visual selector -->
        <div>
          <label class="form-label">Action Type <span class="text-red-400">*</span></label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="opt in actionOptions" :key="opt.value" type="button"
              @click="form.action = opt.value"
              :class="[
                'flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all text-xs font-medium',
                form.action === opt.value ? opt.activeClass : 'border-gray-200 text-gray-500 hover:border-gray-300'
              ]">
              <i :class="[opt.icon, 'text-base']"></i>
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- Inventory item -->
        <div>
          <label class="form-label">Inventory Item <span class="text-red-400">*</span></label>
          <select v-model="form.inventory_item_id" required class="form-input">
            <option value="">Select an item</option>
            <option v-for="item in inventoryItems" :key="item.id" :value="item.id">
              {{ item.description }} ({{ item.quantity }} {{ item.unit }} in stock)
            </option>
          </select>
          <p v-if="loadingItems" class="text-xs text-gray-400 mt-1">Loading items…</p>
        </div>

        <!-- Quantity -->
        <div>
          <label class="form-label">Quantity <span class="text-red-400">*</span></label>
          <div class="relative">
            <span :class="form.action === 'stock_in' ? 'text-green-500' : form.action === 'stock_out' ? 'text-red-500' : 'text-gray-400'"
              class="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-sm">
              {{ form.action === 'stock_in' ? '+' : form.action === 'stock_out' ? '-' : '±' }}
            </span>
            <input v-model.number="form.quantity" type="number" min="0.01" step="0.01" required placeholder="0"
              class="form-input pl-8" />
          </div>
        </div>

        <!-- Transaction date -->
        <div>
          <label class="form-label">Transaction Date <span class="text-red-400">*</span></label>
          <input v-model="form.transaction_date" type="date" required class="form-input" />
        </div>

        <!-- Note -->
        <div>
          <label class="form-label">Note</label>
          <textarea v-model="form.note" rows="2" placeholder="Optional note about this transaction…"
            class="form-input resize-none"></textarea>
        </div>

      </form>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
        <button type="button" @click="$emit('close')"
          class="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
          Cancel
        </button>
        <button @click="submitForm" :disabled="submitting || !form.action"
          class="px-5 py-2 text-sm bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
          <i v-if="submitting" class="fas fa-spinner fa-spin text-xs"></i>
          <i v-else class="fas fa-plus text-xs"></i>
          Add Transaction
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
        action:            '',
        inventory_item_id: '',
        quantity:          '',
        transaction_date:  new Date().toISOString().split('T')[0],
        note:              '',
        created_by:        parseInt(localStorage.getItem('userId')) || null,
      },
      inventoryItems: [],
      loadingItems: false,
      submitting: false,
      actionOptions: [
        { value: 'stock_in',    label: 'Stock In',    icon: 'fas fa-arrow-down',            activeClass: 'border-green-400 bg-green-50 text-green-600' },
        { value: 'stock_out',   label: 'Stock Out',   icon: 'fas fa-arrow-up',              activeClass: 'border-red-400 bg-red-50 text-red-600' },
        { value: 'adjustment',  label: 'Adjustment',  icon: 'fas fa-sliders',               activeClass: 'border-blue-400 bg-blue-50 text-blue-600' },
      ],
    };
  },
  methods: {
    async fetchInventoryItems() {
      this.loadingItems = true;
      try {
        const res = await this.$apiGet('/inventoryitem', { page_size: 500 });
        this.inventoryItems = res.data || [];
      } catch (e) { console.error(e); }
      finally { this.loadingItems = false; }
    },
    async submitForm() {
      if (!this.form.action) return;
      this.submitting = true;
      try {
        await this.$apiPost('/inventorytransaction', this.form);
        this.$emit('saved');
        this.$emit('close');
      } catch (e) { console.error(e); }
      finally { this.submitting = false; }
    },
  },
  mounted() { this.fetchInventoryItems(); },
};
</script>

<style scoped>
.form-label { @apply block text-xs font-medium text-gray-600 mb-1.5; }
.form-input { @apply w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors bg-white; }
</style>
