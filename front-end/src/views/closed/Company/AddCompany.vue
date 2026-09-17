<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col text-sm relative">
      
      <div class="flex justify-between items-center px-6 py-4 border-b shrink-0">
        <h2 class="text-lg font-semibold text-gray-800">
          {{ isEdit ? 'Edit Company' : 'Add Company' }}
        </h2>
        <button 
          @click="$emit('close')" 
          class="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
        >
          &times;
        </button>
      </div>

      <form @submit.prevent="submitForm" class="flex flex-col flex-1 overflow-y-auto">
        <div class="p-6 space-y-4">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block mb-1 text-sm font-medium text-gray-700">Company Name</label>
              <input v-model="form.name" type="text" required class="form-input" />
            </div>

            <div class="md:col-span-2">
              <label class="block mb-1 text-sm font-medium text-gray-700">Address</label>
              <input v-model="form.address" type="text" required class="form-input" />
            </div>

            <div class="md:col-span-2 flex items-center justify-between border-b pb-2 mt-2">
              <span class="font-medium text-gray-700">Coordinates</span>
              <div class="flex gap-2">
                <button 
                  type="button" 
                  @click="getCurrentLocation" 
                  class="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border flex items-center gap-1 transition-colors"
                >
                  <i class="fas fa-location-arrow text-green-600"></i> Use Current GPS
                </button>
                <button 
                  type="button" 
                  @click="openMapModal" 
                  class="px-2.5 py-1 text-xs bg-green-50 hover:bg-green-100 text-green-700 rounded-md border border-green-200 flex items-center gap-1 transition-colors font-medium"
                >
                  <i class="fas fa-map-marked-alt"></i> Pick from Map
                </button>
              </div>
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Latitude</label>
              <input v-model="form.latitude" type="number" step="any" required class="form-input" />
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Longitude</label>
              <input v-model="form.longitude" type="number" step="any" required class="form-input" />
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Phone</label>
              <input v-model="form.phone" type="tel" required class="form-input" />
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Official Email</label>
              <input v-model="form.official_email" type="email" required class="form-input" />
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Website</label>
              <input v-model="form.website" type="url" required class="form-input" />
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Company Logo (Images only, no SVG)</label>
              <input 
                type="file" 
                accept="image/png, image/jpeg, image/jpg, image/webp, image/gif" 
                @change="handleFileUpload" 
                :required="!isEdit && !logoPreview" 
                class="form-input file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" 
              />
              <p v-if="uploadError" class="text-xs text-red-500 mt-1">{{ uploadError }}</p>

              <div v-if="logoPreview" class="mt-2 flex items-center space-x-3">
                <img :src="logoPreview" alt="Logo preview" class="h-12 w-12 object-contain rounded-md border p-1 bg-gray-50" />
                <span class="text-xs text-gray-500">Current Logo</span>
              </div>
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Facebook</label>
              <input v-model="form.facebook" type="text" class="form-input" />
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Instagram</label>
              <input v-model="form.instagram" type="text" class="form-input" />
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">LinkedIn</label>
              <input v-model="form.linkedin" type="text" class="form-input" />
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Twitter</label>
              <input v-model="form.twitter" type="text" class="form-input" />
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Telegram</label>
              <input v-model="form.telegram" type="text" class="form-input" />
            </div>

            <div class="md:col-span-2">
              <label class="block mb-1 text-sm font-medium text-gray-700">Description</label>
              <textarea v-model="form.description" rows="3" required class="form-input resize-y"></textarea>
            </div>
          </div>

        </div>

        <div class="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t shrink-0">
          <button 
            type="button" 
            @click="$emit('close')" 
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium shadow-sm"
          >
            {{ isEdit ? 'Save Changes' : 'Add Company' }}
          </button>
        </div>
      </form>

    </div>

    <div v-if="showMapModal" class="fixed inset-0 bg-black/60 z-60 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden">
        <div class="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
          <span class="font-semibold text-gray-700">Click on the map to set coordinates</span>
          <button @click="showMapModal = false" class="text-gray-400 hover:text-gray-600 text-lg">&times;</button>
        </div>
        <div id="leaflet-map" class="w-full h-80 bg-gray-100"></div>
        <div class="flex justify-between items-center px-4 py-3 border-t bg-gray-50 text-xs text-gray-600">
          <div>Selected: <span class="font-mono text-gray-900">{{ tempLat || '-' }}, {{ tempLng || '-' }}</span></div>
          <div class="flex gap-2">
            <button @click="showMapModal = false" type="button" class="px-3 py-1.5 border rounded-md">Cancel</button>
            <button @click="confirmMapSelection" type="button" class="px-3 py-1.5 bg-green-600 text-white rounded-md font-medium">Use Location</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { 
    data: {
      type: Object,
      default: null
    } 
  },
  data() {
    return {
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
        owner_id: this.data?.owner_id || localStorage.getItem("userId"),
        created_by: this.data?.created_by || localStorage.getItem("userId"),
        updated_by: localStorage.getItem("userId")
      }
    };
  },
  computed: {
    isEdit() {
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
            console.warn("Geolocation access denied/failed:", error.message);
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
      // Load Leaflet dynamically if not loaded
      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
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

      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif'
      ];

      if (!allowedTypes.includes(file.type) || file.type.includes('svg')) {
        this.uploadError = 'SVG files and non-image formats are strictly prohibited. Please upload JPG, PNG, WEBP, or GIF.';
        event.target.value = '';
        this.logoFile = null;
        return;
      }

      this.logoFile = file;
      this.logoPreview = URL.createObjectURL(file);
    },

    async submitForm() {
      if (this.uploadError) return;

      try {
        let payload;

        if (this.logoFile) {
          payload = new FormData();
          Object.keys(this.form).forEach(key => {
            if (key !== 'logo') {
              payload.append(key, this.form[key]);
            }
          });
          payload.append('logo', this.logoFile);
        } else {
          payload = { ...this.form };
        }

        let res;
        const headers = this.logoFile ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' };
        if (!this.isEdit) {
          res = await this.$apiPost("/company", payload, headers);
          if (res) {
            this.$root.$refs.toast?.showToast('Added successfully', 'success');
          }
        } else {
          res = await this.$apiPut("/company", this.data.id, payload, headers);
          if (res) {
            this.$root.$refs.toast?.showToast('Edited successfully', 'success');
          }
        }
        this.$emit("saved");
        this.$emit("close");
      } catch (e) { 
        console.error("submitForm error:", e); 
      }
    }
  },
  mounted() {
    // Automatically set current GPS location if creating a new entry without pre-filled coordinates
    if (!this.isEdit && !this.form.latitude && !this.form.longitude) {
      this.getCurrentLocation();
    }
  }
}
</script>

<style scoped>
@reference "tailwindcss";

.form-input {
  @apply border border-gray-300 rounded-lg px-3.5 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-150 text-gray-800;
}
</style>