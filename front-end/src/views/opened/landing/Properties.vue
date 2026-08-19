<template>
  <div class="min-h-screen font-sans">
    <LandingNavbar />

    <!-- Page Hero -->
    <section class="relative pt-32 pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden" 
      v-motion :initial="{ opacity: 0 }" :visible="{ opacity: 1, transition: { duration: 800 } }">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full translate-x-1/2 -translate-y-1/2"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span class="text-primary font-semibold text-sm uppercase tracking-widest" 
          v-motion :initial="{ opacity: 0, y: 20 }" :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }">Our Portfolio</span>
        <h1 class="text-4xl lg:text-5xl font-black text-white mt-3 mb-4" 
          v-motion :initial="{ opacity: 0, y: 30 }" :visible="{ opacity: 1, y: 0, transition: { duration: 600, delay: 100 } }">Browse Properties</h1>
        <p class="text-gray-300 max-w-xl mx-auto" 
          v-motion :initial="{ opacity: 0, y: 20 }" :visible="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }">
          Find your perfect property from our curated selection of premium listings for sale and rent.
        </p>
        <div class="flex items-center justify-center gap-2 mt-5 text-sm text-gray-400" 
          v-motion :initial="{ opacity: 0 }" :visible="{ opacity: 1, transition: { duration: 600, delay: 300 } }">
          <router-link to="/" class="hover:text-primary transition-colors">Home</router-link>
          <i class="fas fa-chevron-right text-xs"></i>
          <span class="text-primary">Properties</span>
        </div>
      </div>
    </section>

    <!-- Filters -->
    <section class="bg-white shadow-md sticky top-16 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-wrap gap-3 items-center">
          <select v-model="filters.type" class="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50">
            <option value="">All Types</option>
            <option>For Sale</option>
            <option>For Rent</option>
          </select>
          <select v-model="filters.category" class="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50">
            <option value="">All Categories</option>
            <option>Apartment</option>
            <option>Villa</option>
            <option>Commercial</option>
            <option>Land</option>
          </select>
          <select v-model="filters.beds" class="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50">
            <option value="">Any Bedrooms</option>
            <option value="1">1+ Beds</option>
            <option value="2">2+ Beds</option>
            <option value="3">3+ Beds</option>
          </select>
          <input v-model="filters.search" type="text" placeholder="Search by name or location..."
            class="flex-1 min-w-48 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50" />
          <button @click="resetFilters" class="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:border-primary hover:text-primary transition-all">
            <i class="fas fa-redo mr-1"></i> Reset
          </button>
          <span class="text-sm text-gray-400 ml-auto">{{ filteredProperties.length }} properties found</span>
        </div>
      </div>
    </section>

    <!-- Properties Grid -->
    <section class="py-16 bg-gray-50" v-motion :initial="{ opacity: 0 }" :visible="{ opacity: 1, transition: { duration: 800 } }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="filteredProperties.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(prop, index) in filteredProperties" :key="prop.id"
            v-motion
            :initial="{ opacity: 0, y: 40 }"
            :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: index * 80 } }"
            class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
            <div class="relative overflow-hidden h-52">
              <img :src="propertyImage" alt="Property" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute top-3 left-3 flex gap-2">
                <span :class="['px-3 py-1 rounded-full text-xs font-bold', prop.type === 'For Sale' ? 'bg-secondary text-white' : 'bg-primary text-white']">
                  {{ prop.type }}
                </span>
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-gray-800/70 text-white">{{ prop.category }}</span>
              </div>
              <button class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-all">
                <i class="far fa-heart text-gray-500 text-sm"></i>
              </button>
            </div>
            <div class="p-5">
              <div class="flex items-start justify-between mb-2">
                <h3 class="font-bold text-gray-900 text-base leading-tight">{{ prop.name }}</h3>
                <span class="text-primary font-black text-lg whitespace-nowrap ml-2">{{ prop.price }}</span>
              </div>
              <p class="text-gray-500 text-sm flex items-center gap-1 mb-3">
                <i class="fas fa-map-marker-alt text-primary text-xs"></i> {{ prop.location }}
              </p>
              <p class="text-gray-400 text-xs leading-relaxed mb-4">{{ prop.desc }}</p>
              <div class="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3 mb-4">
                <span v-if="prop.beds" class="flex items-center gap-1"><i class="fas fa-bed text-primary"></i> {{ prop.beds }} Beds</span>
                <span v-if="prop.baths" class="flex items-center gap-1"><i class="fas fa-bath text-primary"></i> {{ prop.baths }} Baths</span>
                <span class="flex items-center gap-1"><i class="fas fa-ruler-combined text-primary"></i> {{ prop.area }}</span>
              </div>
              <router-link to="/contact"
                class="block text-center py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-white font-semibold rounded-xl text-sm transition-all">
                Inquire Now
              </router-link>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-20">
          <i class="fas fa-search text-5xl text-gray-300 mb-4"></i>
          <h3 class="text-xl font-bold text-gray-500">No properties found</h3>
          <p class="text-gray-400 mt-2">Try adjusting your filters</p>
          <button @click="resetFilters" class="mt-4 px-6 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all">
            Clear Filters
          </button>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 bg-primary">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-3xl font-black text-white mb-4">Can't Find What You're Looking For?</h2>
        <p class="text-white/80 mb-8">Tell us your requirements and our team will find the perfect property for you.</p>
        <router-link to="/contact"
          class="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg">
          <i class="fas fa-envelope"></i> Contact Our Team
        </router-link>
      </div>
    </section>

    <LandingFooter />
  </div>
