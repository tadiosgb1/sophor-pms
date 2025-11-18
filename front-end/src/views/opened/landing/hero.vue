<template>
  <section class="relative overflow-hidden py-28">

    <!-- BACKGROUND GRADIENT + PATTERN -->
    <div class="absolute inset-0 bg-gradient-to-br from-green-600/40 via-white/50 to-green-400/40"></div>
    <div class="absolute inset-0 opacity-20 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/dot-grid.png')]"></div>

    <!-- FLOATING SHAPES -->
    <div class="floating-circle bg-green-500/30 top-20 left-20"></div>
    <div class="floating-circle bg-green-300/40 bottom-32 right-32"></div>

    <!-- CONTENT -->
    <div class="relative z-10 max-w-5xl mx-auto px-6 text-center animate-fadeIn">

      <h1 class="text-5xl md:text-6xl font-black text-gray-900 leading-tight drop-shadow-sm">
        The Complete Property Management System for <span class="text-green-600">Modern Agencies</span>
      </h1>

      <p class="mt-6 text-lg text-gray-700 max-w-3xl mx-auto">
        Streamline listings, tenants, payments, maintenance, reporting, and automation — 
        all inside one intelligent real-estate management platform built for speed and accuracy.
      </p>

      <!-- CTA BUTTONS -->
      <div class="mt-10 flex flex-wrap justify-center gap-5">
        <router-link
          to="/register"
          class="bg-green-600 hover:bg-green-700 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-lg transition transform hover:scale-105"
        >
          Get Started
        </router-link>

        <router-link
          to="/login"
          class="bg-white text-gray-900 border border-gray-300 px-10 py-4 text-lg font-semibold rounded-xl shadow-md hover:bg-gray-100 transition"
        >
          Login
        </router-link>
      </div>

      <!-- STAT BAR -->
      <div class="mt-14 flex justify-center gap-14 text-center">
        <div class="animate-slideUpDelay1">
          <p class="text-4xl font-extrabold text-green-600">+10,000</p>
          <p class="text-gray-700 text-sm">Managed Properties</p>
        </div>

        <div class="animate-slideUpDelay2">
          <p class="text-4xl font-extrabold text-green-600">99.8%</p>
          <p class="text-gray-700 text-sm">Faster Workflows</p>
        </div>

        <div class="animate-slideUpDelay3">
          <p class="text-4xl font-extrabold text-green-600">4.97★</p>
          <p class="text-gray-700 text-sm">Client Rating</p>
        </div>
      </div>

    </div>
  </section>
</template>

<script>
export default {
  name: "PmsHero",
};
</script>

<style scoped>
/* Fade-in main content */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 1.2s ease forwards;
}

/* Floating circles */
.floating-circle {
  position: absolute;
  width: 180px;
  height: 180px;
  border-radius: 9999px;
  filter: blur(40px);
  animation: float 8s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-20px, -30px); }
}

/* Stats sliding */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slideUpDelay1 { animation: slideUp 1s ease forwards 0.7s; opacity: 0; }
.animate-slideUpDelay2 { animation: slideUp 1s ease forwards 1.0s; opacity: 0; }
.animate-slideUpDelay3 { animation: slideUp 1s ease forwards 1.3s; opacity: 0; }
</style>
