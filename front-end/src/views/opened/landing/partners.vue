<template>
  <section aria-labelledby="partners-title" class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 id="partners-title" class="text-2xl font-semibold text-gray-900">Trusted by partners & integrations</h2>
          <p class="mt-1 text-sm text-gray-600 max-w-xl">Seamless integrations and trusted partners that power payments, communication, accounting and more.</p>
        </div>
        <div class="hidden sm:flex items-center gap-3">
          <a href="/integrations" class="text-sm font-medium text-green-600 hover:underline">See all integrations</a>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center">
        <figure class="flex items-center justify-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
          <svg class="h-10 w-auto" viewBox="0 0 100 30" aria-hidden="true" fill="none">
            <rect width="100" height="30" rx="6" fill="#10B981" />
            <text x="50" y="19" font-size="12" text-anchor="middle" fill="white" font-family="Inter, sans-serif">Chappa</text>
          </svg>
        </figure>

        <figure class="flex items-center justify-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
          <svg class="h-10 w-auto" viewBox="0 0 100 30" aria-hidden="true" fill="none">
            <rect width="100" height="30" rx="6" fill="#1F2937" />
            <text x="50" y="19" font-size="12" text-anchor="middle" fill="white" font-family="Inter, sans-serif">CBE E-birr</text>
          </svg>
        </figure>

        <figure class="flex items-center justify-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
          <svg class="h-10 w-auto" viewBox="0 0 100 30" aria-hidden="true" fill="none">
            <rect width="100" height="30" rx="6" fill="#111827" />
            <text x="50" y="19" font-size="12" text-anchor="middle" fill="#60A5FA" font-family="Inter, sans-serif">Ethio-telecom</text>
          </svg>
        </figure>

        <figure class="flex items-center justify-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
          <svg class="h-10 w-auto" viewBox="0 0 100 30" aria-hidden="true" fill="none">
            <rect width="100" height="30" rx="6" fill="#F59E0B" />
            <text x="50" y="19" font-size="12" text-anchor="middle" fill="white" font-family="Inter, sans-serif">Centim pay</text>
          </svg>
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup>
// Static component — swap SVGs with real logos or <img> tags when available.
</script>

<style scoped>
figure { transition: transform 180ms ease, box-shadow 180ms ease; }
figure:hover { transform: translateY(-6px); box-shadow: 0 12px 30px rgba(16,185,129,0.06); }
</style>
