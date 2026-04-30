<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg text-sm overflow-hidden">

      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-500">
            <i class="fas fa-pen text-sm"></i>
          </div>
          <div>
            <h2 class="font-semibold text-gray-800">Edit Expense</h2>
            <p class="text-xs text-gray-400">Update the expense details</p>
          </div>
        </div>
        <button @click="$emit('close')"
          class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none">
          &times;
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

        <!-- Category — visual selector -->
        <div>
          <label class="form-label">Category <span class="text-red-400">*</span></label>
          <div class="grid grid-cols-4 gap-2">
            <button v-for="cat in categoryOptions" :key="cat.value" type="button"
              @click="form.category = cat.value"
              :class="[
                'flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 transition-all text-xs font-medium',
                form.category === cat.value ? cat.activeClass : 'border-gray-200 text-gray-500 hover:border-gray-300'
              ]">
              <i :class="[cat.icon, 'text-sm']"></i>
              <span class="text-[10px]">{{ cat.label }}</span>
            </button>
          </div>
        </div>

        <!-- Amount -->
        <div>
          <label class="form-label">Amount (ETB) <span class="text-red-400">*</span></label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">ETB</span>
            <input v-model.number="form.amount" type="number" min="0" step="0.01" required placeholder="0.00"
              class="form-input pl-10" />
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="form-label">Description</label>
          <textarea v-model="form.description" rows="2" placeholder="Brief description of the expense…"
            class="form-input resize-none"></textarea>
        </div>

        <!-- Site + Date -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="form-label">Site <span class="text-red-400">*</span></label>
            <select v-model="form.site_id" required class="form-input">
              <option value="">Select site</option>
              <option v-for="site in sites" :key="site.id" :value="site.id">{{ site.name }}</option>
            </select>
            <p v-if="loadingSites" class="text-xs text-gray-400 mt-1">Loading…</p>
          </div>
          <div>
            <label class="form-label">Expense Date <span class="text-red-400">*</span></label>
            <input v-model="form.expense_date" type="date" required class="form-input" />
          </div>
        </div>

      </form>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
        <button type="button" @click="$emit('close')"
          class="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
          Cancel
        </button>
        <button @click="submitForm" :disabled="submitting || !form.category"
          class="px-5 py-2 text-sm bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
          <i v-if="submitting" class="fas fa-spinner fa-spin text-xs"></i>
          <i v-else class="fas fa-check text-xs"></i>
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { data: Object },
  data() {
    const rawDate = this.data?.expense_date;
    const formattedDate = rawDate ? new Date(rawDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    return {
      form: {
        category:     this.data?.category    || '',
        amount:       this.data?.amount      || '',
        description:  this.data?.description || '',
        site_id:      this.data?.site_id     || '',
        expense_date: formattedDate,
        updated_by:   parseInt(localStorage.getItem('userId')) || null,
      },
      sites: [],
      loadingSites: false,
      submitting: false,
      categoryOptions: [
        { value: 'Maintenance', label: 'Maintenance', icon: 'fas fa-wrench',            activeClass: 'border-yellow-400 bg-yellow-50 text-yellow-600' },
        { value: 'Utilities',   label: 'Utilities',   icon: 'fas fa-bolt',              activeClass: 'border-blue-400 bg-blue-50 text-blue-600' },
        { value: 'Cleaning',    label: 'Cleaning',    icon: 'fas fa-broom',             activeClass: 'border-teal-400 bg-teal-50 text-teal-600' },
        { value: 'Security',    label: 'Security',    icon: 'fas fa-shield-halved',     activeClass: 'border-red-400 bg-red-50 text-red-600' },
        { value: 'Repairs',     label: 'Repairs',     icon: 'fas fa-screwdriver-wrench',activeClass: 'border-orange-400 bg-orange-50 text-orange-600' },
        { value: 'Salaries',    label: 'Salaries',    icon: 'fas fa-user-tie',          activeClass: 'border-purple-400 bg-purple-50 text-purple-600' },
        { value: 'Insurance',   label: 'Insurance',   icon: 'fas fa-file-shield',       activeClass: 'border-indigo-400 bg-indigo-50 text-indigo-600' },
        { value: 'Other',       label: 'Other',       icon: 'fas fa-ellipsis',          activeClass: 'border-gray-400 bg-gray-50 text-gray-600' },
      ],
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
      if (!this.form.category) return;
      this.submitting = true;
      try {
        await this.$apiPut('/expense', this.data.id, this.form);
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
.form-input { @apply w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors bg-white; }
</style>
