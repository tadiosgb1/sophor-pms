<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">

    <!-- HEADER -->
    <Header />

    <!-- HERO / BACKGROUND SECTION -->
    <section class="relative bg-gradient-to-r from-green-600 via-green-500 to-green-400 py-28 text-center text-white">
      <div class="absolute inset-0 bg-black opacity-25"></div>
      <div class="relative z-10 max-w-4xl mx-auto px-6">
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4">About Sophor PMS</h1>
        <p class="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
          PMS Sophor is a modern Property Management System designed to simplify property operations, maximize revenue, and improve tenant satisfaction.
        </p>
      </div>
    </section>

    <!-- MISSION & VISION SECTION -->
    <section class="py-20 max-w-6xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        <div>
          <img src="../../../assets//img/bg1.png" alt="Property Management" class="rounded-2xl shadow-lg" />
        </div>

        <div class="space-y-8">
          <div>
            <h2 class="text-3xl font-bold text-green-700 mb-2">Our Mission</h2>
            <p class="text-gray-700 text-lg leading-relaxed">
              To provide property owners and managers with a fully integrated system that automates operations, ensures transparency, and enhances profitability while delivering excellent tenant experiences.
            </p>
          </div>

          <div>
            <h2 class="text-3xl font-bold text-green-700 mb-2">Our Vision</h2>
            <p class="text-gray-700 text-lg leading-relaxed">
              To be the leading property management platform in Ethiopia and beyond, empowering real estate businesses with innovative technology and seamless management solutions.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CORE VALUES SECTION -->
    <section class="py-20 bg-green-50">
      <div class="max-w-6xl mx-auto px-6 text-center mb-12">
        <h2 class="text-3xl font-extrabold text-green-700">Our Core Values</h2>
        <p class="text-gray-600 mt-2 max-w-2xl mx-auto">
          Values that guide us in delivering the best property management system to our clients.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">

        <div class="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition text-center">
          <i class="fa-solid fa-bolt text-green-600 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold mb-2">Innovation</h3>
          <p class="text-gray-600">
            Continuously improving our technology to provide cutting-edge solutions.
          </p>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition text-center">
          <i class="fa-solid fa-handshake text-green-600 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold mb-2">Integrity</h3>
          <p class="text-gray-600">
            We uphold transparency, honesty, and reliability in every interaction.
          </p>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition text-center">
          <i class="fa-solid fa-users text-green-600 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold mb-2">Customer-Centric</h3>
          <p class="text-gray-600">
            Our platform is designed to enhance satisfaction for both property managers and tenants.
          </p>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition text-center">
          <i class="fa-solid fa-chart-line text-green-600 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold mb-2">Excellence</h3>
          <p class="text-gray-600">
            Delivering high-quality solutions with attention to detail and performance.
          </p>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition text-center">
          <i class="fa-solid fa-shield-alt text-green-600 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold mb-2">Security</h3>
          <p class="text-gray-600">
            Ensuring data protection, privacy, and reliability for all users.
          </p>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition text-center">
          <i class="fa-solid fa-users-cog text-green-600 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold mb-2">Collaboration</h3>
          <p class="text-gray-600">
            We work with clients to understand their needs and deliver solutions that fit.
          </p>
        </div>

      </div>
    </section>

    <!-- CTA SECTION -->
    <section class="py-16 text-center bg-green-600 text-white">
      <h2 class="text-3xl font-bold mb-4">Ready to streamline your property management?</h2>
      <p class="max-w-2xl mx-auto opacity-90">
        Join PMS Suite today and transform the way you manage properties, tenants, and sales.
      </p>
      <router-link
        to="/register"
        class="mt-6 inline-block bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
      >
        Get Started
      </router-link>
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
