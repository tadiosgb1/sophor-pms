
<template>
  <div class="reports p-6">
    <CommonHeader />
    <h1 class="text-2xl font-bold mt-6">reports Page</h1>

    <div class="mt-4">
      <!-- Page content -->
    </div>
  </div>
</template>

<script>
import CommonHeader from '@/components/common/CommonHeader.vue'
import commonMixin from '@/mixins/commonMixin.js'

export default {
  name: 'reports',
  components: { CommonHeader },
  mixins: [commonMixin],

  data() {
    return {
      message: "reports works!",
      counter: 0,
    }
  },

  created() { console.log("reports created"); },
  mounted() { console.log("reports mounted"); }
}
</script>

<style scoped>
</style>
