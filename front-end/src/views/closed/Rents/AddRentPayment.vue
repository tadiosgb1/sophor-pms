<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xl text-sm overflow-hidden flex flex-col"
      style="max-height: calc(100vh - 2rem)">

      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600">
            <i class="fas fa-calendar-check text-sm"></i>
          </div>
          <div>
            <h2 class="font-semibold text-gray-800">Record Rent Payment</h2>
            <p class="text-xs text-gray-400">
              {{ rent.Unit?.name }} · ETB {{ Number(rent.rent_amount).toLocaleString() }} / {{ rent.rent_period }}
            </p>
          </div>
        </div>
        <button @click="$emit('close')"
          class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 text-lg leading-none">&times;</button>
      </div>

      <div class="px-6 py-5 space-y-5 overflow-y-auto flex-1">

        <!-- ── STEP 1: How many cycles? ── -->
        <div>
          <label class="form-label">
            How many {{ periodLabel }}s to pay?
            <span v-if="!rent.allow_advance_payment" class="text-gray-400 font-normal">(advance not allowed)</span>
            <span v-else class="text-blue-500 font-normal">(max {{ rent.max_advance_cycles || '∞' }})</span>
          </label>

          <!-- Cycle count selector -->
          <div class="flex items-center gap-3">
            <button type="button" @click="decreaseCycles"
              :disabled="cyclesCount <= 1"
              class="w-9 h-9 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-orange-400 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold text-lg">
              −
            </button>
            <div class="flex-1 text-center">
              <span class="text-3xl font-bold text-gray-900">{{ cyclesCount }}</span>
              <p class="text-xs text-gray-400 mt-0.5">{{ periodLabel }}{{ cyclesCount > 1 ? 's' : '' }}</p>
            </div>
            <button type="button" @click="increaseCycles"
              :disabled="!rent.allow_advance_payment || (rent.max_advance_cycles && cyclesCount >= rent.max_advance_cycles)"
              class="w-9 h-9 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-orange-400 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold text-lg">
              +
            </button>
          </div>
        </div>

        <!-- ── CYCLE PREVIEW ── -->
        <div v-if="cyclePreview.length" class="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            <i class="fas fa-calendar-days mr-1.5 text-orange-400"></i>
            Cycles this payment covers
          </p>
          <div class="space-y-2">
            <div v-for="(c, i) in cyclePreview" :key="i"
              class="flex items-center justify-between bg-white rounded-lg border border-gray-100 px-3 py-2">
              <div class="flex items-center gap-2">
                <span class="w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                  {{ i + 1 }}
                </span>
                <span class="font-medium text-gray-800 text-xs">{{ c.label }}</span>
              </div>
              <div class="text-right">
                <p class="text-xs text-gray-500">{{ formatDate(c.cycle_from) }} – {{ formatDate(c.cycle_to) }}</p>
                <p class="text-xs font-semibold text-gray-800">ETB {{ Number(c.amount).toLocaleString() }}</p>
              </div>
            </div>
          </div>
          <!-- Total -->
          <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
            <span class="text-xs font-semibold text-gray-600">Total Amount</span>
            <span class="text-base font-bold text-orange-600">ETB {{ totalAmount.toLocaleString() }}</span>
          </div>
        </div>

        <!-- Loading preview -->
        <div v-if="loadingPreview" class="text-center py-4 text-gray-400 text-xs">
          <i class="fas fa-spinner fa-spin mr-2"></i>Calculating cycles…
        </div>

        <!-- ── PAYMENT METHOD ── -->
        <div>
          <label class="form-label">Payment Method <span class="text-red-400">*</span></label>
          <div class="grid grid-cols-3 gap-2">
            <button v-for="m in methodOptions" :key="m.value" type="button"
              @click="form.payment_method = m.value"
              :class="['flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all text-xs font-medium',
                form.payment_method === m.value ? m.activeClass : 'border-gray-200 text-gray-500 hover:border-gray-300']">
              <i :class="[m.icon, 'text-lg']"></i>
              <span class="text-[10px]">{{ m.label }}</span>
            </button>
          </div>
        </div>

        <!-- Payment date -->
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

        <!-- Online: transaction ref -->
        <div v-if="isOnlineMethod">
          <label class="form-label">Transaction Reference <span class="text-red-400">*</span></label>
          <input v-model="form.transaction_ref" type="text"
            :placeholder="transactionRefPlaceholder" class="form-input font-mono" />
          <p class="text-[10px] text-gray-400 mt-1">{{ transactionRefHint }}</p>
        </div>

        <!-- Screenshot upload -->
        <div v-if="form.payment_method === 'screenshot'">
          <label class="form-label">Payment Receipt Screenshot <span class="text-red-400">*</span></label>
          <div class="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-orange-400 transition-colors cursor-pointer"
            @click="$refs.screenshotInput.click()">
            <div v-if="!screenshotPreview" class="p-6 text-center">
              <i class="fas fa-camera text-3xl text-gray-300 mb-2 block"></i>
              <p class="text-xs text-gray-400">Click to upload receipt screenshot</p>
              <p class="text-[10px] text-gray-300 mt-1">JPG, PNG supported</p>
            </div>
            <img v-else :src="screenshotPreview" class="w-full max-h-48 object-contain bg-gray-50" alt="Preview" />
          </div>
          <input ref="screenshotInput" type="file" accept="image/*" class="hidden" @change="handleScreenshot" />
          <p v-if="screenshotFile" class="text-xs text-green-600 mt-1 flex items-center gap-1">
            <i class="fas fa-check-circle"></i> {{ screenshotFile.name }}
          </p>
        </div>

        <!-- Notes -->
        <div>
          <label class="form-label">Notes</label>
          <textarea v-model="form.notes" rows="2" placeholder="Optional notes…"
            class="form-input resize-none"></textarea>
        </div>

      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
        <div class="text-xs text-gray-500">
          <span v-if="cyclePreview.length">
            Covering: <strong class="text-gray-700">{{ cyclePreview[0]?.label }}{{ cyclesCount > 1 ? ' → ' + cyclePreview[cyclePreview.length-1]?.label : '' }}</strong>
          </span>
        </div>
        <div class="flex gap-3">
          <button type="button" @click="$emit('close')"
            class="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100">Cancel</button>
          <button @click="submitForm" :disabled="submitting || !isFormValid"
            class="px-5 py-2 text-sm bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg font-medium flex items-center gap-2">
            <i v-if="submitting" class="fas fa-spinner fa-spin text-xs"></i>
            <i v-else class="fas fa-check text-xs"></i>
            Record Payment
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rent: { type: Object, required: true },
  },
  data() {
    return {
      cyclesCount:       1,
      cyclePreview:      [],
      loadingPreview:    false,
      form: {
        rent_id:         this.rent.id,
        payment_method:  'screenshot',
        payment_date:    new Date().toISOString().split('T')[0],
        payer_name:      '',
        payer_phone:     '',
        transaction_ref: '',
        notes:           '',
        created_by:      parseInt(localStorage.getItem('userId')) || null,
      },
      screenshotFile:    null,
      screenshotPreview: null,
      submitting:        false,

      methodOptions: [
        { value: 'screenshot',    label: 'Screenshot',    icon: 'fas fa-image',                activeClass: 'border-orange-400 bg-orange-50 text-orange-700' },
        { value: 'telebirr',      label: 'Telebirr',      icon: 'fas fa-mobile-screen-button', activeClass: 'border-blue-400 bg-blue-50 text-blue-700' },
        { value: 'cbebirr',       label: 'CBE Birr',      icon: 'fas fa-building-columns',     activeClass: 'border-yellow-400 bg-yellow-50 text-yellow-700' },
        { value: 'bank_transfer', label: 'Bank Transfer', icon: 'fas fa-landmark',             activeClass: 'border-indigo-400 bg-indigo-50 text-indigo-700' },
        { value: 'cash',          label: 'Cash',          icon: 'fas fa-money-bill',           activeClass: 'border-green-400 bg-green-50 text-green-700' },
      ],
    };
  },
  computed: {
    periodLabel() {
      return { monthly: 'month', quarterly: 'quarter', yearly: 'year' }[this.rent.rent_period] || 'period';
    },
    totalAmount() {
      return this.cyclePreview.reduce((s, c) => s + Number(c.amount || 0), 0);
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
      if (!this.form.payment_method || !this.cyclePreview.length) return false;
      if (this.form.payment_method === 'screenshot' && !this.screenshotFile) return false;
      if (this.isOnlineMethod && !this.form.transaction_ref) return false;
      return true;
    },
  },
  watch: {
    cyclesCount() { this.fetchPreview(); },
  },
  methods: {
    increaseCycles() {
      const max = this.rent.max_advance_cycles;
      if (!max || this.cyclesCount < max) this.cyclesCount++;
    },
    decreaseCycles() {
      if (this.cyclesCount > 1) this.cyclesCount--;
    },
    async fetchPreview() {
      this.loadingPreview = true;
      try {
        const res = await this.$apiGet('/rentpayment/preview-cycles', {
          rent_id:      this.rent.id,
          cycles_count: this.cyclesCount,
        });
        this.cyclePreview = res.cycles || [];
      } catch (e) {
        console.error(e);
        this.cyclePreview = [];
      } finally {
        this.loadingPreview = false;
      }
    },
    handleScreenshot(e) {
      const f = e.target.files[0];
      if (!f) return;
      this.screenshotFile    = f;
      this.screenshotPreview = URL.createObjectURL(f);
    },
    async submitForm() {
      if (!this.isFormValid || !this.cyclePreview.length) return;
      this.submitting = true;
      try {
        const first = this.cyclePreview[0];
        const last  = this.cyclePreview[this.cyclePreview.length - 1];

        const fd = new FormData();
        fd.append('rent_id',        this.form.rent_id);
        fd.append('payment_method', this.form.payment_method);
        fd.append('payment_date',   this.form.payment_date);
        fd.append('amount',         this.totalAmount);
        fd.append('cycles_count',   this.cyclesCount);
        fd.append('cycle_from',     first.cycle_from);
        fd.append('cycle_to',       last.cycle_to);
        fd.append('cycle_label',    this.cyclesCount === 1
          ? first.label
          : `${first.label} – ${last.label}`);

        if (this.form.payer_name)      fd.append('payer_name',      this.form.payer_name);
        if (this.form.payer_phone)     fd.append('payer_phone',     this.form.payer_phone);
        if (this.form.transaction_ref) fd.append('transaction_ref', this.form.transaction_ref);
        if (this.form.notes)           fd.append('notes',           this.form.notes);
        if (this.form.created_by)      fd.append('created_by',      this.form.created_by);
        if (this.screenshotFile)       fd.append('screenshot_url',  this.screenshotFile);

        await this.$apiPost('/rentpayment', fd, { 'Content-Type': 'multipart/form-data' });
        this.$emit('saved');
        this.$emit('close');
      } catch (e) { console.error(e); }
      finally { this.submitting = false; }
    },
    formatDate(ts) {
      if (!ts) return '—';
      return new Date(ts).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    },
  },
  mounted() { this.fetchPreview(); },
};
</script>

<style scoped>
.form-label { @apply block text-xs font-medium text-gray-600 mb-1.5; }
.form-input  { @apply w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors bg-white; }
</style>
