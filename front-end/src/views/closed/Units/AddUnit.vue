<template>
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4" 
    @click="closeDropdowns"
  >
    <!-- Modal container: set max-height and flex-col -->
    <div 
      class="bg-white rounded-xl shadow-2xl w-full max-w-md lg:max-w-5xl max-h-[90vh] flex flex-col text-sm overflow-hidden" 
      @click.stop
    >
      <!-- Fixed Header -->
      <div class="flex justify-between items-center p-4 sm:p-6 border-b shrink-0 bg-white">
        <h2 class="text-lg sm:text-xl font-semibold text-gray-800">
          {{ isEdit ? 'Edit Unit' : 'Add Unit' }}
        </h2>
        <button 
          @click="$emit('close')" 
          type="button" 
          class="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1"
        >
          &times;
        </button>
      </div>

      <!-- Scrollable Form Content -->
      <form @submit.prevent="submitForm" class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 lg:space-y-0">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Name</label>
            <input 
              v-model="form.name" 
              type="text" 
              required
              placeholder="e.g. Apartment 4B"
              class="form-input" 
            />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Description</label>
            <input 
              v-model="form.description" 
              type="text" 
              required
              placeholder="Unit details..."
              class="form-input" 
            />
          </div>

          <!-- Searchable Site Select -->
          <div class="relative">
            <label class="block mb-1 text-sm font-medium text-gray-700">Site</label>
            <input 
              type="text" 
              v-model="siteSearch" 
              @focus="showSiteDropdown = true"
              placeholder="Search Site by name or location..."
              :disabled="isLoadingSites"
              class="form-input"
              required
            />
            <button 
              v-if="form.site_id" 
              type="button" 
              @click="clearSite" 
              class="absolute right-3 top-8 text-gray-400 hover:text-gray-600 font-bold"
            >
              &times;
            </button>

            <ul 
              v-if="showSiteDropdown && !isLoadingSites" 
              class="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
            >
              <li 
                v-for="site in filteredSites" 
                :key="site.id" 
                @click="selectSite(site)"
                class="px-4 py-2 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-0"
              >
                <div class="font-medium text-gray-800">{{ site.name }}</div>
                <div v-if="site.city || site.sub_city" class="text-xs text-gray-500">
                  {{ [site.sub_city, site.city].filter(Boolean).join(', ') }}
                </div>
              </li>
              <li v-if="filteredSites.length === 0" class="px-4 py-3 text-gray-500 text-xs text-center">
                No matching sites found
              </li>
            </ul>
          </div>

          <!-- Type Dropdown -->
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Type</label>
            <select 
              v-model="form.type_id" 
              required 
              :disabled="isLoadingTypes"
              class="form-input bg-white"
            >
              <option value="" disabled>
                {{ isLoadingTypes ? 'Loading types...' : 'Select Type' }}
              </option>
              <option 
                v-for="typeItem in types" 
                :key="typeItem.id" 
                :value="typeItem.id"
              >
                {{ typeItem.name || typeItem.title || typeItem.id }}
              </option>
            </select>
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Floor</label>
            <input 
              v-model="form.floor" 
              type="text" 
              required
              placeholder="e.g. 4"
              class="form-input" 
            />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">House Number</label>
            <input 
              v-model="form.house_number" 
              type="text" 
              required
              placeholder="e.g. 42"
              class="form-input" 
            />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Block Number</label>
            <input 
              v-model="form.block_number" 
              type="text" 
              required
              placeholder="e.g. Block A"
              class="form-input" 
            />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Bedrooms</label>
            <input 
              v-model="form.bedrooms" 
              type="number" 
              required
              placeholder="e.g. 2"
              class="form-input" 
            />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Bathrooms</label>
            <input 
              v-model="form.bathrooms" 
              type="number" 
              required
              placeholder="e.g. 1.5"
              class="form-input" 
            />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Size</label>
            <input 
              v-model="form.size" 
              type="text" 
              required
              placeholder="e.g. 850 sq ft"
              class="form-input" 
            />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Price</label>
            <input 
              v-model="form.price" 
              type="number" 
              step="any"
              required
              placeholder="e.g. 1200"
              class="form-input" 
            />
          </div>

          <!-- Searchable Manager Select -->
          <div class="relative">
            <label class="block mb-1 text-sm font-medium text-gray-700">Manager</label>
            <input 
              type="text" 
              v-model="managerSearch" 
              @focus="showManagerDropdown = true"
              placeholder="Search Manager by name or email..."
              :disabled="isLoadingUsers"
              class="form-input"
              required
            />
            <button 
              v-if="form.manager_id" 
              type="button" 
              @click="clearManager" 
              class="absolute right-3 top-8 text-gray-400 hover:text-gray-600 font-bold"
            >
              &times;
            </button>

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
            <input 
              type="text" 
              v-model="staffSearch" 
              @focus="showStaffDropdown = true"
              placeholder="Search Staff by name or email..."
              :disabled="isLoadingUsers"
              class="form-input"
              required
            />
            <button 
              v-if="form.staff_id" 
              type="button" 
              @click="clearStaff" 
              class="absolute right-3 top-8 text-gray-400 hover:text-gray-600 font-bold"
            >
              &times;
            </button>

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
        </div>

        <!-- Sticky Footer Action Buttons -->
        <div class="sticky bottom-0 bg-white pt-4 mt-6 border-t flex justify-end gap-3 shrink-0">
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
            class="px-5 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
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
      siteSearch: '',
      managerSearch: '',
      staffSearch: '',
      showSiteDropdown: false,
      showManagerDropdown: false,
      showStaffDropdown: false,

      form: {
        name: this.data?.name || '',
        description: this.data?.description || '',
        type_id: this.data?.type_id || '',
        floor: this.data?.floor || '',
        house_number: this.data?.house_number || '',
        block_number: this.data?.block_number || '',
        bedrooms: this.data?.bedrooms || '',
        bathrooms: this.data?.bathrooms || '',
        size: this.data?.size || '',
        price: this.data?.price || '',
        status: this.data?.status || 'available',
        site_id: this.data?.site_id || '',
        owner_id: this.data?.owner_id || localStorage.getItem('userId'),
        manager_id: this.data?.manager_id || '',
        staff_id: this.data?.staff_id || '',
        created_by: this.data?.created_by || '',
        updated_by: this.data?.updated_by || ''
      }
    };
  },

  computed: {
    isEdit() {
      return Boolean(this.data && this.data.id);
    },

    filteredSites() {
      if (!this.siteSearch) return this.sites;
      const query = this.siteSearch.toLowerCase();
      return this.sites.filter(site => {
        const name = (site.name || '').toLowerCase();
        const city = (site.city || '').toLowerCase();
        const subCity = (site.sub_city || '').toLowerCase();
        return name.includes(query) || city.includes(query) || subCity.includes(query);
      });
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

    selectSite(site) {
      this.form.site_id = site.id;
      this.siteSearch = `${site.name}${site.city ? ` (${site.city})` : ''}`;
      this.showSiteDropdown = false;
    },

    clearSite() {
      this.form.site_id = '';
      this.siteSearch = '';
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
      this.showSiteDropdown = false;
      this.showManagerDropdown = false;
      this.showStaffDropdown = false;
    },

    async fetchSites() {
      this.isLoadingSites = true;
      try {
        const res = await this.$apiGet("/site");
        if (res) {
          this.sites = Array.isArray(res) ? res : (res.data || []);
          
          if (this.form.site_id) {
            const initialSite = this.sites.find(s => s.id === this.form.site_id);
            if (initialSite) this.selectSite(initialSite);
          }
        }
      } catch (e) {
        console.error("Failed to fetch sites:", e);
      } finally {
        this.isLoadingSites = false;
      }
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

    async submitForm() {
      if (!this.form.site_id) {
        this.$root.$refs.toast?.showToast('Please select a valid Site.', 'error');
        return;
      }

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
    this.fetchSites();
    this.fetchUsers();
    this.fetchTypes();
  }
}
</script>

<style scoped>
.form-input {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
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