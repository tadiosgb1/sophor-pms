<template>
  <section class="py-20 bg-gray-50" id="properties" v-motion :initial="{ opacity: 0 }" :visible="{ opacity: 1, transition: { duration: 800 } }">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12" v-motion :initial="{ opacity: 0, y: 30 }" :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }">
        <span class="text-primary font-semibold text-sm uppercase tracking-widest">Our Portfolio</span>
        <h2 class="text-3xl lg:text-4xl font-black text-gray-900 mt-2 mb-4">Featured Properties</h2>
        <p class="text-gray-500 max-w-xl mx-auto">Explore our handpicked selection of premium properties available for sale and rent across Ethiopia.</p>
      </div>

      <!-- Filter Tabs -->
      <div class="flex justify-center gap-2 mb-10" v-motion :initial="{ opacity: 0, y: 20 }" :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: 200 } }">
        <button v-for="tab in propertyTabs" :key="tab"
          @click="activeTab = tab"
          :class="['px-5 py-2 rounded-full text-sm font-semibold transition-all', activeTab === tab ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200']">
          {{ tab }}
        </button>
      </div>

      <!-- Property Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="(prop, index) in filteredProperties" :key="prop.id"
          v-motion
          :initial="{ opacity: 0, y: 40 }"
          :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: index * 100 } }"
          class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
          <!-- Image -->
          <div class="relative overflow-hidden h-52">
            <img :src="propertyImage" alt="Property" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute top-3 left-3 flex gap-2">
              <span :class="['px-3 py-1 rounded-full text-xs font-bold', prop.type === 'For Sale' ? 'bg-secondary text-white' : 'bg-primary text-white']">
                {{ prop.type }}
              </span>
              <span v-if="prop.featured" class="px-3 py-1 rounded-full text-xs font-bold bg-yellow-400 text-yellow-900">
                Featured
              </span>
            </div>
            <button class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-all">
              <i class="far fa-heart text-gray-500 text-sm"></i>
            </button>
          </div>
          <!-- Content -->
          <div class="p-5">
            <div class="flex items-start justify-between mb-2">
              <h3 class="font-bold text-gray-900 text-base leading-tight">{{ prop.name }}</h3>
              <span class="text-primary font-black text-lg whitespace-nowrap ml-2">{{ prop.price }}</span>
            </div>
            <p class="text-gray-500 text-sm flex items-center gap-1 mb-3">
              <i class="fas fa-map-marker-alt text-primary text-xs"></i>
              {{ prop.location }}
            </p>
            <div class="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
              <span class="flex items-center gap-1"><i class="fas fa-bed text-primary"></i> {{ prop.beds }} Beds</span>
              <span class="flex items-center gap-1"><i class="fas fa-bath text-primary"></i> {{ prop.baths }} Baths</span>
              <span class="flex items-center gap-1"><i class="fas fa-ruler-combined text-primary"></i> {{ prop.area }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-10" v-motion :initial="{ opacity: 0 }" :visible="{ opacity: 1, transition: { duration: 500, delay: 400 } }">
        <router-link to="/properties"
          class="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-all">
          View All Properties <i class="fas fa-arrow-right"></i>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
import propertyImg from '../../assets/img/Properties/realstate1.jpg';

export default {
  name: 'FeaturedProperties',
  data() {
    return {
      activeTab: 'All',
      propertyImage: propertyImg,
      propertyTabs: ['All', 'For Sale', 'For Rent'],
      properties: [
        { id: 1, name: 'Luxury Villa in Mekelle', type: 'For Sale', price: 'ETB 4.5M', location: 'Addis Ababa, Ethiopia', beds: 4, baths: 3, area: '320 m²', featured: true },
        { id: 2, name: 'Modern Apartment Complex', type: 'For Rent', price: 'ETB 15K/mo', location: 'Addis Ababa, Ethiopia', beds: 2, baths: 1, area: '95 m²', featured: false },
        { id: 3, name: 'Commercial Office Space', type: 'For Sale', price: 'ETB 8.2M', location: 'Addis Ababa, Ethiopia', beds: 0, baths: 2, area: '450 m²', featured: true },
        { id: 4, name: 'Family Residence', type: 'For Rent', price: 'ETB 22K/mo', location: 'Addis Ababa, Ethiopia', beds: 3, baths: 2, area: '180 m²', featured: false },
        { id: 5, name: 'Studio Apartment', type: 'For Rent', price: 'ETB 8K/mo', location: 'Addis Ababa, Ethiopia', beds: 1, baths: 1, area: '55 m²', featured: false },
        { id: 6, name: 'Prime Land Plot', type: 'For Sale', price: 'ETB 2.1M', location: 'Addis Ababa, Ethiopia', beds: 0, baths: 0, area: '600 m²', featured: false },
      ],
    };
  },
  computed: {
    filteredProperties() {
      if (this.activeTab === 'All') return this.properties;
      return this.properties.filter(p => p.type === this.activeTab);
    },
  },
};
</script>
