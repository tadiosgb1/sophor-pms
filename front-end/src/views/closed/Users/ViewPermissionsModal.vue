<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4 overflow-y-auto">
    <div
      class="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 md:p-8"
      style="max-height: 90vh; overflow-y: auto;"
    >
      <!-- Header -->
      <div class="flex justify-between items-center mb-4 border-b pb-2">
        <h2 class="text-xl md:text-2xl font-bold text-gray-800">Selected User Permissions</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
      </div>

      <!-- Permissions List -->
      <ul class="divide-y divide-gray-200 max-h-[60vh] overflow-y-auto">
        <li
          v-for="p in permissions"
          :key="p.id"
          class="py-2 text-gray-800"
        >
          <span class="font-medium">{{ p.code }}</span> — {{ p.name }}
        </li>
      </ul>

      <!-- Close Button -->
      <div class="mt-4 flex justify-end">
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["permissions"],
};
</script>
