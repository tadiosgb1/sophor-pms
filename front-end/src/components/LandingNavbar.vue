<template>
  <nav
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'bg-white shadow-lg' : 'bg-transparent'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-20">
        <!-- Logo -->
      <router-link to="/" class="flex items-center gap-3 flex-shrink-0">
  <img
    src="../assets/img/transparent-logo1.png"
    alt="Sophor Logo"
    class="h-12 w-auto object-contain"
  />

  <span
    :class="[
      'text-xl font-bold tracking-tight',
      scrolled ? 'text-gray-900' : 'text-white'
    ]"
  >
    Sophor
  </span>
</router-link>

        <!-- Desktop Nav Links -->
        <div class="hidden lg:flex items-center gap-1">
          <router-link
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              scrolled
                ? 'text-gray-700 hover:text-primary hover:bg-green-50'
                : 'text-white/90 hover:text-white hover:bg-white/10'
            ]"
            active-class="!text-primary font-semibold"
          >
            {{ link.label }}
          </router-link>
        </div>

        <!-- CTA Buttons -->
        <div class="hidden lg:flex items-center gap-3">
          <router-link
            to="/login"
            :class="[
              'px-5 py-2 rounded-lg text-sm font-semibold border-2 transition-all duration-200',
              scrolled
                ? 'border-primary text-primary hover:bg-primary hover:text-white'
                : 'border-white text-white hover:bg-white hover:text-gray-900'
            ]"
          >
            Login
          </router-link>
          <router-link
            to="/contact"
            class="px-5 py-2 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-all duration-200 shadow-md"
          >
            Get Started
          </router-link>
        </div>

        <!-- Mobile Login & Menu Button -->
        <div class="lg:hidden flex items-center gap-2">
          <router-link
            to="/login"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all duration-200',
              scrolled
                ? 'border-primary text-primary hover:bg-primary hover:text-white'
                : 'border-white text-white hover:bg-white hover:text-gray-900'
            ]"
          >
            Login
          </router-link>
          <button
            @click="mobileOpen = !mobileOpen"
            :class="['p-2 rounded-lg', scrolled ? 'text-gray-700' : 'text-white']"
            aria-label="Toggle menu"
          >
            <i :class="mobileOpen ? 'fas fa-times text-xl' : 'fas fa-bars text-xl'"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition name="slide-down">
      <div v-if="mobileOpen" class="lg:hidden bg-white shadow-xl border-t border-gray-100">
        <div class="px-4 py-4 space-y-1">
          <router-link
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            @click="mobileOpen = false"
            class="block px-4 py-3 rounded-lg text-gray-700 hover:text-primary hover:bg-green-50 font-medium transition-all"
            active-class="text-primary bg-green-50"
          >
            <i :class="link.icon + ' mr-2 text-primary'"></i>
            {{ link.label }}
          </router-link>
          <div class="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <router-link to="/login" @click="mobileOpen = false"
              class="block text-center px-4 py-2.5 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all">
              Login
            </router-link>
            <router-link to="/contact" @click="mobileOpen = false"
              class="block text-center px-4 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-all">
              Get Started
            </router-link>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script>
export default {
  name: 'LandingNavbar',
  data() {
    return {
      scrolled: false,
      mobileOpen: false,
      navLinks: [
        { to: '/', label: 'Home', icon: 'fas fa-home' },
        { to: '/properties', label: 'Properties', icon: 'fas fa-building' },
        { to: '/about', label: 'About Us', icon: 'fas fa-info-circle' },
        { to: '/news', label: 'News & Events', icon: 'fas fa-newspaper' },
        { to: '/contact', label: 'Contact', icon: 'fas fa-envelope' },
      ],
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.scrolled = window.scrollY > 50;
    },
  },
};
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
