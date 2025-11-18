<template>
  <div class="min-h-screen bg-gradient-to-r from-blue-50 via-white to-green-50">
    
    <!-- HEADER -->
    <Header />

    <!-- HERO SECTION -->
  
    <Hero />
    <Partners />
    <Pricing />
    <ProductTour />
    
    <!-- WHY CHOOSE US -->
    <section class="py-20 max-w-6xl mx-auto px-6">
      <h2 class="text-3xl font-bold text-center text-green-800">Why Choose Our PMS?</h2>
      <p class="text-center text-gray-600 mt-2">
        Designed for property managers, landlords, brokers, and real-estate companies.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
        <div class="p-6 bg-white rounded-xl shadow hover:shadow-lg transition text-center">
          <h3 class="text-xl font-semibold text-green-700">Automated Rent Collection</h3>
          <p class="mt-3 text-gray-600">Track payments, send reminders, generate invoices instantly.</p>
        </div>

        <div class="p-6 bg-white rounded-xl shadow hover:shadow-lg transition text-center">
          <h3 class="text-xl font-semibold text-green-700">Smart Property Management</h3>
          <p class="mt-3 text-gray-600">List and manage rentals, sales, maintenance, and documents.</p>
        </div>

        <div class="p-6 bg-white rounded-xl shadow hover:shadow-lg transition text-center">
          <h3 class="text-xl font-semibold text-green-700">Detailed Reports</h3>
          <p class="mt-3 text-gray-600">Financial, maintenance, tenant, and occupancy reports.</p>
        </div>
      </div>
    </section>

    <!-- PMS MODULES -->
  <!-- CORE MODULES SECTION -->
<section class="py-20 bg-gray-50" id="modules">
  <div class="max-w-7xl mx-auto px-6 text-center">

    <h2 class="text-4xl font-extrabold text-gray-800 mb-6">
      Core Modules
    </h2>

    <p class="text-lg text-gray-600 mb-12">
      Powerful and scalable modules designed to automate property management, streamline finance, and simplify tenant operations.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">

      <!-- PROPERTY MANAGEMENT -->
      <div class="p-6 bg-white shadow rounded-2xl hover:shadow-lg transition">
        <i class="fa-solid fa-building text-green-600 text-4xl mb-4"></i>
        <h3 class="text-xl font-bold mb-2">Property Management</h3>
        <p class="text-gray-600">
          Manage properties, buildings, units, owners, documents, and full lifecycle operations.
        </p>
      </div>

      <!-- RENT MANAGEMENT -->
      <div class="p-6 bg-white shadow rounded-2xl hover:shadow-lg transition">
        <i class="fa-solid fa-file-invoice-dollar text-green-600 text-4xl mb-4"></i>
        <h3 class="text-xl font-bold mb-2">Rent Management</h3>
        <p class="text-gray-600">
          Automated rent billing, reminders, receipts, arrears tracking, and reporting.
        </p>
      </div>

      <!-- SALES MANAGEMENT -->
      <div class="p-6 bg-white shadow rounded-2xl hover:shadow-lg transition">
        <i class="fa-solid fa-handshake text-green-600 text-4xl mb-4"></i>
        <h3 class="text-xl font-bold mb-2">Sales Management</h3>
        <p class="text-gray-600">
          Manage property sales, agreements, buyers, installment plans, and commissions.
        </p>
      </div>

      <!-- TENANT MANAGEMENT -->
      <div class="p-6 bg-white shadow rounded-2xl hover:shadow-lg transition">
        <i class="fa-solid fa-users text-green-600 text-4xl mb-4"></i>
        <h3 class="text-xl font-bold mb-2">Tenant Management</h3>
        <p class="text-gray-600">
          Tenant onboarding, contracts, communication, notices, and documents.
        </p>
      </div>

      <!-- MAINTENANCE -->
      <div class="p-6 bg-white shadow rounded-2xl hover:shadow-lg transition">
        <i class="fa-solid fa-screwdriver-wrench text-green-600 text-4xl mb-4"></i>
        <h3 class="text-xl font-bold mb-2">Maintenance Requests</h3>
        <p class="text-gray-600">
          Tenants submit issues, track progress, and monitor service completion.
        </p>
      </div>

      <!-- FINANCIAL MANAGEMENT -->
      <div class="p-6 bg-white shadow rounded-2xl hover:shadow-lg transition">
        <i class="fa-solid fa-chart-pie text-green-600 text-4xl mb-4"></i>
        <h3 class="text-xl font-bold mb-2">Financial Management</h3>
        <p class="text-gray-600">
          Accounting, income/expense logs, payments, and financial dashboards.
        </p>
      </div>

      <!-- REPORTS & ANALYTICS -->
      <div class="p-6 bg-white shadow rounded-2xl hover:shadow-lg transition">
        <i class="fa-solid fa-chart-line text-green-600 text-4xl mb-4"></i>
        <h3 class="text-xl font-bold mb-2">Reports & Analytics</h3>
        <p class="text-gray-600">
          Real-time insights: occupancy, revenue, sales, expenses, and performance.
        </p>
      </div>

      <!-- ACCESS CONTROL -->
      <div class="p-6 bg-white shadow rounded-2xl hover:shadow-lg transition">
        <i class="fa-solid fa-user-shield text-green-600 text-4xl mb-4"></i>
        <h3 class="text-xl font-bold mb-2">Role-Based Access</h3>
        <p class="text-gray-600">
          Admin, managers, accountants, agents, and owners with controlled permissions.
        </p>
      </div>

    </div>

  </div>
</section>


<section>
  <Overview />
</section>

    <!-- CALL-TO-ACTION -->
    <section class="py-20 text-center">
      <h2 class="text-3xl font-bold text-gray-900">Ready to Transform Your Property Business?</h2>
      <p class="text-gray-600 mt-2">Start managing your properties with efficiency and automation today.</p>

      <router-link
        to="/register"
        class="inline-block mt-6 bg-green-600 text-white px-10 py-3 rounded-xl font-semibold text-lg hover:bg-green-700 transition"
      >
        Create Free Account
      </router-link>
    </section>
    <section>
      <Testimonals />
    </section>

    <!-- FAQs -->
    <section class="bg-green-50 py-20">
      <Fqs />
    </section>


    <!-- FOOTER -->
    <Footer />

  </div>
</template>

<script>
import Header from "./header.vue";
import Footer from "./footer.vue";
import Fqs from "./fqs.vue";
import Pricing from './pricing.vue'
import Hero from './hero.vue'
import Testimonals from './testimonals.vue'
import Partners from './partners.vue'
import Overview from './overview.vue'
import ProductTour from './productTour.vue'
// Simple reusable feature card component inside same file
export default {
  components: { Header, Footer, Fqs,Pricing,Hero,Testimonals,Partners, Overview,ProductTour,FeatureCard: {
      props: ["title", "desc"],
      template: `
        <div class="p-6 bg-white rounded-xl shadow hover:shadow-xl transition">
          <h3 class="text-xl font-semibold text-green-700">{{ title }}</h3>
          <p class="mt-3 text-gray-600">{{ desc }}</p>
        </div>
      `
    }
  }
};
</script>

<style scoped>
</style>
