<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 text-sm max-h-[90vh] flex flex-col">
      
      <!-- Modal Header -->
      <div class="flex justify-between items-center pb-3 border-b border-gray-200 shrink-0">
        <h2 class="text-lg font-bold text-gray-800">
          {{ isEditMode ? 'Edit Company' : 'Add Company' }}
        </h2>
        <button 
          @click="$emit('close')" 
          type="button"
          class="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors text-xl leading-none"
        >
          &times;
        </button>
      </div>

      <!-- Form Content (Scrollable Area) -->
      <form @submit.prevent="submitForm" class="flex-1 overflow-y-auto py-4 pr-1 space-y-6">

        <!-- Section: General Information -->
        <div>
          <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">General Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-1 text-xs font-medium text-gray-700">Company Name *</label>
              <input 
                v-model="form.name" 
                type="text" 
                required 
                placeholder="e.g. Acme Corp"
                class="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all" 
              />
            </div>
            
            <!-- Logo File Upload Field -->
            <div>
              <label class="block mb-1 text-xs font-medium text-gray-700">Company Logo (Images only, no SVG)</label>
              <input 
                type="file" 
                accept="image/png, image/jpeg, image/jpg, image/webp, image/gif" 
                @change="handleFileUpload" 
                :required="!isEditMode && !logoPreview"
                class="w-full border border-gray-300 rounded-lg px-3.5 py-1.5 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 transition-all" 
              />
              <p v-if="uploadError" class="text-xs text-red-500 mt-1">{{ uploadError }}</p>

              <!-- Image Preview -->
              <div v-if="logoPreview" class="mt-2 flex items-center space-x-3">
                <img :src="logoPreview" alt="Logo preview" class="h-10 w-10 object-contain rounded-md border p-1 bg-gray-50" />
                <span class="text-xs text-gray-500">Current Preview</span>
              </div>
            </div>

          

            <div class="md:col-span-2">
              <label class="block mb-1 text-xs font-medium text-gray-700">Description</label>
              <textarea 
                v-model="form.description" 
                rows="3"
                placeholder="Brief summary about the company..."
                class="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all resize-y"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Section: Contact & Location -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-400">Contact & Location</h3>
            <div class="flex gap-2">
              <button 
                type="button" 
                @click="getCurrentLocation" 
                class="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border flex items-center gap-1 transition-colors"
              >
                <i class="fas fa-location-arrow text-orange-500"></i> Use Current GPS
              </button>
              <button 
                type="button" 
                @click="openMapModal" 
                class="px-2.5 py-1 text-xs bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-md border border-orange-200 flex items-center gap-1 transition-colors font-medium"
              >
                <i class="fas fa-map-marked-alt"></i> Pick from Map
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-1 text-xs font-medium text-gray-700">Official Email *</label>
              <input 
                v-model="form.official_email" 
                type="email" 
                required 
                placeholder="info@company.com"
                class="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all" 
              />
            </div>

            <div>
              <label class="block mb-1 text-xs font-medium text-gray-700">Phone</label>
              <input 
                v-model="form.phone" 
                type="tel" 
                placeholder="+1 (555) 000-0000"
                class="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all" 
              />
            </div>

            <div>
              <label class="block mb-1 text-xs font-medium text-gray-700">Website</label>
              <input 
                v-model="form.website" 
                type="url" 
                placeholder="https://company.com"
                class="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all" 
              />
            </div>

            <div>
              <label class="block mb-1 text-xs font-medium text-gray-700">Address</label>
              <input 
                v-model="form.address" 
                type="text" 
                placeholder="123 Main St, City, Country"
                class="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all" 
              />
            </div>

            <div>
              <label class="block mb-1 text-xs font-medium text-gray-700">Latitude</label>
              <input 
                v-model="form.latitude" 
                type="number" 
                step="any"
                placeholder="e.g. 37.7749"
                class="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all" 
              />
            </div>

            <div>
              <label class="block mb-1 text-xs font-medium text-gray-700">Longitude</label>
              <input 
                v-model="form.longitude" 
                type="number" 
                step="any"
                placeholder="e.g. -122.4194"
                class="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all" 
              />
            </div>
          </div>
        </div>

        <!-- Section: Social Media -->
        <div>
          <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Social Media Links</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-1 text-xs font-medium text-gray-700">Facebook</label>
              <input 
                v-model="form.facebook" 
                type="url" 
                placeholder="https://facebook.com/page"
                class="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all" 
              />
            </div>

            <div>
              <label class="block mb-1 text-xs font-medium text-gray-700">Instagram</label>
              <input 
                v-model="form.instagram" 
                type="url" 
                placeholder="https://instagram.com/handle"
                class="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all" 
              />
            </div>

            <div>
              <label class="block mb-1 text-xs font-medium text-gray-700">LinkedIn</label>
              <input 
                v-model="form.linkedin" 
                type="url" 
                placeholder="https://linkedin.com/company/page"
                class="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all" 
              />
            </div>

            <div>
              <label class="block mb-1 text-xs font-medium text-gray-700">Twitter / X</label>
              <input 
                v-model="form.twitter" 
                type="url" 
                placeholder="https://x.com/handle"
                class="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all" 
              />
            </div>

            <div class="md:col-span-2">
              <label class="block mb-1 text-xs font-medium text-gray-700">Telegram</label>
              <input 
                v-model="form.telegram" 
                type="url" 
                placeholder="https://t.me/channel"
                class="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all" 
              />
            </div>
          </div>
        </div>

        <!-- Action Buttons Footer -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button 
            type="button" 
            @click="$emit('close')" 
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg shadow-sm transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <i v-if="isSubmitting" class="fas fa-spinner fa-spin text-xs"></i>
            <span>{{ isEditMode ? 'Save Changes' : 'Create Company' }}</span>
          </button>
        </div>

      </form>
    </div>

    <!-- Map Selection Modal -->
    <div v-if="showMapModal" class="fixed inset-0 bg-black/60 z-60 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden">
        <div class="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
          <span class="font-semibold text-gray-700">Click on the map to set coordinates</span>
          <button @click="showMapModal = false" type="button" class="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
        </div>
        <div id="leaflet-map" class="w-full h-80 bg-gray-100"></div>
        <div class="flex justify-between items-center px-4 py-3 border-t bg-gray-50 text-xs text-gray-600">
          <div>Selected: <span class="font-mono text-gray-900">{{ tempLat || '-' }}, {{ tempLng || '-' }}</span></div>
          <div class="flex gap-2">
            <button @click="showMapModal = false" type="button" class="px-3 py-1.5 border rounded-md hover:bg-gray-100">Cancel</button>
            <button @click="confirmMapSelection" type="button" class="px-3 py-1.5 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600">Use Location</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "CompanyModal",
  
  props: {
    data: {
      type: Object,
      default: () => null
    }
  },

  data() {
    return {
      isSubmitting: false,
      logoFile: null,
      logoPreview: this.data?.logo || null,
      uploadError: '',
      showMapModal: false,
      map: null,
      marker: null,
      tempLat: null,
      tempLng: null,
      form: {
        name: this.data?.name || '',
        address: this.data?.address || '',
        latitude: this.data?.latitude || '',
        longitude: this.data?.longitude || '',
        phone: this.data?.phone || '',
        official_email: this.data?.official_email || '',
        website: this.data?.website || '',
        logo: this.data?.logo || '',
        facebook: this.data?.facebook || '',
        instagram: this.data?.instagram || '',
        linkedin: this.data?.linkedin || '',
        twitter: this.data?.twitter || '',
        telegram: this.data?.telegram || '',
        description: this.data?.description || '',
        owner_id: this.data?.owner_id || ''
      }
    };
  },

  computed: {
    isEditMode() {
      return Boolean(this.data && this.data.id);
    }
  },

  methods: {
    getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.form.latitude = position.coords.latitude;
            this.form.longitude = position.coords.longitude;
          },
          (error) => {
            console.warn("Geolocation access failed:", error.message);
          }
        );
      }
    },

    openMapModal() {
      this.tempLat = this.form.latitude || 0;
      this.tempLng = this.form.longitude || 0;
      this.showMapModal = true;
      this.$nextTick(() => {
        this.initLeafletMap();
      });
    },

    initLeafletMap() {
      if (!window.L) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => this.renderMap();
        document.head.appendChild(script);
      } else {
        this.renderMap();
      }
    },

    renderMap() {
      const lat = parseFloat(this.tempLat) || 0;
      const lng = parseFloat(this.tempLng) || 0;

      if (this.map) {
        this.map.remove();
      }

      this.map = window.L.map('leaflet-map').setView([lat, lng], lat && lng ? 13 : 2);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);

      if (lat && lng) {
        this.marker = window.L.marker([lat, lng]).addTo(this.map);
      }

      this.map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        this.tempLat = lat.toFixed(6);
        this.tempLng = lng.toFixed(6);

        if (this.marker) {
          this.marker.setLatLng([lat, lng]);
        } else {
          this.marker = window.L.marker([lat, lng]).addTo(this.map);
        }
      });
    },

    confirmMapSelection() {
      if (this.tempLat && this.tempLng) {
        this.form.latitude = this.tempLat;
        this.form.longitude = this.tempLng;
      }
      this.showMapModal = false;
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      this.uploadError = '';

      if (!file) {
        this.logoFile = null;
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

      if (!allowedTypes.includes(file.type) || file.type.includes('svg')) {
        this.uploadError = 'SVG files are prohibited. Please upload PNG, JPG, WEBP, or GIF images.';
        event.target.value = '';
        this.logoFile = null;
        return;
      }

      this.logoFile = file;
      this.logoPreview = URL.createObjectURL(file);
    },

    async submitForm() {
      if (this.uploadError) return;

      this.isSubmitting = true;
      try {
        let payload;
        const headers = {};

        if (this.logoFile) {
          payload = new FormData();
          Object.keys(this.form).forEach(key => {
            if (key !== 'logo') {
              payload.append(key, this.form[key]);
            }
          });
          payload.append('logo', this.logoFile);
          headers['Content-Type'] = 'multipart/form-data';
        } else {
          payload = { ...this.form };
          headers['Content-Type'] = 'application/json';
        }

        let res;
        if (this.isEditMode) {
          res = await this.$apiPut("/company", this.data.id, payload, headers);
          if (res) {
            this.$root.$refs.toast?.showToast('Company updated successfully', 'success');
          }
        } else {
          res = await this.$apiPost("/company", payload, headers);
          if (res) {
            this.$root.$refs.toast?.showToast('Company added successfully', 'success');
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
    if (!this.isEditMode && !this.form.latitude && !this.form.longitude) {
      this.getCurrentLocation();
    }
  }
};
</script>