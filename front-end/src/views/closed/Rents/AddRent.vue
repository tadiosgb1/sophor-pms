<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg text-sm overflow-hidden">

      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500">
            <i class="fas fa-house-user text-sm"></i>
          </div>
          <div>
            <h2 class="font-semibold text-gray-800">New Rental</h2>
            <p class="text-xs text-gray-400">Create a new rental agreement</p>
          </div>
        </div>
        <button @click="$emit('close')"
          class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 text-lg leading-none">
          &times;
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

        <!-- Site → Unit cascade -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="form-label">Site <span class="text-red-400">*</span></label>
            <select v-model="form.site_id" required @change="onSiteChange" class="form-input">
              <option value="">Select site</option>
              <option v-for="s in sites" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
          <div>
            <label class="form-label">Unit <span class="text-red-400">*</span></label>
            <select v-model="form.unit_id" required class="form-input" :disabled="!form.site_id">
              <option value="">Select unit</option>
              <option v-for="u in filteredUnits" :key="u.id" :value="u.id">{{ u.name }}</option>
            </select>
          </div>
        </div>

        <!-- Renter -->
        <div>
          <label class="form-label">Renter / Tenant <span class="text-red-400">*</span></label>
          <select v-model="form.renter_id" required class="form-input">
            <option value="">Select renter</option>
            <option v-for="u in users" :key="u.id" :value="u.id">
              {{ u.first_name }} {{ u.last_name }} ({{ u.email }})
            </option>
          </select>
        </div>

        <!-- Rent amount + Deposit -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="form-label">Rent Amount (ETB) <span class="text-red-400">*</span></label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">ETB</span>
              <input v-model.number="form.rent_amount" type="number" min="0" step="0.01" required
                placeholder="0.00" class="form-input pl-10" />
            </div>
          </div>
          <div>
            <label class="form-label">Deposit (ETB)</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">ETB</span>
              <input v-model.number="form.deposit_amount" type="number" min="0" step="0.01"
                placeholder="0.00" class="form-input pl-10" />
            </div>
          </div>
        </div>

        <!-- Period -->
        <div>
          <label class="form-label">Rent Period <span class="text-red-400">*</span></label>
          <div class="grid grid-cols-3 gap-2">
            <button v-for="p in periodOptions" :key="p.value" type="button"
              @click="form.rent_period = p.value"
              :class="['py-2 rounded-xl border-2 transition-all text-xs font-medium',
                form.rent_period === p.value ? 'border-orange-400 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-500 hover:border-gray-300']">
              {{ p.label }}
            </button>
          </div>
        </div>

        <!-- Start date + Next due -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="form-label">Start Date <span class="text-red-400">*</span></label>
            <input v-model="form.start_date" type="date" required class="form-input" />
          </div>
          <div>
            <label class="form-label">Next Due Date <span class="text-red-400">*</span></label>
            <input v-model="form.next_due_date" type="date" required class="form-input" />
          </div>
        </div>

        <!-- Status -->
        <div>
          <label class="form-label">Status <span class="text-red-400">*</span></label>
          <div class="grid grid-cols-4 gap-2">
            <button v-for="s in statusOptions" :key="s.value" type="button"
              @click="form.status = s.value"
              :class="['flex items-center justify-center gap-1 py-2 rounded-xl border-2 transition-all text-xs font-medium',
                form.status === s.value ? s.activeClass : 'border-gray-200 text-gray-500 hover:border-gray-300']">
              <i :class="[s.icon, 'text-[10px]']"></i>
              {{ s.label }}
            </button>
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label class="form-label">Notes</label>
          <textarea v-model="form.notes" rows="2" placeholder="Optional notes…"
            class="form-input resize-none"></textarea>
        </div>

      </form>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
        <button type="button" @click="$emit('close')"
          class="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
          Cancel
        </button>
        <button @click="submitForm" :disabled="submitting || !form.rent_period || !form.status"
          class="px-5 py-2 text-sm bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
          <i v-if="submitting" class="fas fa-spinner fa-spin text-xs"></i>
          <i v-else class="fas fa-plus text-xs"></i>
          Create Rental
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
        site_id:        '',
        unit_id:        '',
        renter_id:      '',
        rent_amount:    '',
        deposit_amount: '',
        rent_period:    '',
        start_date:     new Date().toISOString().split('T')[0],
        next_due_date:  '',
        status:         'active',
        notes:          '',
        owner_id:       parseInt(localStorage.getItem('userId')) || null,
        created_by:     parseInt(localStorage.getItem('userId')) || null,
      },
      sites: [], units: [], users: [], submitting: false,
      periodOptions: [
        { value: 'monthly',   label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'yearly',    label: 'Yearly' },
      ],
      statusOptions: [
        { value: 'active',     label: 'Active',     icon: 'fas fa-circle-check', activeClass: 'border-green-400 bg-green-50 text-green-700' },
        { value: 'pending',    label: 'Pending',    icon: 'fas fa-clock',        activeClass: 'border-yellow-400 bg-yellow-50 text-yellow-700' },
        { value: 'expired',    label: 'Expired',    icon: 'fas fa-calendar-xmark', activeClass: 'border-gray-400 bg-gray-50 text-gray-700' },
        { value: 'terminated', label: 'Terminated', icon: 'fas fa-ban',          activeClass: 'border-red-400 bg-red-50 text-red-700' },
      ],
    };
  },
  computed: {
    filteredUnits() { return this.units.filter(u => u.site_id == this.form.site_id); },
  },
  methods: {
    async fetchData() {
      try {
        const [sitesRes, unitsRes, usersRes] = await Promise.all([
          this.$apiGet('/site',  { page_size: 200 }),
          this.$apiGet('/unit',  { page_size: 500 }),
          this.$apiGet('/users', { page_size: 500 }),
        ]);
        this.sites = sitesRes.data || [];
        this.units = unitsRes.data || [];
        this.users = usersRes.data || [];
      } catch (e) { console.error(e); }
    },
    onSiteChange() { this.form.unit_id = ''; },
    async submitForm() {
      this.submitting = true;
      try {
        await this.$apiPost('/rent', this.form);
        this.$emit('saved'); this.$emit('close');
      } catch (e) { console.error(e); }
      finally { this.submitting = false; }
    },
  },
  mounted() { this.fetchData(); },
};
</script>

<style scoped>
.form-label { @apply block text-xs font-medium text-gray-600 mb-1.5; }
.form-input { @apply w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors bg-white; }
</style>
