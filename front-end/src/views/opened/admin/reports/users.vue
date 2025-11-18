
<template>
  <div class="users p-6">
    <CommonHeader />
    <h1 class="text-2xl font-bold mt-6">users Page</h1>

    <div class="mt-4">
      <!-- Page content -->
    </div>
  </div>
</template>

<script>
import CommonHeader from '@/components/common/CommonHeader.vue'
import commonMixin from '@/mixins/commonMixin.js'

export default {
  name: 'users',
  components: { CommonHeader },
  mixins: [commonMixin],

  data() {
    return {
      message: "users works!",
      counter: 0,
    }
  },

  created() { console.log("users created"); },
  mounted() { console.log("users mounted"); }
}
</script>

<style scoped>
</style>
