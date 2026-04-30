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
            <h2 class="font-semibold text-gray-800">Edit Maintenance Request</h2>
            <p class="text-xs text-gray-400">Update the request details</p>
          </div>
        </div>
        <button @click="$emit('close')"
          class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 text-lg leading-none">
          &times;
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="px-6 py-5 space-y-4 max-h-[72vh] overflow-y-auto">

        <!-- Title -->
        <div>
          <label class="form-label">Title <span class="text-red-400">*</span></label>
          <input v-model="form.title" type="text" required class="form-input" />
        </div>

        <!-- Category -->
        <div>
          <label class="form-label">Category <span class="text-red-400">*</span></label>
          <div class="grid grid-cols-4 gap-2">
            <button v-for="cat in categoryOptions" :key="cat.value" type="button"
              @click="form.category = cat.value"
              :class="['flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 transition-all text-xs font-medium',
                form.category === cat.value ? cat.activeClass : 'border-gray-200 text-gray-500 hover:border-gray-300']">
              <i :class="[cat.icon, 'text-sm']"></i>
              <span class="text-[10px]">{{ cat.label }}</span>
            </button>
          </div>
        </div>

        <!-- Priority -->
        <div>
          <label class="form-label">Priority <span class="text-red-400">*</span></label>
          <div class="grid grid-cols-4 gap-2">
            <button v-for="p in priorityOptions" :key="p.value" type="button"
              @click="form.priority = p.value"
              :class="['flex items-center justify-center gap-1.5 py-2 rounded-xl border-2 transition-all text-xs font-medium',
                form.priority === p.value ? p.activeClass : 'border-gray-200 text-gray-500 hover:border-gray-300']">
              <span :class="p.dot" class="w-2 h-2 rounded-full shrink-0"></span>
              {{ p.label }}
            </button>
          </div>
        </div>

        <!-- Status -->
        <div>
          <label class="form-label">Status</label>
          <div class="grid grid-cols-4 gap-2">
            <button v-for="s in statusOptions" :key="s.value" type="button"
              @click="form.status = s.value"
              :class="['flex items-center justify-center gap-1.5 py-2 rounded-xl border-2 transition-all text-xs font-medium',
                form.status === s.value ? s.activeClass : 'border-gray-200 text-gray-500 hover:border-gray-300']">
              <i :class="[s.icon, 'text-[10px]']"></i>
              {{ s.label }}
            </button>
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="form-label">Description</label>
          <textarea v-model="form.description" rows="3" class="form-input resize-none"></textarea>
        </div>

        <!-- Site + Unit -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="form-label">Site</label>
            <select v-model="form.site_id" @change="form.unit_id=''" class="form-input">
              <option value="">Select site</option>
              <option v-for="s in sites" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
          <div>
            <label class="form-label">Unit</label>
            <select v-model="form.unit_id" class="form-input" :disabled="!form.site_id">
              <option value="">Site-level</option>
              <option v-for="u in filteredUnits" :key="u.id" :value="u.id">{{ u.name }}</option>
            </select>
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label class="form-label">Internal Notes</label>
          <textarea v-model="form.notes" rows="2" class="form-input resize-none"></textarea>
        </div>

      </form>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
        <button type="button" @click="$emit('close')"
          class="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
          Cancel
        </button>
        <button @click="submitForm" :disabled="submitting"
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
    return {
      form: {
        title:       this.data?.title       || '',
        category:    this.data?.category    || '',
        priority:    this.data?.priority    || 'medium',
        status:      this.data?.status      || 'pending',
        description: this.data?.description || '',
        site_id:     this.data?.site_id     || '',
        unit_id:     this.data?.unit_id     || '',
        notes:       this.data?.notes       || '',
        updated_by:  parseInt(localStorage.getItem('userId')) || null,
      },
      sites: [], units: [], submitting: false,
      categoryOptions: [
        { value: 'Plumbing',   label: 'Plumbing',   icon: 'fas fa-faucet',        activeClass: 'border-blue-400 bg-blue-50 text-blue-600' },
        { value: 'Electrical', label: 'Electrical', icon: 'fas fa-bolt',          activeClass: 'border-yellow-400 bg-yellow-50 text-yellow-600' },
        { value: 'HVAC',       label: 'HVAC',       icon: 'fas fa-wind',          activeClass: 'border-teal-400 bg-teal-50 text-teal-600' },
        { value: 'Structural', label: 'Structural', icon: 'fas fa-building',      activeClass: 'border-orange-400 bg-orange-50 text-orange-600' },
        { value: 'Cosmetic',   label: 'Cosmetic',   icon: 'fas fa-paint-roller',  activeClass: 'border-pink-400 bg-pink-50 text-pink-600' },
        { value: 'Appliance',  label: 'Appliance',  icon: 'fas fa-blender',       activeClass: 'border-purple-400 bg-purple-50 text-purple-600' },
        { value: 'Security',   label: 'Security',   icon: 'fas fa-shield-halved', activeClass: 'border-red-400 bg-red-50 text-red-600' },
        { value: 'Other',      label: 'Other',      icon: 'fas fa-ellipsis',      activeClass: 'border-gray-400 bg-gray-50 text-gray-600' },
      ],
      priorityOptions: [
        { value: 'low',    label: 'Low',    dot: 'bg-gray-400',   activeClass: 'border-gray-400 bg-gray-50 text-gray-700' },
        { value: 'medium', label: 'Medium', dot: 'bg-yellow-400', activeClass: 'border-yellow-400 bg-yellow-50 text-yellow-700' },
        { value: 'high',   label: 'High',   dot: 'bg-orange-500', activeClass: 'border-orange-400 bg-orange-50 text-orange-700' },
        { value: 'urgent', label: 'Urgent', dot: 'bg-red-500',    activeClass: 'border-red-400 bg-red-50 text-red-700' },
      ],
      statusOptions: [
        { value: 'pending',     label: 'Pending',     icon: 'fas fa-clock',        activeClass: 'border-yellow-400 bg-yellow-50 text-yellow-700' },
        { value: 'in_progress', label: 'In Progress', icon: 'fas fa-spinner',      activeClass: 'border-blue-400 bg-blue-50 text-blue-700' },
        { value: 'resolved',    label: 'Resolved',    icon: 'fas fa-circle-check', activeClass: 'border-green-400 bg-green-50 text-green-700' },
        { value: 'rejected',    label: 'Rejected',    icon: 'fas fa-ban',          activeClass: 'border-red-400 bg-red-50 text-red-700' },
      ],
    };
  },
  computed: {
    filteredUnits() { return this.units.filter(u => u.site_id == this.form.site_id); },
  },
  methods: {
    async fetchSites() {
      try { const r = await this.$apiGet('/site', { page_size: 200 }); this.sites = r.data || []; } catch (e) { console.error(e); }
    },
    async fetchUnits() {
      try { const r = await this.$apiGet('/unit', { page_size: 500 }); this.units = r.data || []; } catch (e) { console.error(e); }
    },
    async submitForm() {
      this.submitting = true;
      try {
        await this.$apiPut('/maintenance', this.data.id, this.form);
        this.$emit('saved'); this.$emit('close');
      } catch (e) { console.error(e); }
      finally { this.submitting = false; }
    },
  },
  mounted() { this.fetchSites(); this.fetchUnits(); },
};
</script>

<style scoped>
.form-label { @apply block text-xs font-medium text-gray-600 mb-1.5; }
.form-input { @apply w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors bg-white; }
</style>
