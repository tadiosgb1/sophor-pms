
<template>
  <div class="tadios p-6">
    <CommonHeader />
    <h1 class="text-2xl font-bold mt-6">tadios Page</h1>

    <div class="mt-4">
      <!-- Page content -->
    </div>
  </div>
</template>

<script>
import CommonHeader from '@/components/common/CommonHeader.vue'
import commonMixin from '@/mixins/commonMixin.js'

export default {
  name: 'tadios',
  components: { CommonHeader },
  mixins: [commonMixin],

  data() {
    return {
      message: "tadios works!",
      counter: 0,
    }
  },

  created() { console.log("tadios created"); },
  mounted() { console.log("tadios mounted"); }
}
</script>

<style scoped>
</style>
