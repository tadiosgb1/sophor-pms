<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg text-sm overflow-hidden">

      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
            <i class="fas fa-money-bill-wave text-sm"></i>
          </div>
          <div>
            <h2 class="font-semibold text-gray-800">Record Payment</h2>
            <p class="text-xs text-gray-400">
              Remaining: ETB {{ remaining.toLocaleString() }}
            </p>
          </div>
        </div>
        <button @click="$emit('close')"
          class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 text-lg leading-none">&times;</button>
      </div>

      <form @submit.prevent="submitForm" class="px-6 py-5 space-y-5 max-h-[72vh] overflow-y-auto">

        <!-- Payment Method — visual selector -->
        <div>
          <label class="form-label">Payment Method <span class="text-red-400">*</span></label>
          <div class="grid grid-cols-3 gap-2">
            <button v-for="m in methodOptions" :key="m.value" type="button"
              @click="form.payment_method = m.value"
              :class="[
                'flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all text-xs font-medium',
                form.payment_method === m.value ? m.activeClass : 'border-gray-200 text-gray-500 hover:border-gray-300'
              ]">
              <i :class="[m.icon, 'text-lg']"></i>
              <span class="text-[10px]">{{ m.label }}</span>
            </button>
          </div>
        </div>

        <!-- Payment Type -->
        <div>
          <label class="form-label">Payment Type <span class="text-red-400">*</span></label>
          <div class="grid grid-cols-4 gap-2">
            <button v-for="t in typeOptions" :key="t.value" type="button"
              @click="form.payment_type = t.value"
              :class="[
                'py-2 rounded-xl border-2 transition-all text-xs font-medium',
                form.payment_type === t.value ? t.activeClass : 'border-gray-200 text-gray-500 hover:border-gray-300'
              ]">
              {{ t.label }}
            </button>
          </div>
        </div>

        <!-- Amount -->
        <div>
          <label class="form-label">Amount (ETB) <span class="text-red-400">*</span></label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">ETB</span>
            <input v-model.number="form.amount" type="number" min="1" step="0.01" required
              :placeholder="remaining.toLocaleString()" class="form-input pl-10" />
          </div>
          <p v-if="form.amount > remaining" class="text-xs text-orange-500 mt-1">
            <i class="fas fa-triangle-exclamation mr-1"></i>Amount exceeds remaining balance
          </p>
        </div>

        <!-- Payment Date -->
        <div>
          <label class="form-label">Payment Date <span class="text-red-400">*</span></label>
          <input v-model="form.payment_date" type="date" required class="form-input" />
        </div>

        <!-- Payer info -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="form-label">Payer Name</label>
            <input v-model="form.payer_name" type="text" placeholder="Full name" class="form-input" />
          </div>
          <div>
            <label class="form-label">Payer Phone</label>
            <input v-model="form.payer_phone" type="text" placeholder="09xxxxxxxx" class="form-input" />
          </div>
        </div>

        <!-- Online payment fields (Telebirr / CBE Birr / Bank) -->
        <div v-if="isOnlineMethod">
          <label class="form-label">Transaction Reference <span class="text-red-400">*</span></label>
          <input v-model="form.transaction_ref" type="text"
            :placeholder="transactionRefPlaceholder" class="form-input font-mono" />
          <p class="text-[10px] text-gray-400 mt-1">{{ transactionRefHint }}</p>
        </div>

        <!-- Screenshot upload (for screenshot method) -->
        <div v-if="form.payment_method === 'screenshot'">
          <label class="form-label">Payment Receipt Screenshot <span class="text-red-400">*</span></label>
          <div class="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-orange-400 transition-colors cursor-pointer"
            @click="$refs.screenshotInput.click()">
            <div v-if="!screenshotPreview" class="p-6 text-center">
              <i class="fas fa-camera text-3xl text-gray-300 mb-2 block"></i>
              <p class="text-xs text-gray-400">Click to upload receipt screenshot</p>
              <p class="text-[10px] text-gray-300 mt-1">JPG, PNG supported</p>
            </div>
            <img v-else :src="screenshotPreview" class="w-full max-h-48 object-contain bg-gray-50" alt="Receipt preview" />
          </div>
          <input ref="screenshotInput" type="file" accept="image/*" class="hidden" @change="handleScreenshot" />
          <p v-if="screenshotFile" class="text-xs text-green-600 mt-1 flex items-center gap-1">
            <i class="fas fa-check-circle"></i> {{ screenshotFile.name }}
          </p>
        </div>

        <!-- Notes -->
        <div>
          <label class="form-label">Notes</label>
          <textarea v-model="form.notes" rows="2" placeholder="Optional notes about this payment…"
            class="form-input resize-none"></textarea>
        </div>

      </form>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
        <button type="button" @click="$emit('close')"
          class="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100">Cancel</button>
        <button @click="submitForm" :disabled="submitting || !isFormValid"
          class="px-5 py-2 text-sm bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg font-medium flex items-center gap-2">
          <i v-if="submitting" class="fas fa-spinner fa-spin text-xs"></i>
          <i v-else class="fas fa-check text-xs"></i>
          Record Payment
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    saleId:    { type: [Number, String], required: true },
    salePrice: { type: [Number, String], default: 0 },
    paidTotal: { type: Number, default: 0 },
  },
  data() {
    return {
      form: {
        sale_id:        this.saleId,
        payment_method: 'screenshot',
        payment_type:   'partial',
        amount:         '',
        payment_date:   new Date().toISOString().split('T')[0],
        payer_name:     '',
        payer_phone:    '',
        transaction_ref: '',
        notes:          '',
        created_by:     parseInt(localStorage.getItem('userId')) || null,
      },
      screenshotFile:    null,
      screenshotPreview: null,
      submitting:        false,

      methodOptions: [
        { value: 'screenshot',    label: 'Screenshot',    icon: 'fas fa-image',                 activeClass: 'border-orange-400 bg-orange-50 text-orange-700' },
        { value: 'telebirr',      label: 'Telebirr',      icon: 'fas fa-mobile-screen-button',  activeClass: 'border-blue-400 bg-blue-50 text-blue-700' },
        { value: 'cbebirr',       label: 'CBE Birr',      icon: 'fas fa-building-columns',      activeClass: 'border-yellow-400 bg-yellow-50 text-yellow-700' },
        { value: 'bank_transfer', label: 'Bank Transfer', icon: 'fas fa-landmark',              activeClass: 'border-indigo-400 bg-indigo-50 text-indigo-700' },
        { value: 'cash',          label: 'Cash',          icon: 'fas fa-money-bill',            activeClass: 'border-green-400 bg-green-50 text-green-700' },
      ],
      typeOptions: [
        { value: 'deposit',     label: 'Deposit',     activeClass: 'border-teal-400 bg-teal-50 text-teal-700' },
        { value: 'partial',     label: 'Partial',     activeClass: 'border-blue-400 bg-blue-50 text-blue-700' },
        { value: 'installment', label: 'Installment', activeClass: 'border-purple-400 bg-purple-50 text-purple-700' },
        { value: 'full',        label: 'Full',        activeClass: 'border-green-400 bg-green-50 text-green-700' },
      ],
    };
  },
  computed: {
    remaining() {
      return Math.max(0, Number(this.salePrice) - this.paidTotal);
    },
    isOnlineMethod() {
      return ['telebirr', 'cbebirr', 'bank_transfer'].includes(this.form.payment_method);
    },
    transactionRefPlaceholder() {
      return { telebirr: 'e.g. TXN123456789', cbebirr: 'e.g. CBE987654321', bank_transfer: 'e.g. TRF20250101001' }[this.form.payment_method] || '';
    },
    transactionRefHint() {
      return {
        telebirr:      'Enter the Telebirr transaction ID from the confirmation SMS',
        cbebirr:       'Enter the CBE Birr reference number from the app',
        bank_transfer: 'Enter the bank transfer reference/slip number',
      }[this.form.payment_method] || '';
    },
    isFormValid() {
      if (!this.form.amount || !this.form.payment_method) return false;
      if (this.form.payment_method === 'screenshot' && !this.screenshotFile) return false;
      if (this.isOnlineMethod && !this.form.transaction_ref) return false;
      return true;
    },
  },
  methods: {
    handleScreenshot(e) {
      const f = e.target.files[0];
      if (!f) return;
      this.screenshotFile    = f;
      this.screenshotPreview = URL.createObjectURL(f);
    },
    async submitForm() {
      if (!this.isFormValid) return;
      this.submitting = true;
      try {
        const fd = new FormData();
        Object.entries(this.form).forEach(([k, v]) => {
          if (v !== null && v !== '') fd.append(k, v);
        });
        if (this.screenshotFile) fd.append('screenshot_url', this.screenshotFile);

        await this.$apiPost('/salepayment', fd, { 'Content-Type': 'multipart/form-data' });
        this.$emit('saved');
        this.$emit('close');
      } catch (e) { console.error(e); }
      finally { this.submitting = false; }
    },
  },
};
</script>

<style scoped>
.form-label { @apply block text-xs font-medium text-gray-600 mb-1.5; }
.form-input  { @apply w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-colors bg-white; }
</style>
