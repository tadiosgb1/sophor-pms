<template>
  <div class="min-h-screen  bg-gradient-to-r from-blue-500 via-white to-green-500 opacity-80">
    <!-- Header -->
    <Header @show-login="showLoginModal = true" />

    <!-- Products Section -->
    <section class="py-24 max-w-7xl mx-auto px-6">
      <h1 class="text-4xl md:text-5xl font-extrabold text-center text-green-800 mb-12">Our Products</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="p in products"
          :key="p.id"
          class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
        >
          <img :src="p.image" :alt="p.name" class="w-full h-48 object-cover" />
          <div class="p-5">
            <h3 class="text-xl font-semibold text-green-700">{{ p.name }}</h3>
            <p class="text-gray-600 text-sm mt-2">{{ p.description }}</p>
            <p class="mt-3 font-bold text-lg text-green-800">{{ p.price }} ETB</p>
            <div class="mt-4 flex space-x-3">
              <button class="bg-yellow-400 hover:bg-yellow-500 text-green-900 px-4 py-2 rounded-lg font-semibold transition">Buy</button>
              <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition">View Details</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <Footer />

    <!-- Login Modal -->

  </div>
</template>

<script>
import Header from './header.vue';
import Footer from './footer.vue';


export default {
  components: { Header, Footer },
  data() {
    return {
      showLoginModal: false,
      products: [
        { id: 1, name: 'Solar Home System', description: 'Eco-friendly solar kits for sustainable home energy.', price: 14500, image: '@/assets/img/solar.jpg' },
        { id: 2, name: 'Smart Furniture', description: 'Modern, space-saving designs for contemporary homes.', price: 9800, image: '@/assets/img/furniture.jpg' },
        { id: 3, name: 'Building Materials', description: 'High-quality cement, steel, and finishing materials.', price: 26500, image: '@/assets/img/materials.jpg' },
        { id: 4, name: 'Home Security System', description: 'AI-powered smart cameras and intrusion alerts.', price: 7500, image: '@/assets/img/security.jpg' },
        { id: 5, name: 'Interior Design Kits', description: 'Modern interior materials to customize your home.', price: 12800, image: '@/assets/img/interior.jpg' },
        { id: 6, name: 'Water Purification System', description: 'Clean water technology for healthy living.', price: 5200, image: '@/assets/img/water.jpg' },
      ],
    };
  },
};
</script>

<style scoped>
section { font-family: "Poppins", sans-serif; }
</style>
