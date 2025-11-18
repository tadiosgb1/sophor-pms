<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">


    <!-- PRICING CARDS SECTION -->
    <section class="py-20 max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">

        <!-- BASIC PLAN -->
        <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-8 flex flex-col">
          <h3 class="text-2xl font-bold text-green-700 mb-4">Basic</h3>
          <p class="text-gray-600 mb-6">Ideal for small property owners managing 1-5 units.</p>
          <p class="text-4xl font-extrabold mb-6 text-gray-800">ETB 1,500<span class="text-lg font-medium text-gray-600"> / mo</span></p>
          
          <ul class="space-y-3 text-gray-700 flex-1">
            <li class="flex items-center"><i class="fa-solid fa-check text-green-600 mr-2"></i>Manage up to 5 properties</li>
            <li class="flex items-center"><i class="fa-solid fa-check text-green-600 mr-2"></i>Rent & Lease Tracking</li>
            <li class="flex items-center"><i class="fa-solid fa-check text-green-600 mr-2"></i>Basic Reporting</li>
            <li class="flex items-center"><i class="fa-solid fa-check text-green-600 mr-2"></i>Email Support</li>
          </ul>

          <router-link
            to="/register"
            class="mt-6 inline-block bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 text-center"
          >
            Get Started
          </router-link>
        </div>

        <!-- PROFESSIONAL PLAN -->
        <div class="bg-white rounded-2xl shadow-xl border-2 border-green-600 p-8 flex flex-col">
          <h3 class="text-2xl font-bold text-green-700 mb-4">Professional</h3>
          <p class="text-gray-600 mb-6">Perfect for property managers handling 10-50 units efficiently.</p>
          <p class="text-4xl font-extrabold mb-6 text-gray-800">ETB 4,500<span class="text-lg font-medium text-gray-600"> / mo</span></p>

          <ul class="space-y-3 text-gray-700 flex-1">
            <li class="flex items-center"><i class="fa-solid fa-check text-green-600 mr-2"></i>Manage up to 50 properties</li>
            <li class="flex items-center"><i class="fa-solid fa-check text-green-600 mr-2"></i>Advanced Rent & Lease Management</li>
            <li class="flex items-center"><i class="fa-solid fa-check text-green-600 mr-2"></i>Financial Reporting</li>
            <li class="flex items-center"><i class="fa-solid fa-check text-green-600 mr-2"></i>Maintenance Requests</li>
            <li class="flex items-center"><i class="fa-solid fa-check text-green-600 mr-2"></i>Priority Email Support</li>
          </ul>

          <router-link
            to="/register"
            class="mt-6 inline-block bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 text-center"
          >
            Get Started
          </router-link>
        </div>

        <!-- ENTERPRISE PLAN -->
        <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-8 flex flex-col">
          <h3 class="text-2xl font-bold text-green-700 mb-4">Enterprise</h3>
          <p class="text-gray-600 mb-6">Best for large agencies and real estate businesses with unlimited properties.</p>
          <p class="text-4xl font-extrabold mb-6 text-gray-800">ETB 9,500<span class="text-lg font-medium text-gray-600"> / mo</span></p>

          <ul class="space-y-3 text-gray-700 flex-1">
            <li class="flex items-center"><i class="fa-solid fa-check text-green-600 mr-2"></i>Unlimited properties</li>
            <li class="flex items-center"><i class="fa-solid fa-check text-green-600 mr-2"></i>Full Property Management Suite</li>
            <li class="flex items-center"><i class="fa-solid fa-check text-green-600 mr-2"></i>Custom Reporting & Analytics</li>
            <li class="flex items-center"><i class="fa-solid fa-check text-green-600 mr-2"></i>Dedicated Account Manager</li>
            <li class="flex items-center"><i class="fa-solid fa-check text-green-600 mr-2"></i>24/7 Priority Support</li>
          </ul>

          <router-link
            to="/register"
            class="mt-6 inline-block bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 text-center"
          >
            Get Started
          </router-link>
        </div>

      </div>
    </section>

    <!-- CTA SECTION -->
    <section class="bg-green-600 text-white py-16 text-center">
      <h2 class="text-3xl font-bold mb-4">Not sure which plan is right for you?</h2>
      <p class="max-w-2xl mx-auto opacity-90">
        Contact our team and we'll help you choose the perfect plan for your property management needs.
      </p>
      <router-link
        to="/contact-us"
        class="mt-6 inline-block bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
      >
        Contact Us
      </router-link>
    </section>


  </div>
</template>

<script>


export default {
  components: {  },
};
</script>

<style scoped>
</style>
