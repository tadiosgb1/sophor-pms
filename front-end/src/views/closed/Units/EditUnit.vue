<template>
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6 overflow-y-auto"
    @click="closeDropdowns"
  >
    <!-- Modal Container -->
    <div 
      class="bg-white rounded-xl shadow-2xl w-full max-w-lg lg:max-w-4xl max-h-[90vh] flex flex-col my-auto overflow-hidden text-sm"
      @click.stop
    >
      <!-- Fixed Header -->
      <div class="flex justify-between items-center px-6 py-4 border-b border-gray-100 shrink-0">
        <h2 class="text-lg sm:text-xl font-semibold text-gray-800">
          {{ isEdit ? 'Edit Unit' : 'Add Unit' }}
        </h2>
        <button 
          @click="$emit('close')" 
          type="button" 
          class="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors"
        >
          &times;
        </button>
      </div>

      <!-- Scrollable Form -->
      <form @submit.prevent="submitForm" class="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Name -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Name</label>
          <input 
            v-model.trim="form.name" 
            type="text" 
            required
            placeholder="e.g. Apartment 4B"
            class="form-input" 
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Description</label>
          <input 
            v-model.trim="form.description" 
            type="text" 
            placeholder="Unit details..."
            class="form-input" 
          />
        </div>

        <!-- Type Dropdown (Dynamic) -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Type</label>
          <select 
            v-model="form.type_id" 
            required 
            :disabled="isLoadingTypes"
            class="form-input bg-white disabled:bg-gray-50"
          >
            <option value="" disabled>
              {{ isLoadingTypes ? 'Loading types...' : 'Select Type' }}
            </option>
            <option 
              v-for="typeItem in types" 
              :key="typeItem.id" 
              :value="typeItem.id"
            >
              {{ typeItem.name || typeItem.title || typeItem.label || `Type #${typeItem.id}` }}
            </option>
          </select>
        </div>

        <!-- Site Dropdown (Dynamic) -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Site</label>
          <select 
            v-model="form.site_id" 
            required 
            :disabled="isLoadingSites"
            class="form-input bg-white disabled:bg-gray-50"
          >
            <option value="" disabled>
              {{ isLoadingSites ? 'Loading sites...' : 'Select Site' }}
            </option>
            <option 
              v-for="site in sites" 
              :key="site.id" 
              :value="site.id"
            >
              {{ site.name || site.title || `Site #${site.id}` }}
            </option>
          </select>
        </div>

        <!-- Floor -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Floor</label>
          <input 
            v-model.number="form.floor" 
            type="number" 
            required
            placeholder="e.g. 4"
            class="form-input" 
          />
        </div>

        <!-- House Number -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">House Number</label>
          <input 
            v-model.trim="form.house_number" 
            type="text" 
            required
            placeholder="e.g. 42"
            class="form-input" 
          />
        </div>

        <!-- Block Number -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Block Number</label>
          <input 
            v-model.trim="form.block_number" 
            type="text" 
            placeholder="e.g. Block A"
            class="form-input" 
          />
        </div>

        <!-- Bedrooms -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Bedrooms</label>
          <input 
            v-model.number="form.bedrooms" 
            type="number" 
            min="0"
            required
            placeholder="e.g. 2"
            class="form-input" 
          />
        </div>

        <!-- Bathrooms -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Bathrooms</label>
          <input 
            v-model.number="form.bathrooms" 
            type="number" 
            step="0.5"
            min="0"
            required
            placeholder="e.g. 1.5"
            class="form-input" 
          />
        </div>

        <!-- Size -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Size (sq ft)</label>
          <input 
            v-model.number="form.size" 
            type="number" 
            step="any"
            required
            placeholder="e.g. 850"
            class="form-input" 
          />
        </div>

        <!-- Price -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Price</label>
          <input 
            v-model.number="form.price" 
            type="number" 
            step="any"
            required
            placeholder="e.g. 1200"
            class="form-input" 
          />
        </div>

        <!-- Status Dropdown -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Status</label>
          <select v-model="form.status" required class="form-input bg-white">
            <option value="" disabled>Select Status</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Reserved">Reserved</option>
          </select>
        </div>

        <!-- Searchable Manager Select -->
        <div class="relative">
          <label class="block mb-1 text-sm font-medium text-gray-700">Manager</label>
          <div class="relative">
            <input 
              type="text" 
              v-model="managerSearch" 
              @focus="showManagerDropdown = true"
              placeholder="Search Manager..."
              :disabled="isLoadingUsers"
              class="form-input pr-8"
              required
            />
            <button 
              v-if="form.manager_id" 
              type="button" 
              @click="clearManager" 
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold text-lg"
            >
              &times;
            </button>
          </div>

          <ul 
            v-if="showManagerDropdown && !isLoadingUsers" 
            class="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
          >
            <li 
              v-for="user in filteredManagers" 
              :key="user.id" 
              @click="selectManager(user)"
              class="px-4 py-2 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-0"
            >
              <div class="font-medium text-gray-800">{{ getUserFullName(user) }}</div>
              <div v-if="user.email" class="text-xs text-gray-500">{{ user.email }}</div>
            </li>
            <li v-if="filteredManagers.length === 0" class="px-4 py-3 text-gray-500 text-xs text-center">
              No matching users found
            </li>
          </ul>
        </div>

        <!-- Searchable Staff Select -->
        <div class="relative">
          <label class="block mb-1 text-sm font-medium text-gray-700">Staff</label>
          <div class="relative">
            <input 
              type="text" 
              v-model="staffSearch" 
              @focus="showStaffDropdown = true"
              placeholder="Search Staff..."
              :disabled="isLoadingUsers"
              class="form-input pr-8"
              required
            />
            <button 
              v-if="form.staff_id" 
              type="button" 
              @click="clearStaff" 
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold text-lg"
            >
              &times;
            </button>
          </div>

          <ul 
            v-if="showStaffDropdown && !isLoadingUsers" 
            class="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
          >
            <li 
              v-for="user in filteredStaff" 
              :key="user.id" 
              @click="selectStaff(user)"
              class="px-4 py-2 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-0"
            >
              <div class="font-medium text-gray-800">{{ getUserFullName(user) }}</div>
              <div v-if="user.email" class="text-xs text-gray-500">{{ user.email }}</div>
            </li>
            <li v-if="filteredStaff.length === 0" class="px-4 py-3 text-gray-500 text-xs text-center">
              No matching users found
            </li>
          </ul>
        </div>

        <!-- Fixed Footer Actions -->
        <div class="col-span-1 md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
          <button 
            type="button" 
            @click="$emit('close')" 
            class="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="px-5 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ isEdit ? 'Save Changes' : 'Add Unit' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "UnitModal",

  props: { 
    data: {
      type: Object,
      default: () => null
    }
  },

  data() {
    return {
      users: [],
      types: [],
      sites: [],
      isLoadingUsers: false,
      isLoadingTypes: false,
      isLoadingSites: false,
      isSubmitting: false,

      // Search controls
      managerSearch: '',
      staffSearch: '',
      showManagerDropdown: false,
      showStaffDropdown: false,

      form: {
        name: this.data?.name || '',
        description: this.data?.description || '',
        type_id: this.data?.type_id || '',
        site_id: this.data?.site_id || '',
        floor: this.data?.floor ?? '',
        house_number: this.data?.house_number || '',
        block_number: this.data?.block_number || '',
        bedrooms: this.data?.bedrooms ?? '',
        bathrooms: this.data?.bathrooms ?? '',
        size: this.data?.size ?? '',
        price: this.data?.price ?? '',
        status: this.data?.status || 'Available',
        owner_id: this.data?.owner_id || localStorage.getItem("userId"),
        manager_id: this.data?.manager_id || '',
        staff_id: this.data?.staff_id || '',
        created_by: this.data?.created_by || localStorage.getItem("userId"),
        updated_by: this.data?.updated_by || localStorage.getItem("userId")
      }
    };
  },

  computed: {
    isEdit() {
      return Boolean(this.data && this.data.id);
    },

    filteredManagers() {
      if (!this.managerSearch) return this.users;
      const query = this.managerSearch.toLowerCase();
      return this.users.filter(user => {
        const fullName = this.getUserFullName(user).toLowerCase();
        const email = (user.email || '').toLowerCase();
        return fullName.includes(query) || email.includes(query);
      });
    },

    filteredStaff() {
      if (!this.staffSearch) return this.users;
      const query = this.staffSearch.toLowerCase();
      return this.users.filter(user => {
        const fullName = this.getUserFullName(user).toLowerCase();
        const email = (user.email || '').toLowerCase();
        return fullName.includes(query) || email.includes(query);
      });
    }
  },

  methods: {
    getUserFullName(user) {
      if (!user) return '';
      if (user.first_name || user.last_name) {
        return `${user.first_name || ''} ${user.last_name || ''}`.trim();
      }
      return user.name || user.full_name || user.username || `User #${user.id}`;
    },

    selectManager(user) {
      this.form.manager_id = user.id;
      this.managerSearch = `${this.getUserFullName(user)}${user.email ? ` (${user.email})` : ''}`;
      this.showManagerDropdown = false;
    },

    clearManager() {
      this.form.manager_id = '';
      this.managerSearch = '';
    },

    selectStaff(user) {
      this.form.staff_id = user.id;
      this.staffSearch = `${this.getUserFullName(user)}${user.email ? ` (${user.email})` : ''}`;
      this.showStaffDropdown = false;
    },

    clearStaff() {
      this.form.staff_id = '';
      this.staffSearch = '';
    },

    closeDropdowns() {
      this.showManagerDropdown = false;
      this.showStaffDropdown = false;
    },

    async fetchUsers() {
      this.isLoadingUsers = true;
      try {
        const res = await this.$apiGet("/users");
        if (res) {
          this.users = Array.isArray(res) ? res : (res.data || []);
          
          if (this.form.manager_id) {
            const initialManager = this.users.find(u => u.id === this.form.manager_id);
            if (initialManager) this.selectManager(initialManager);
          }
          if (this.form.staff_id) {
            const initialStaff = this.users.find(u => u.id === this.form.staff_id);
            if (initialStaff) this.selectStaff(initialStaff);
          }
        }
      } catch (e) {
        console.error("Failed to fetch users:", e);
      } finally {
        this.isLoadingUsers = false;
      }
    },
    async fetchTypes() {
      this.isLoadingTypes = true;
      try {
        const res = await this.$apiGet("/type");
        if (res) {
          this.types = Array.isArray(res) ? res : (res.data || []);
        }
      } catch (e) {
        console.error("Failed to fetch types:", e);
      } finally {
        this.isLoadingTypes = false;
      }
    },

    async fetchSites() {
      this.isLoadingSites = true;
      try {
        const res = await this.$apiGet("/site");
        if (res) {
          this.sites = Array.isArray(res) ? res : (res.data || []);
        }
      } catch (e) {
        console.error("Failed to fetch sites:", e);
      } finally {
        this.isLoadingSites = false;
      }
    },

    async submitForm() {
      if (!this.form.manager_id || !this.form.staff_id) {
        this.$root.$refs.toast?.showToast('Please select a valid Manager and Staff member.', 'error');
        return;
      }

      this.isSubmitting = true;
      try {
        let res;
        if (this.isEdit) {
          res = await this.$apiPut("/unit", this.data.id, this.form);
          if (res) {
            this.$root.$refs.toast?.showToast('Edited successfully', 'success');
          }
        } else {
          res = await this.$apiPost("/unit", this.form);
          if (res) {
            this.$root.$refs.toast?.showToast('Added successfully', 'success');
          }
        }
        this.$emit("saved");
        this.$emit("close");
      } catch (e) { 
        console.error("Submit error:", e);
        this.$root.$refs.toast?.showToast('An error occurred. Please try again.', 'error');
      } finally {
        this.isSubmitting = false;
      }
    }
  },

  mounted() {
    this.fetchUsers();
    this.fetchTypes();
    this.fetchSites();
  }
}
</script>

<style scoped>
.form-input {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  width: 100%;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 150ms ease-in-out;
}

.form-input:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px #22c55e;
}
</style>