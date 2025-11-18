<template>
  <section aria-labelledby="testimonials-title" class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="text-center mb-10">
        <h2 id="testimonials-title" class="text-3xl font-semibold text-gray-900">What our customers say</h2>
        <p class="mt-2 text-gray-600 max-w-2xl mx-auto">Real outcomes from property managers, owners and maintenance teams who switched to our platform.</p>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="(t, i) in testimonials"
          :key="i"
          class="flex flex-col h-full rounded-2xl border border-gray-100 p-6 shadow-sm"
          role="article"
          :aria-label="`Testimonial from ${t.name}`"
        >
          <header class="flex items-start gap-4">
            <div class="flex-none">
              <div class="h-12 w-12 flex items-center justify-center rounded-full bg-green-50 text-green-700 font-semibold text-sm">{{ t.initials }}</div>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">{{ t.name }}</p>
              <p class="text-xs text-gray-500">{{ t.role }} — {{ t.company }}</p>
            </div>
            <div class="flex-none ml-3 text-green-500" aria-hidden="true">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7.17 6A5.002 5.002 0 0 0 2 11v7a2 2 0 0 0 2 2h7a5 5 0 0 0 5-5v-1a5 5 0 0 0-5-5H7.17zM21.17 6A5.002 5.002 0 0 0 16 11v7a2 2 0 0 0 2 2h1.17A5.002 5.002 0 0 0 24 15V9a3 3 0 0 0-2.83-3H21.17z"/>
              </svg>
            </div>
          </header>

          <div class="mt-4 flex-1">
            <p class="text-gray-700 leading-relaxed">"{{ t.message }}"</p>
          </div>

          <footer class="mt-6 flex items-center justify-between">
            <div class="flex items-center gap-2" aria-hidden="true">
              <template v-for="n in 5">
                <svg v-if="n <= Math.round(t.rating)" key="n" class="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 0 0 .95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 0 0-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 0 0-1.175 0l-3.38 2.455c-.784.57-1.839-.196-1.54-1.118l1.287-3.966a1 1 0 0 0-.364-1.118L2.06 9.393c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 0 0 .95-.69L9.05 2.927z" />
                </svg>
              </template>
            </div>

            <div class="text-xs text-gray-500">Verified customer</div>
          </footer>
        </article>
      </div>

      <div class="mt-10 text-center">
        <a href="/signup" class="inline-flex items-center gap-3 rounded-full bg-green-500 text-white px-6 py-3 text-sm font-medium shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">Start your free trial</a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const testimonials = ref([
  {
    name: 'Tadesse Gebremicheal',
    initials: 'AY',
    role: 'Property Manager',
    company: 'NorthStar Properties',
    rating: 5,
    message: 'Since we switched to GreenPMS, maintenance response time dropped by 45% and tenant satisfaction has never been higher.'
  },
  {
    name: 'Bruh Teshome',
    initials: 'DO',
    role: 'Owner',
    company: 'Harbor Rentals',
    rating: 4.5,
    message: 'The automation for rent reminders and integrated payments saved us hours every month — highly recommend.'
  },
  {
    name: 'Kalayu Redae',
    initials: 'LB',
    role: 'Maintenance Lead',
    company: 'Citywide Maintenance',
    rating: 4,
    message: 'Assigning and tracking jobs is effortless. The photo uploads and status updates keep everyone aligned.'
  }
])
</script>

<style scoped>
/* subtle card hover */
article:hover {
  transform: translateY(-4px);
  transition: transform 160ms ease-in-out;
}

article { transition: box-shadow 160ms ease-in-out; }

article:focus-within { box-shadow: 0 6px 20px rgba(16, 185, 129, 0.08); }
</style>