</template>

<script>
import LandingNavbar from '../../../components/LandingNavbar.vue';
import LandingFooter from '../../../components/LandingFooter.vue';
import propertyImg from '../../../assets/img/Properties/realstate1.jpg';

export default {
  name: 'PropertiesPage',
  components: { LandingNavbar, LandingFooter },
  data() {
    return {
      propertyImage: propertyImg,
      filters: { type: '', category: '', beds: '', search: '' },
      properties: [
        { id: 1, name: 'Luxury Villa in Mekelle', type: 'For Sale', category: 'Villa', price: 'ETB 4.5M', location: 'Mekelle, Tigray', beds: 4, baths: 3, area: '320 m²', icon: 'fas fa-home', desc: 'Stunning luxury villa with panoramic city views, private garden, and premium finishes throughout.' },
        { id: 2, name: 'Modern Apartment Complex', type: 'For Rent', category: 'Apartment', price: 'ETB 15K/mo', location: 'Ayder, Mekelle', beds: 2, baths: 1, area: '95 m²', icon: 'fas fa-building', desc: 'Contemporary apartment in the heart of Ayder with modern amenities and 24/7 security.' },
        { id: 3, name: 'Commercial Office Space', type: 'For Sale', category: 'Commercial', price: 'ETB 8.2M', location: 'Hawelti, Mekelle', beds: 0, baths: 2, area: '450 m²', icon: 'fas fa-briefcase', desc: 'Prime commercial space in Mekelle\'s business district, ideal for corporate offices or retail.' },
        { id: 4, name: 'Family Residence', type: 'For Rent', category: 'Villa', price: 'ETB 22K/mo', location: 'Adi Haki, Mekelle', beds: 3, baths: 2, area: '180 m²', icon: 'fas fa-house-user', desc: 'Spacious family home in a quiet neighborhood with a large yard and modern kitchen.' },
        { id: 5, name: 'Studio Apartment', type: 'For Rent', category: 'Apartment', price: 'ETB 8K/mo', location: 'Semien, Mekelle', beds: 1, baths: 1, area: '55 m²', icon: 'fas fa-door-open', desc: 'Cozy studio apartment perfect for young professionals, fully furnished and move-in ready.' },
        { id: 6, name: 'Prime Land Plot', type: 'For Sale', category: 'Land', price: 'ETB 2.1M', location: 'Quiha, Tigray', beds: 0, baths: 0, area: '600 m²', icon: 'fas fa-map', desc: 'Strategic land plot with all utilities connected, ideal for residential or commercial development.' },
        { id: 7, name: 'Penthouse Suite', type: 'For Sale', category: 'Apartment', price: 'ETB 6.8M', location: 'Mekelle City Center', beds: 3, baths: 2, area: '210 m²', icon: 'fas fa-city', desc: 'Exclusive penthouse with rooftop terrace, floor-to-ceiling windows, and breathtaking views.' },
        { id: 8, name: 'Retail Shop Space', type: 'For Rent', category: 'Commercial', price: 'ETB 18K/mo', location: 'Romanat, Mekelle', beds: 0, baths: 1, area: '80 m²', icon: 'fas fa-store', desc: 'High-traffic retail space in a busy commercial area, perfect for shops and service businesses.' },
        { id: 9, name: 'Townhouse Complex', type: 'For Sale', category: 'Villa', price: 'ETB 3.2M', location: 'Edaga Hamus, Tigray', beds: 3, baths: 2, area: '150 m²', icon: 'fas fa-home', desc: 'Modern townhouse in a gated community with shared amenities, parking, and 24/7 security.' },
      ],
    };
  },
  computed: {
    filteredProperties() {
      return this.properties.filter(p => {
        const matchType = !this.filters.type || p.type === this.filters.type;
        const matchCat = !this.filters.category || p.category === this.filters.category;
        const matchBeds = !this.filters.beds || p.beds >= parseInt(this.filters.beds);
        const matchSearch = !this.filters.search ||
          p.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
          p.location.toLowerCase().includes(this.filters.search.toLowerCase());
        return matchType && matchCat && matchBeds && matchSearch;
      });
    },
  },
  methods: {
    resetFilters() {
      this.filters = { type: '', category: '', beds: '', search: '' };
    },
  },
};
</script>
