<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">

    <!-- HEADER -->
    <Header />

    <!-- HERO SECTION -->
    <section class="relative bg-gradient-to-r from-green-700 via-green-600 to-green-500 py-24 text-center text-white">
      <div class="max-w-4xl mx-auto px-6">
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4">Our Services</h1>
        <p class="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
          Innovative property management solutions built to streamline operations, increase revenue, 
          and deliver outstanding experiences for owners, managers, and tenants.
        </p>
      </div>
    </section>

    <!-- SERVICES SECTION -->
    <section class="py-20 max-w-7xl mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-extrabold text-gray-800">What We Offer</h2>
        <p class="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">
          A complete suite of services engineered to support property owners, real estate businesses, 
          and property managers in running efficient operations.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

        <!-- SERVICE CARD -->
        <div class="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">
          <i class="fa-solid fa-building text-green-600 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold mb-2">Property Management</h3>
          <p class="text-gray-600 leading-relaxed">
            Professional tools to manage buildings, units, documents, ownership, and property lifecycle.
          </p>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">
          <i class="fa-solid fa-file-invoice-dollar text-green-600 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold mb-2">Rent & Lease Management</h3>
          <p class="text-gray-600 leading-relaxed">
            Automated rent collection, reminders, lease agreements, renewals, receipts, and arrears tracking.
          </p>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">
          <i class="fa-solid fa-handshake text-green-600 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold mb-2">Sales Management</h3>
          <p class="text-gray-600 leading-relaxed">
            Manage property sales, payment schedules, buyer contracts, and commission tracking.
          </p>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">
          <i class="fa-solid fa-users text-green-600 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold mb-2">Tenant Management</h3>
          <p class="text-gray-600 leading-relaxed">
            Full tenant management including onboarding, contract tracking, communication, and records.
          </p>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">
          <i class="fa-solid fa-screwdriver-wrench text-green-600 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold mb-2">Maintenance & Support</h3>
          <p class="text-gray-600 leading-relaxed">
            Track maintenance requests, assign technicians, monitor status, and manage service histories.
          </p>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">
          <i class="fa-solid fa-chart-line text-green-600 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold mb-2">Reporting & Analytics</h3>
          <p class="text-gray-600 leading-relaxed">
            Real-time dashboards for occupancy, revenue, expenses, sales, and performance insights.
          </p>
        </div>

      </div>
    </section>

    <!-- CTA SECTION -->
    <section class="bg-green-600 text-white py-16 text-center">
      <h2 class="text-3xl font-bold mb-4">Looking to take your property business to the next level?</h2>
      <p class="max-w-2xl mx-auto text-lg opacity-90">
        Our solutions empower property owners and managers with cutting-edge tools 
        to automate operations and maximize earnings.
      </p>

      <div class="mt-8">
        <router-link 
          to="/contact"
          class="bg-white text-green-700 font-semibold text-lg px-8 py-3 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Get Started Today
        </router-link>
      </div>
    </section>

    <!-- FOOTER -->
    <Footer />

  </div>
</template>

<script>
import Header from "./header.vue";
import Footer from "./footer.vue";

export default {
  components: { Header, Footer },
};
</script>

<style scoped>
</style>
