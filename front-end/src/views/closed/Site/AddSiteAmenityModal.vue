<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md text-sm overflow-hidden">

      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-500">
            <i class="fas fa-star text-sm"></i>
          </div>
          <div>
            <h2 class="font-semibold text-gray-800">Add Amenity to Site</h2>
            <p class="text-xs text-gray-400">Select amenities to assign</p>
          </div>
        </div>
        <button @click="$emit('close')"
          class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 text-lg leading-none">&times;</button>
      </div>

      <!-- Body -->
      <div class="px-6 py-5 max-h-[60vh] overflow-y-auto">
        <div v-if="loadingAmenities" class="text-center py-6 text-gray-400 text-xs">
          <i class="fas fa-spinner fa-spin mr-2"></i> Loading amenities…
        </div>
        <div v-else-if="availableAmenities.length === 0" class="text-center py-6 text-gray-400 text-xs italic">
          All amenities are already assigned to this site.
        </div>
        <div v-else class="grid grid-cols-2 gap-2">
          <button v-for="amenity in availableAmenities" :key="amenity.id"
            type="button"
            @click="toggleAmenity(amenity.id)"
            :class="[
              'flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all text-xs font-medium text-left',
              selected.includes(amenity.id)
                ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                : 'border-gray-200 text-gray-600 hover:border-yellow-300'
            ]">
            <div :class="selected.includes(amenity.id) ? 'bg-yellow-400' : 'bg-gray-200'"
              class="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors">
              <i v-if="selected.includes(amenity.id)" class="fas fa-check text-white text-[8px]"></i>
            </div>
            {{ amenity.name }}
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
        <span class="text-xs text-gray-400">{{ selected.length }} selected</span>
        <div class="flex gap-3">
          <button type="button" @click="$emit('close')"
            class="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100">Cancel</button>
          <button @click="submitAssign" :disabled="submitting || selected.length === 0"
            class="px-5 py-2 text-sm bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg font-medium flex items-center gap-2">
            <i v-if="submitting" class="fas fa-spinner fa-spin text-xs"></i>
            <i v-else class="fas fa-plus text-xs"></i>
            Assign
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    siteId: { type: [Number, String], required: true },
    existing: { type: Array, default: () => [] },
  },
  data() {
    return {
      allAmenities: [],
      selected: [],
      loadingAmenities: false,
      submitting: false,
    };
  },
  computed: {
    existingIds() {
      return this.existing.map(sa => sa.amenity_id);
    },
    availableAmenities() {
      return this.allAmenities.filter(a => !this.existingIds.includes(a.id));
    },
  },
  methods: {
    toggleAmenity(id) {
      if (this.selected.includes(id)) {
        this.selected = this.selected.filter(i => i !== id);
      } else {
        this.selected.push(id);
      }
    },
    async fetchAmenities() {
      this.loadingAmenities = true;
      try {
        const res = await this.$apiGet('/amenity', { page_size: 200 });
        this.allAmenities = res.data || [];
      } catch (e) { console.error(e); }
      finally { this.loadingAmenities = false; }
    },
    async submitAssign() {
      this.submitting = true;
      try {
        const userId = parseInt(localStorage.getItem('userId')) || null;
        for (const amenityId of this.selected) {
          await this.$apiPost('/siteamenity', {
            site_id:    this.siteId,
            amenity_id: amenityId,
            owner_id:   userId,
            created_by: userId,
          });
        }
        this.$emit('saved');
        this.$emit('close');
      } catch (e) { console.error(e); }
      finally { this.submitting = false; }
    },
  },
  mounted() { this.fetchAmenities(); },
};
</script>
