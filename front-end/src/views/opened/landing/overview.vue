<template>
  <section class="py-20 bg-white space-y-24">
    <!-- Dashboard / UI Preview Gallery -->
    <div aria-labelledby="dashboard-preview-title" class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 id="dashboard-preview-title" class="text-3xl font-semibold text-gray-900">Dashboard & UI Preview</h2>
        <p class="mt-3 text-gray-600 max-w-2xl mx-auto">A quick look at the clean, modern interface designed for property managers, tenants, and maintenance teams.</p>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <figure class="rounded-2xl border bg-gray-50 border-gray-100 shadow-sm overflow-hidden">
          <img src="https://placehold.co/600x380?text=Main+Dashboard" alt="Main Dashboard Preview" class="w-full h-auto" />
        </figure>
        <figure class="rounded-2xl border bg-gray-50 border-gray-100 shadow-sm overflow-hidden">
          <img src="https://placehold.co/600x380?text=Maintenance+Center" alt="Maintenance Center Preview" class="w-full h-auto" />
        </figure>
        <figure class="rounded-2xl border bg-gray-50 border-gray-100 shadow-sm overflow-hidden">
          <img src="https://placehold.co/600x380?text=Units+Overview" alt="Units Overview Preview" class="w-full h-auto" />
        </figure>
      </div>
    </div>

    <!-- Automation & AI -->
    <div aria-labelledby="automation-ai-title" class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 id="automation-ai-title" class="text-3xl font-semibold text-gray-900">Automation & AI Features</h2>
        <p class="mt-3 text-gray-600 max-w-2xl mx-auto">Reduce manual workloads with automated reminders, smart maintenance routing, and AI‑powered insights.</p>
      </div>

      <div class="grid gap-8 md:grid-cols-3">
        <div class="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition">
          <div class="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center mb-4">
            <svg class="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm1 15h-2v-2h2zm0-4h-2V7h2z" />
            </svg>
          </div>
          <h4 class="font-medium text-gray-900">Automated Rent Reminders</h4>
          <p class="mt-2 text-sm text-gray-600">Send scheduled email/SMS notifications to tenants without lifting a finger.</p>
        </div>

        <div class="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition">
          <div class="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center mb-4">
            <svg class="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4a8 8 0 1 0 .001 16.001A8 8 0 0 0 12 4zm3.707 10.293-4-4a1 1 0 0 0-1.414 1.414l4 4a1 1 0 0 0 1.414-1.414z" />
            </svg>
          </div>
          <h4 class="font-medium text-gray-900">Smart Maintenance Routing</h4>
          <p class="mt-2 text-sm text-gray-600">Automatically assigns tasks to the best available maintenance staff based on skills and location.</p>
        </div>

        <div class="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition">
          <div class="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center mb-4">
            <svg class="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-1 15v-2h2v2zm0-4V7h2v6z" />
            </svg>
          </div>
          <h4 class="font-medium text-gray-900">AI Insights & Forecasts</h4>
          <p class="mt-2 text-sm text-gray-600">Predict occupancy, revenue, and maintenance demand using AI‑driven analytics.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Replace placeholder images with real dashboard images later.
</script>

<style scoped>
figure {
  transition: transform 160ms ease, box-shadow 160ms ease;
}
figure:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 26px rgba(16, 185, 129, 0.06);
}
</style>
