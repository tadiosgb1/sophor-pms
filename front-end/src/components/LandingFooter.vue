<template>
  <footer class="bg-gray-900 text-gray-300">
    <!-- Main Footer -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <!-- Brand Column -->
        <div class="lg:col-span-1">
          <div class="flex items-center gap-3 mb-4">
            <img src="../assets/img/logo.png" alt="Sophor" class="h-10 w-auto brightness-200" />
            <span class="text-xl font-bold text-white">Sophor</span>
          </div>
          <p class="text-sm text-gray-400 leading-relaxed mb-6">
            Your trusted partner in real estate. We help you find, manage, and invest in properties with confidence and ease.
          </p>
          <div class="flex gap-3">
            <a v-for="social in socials" :key="social.icon" href="#"
              class="w-9 h-9 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-all duration-200"
              :aria-label="social.label">
              <i :class="social.icon + ' text-sm'"></i>
            </a>
          </div>
        </div>
        <!-- Quick Links -->
        <div>
          <h4 class="text-white font-semibold text-sm uppercase tracking-wider mb-5">Quick Links</h4>
          <ul class="space-y-3">
            <li v-for="link in quickLinks" :key="link.to">
              <router-link :to="link.to"
                class="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
                <i class="fas fa-chevron-right text-xs text-primary"></i>
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Services -->
        <div>
          <h4 class="text-white font-semibold text-sm uppercase tracking-wider mb-5">Our Services</h4>
          <ul class="space-y-3">
            <li v-for="service in services" :key="service">
              <span class="text-sm text-gray-400 flex items-center gap-2">
                <i class="fas fa-check-circle text-xs text-primary"></i>
                {{ service }}
              </span>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h4 class="text-white font-semibold text-sm uppercase tracking-wider mb-5">Contact Us</h4>
          <ul class="space-y-4">
            <li v-for="info in contactInfo" :key="info.label" class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i :class="info.icon + ' text-primary text-xs'"></i>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">{{ info.label }}</p>
                <p class="text-sm text-gray-300">{{ info.value }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Newsletter Strip -->
    <div class="border-t border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h5 class="text-white font-semibold">Subscribe to our newsletter</h5>
            <p class="text-sm text-gray-400">Get the latest property listings and news delivered to your inbox.</p>
          </div>
          <div class="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              class="flex-1 md:w-64 px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
            />
            <button class="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg transition-all whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-xs text-gray-500">
          © {{ year }} Sophor Real Estate. All rights reserved.
        </p>
        <div class="flex gap-5">
          <a href="#" class="text-xs text-gray-500 hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" class="text-xs text-gray-500 hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" class="text-xs text-gray-500 hover:text-primary transition-colors">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'LandingFooter',
  data() {
    return {
      year: new Date().getFullYear(),
      socials: [
        { icon: 'fab fa-facebook-f', label: 'Facebook' },
        { icon: 'fab fa-twitter', label: 'Twitter' },
        { icon: 'fab fa-instagram', label: 'Instagram' },
        { icon: 'fab fa-linkedin-in', label: 'LinkedIn' },
        { icon: 'fab fa-youtube', label: 'YouTube' },
      ],
      quickLinks: [
        { to: '/', label: 'Home' },
        { to: '/properties', label: 'Properties' },
        { to: '/about', label: 'About Us' },
        { to: '/news', label: 'News & Events' },
        { to: '/faq', label: 'FAQ' },
        { to: '/contact', label: 'Contact Us' },
        { to: '/login', label: 'Client Portal' },
      ],
      services: [
        'Property Sales',
        'Property Rentals',
        'Property Management',
        'Maintenance Services',
        'Investment Consulting',
        'Inventory Management',
      ],
      contactInfo: [
        { icon: 'fas fa-map-marker-alt', label: 'Address', value: 'Tigray,Addis Ababa,Ethiopia' },
        { icon: 'fas fa-phone', label: 'Phone', value: '+251 998 890 220' },
        { icon: 'fas fa-envelope', label: 'Email', value: 'sophortechnologies@gmail.com' },
        { icon: 'fas fa-clock', label: 'Working Hours', value: 'Mon–Fri: 8AM – 6PM' },
      ],
    };
  },
};
</script>
