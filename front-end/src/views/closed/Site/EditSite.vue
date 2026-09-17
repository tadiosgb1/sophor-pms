<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
    <!-- Modal container -->
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md lg:max-w-5xl p-6 text-sm my-8 flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4 border-b pb-2 shrink-0">
        <h2 class="text-xl font-semibold text-gray-800">Edit Site</h2>
        <button 
          @click="$emit('close')" 
          type="button" 
          class="text-gray-400 hover:text-gray-600 text-2xl leading-none"
        >
          &times;
        </button>
      </div>

      <!-- Form Content -->
      <form @submit.prevent="submitForm" class="flex-1 overflow-y-auto space-y-4 pr-1">
        <!-- Main Form Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Name -->
          <div>
            <label class="block mb-1 text-xs font-medium text-gray-700">Name *</label>
            <input 
              v-model="form.name" 
              type="text" 
              required
              class="border border-gray-300 rounded-lg px-3.5 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" 
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block mb-1 text-xs font-medium text-gray-700">Description *</label>
            <input 
              v-model="form.description" 
              type="text" 
              required
              class="border border-gray-300 rounded-lg px-3.5 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" 
            />
          </div>

          <!-- Site Type -->
          <div>
            <label class="block mb-1 text-xs font-medium text-gray-700">Site Type *</label>
            <input 
              v-model="form.site_type" 
              type="text" 
              required
              class="border border-gray-300 rounded-lg px-3.5 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" 
            />
          </div>

          <!-- Status -->
          <div>
            <label class="block mb-1 text-xs font-medium text-gray-700">Status *</label>
            <input 
              v-model="form.status" 
              type="text" 
              required
              class="border border-gray-300 rounded-lg px-3.5 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" 
            />
          </div>

          <!-- Country -->
          <div>
            <label class="block mb-1 text-xs font-medium text-gray-700">Country *</label>
            <input 
              v-model="form.country" 
              type="text" 
              required
              class="border border-gray-300 rounded-lg px-3.5 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" 
            />
          </div>

          <!-- State -->
          <div>
            <label class="block mb-1 text-xs font-medium text-gray-700">State *</label>
            <input 
              v-model="form.state" 
              type="text" 
              required
              class="border border-gray-300 rounded-lg px-3.5 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" 
            />
          </div>

          <!-- City -->
          <div>
            <label class="block mb-1 text-xs font-medium text-gray-700">City *</label>
            <input 
              v-model="form.city" 
              type="text" 
              required
              class="border border-gray-300 rounded-lg px-3.5 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" 
            />
          </div>

          <!-- Sub City -->
          <div>
            <label class="block mb-1 text-xs font-medium text-gray-700">Sub City *</label>
            <input 
              v-model="form.sub_city" 
              type="text" 
              required
              class="border border-gray-300 rounded-lg px-3.5 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" 
            />
          </div>

          <!-- Street -->
          <div>
            <label class="block mb-1 text-xs font-medium text-gray-700">Street *</label>
            <input 
              v-model="form.street" 
              type="text" 
              required
              class="border border-gray-300 rounded-lg px-3.5 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" 
            />
          </div>


        

          <!-- Updated By -->
     
        </div>

        <!-- Interactive Map & Coordinates Section -->
        <div class="border-t pt-4 mt-4">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Location Coordinates & Map Picker
            </h3>
            <button 
              type="button" 
              @click="fetchCurrentLocation" 
              class="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
            >
              <i class="fas fa-crosshairs"></i> Use Current Location
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3">
            <!-- Latitude Input -->
            <div>
              <label class="block mb-1 text-xs font-medium text-gray-700">Latitude *</label>
              <input 
                v-model.number="form.latitude" 
                @input="updateMapPosition"
                type="number" 
                step="any" 
                required
                placeholder="0.000000"
                class="border border-gray-300 rounded-lg px-3.5 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" 
              />
            </div>

            <!-- Longitude Input -->
            <div>
              <label class="block mb-1 text-xs font-medium text-gray-700">Longitude *</label>
              <input 
                v-model.number="form.longitude" 
                @input="updateMapPosition"
                type="number" 
                step="any" 
                required
                placeholder="0.000000"
                class="border border-gray-300 rounded-lg px-3.5 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" 
              />
            </div>
          </div>

          <!-- Leaflet Map Instance -->
          <div class="relative w-full h-56 rounded-lg border border-gray-300 overflow-hidden shadow-inner">
            <div ref="mapContainer" class="w-full h-full bg-gray-100"></div>
            <div 
              v-if="locationLoading" 
              class="absolute inset-0 bg-white/75 backdrop-blur-xs flex items-center justify-center text-xs text-gray-600 gap-2 z-[1000]"
            >
              <i class="fas fa-spinner fa-spin text-green-600"></i> Retrieving location...
            </div>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t shrink-0">
          <button 
            type="button" 
            @click="$emit('close')" 
            class="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <i v-if="isSubmitting" class="fas fa-spinner fa-spin text-xs"></i>
            <span>Edit</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "EditSiteModal",
  
  props: { 
    data: {
      type: Object,
      default: () => null
    } 
  },

  data() {
    return {
      isSubmitting: false,
      locationLoading: false,
      map: null,
      marker: null,
      form: {
        name: this.data?.name || '',
        description: this.data?.description || '',
        site_type: this.data?.site_type || '',
        status: this.data?.status || '',
        latitude: this.data?.latitude || '',
        longitude: this.data?.longitude || '',
        country: this.data?.country || '',
        state: this.data?.state || '',
        city: this.data?.city || '',
        sub_city: this.data?.sub_city || '',
        street: this.data?.street || '',
        owner_id: this.data?.owner_id || localStorage.getItem('userId'),
        created_by: this.data?.created_by || localStorage.getItem('userId'),
        updated_by: this.data?.updated_by || localStorage.getItem('userId')  // Assuming you want to set the updated_by field to the current user ID
      }
    };
  },

  async mounted() {
    await this.initMap();
    if (!this.form.latitude || !this.form.longitude) {
      this.fetchCurrentLocation();
    }
  },

  beforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  },

  methods: {
    // Inject and initialize Leaflet map
    async initMap() {
      await this.loadLeafletAssets();

      const initialLat = parseFloat(this.form.latitude) || 0;
      const initialLng = parseFloat(this.form.longitude) || 0;
      const initialZoom = (initialLat === 0 && initialLng === 0) ? 2 : 13;

      this.map = window.L.map(this.$refs.mapContainer).setView([initialLat, initialLng], initialZoom);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);

      this.marker = window.L.marker([initialLat, initialLng], { draggable: true }).addTo(this.map);

      // Event listener for dragging marker pin
      this.marker.on('dragend', (e) => {
        const { lat, lng } = e.target.getLatLng();
        this.setCoordinates(lat, lng);
      });

      // Event listener for map click
      this.map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        this.marker.setLatLng([lat, lng]);
        this.setCoordinates(lat, lng);
      });
    },

    // Lazy load Leaflet CSS and JS CDN dependencies
    loadLeafletAssets() {
      return new Promise((resolve) => {
        if (window.L) return resolve();

        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(css);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
    },

    // Fetch user current browser position
    fetchCurrentLocation() {
      if (!navigator.geolocation) {
        this.$root.$refs.toast?.showToast('Geolocation is not supported by your browser', 'error');
        return;
      }

      this.locationLoading = true;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.setCoordinates(latitude, longitude);
          if (this.map && this.marker) {
            this.map.setView([latitude, longitude], 15);
            this.marker.setLatLng([latitude, longitude]);
          }
          this.locationLoading = false;
        },
        (error) => {
          console.error("Geolocation error:", error);
          this.locationLoading = false;
          this.$root.$refs.toast?.showToast('Unable to fetch current location', 'error');
        },
        { enableHighAccuracy: true }
      );
    },

    // Form variable updater helper
    setCoordinates(lat, lng) {
      this.form.latitude = parseFloat(lat.toFixed(6));
      this.form.longitude = parseFloat(lng.toFixed(6));
    },

    // Real-time map movement on manual text input edits
    updateMapPosition() {
      const lat = parseFloat(this.form.latitude);
      const lng = parseFloat(this.form.longitude);

      if (!isNaN(lat) && !isNaN(lng) && this.map && this.marker) {
        this.marker.setLatLng([lat, lng]);
        this.map.panTo([lat, lng]);
      }
    },

    // Handles form submission
    async submitForm() {
      this.isSubmitting = true;
      try {
        const res = await this.$apiPut("/site", this.data?.id, this.form);
        if (res) {
          this.$root.$refs.toast?.showToast('Edited successfully', 'success');
        }
        this.$emit("saved");
        this.$emit("close");
      } catch (e) {
        console.error(e);
        this.$root.$refs.toast?.showToast('An error occurred during edit', 'error');
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>