<template>
  <footer class="bg-white text-gray-700 py-16 mt-20 border-t border-gray-200">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

      <!-- COMPANY -->
      <div>
        <h2 class="text-2xl font-bold text-green-500">Sophor PMS</h2>
        <p class="mt-3 text-gray-600">
          A modern property management system helping landlords, managers, and real estate companies automate operations.
        </p>
      </div>

      <!-- QUICK LINKS -->
      <div>
        <h3 class="text-lg font-semibold text-green-500 mb-4">Quick Links</h3>
        <ul class="space-y-2">
          <li><router-link to="/" class="hover:text-green-500">Home</router-link></li>
          <li><router-link to="/about" class="hover:text-green-500">About</router-link></li>
          <li><router-link to="/services" class="hover:text-green-500">Services</router-link></li>
          <li><router-link to="/contact-us" class="hover:text-green-500">Contact</router-link></li>
        </ul>
      </div>

      <!-- FEATURES -->
      <div>
        <h3 class="text-lg font-semibold text-green-500 mb-4">Features</h3>
        <ul class="space-y-2">
          <li>Property Management</li>
          <li>Rent Collection</li>
          <li>Sales Management</li>
          <li>Tenant Management</li>
          <li>Maintenance Requests</li>
          <li>Reports & Analytics</li>
        </ul>
      </div>

      <!-- CONTACT & SOCIALS -->
      <div>
        <h3 class="text-lg font-semibold text-green-500 mb-4">Contact</h3>
        <ul class="space-y-2">
          <li>Email: info@sophortechnologies.com</li>
          <li>Phone: +251998890220</li>
          <li>Address: Addis Ababa, Ethiopia and Mekele,Ethiopia</li>
        </ul>

        <!-- SOCIAL MEDIA ICONS -->
        <div class="flex space-x-4 mt-4 text-2xl text-gray-500">
          <a href="#" class="hover:text-green-500"><i class="fab fa-facebook"></i></a>
          <a href="#" class="hover:text-green-500"><i class="fab fa-tiktok"></i></a>
          <a href="#" class="hover:text-green-500"><i class="fab fa-youtube"></i></a>
          <a href="#" class="hover:text-green-500"><i class="fab fa-instagram"></i></a>
          <a href="#" class="hover:text-green-500"><i class="fab fa-telegram"></i></a>
          <a href="#" class="hover:text-green-500"><i class="fab fa-linkedin"></i></a>
        </div>
      </div>
    </div>

    <div class="text-center text-gray-500 mt-10 border-t border-gray-300 pt-6">
    Powered by <span class="text-green-500">Sophor Technologies </span> © {{ new Date().getFullYear() }} Sophor  PMS   — All Rights Reserved 
    </div>
  </footer>
</template>

<script>
export default {};
</script>

<style scoped></style>
