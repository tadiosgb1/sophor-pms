<template>
  <section class="relative min-h-screen flex items-center overflow-hidden">
    <!-- Background Slider -->
    <div class="absolute inset-0 z-0">
      <transition-group name="fade-hero">
        <div
          v-for="(img, i) in heroImages"
          :key="i"
          v-show="heroIndex === i"
          class="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          :style="{ backgroundImage: `url(${img})` }"
        ></div>
      </transition-group>
      <div class="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-transparent"></div>
    </div>

    <!-- Hero Content -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div class="max-w-2xl">
        <div class="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
          <i class="fas fa-star text-xs"></i>
          Trusted Real Estate Partner in Ethiopia
        </div>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
          Find Your
          <span class="text-primary"> Dream</span>
          <br />Property Today
        </h1>
        <p class="text-lg text-gray-200 leading-relaxed mb-8 max-w-xl">
          Sophor offers premium properties for sale and rent, backed by a world-class property management system. Your investment, our expertise.
        </p>

        <!-- Search Bar -->
        <div class="bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2 mb-8">
          <select class="flex-1 px-4 py-3 rounded-xl text-gray-700 text-sm bg-gray-50 border-0 focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Property Type</option>
            <option>Apartment</option>
            <option>Villa</option>
            <option>Commercial</option>
            <option>Land</option>
          </select>
          <select class="flex-1 px-4 py-3 rounded-xl text-gray-700 text-sm bg-gray-50 border-0 focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">For Sale / Rent</option>
            <option>For Sale</option>
            <option>For Rent</option>
          </select>
          <input type="text" placeholder="Location or keyword..."
            class="flex-1 px-4 py-3 rounded-xl text-gray-700 text-sm bg-gray-50 border-0 focus:outline-none focus:ring-2 focus:ring-primary" />
          <router-link to="/properties"
            class="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap">
            <i class="fas fa-search"></i> Search
          </router-link>
        </div>

        <!-- Stats Row -->
        <div class="flex flex-wrap gap-6">
          <div v-for="stat in heroStats" :key="stat.label" class="text-center">
            <div class="text-2xl font-black text-white">{{ stat.value }}</div>
            <div class="text-xs text-gray-300 uppercase tracking-wide">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Slider Dots -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
      <button v-for="(_, i) in heroImages" :key="i" @click="heroIndex = i"
        :class="['w-2.5 h-2.5 rounded-full transition-all', heroIndex === i ? 'bg-primary w-8' : 'bg-white/50']">
      </button>
    </div>
  </section>
</template>

<script>
import bg1 from '../../assets/img/hero/bg1.jpg';
import bg2 from '../../assets/img/hero/bg2.jpg';
import bg3 from '../../assets/img/hero/bg3.jpg';
import bg4 from '../../assets/img/hero/bg4.jpg';

export default {
  name: 'HeroSection',
  data() {
    return {
      heroIndex: 0,
      heroImages: [bg1, bg2, bg3, bg4],
      heroInterval: null,
      heroStats: [
        { value: '500+', label: 'Properties' },
        { value: '1,200+', label: 'Happy Clients' },
        { value: '10+', label: 'Years Experience' },
        { value: '98%', label: 'Satisfaction Rate' },
      ],
    };
  },
  mounted() {
    this.heroInterval = setInterval(() => {
      this.heroIndex = (this.heroIndex + 1) % this.heroImages.length;
    }, 3000); // Changed from 5000ms to 3000ms (3 seconds)
  },
  beforeUnmount() {
    clearInterval(this.heroInterval);
  },
};
</script>

<style scoped>
.fade-hero-enter-active,
.fade-hero-leave-active {
  transition: opacity 0.6s ease; /* Reduced from 1s to 0.6s */
}
.fade-hero-enter-from,
.fade-hero-leave-to {
  opacity: 0;
}
</style>
