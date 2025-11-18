<template>
  <section aria-labelledby="product-tour-title" class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 id="product-tour-title" class="text-3xl font-semibold text-gray-900">Product Tour</h2>
        <p class="mt-3 text-gray-600 max-w-2xl mx-auto">
          See the platform in action — a short walk-through of the dashboard, unit management, maintenance center, and automation tools.
        </p>
      </div>

      <!-- Video Container -->
      <div class="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-lg bg-black">
        <div class="aspect-w-16 aspect-h-9">
          <!-- Replace the source with your OBS recorded video -->
          <video
            controls
            class="w-full h-full"
            poster="https://placehold.co/1200x675?text=Product+Tour+Preview"
          >
            <source src="../../../assets//videos/productTour.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <!-- Key Highlights Under Video -->
      <div class="grid gap-8 md:grid-cols-3 mt-12">
        <div class="text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div class="h-12 w-12 mx-auto flex items-center justify-center rounded-xl bg-green-50 text-green-600 mb-3">
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm4 0h14v-2H7v2z"/></svg>
          </div>
          <h4 class="font-medium text-gray-900">Clean Modern Dashboard</h4>
          <p class="mt-2 text-sm text-gray-600">Get a high-level overview of occupancy, payments, and maintenance at a glance.</p>
        </div>

        <div class="text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div class="h-12 w-12 mx-auto flex items-center justify-center rounded-xl bg-green-50 text-green-600 mb-3">
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v2H4V4zm0 7h16v2H4v-2zm0 7h16v2H4v-2z"/></svg>
          </div>
          <h4 class="font-medium text-gray-900">Manage Units & Requests</h4>
          <p class="mt-2 text-sm text-gray-600">Track all units, tenants, and maintenance progress in one unified interface.</p>
        </div>

        <div class="text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div class="h-12 w-12 mx-auto flex items-center justify-center rounded-xl bg-green-50 text-green-600 mb-3">
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-2h2zm0-4h-2V7h2z"/></svg>
          </div>
          <h4 class="font-medium text-gray-900">Automation & AI Insights</h4>
          <p class="mt-2 text-sm text-gray-600">Discover how the system saves time using automated reminders and predictive analytics.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Replace the video source with your actual product tour video once recorded.
</script>

<style scoped>
.aspect-w-16 {
  position: relative;
  width: 100%;
  padding-bottom: calc(100% / 16 * 9);
}
.aspect-w-16 > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
