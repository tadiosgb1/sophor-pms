<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md text-sm overflow-hidden">

      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-500">
            <i class="fas fa-user-plus text-sm"></i>
          </div>
          <div>
            <h2 class="font-semibold text-gray-800">Assign Request</h2>
            <p class="text-xs text-gray-400 truncate max-w-[220px]">{{ data?.title }}</p>
          </div>
        </div>
        <button @click="$emit('close')"
          class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 text-lg leading-none">
          &times;
        </button>
      </div>

      <!-- Body -->
      <div class="px-6 py-5 space-y-4">

        <!-- Current assignee -->
        <div v-if="data?.assignee" class="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl p-3">
          <div class="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
            {{ data.assignee.first_name?.[0] }}{{ data.assignee.last_name?.[0] }}
          </div>
          <div>
            <p class="text-xs text-blue-600 font-medium">Currently assigned to</p>
            <p class="text-sm font-semibold text-blue-800">{{ data.assignee.first_name }} {{ data.assignee.last_name }}</p>
          </div>
        </div>

        <!-- Assign to -->
        <div>
          <label class="form-label">Assign to <span class="text-red-400">*</span></label>
          <select v-model="assignedTo" required class="form-input">
            <option value="">Select staff or manager</option>
            <optgroup label="Managers">
              <option v-for="u in managers" :key="u.id" :value="u.id">
                {{ u.first_name }} {{ u.last_name }}
              </option>
            </optgroup>
            <optgroup label="Staff">
              <option v-for="u in staff" :key="u.id" :value="u.id">
                {{ u.first_name }} {{ u.last_name }}
              </option>
            </optgroup>
          </select>
        </div>

        <!-- Status update -->
        <div>
          <label class="form-label">Update Status</label>
          <select v-model="newStatus" class="form-input">
            <option value="">Keep current ({{ data?.status }})</option>
            <option value="in_progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <!-- Notes -->
        <div>
          <label class="form-label">Assignment Note <span class="text-xs text-gray-400">(optional)</span></label>
          <textarea v-model="note" rows="2" placeholder="Add a note for the assignee…"
            class="form-input resize-none"></textarea>
        </div>

      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
        <button type="button" @click="$emit('close')"
          class="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
          Cancel
        </button>
        <button @click="submitAssign" :disabled="submitting || !assignedTo"
          class="px-5 py-2 text-sm bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
          <i v-if="submitting" class="fas fa-spinner fa-spin text-xs"></i>
          <i v-else class="fas fa-user-check text-xs"></i>
          Assign
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
      assignedTo: this.data?.assigned_to || '',
      newStatus: '',
      note: '',
      users: [],
      submitting: false,
    };
  },
  computed: {
    managers() { return this.users.filter(u => u.Roles?.some(r => r.name === 'Manager')); },
    staff()    { return this.users.filter(u => u.Roles?.some(r => r.name === 'Staff')); },
  },
  methods: {
    async fetchUsers() {
      try {
        const res = await this.$apiGet('/users', { page_size: 200 });
        this.users = res.data || [];
      } catch (e) { console.error(e); }
    },
    async submitAssign() {
      this.submitting = true;
      try {
        const payload = {
          assigned_to: this.assignedTo,
          updated_by: parseInt(localStorage.getItem('userId')) || null,
        };
        if (this.newStatus) payload.status = this.newStatus;
        if (this.note) payload.notes = this.note;

        await this.$apiPatch('/maintenance', this.data.id, payload);
        this.$emit('saved');
        this.$emit('close');
      } catch (e) { console.error(e); }
      finally { this.submitting = false; }
    },
  },
  mounted() { this.fetchUsers(); },
};
</script>

<style scoped>
.form-label { @apply block text-xs font-medium text-gray-600 mb-1.5; }
.form-input { @apply w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-colors bg-white; }
</style>
