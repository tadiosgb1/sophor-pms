
<template>
  <div class="view p-6">
    <CommonHeader />
    <h1 class="text-2xl font-bold mt-6">view Page</h1>

    <div class="mt-4">
      <!-- Page content -->
    </div>
  </div>
</template>

<script>
import CommonHeader from '@/components/common/CommonHeader.vue'
import commonMixin from '@/mixins/commonMixin.js'

export default {
  name: 'view',
  components: { CommonHeader },
  mixins: [commonMixin],

  data() {
    return {
      message: "view works!",
      counter: 0,
    }
  },

  created() { console.log("view created"); },
  mounted() { console.log("view mounted"); }
}
</script>

<style scoped>
</style>
