<template>
  <header class="bg-white shadow fixed w-full top-0 left-0 z-50">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      
      <!-- LOGO -->
      <router-link to="/" class="text-2xl font-extrabold text-green-700">
        Sophor <span class="text-yellow-500">PMS</span>
      </router-link>

      <!-- DESKTOP MENU -->
      <nav class="hidden md:flex space-x-8 text-gray-700 font-medium">
        <router-link to="/" class="hover:text-green-600">Home</router-link>
        <router-link to="/about" class="hover:text-green-600">About</router-link>
        <router-link to="/services" class="hover:text-green-600">Services</router-link>
        <router-link to="/contact-us" class="hover:text-green-600">Contact</router-link>
      </nav>

      <!-- CTA BUTTONS -->
      <div class="hidden md:flex space-x-4">
        <router-link
          to="/login"
          class="px-5 py-2 bg-gray-100 rounded-lg text-gray-900 hover:bg-gray-200 font-medium"
        >
          Login
        </router-link>

        <router-link v-if="gst"
          to="/register"
          class="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
        >
          Get Started
        </router-link>
      </div>

      <!-- MOBILE MENU BUTTON -->
      <button @click="mobileMenu = !mobileMenu" class="md:hidden text-gray-700 text-3xl">
        ☰
      </button>
    </div>

    <!-- MOBILE MENU -->
    <div 
      v-if="mobileMenu" 
      class="md:hidden bg-white shadow-lg px-6 py-4 space-y-4 text-gray-800"
    >
      <router-link to="/" @click="closeMenu" class="block">Home</router-link>
      <router-link to="/about" @click="closeMenu" class="block">About</router-link>
      <router-link to="/services" @click="closeMenu" class="block">Services</router-link>
      <router-link to="/contact" @click="closeMenu" class="block">Contact</router-link>

      <div class="border-t pt-4 space-y-3">
        <router-link
          to="/login"
          @click="closeMenu"
          class="block bg-gray-100 px-4 py-2 rounded-lg text-gray-900"
        >
          Login
        </router-link>

        <router-link
          to="/register"
          @click="closeMenu"
          class="block bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Get Started
        </router-link>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      mobileMenu: false,
    };
  },
  methods: {
    closeMenu() {
      this.mobileMenu = false;
    },
  },
};
</script>

<style scoped>
</style>
