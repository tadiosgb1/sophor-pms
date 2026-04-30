<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <Loading :visible="loading" message="Loading rental..." />

    <!-- Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <div class="flex items-center gap-3">
        <button @click="$router.back()"
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 shadow-sm transition-colors">
          <i class="fas fa-arrow-left text-xs"></i>
        </button>
        <div>
          <h1 class="text-lg font-bold text-gray-800">Rental Detail</h1>
          <p class="text-xs text-gray-400">{{ item.Unit?.name || '' }} · {{ item.renter?.first_name }} {{ item.renter?.last_name }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button @click="showEditModal = true"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
          <i class="fas fa-pen text-[10px]"></i> Edit
        </button>
        <button @click="deleteModalVisible = true"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
          <i class="fas fa-trash text-[10px]"></i> Delete
        </button>
      </div>
    </div>

    <template v-if="!loading && item.id">

      <!-- Status banner -->
      <div :class="statusBannerClass(item.status)" class="rounded-xl p-5 mb-5 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-white bg-opacity-60 flex items-center justify-center">
            <i class="fas fa-house-user text-2xl"></i>
          </div>
          <div>
            <p class="font-bold text-lg">{{ item.Unit?.name || 'Rental' }}</p>
            <p class="text-xs opacity-75">{{ item.Site?.name }} · {{ item.rent_period }}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-3xl font-bold">ETB {{ Number(item.rent_amount).toLocaleString() }}</p>
          <p class="text-xs opacity-75">per {{ item.rent_period }}</p>
          <span :class="statusBadge(item.status)" class="px-2 py-0.5 rounded-full text-xs font-medium capitalize mt-1 inline-block">
            {{ item.status }}
          </span>
        </div>
      </div>

      <!-- Overdue alert -->
      <div v-if="isOverdue" class="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-3 mb-5">
        <i class="fas fa-triangle-exclamation text-red-500"></i>
        <div>
          <p class="font-semibold text-red-700 text-xs">Payment Overdue</p>
          <p class="text-xs text-red-500">Next due date was {{ formatDate(item.next_due_date) }}</p>
        </div>
      </div>

      <!-- Detail grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

        <!-- Lease info -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <i class="fas fa-file-contract text-pink-400 text-xs"></i>
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Lease Info</span>
          </div>
          <div class="p-5 space-y-3">
            <div class="detail-row"><span class="detail-label">Rent Amount</span>
              <span class="font-bold text-gray-900 text-sm">ETB {{ Number(item.rent_amount).toLocaleString() }}</span>
            </div>
            <div class="detail-row"><span class="detail-label">Deposit</span>
              <span class="detail-value">ETB {{ Number(item.deposit_amount).toLocaleString() }}</span>
            </div>
            <div class="detail-row"><span class="detail-label">Period</span>
              <span class="detail-value capitalize">{{ item.rent_period }}</span>
            </div>
            <div class="detail-row"><span class="detail-label">Start Date</span>
              <span class="detail-value">{{ formatDate(item.start_date) }}</span>
            </div>
            <div class="detail-row"><span class="detail-label">Next Due</span>
              <span :class="isOverdue ? 'text-red-600 font-semibold' : 'text-gray-800'" class="text-xs text-right">
                {{ formatDate(item.next_due_date) }}
              </span>
            </div>
            <div class="detail-row"><span class="detail-label">Status</span>
              <span :class="statusBadge(item.status)" class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">{{ item.status }}</span>
            </div>
            <div v-if="item.notes" class="pt-2 border-t border-gray-100">
              <p class="text-xs text-gray-400 mb-1">Notes</p>
              <p class="text-gray-700 text-xs leading-relaxed bg-gray-50 rounded-lg p-3">{{ item.notes }}</p>
            </div>
          </div>
        </div>

        <!-- Property -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <i class="fas fa-building text-teal-400 text-xs"></i>
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Property</span>
          </div>
          <div class="p-5 space-y-4">
            <div v-if="item.Unit" class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                <i class="fas fa-door-open text-sm"></i>
              </div>
              <div>
                <p class="text-xs text-gray-400">Unit</p>
                <p class="font-semibold text-gray-800">{{ item.Unit.name }}</p>
                <p class="text-xs text-gray-400">Floor {{ item.Unit.floor }} · #{{ item.Unit.house_number }}</p>
              </div>
            </div>
            <div v-if="item.Site" class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                <i class="fas fa-map-pin text-sm"></i>
              </div>
              <div>
                <p class="text-xs text-gray-400">Site</p>
                <p class="font-semibold text-gray-800">{{ item.Site.name }}</p>
                <p class="text-xs text-gray-400">{{ item.Site.city }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Renter -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <i class="fas fa-user text-orange-400 text-xs"></i>
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Renter / Tenant</span>
          </div>
          <div class="p-5">
            <template v-if="item.renter">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm shrink-0">
                  {{ item.renter.first_name?.[0] }}{{ item.renter.last_name?.[0] }}
                </div>
                <div>
                  <p class="font-semibold text-gray-800">{{ item.renter.first_name }} {{ item.renter.last_name }}</p>
                  <p class="text-xs text-gray-400">{{ item.renter.email }}</p>
                  <p class="text-xs text-gray-400">{{ item.renter.phone }}</p>
                </div>
              </div>
            </template>
            <p v-else class="text-gray-400 text-xs">Renter ID: {{ item.renter_id || '—' }}</p>
          </div>
        </div>

        <!-- Record info -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <i class="fas fa-clock text-gray-400 text-xs"></i>
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Record Info</span>
          </div>
          <div class="p-5 space-y-3">
            <div class="detail-row"><span class="detail-label">Owner</span>
              <span class="detail-value">{{ item.owner ? item.owner.first_name + ' ' + item.owner.last_name : '—' }}</span>
            </div>
            <div class="detail-row"><span class="detail-label">Created by</span>
              <span class="detail-value">{{ item.createdBy ? item.createdBy.first_name + ' ' + item.createdBy.last_name : '—' }}</span>
            </div>
            <div class="detail-row"><span class="detail-label">Updated by</span>
              <span class="detail-value">{{ item.updatedBy ? item.updatedBy.first_name + ' ' + item.updatedBy.last_name : '—' }}</span>
            </div>
            <div class="detail-row"><span class="detail-label">Created at</span>
              <span class="detail-value">{{ formatDate(item.createdAt) }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Documents section -->
      <div class="mt-5 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i class="fas fa-file-lines text-indigo-400 text-xs"></i>
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Rent Documents</span>
          </div>
          <button @click="showAddDocument = true"
            class="flex items-center gap-1 text-xs bg-orange-500 hover:bg-orange-600 text-white px-2.5 py-1 rounded-lg transition-colors">
            <i class="fas fa-plus text-[10px]"></i> Add Document
          </button>
        </div>

        <div v-if="item.documents && item.documents.length" class="divide-y divide-gray-100">
          <div v-for="doc in item.documents" :key="doc.id"
            class="px-5 py-3 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <i class="fas fa-file-pdf text-xs"></i>
              </div>
              <div>
                <p class="font-medium text-gray-800 text-xs">{{ doc.document_name }}</p>
                <a v-if="doc.document_url" :href="doc.document_url" target="_blank"
                  class="text-xs text-orange-500 hover:underline">View document</a>
              </div>
            </div>
            <div class="flex gap-2">
              <button @click="editDocument(doc)"
                class="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 text-xs">
                <i class="fas fa-pen"></i>
              </button>
              <button @click="deleteDocument(doc.id)"
                class="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 text-xs">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
        <div v-else class="px-5 py-8 text-center text-gray-400 text-xs italic">No documents uploaded yet.</div>
      </div>

      <!-- ══════════════════════════════════════════════════════════════ -->
      <!-- PAYMENT CYCLES SECTION                                         -->
      <!-- ══════════════════════════════════════════════════════════════ -->
      <div class="mt-5 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        <!-- Section header -->
        <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div class="flex items-center gap-2 flex-wrap">
            <i class="fas fa-calendar-check text-pink-500 text-xs"></i>
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Payment Cycles</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
              {{ verifiedCycles }} cycle{{ verifiedCycles !== 1 ? 's' : '' }} paid
            </span>
            <span v-if="item.allow_advance_payment"
              class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-600">
              <i class="fas fa-forward-fast mr-0.5"></i>
              Advance up to {{ item.max_advance_cycles || '∞' }} cycles allowed
            </span>
          </div>
          <button @click="showAddPayment = true"
            class="flex items-center gap-1 text-xs bg-orange-500 hover:bg-orange-600 text-white px-2.5 py-1 rounded-lg transition-colors shrink-0">
            <i class="fas fa-plus text-[10px]"></i> Record Payment
          </button>
        </div>

        <!-- Payment summary bar -->
        <div class="px-5 pt-4 pb-3 border-b border-gray-100">
          <div class="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span>Paid cycles</span>
            <span class="font-semibold text-gray-700">{{ verifiedCycles }} / {{ totalCycles }} cycles</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2 mb-1">
            <div class="h-2 rounded-full transition-all duration-500"
              :class="cyclePercent >= 100 ? 'bg-green-500' : cyclePercent >= 50 ? 'bg-orange-400' : 'bg-yellow-400'"
              :style="{ width: Math.min(cyclePercent, 100) + '%' }"></div>
          </div>
          <div class="flex items-center justify-between text-[10px] text-gray-400">
            <span>ETB {{ paidAmount.toLocaleString() }} paid</span>
            <span :class="isOverdue ? 'text-red-600 font-semibold' : 'text-gray-400'">
              Next due: {{ formatDate(item.next_due_date) }}
              <span v-if="isOverdue" class="ml-1 bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">Overdue</span>
            </span>
          </div>
        </div>

        <!-- Payment list -->
        <div v-if="item.payments && item.payments.length" class="divide-y divide-gray-100">
          <div v-for="pay in item.payments" :key="pay.id"
            class="px-5 py-4 transition-colors"
            :class="{ 'bg-red-50': pay.status === 'rejected', 'bg-green-50': pay.status === 'verified' }">

            <div class="flex items-start gap-4">
              <!-- Method icon -->
              <div :class="methodIconBg(pay.payment_method)"
                class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <i :class="methodIcon(pay.payment_method)" class="text-base"></i>
              </div>

              <div class="flex-1 min-w-0">
                <!-- Top row: cycle label + amount + badges + status -->
                <div class="flex items-center flex-wrap gap-2 mb-1">
                  <span class="font-bold text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded-lg text-xs">
                    <i class="fas fa-calendar-days text-gray-400 mr-1 text-[10px]"></i>{{ pay.cycle_label }}
                  </span>
                  <span v-if="pay.cycles_count > 1"
                    class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700">
                    {{ pay.cycles_count }} cycles
                  </span>
                  <span class="font-semibold text-gray-800 text-xs">ETB {{ Number(pay.amount).toLocaleString() }}</span>
                  <span :class="methodBadge(pay.payment_method)" class="px-2 py-0.5 rounded-full text-[10px] font-medium">
                    {{ formatMethod(pay.payment_method) }}
                  </span>
                  <span :class="payStatusBadge(pay.status)" class="px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ml-auto">
                    {{ pay.status }}
                  </span>
                </div>

                <!-- Cycle date range -->
                <p class="text-[10px] text-gray-400 mb-1">
                  <i class="fas fa-arrows-left-right mr-1"></i>
                  {{ formatDate(pay.cycle_from) }} → {{ formatDate(pay.cycle_to) }}
                </p>

                <!-- Payer + payment date -->
                <p class="text-xs text-gray-500">
                  <i class="fas fa-user text-gray-300 mr-1"></i>
                  {{ pay.payer_name || (pay.payer ? pay.payer.first_name + ' ' + pay.payer.last_name : '—') }}
                  <span v-if="pay.payer_phone" class="text-gray-400"> · {{ pay.payer_phone }}</span>
                  <span class="text-gray-400"> · Paid {{ formatDate(pay.payment_date) }}</span>
                </p>

                <!-- Transaction ref -->
                <p v-if="pay.transaction_ref" class="text-[10px] text-gray-400 font-mono mt-0.5">
                  <i class="fas fa-hashtag text-gray-300 mr-0.5"></i>{{ pay.transaction_ref }}
                </p>

                <!-- Notes -->
                <p v-if="pay.notes" class="text-[10px] text-gray-500 mt-1 italic">{{ pay.notes }}</p>

                <!-- Rejection reason — prominent red box -->
                <div v-if="pay.status === 'rejected' && pay.rejection_reason"
                  class="mt-2 flex items-start gap-2 bg-red-100 border border-red-200 rounded-lg px-3 py-2">
                  <i class="fas fa-circle-xmark text-red-500 mt-0.5 shrink-0"></i>
                  <div>
                    <p class="text-[10px] font-semibold text-red-700 mb-0.5">Rejection Reason</p>
                    <p class="text-[10px] text-red-600 leading-relaxed">{{ pay.rejection_reason }}</p>
                  </div>
                </div>

                <!-- Verified by -->
                <p v-if="pay.status === 'verified' && pay.verifier" class="text-[10px] text-green-600 mt-1">
                  <i class="fas fa-circle-check mr-0.5"></i>
                  Verified by {{ pay.verifier.first_name }} {{ pay.verifier.last_name }}
                  <span v-if="pay.verified_at"> on {{ formatDate(pay.verified_at) }}</span>
                </p>

                <!-- Screenshot — large clickable preview -->
                <div v-if="pay.screenshot_url" class="mt-3">
                  <p class="text-[10px] text-gray-400 mb-1.5"><i class="fas fa-image mr-1"></i>Payment Receipt</p>
                  <button @click="lightboxUrl = pay.screenshot_url"
                    class="relative group block w-full max-w-xs rounded-xl overflow-hidden border-2 border-gray-200 hover:border-orange-400 transition-colors shadow-sm">
                    <img :src="pay.screenshot_url" class="w-full object-cover max-h-48" alt="Receipt" />
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                      <span class="opacity-0 group-hover:opacity-100 bg-white text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full shadow transition-opacity flex items-center gap-1.5">
                        <i class="fas fa-expand text-[10px]"></i> View Full Size
                      </span>
                    </div>
                  </button>
                </div>

                <!-- Action buttons -->
                <div class="flex items-center gap-2 mt-3">
                  <template v-if="pay.status === 'pending'">
                    <button @click="verifyPayment(pay.id)"
                      class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                      <i class="fas fa-check text-[10px]"></i> Approve
                    </button>
                    <button @click="openRejectModal(pay)"
                      class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                      <i class="fas fa-times text-[10px]"></i> Reject
                    </button>
                  </template>
                  <button v-if="pay.status === 'rejected'" @click="verifyPayment(pay.id)"
                    class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-green-300 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <i class="fas fa-rotate-left text-[10px]"></i> Approve Anyway
                  </button>
                  <button @click="deletePayment(pay.id)"
                    class="ml-auto flex items-center gap-1 px-2 py-1.5 text-[10px] text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="px-5 py-10 text-center">
          <i class="fas fa-calendar-check text-3xl text-gray-200 mb-2 block"></i>
          <p class="text-gray-400 text-xs italic">No payments recorded yet.</p>
          <button @click="showAddPayment = true" class="mt-3 text-xs text-orange-500 hover:underline">
            Record first payment
          </button>
        </div>
      </div>

      <!-- Lightbox -->
      <div v-if="lightboxUrl" @click.self="lightboxUrl = null"
        class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[100] p-4">
        <div class="relative max-w-3xl w-full">
          <button @click="lightboxUrl = null"
            class="absolute -top-10 right-0 text-white hover:text-gray-300 text-sm flex items-center gap-2">
            <i class="fas fa-times"></i> Close
          </button>
          <img :src="lightboxUrl" class="w-full rounded-xl shadow-2xl max-h-[80vh] object-contain" alt="Receipt" />
          <a :href="lightboxUrl" target="_blank" download
            class="mt-3 flex items-center justify-center gap-2 text-xs text-white hover:text-orange-300 transition-colors">
            <i class="fas fa-download"></i> Download Receipt
          </a>
        </div>
      </div>

    </template>

    <!-- Modals -->
    <edit-rent v-if="showEditModal" :data="item" @close="showEditModal=false" @saved="reload" />
    <AddRentDocument v-if="showAddDocument" :data="{ rent_id: item.id }" @close="showAddDocument=false" @saved="reload" />
    <EditRentDocument v-if="editingDocument" :data="editingDocument" @close="editingDocument=null" @saved="reload" />
    <AddRentPayment v-if="showAddPayment" :rent="item" @close="showAddPayment=false" @saved="reload" />

    <!-- Reject modal -->
    <div v-if="rejectingPayment" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md text-sm overflow-hidden">
        <div class="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-red-50">
          <div class="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-500 shrink-0">
            <i class="fas fa-circle-xmark text-lg"></i>
          </div>
          <div>
            <h2 class="font-semibold text-gray-800">Reject Payment</h2>
            <p class="text-xs text-gray-500">
              {{ rejectingPayment.cycle_label }} · ETB {{ Number(rejectingPayment.amount).toLocaleString() }} · {{ formatMethod(rejectingPayment.payment_method) }}
            </p>
          </div>
        </div>
        <!-- Screenshot preview inside reject modal -->
        <div v-if="rejectingPayment.screenshot_url" class="px-6 pt-4">
          <p class="text-xs text-gray-400 mb-2">Submitted Receipt</p>
          <button @click="lightboxUrl = rejectingPayment.screenshot_url"
            class="relative group block w-full rounded-xl overflow-hidden border border-gray-200 hover:border-red-300 transition-colors">
            <img :src="rejectingPayment.screenshot_url" class="w-full max-h-40 object-cover" alt="Receipt" />
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
              <span class="opacity-0 group-hover:opacity-100 bg-white text-gray-700 text-xs px-3 py-1 rounded-full shadow transition-opacity">
                <i class="fas fa-expand mr-1"></i>View Full
              </span>
            </div>
          </button>
        </div>
        <div class="px-6 py-4">
          <label class="block text-xs font-medium text-gray-600 mb-1.5">
            Reason for rejection <span class="text-red-400">*</span>
          </label>
          <textarea v-model="rejectionReason" rows="3"
            placeholder="e.g. Amount mismatch, blurry screenshot, wrong reference number…"
            class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"></textarea>
          <p class="text-[10px] text-gray-400 mt-1">This reason will be visible to the payer.</p>
        </div>
        <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button @click="rejectingPayment=null; rejectionReason=''"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 text-sm">Cancel</button>
          <button @click="confirmReject" :disabled="!rejectionReason.trim()"
            class="px-5 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium flex items-center gap-2">
            <i class="fas fa-times text-xs"></i> Reject Payment
          </button>
        </div>
      </div>
    </div>

    <delete-confirm-modal :visible="deleteModalVisible" title="Delete Rental"
      message="Are you sure you want to delete this rental?"
      @confirm="confirmDelete" @cancel="deleteModalVisible=false" />
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue";
import EditRent from "./EditRent.vue";
import AddRentDocument from "../Rentdocuments/AddRentDocument.vue";
import EditRentDocument from "../Rentdocuments/EditRentDocument.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";
import AddRentPayment from "./AddRentPayment.vue";

export default {
  components: { Loading, EditRent, AddRentDocument, EditRentDocument, DeleteConfirmModal, AddRentPayment },
  data() {
    return {
      item: {}, loading: false,
      showEditModal: false, showAddDocument: false,
      editingDocument: null, deleteModalVisible: false,
      showAddPayment: false,
      rejectingPayment: null,
      rejectionReason: '',
      lightboxUrl: null,
    };
  },
  computed: {
    isOverdue() {
      return this.item.status === 'active' && this.item.next_due_date && new Date(this.item.next_due_date) < new Date();
    },
    verifiedCycles() {
      if (!this.item.payments) return 0;
      return this.item.payments
        .filter(p => p.status === 'verified')
        .reduce((s, p) => s + (p.cycles_count || 1), 0);
    },
    totalCycles() {
      if (!this.item.payments) return 0;
      return this.item.payments.reduce((s, p) => s + (p.cycles_count || 1), 0);
    },
    paidAmount() {
      if (!this.item.payments) return 0;
      return this.item.payments
        .filter(p => p.status === 'verified')
        .reduce((s, p) => s + Number(p.amount || 0), 0);
    },
    cyclePercent() {
      if (!this.totalCycles) return 0;
      return Math.round((this.verifiedCycles / this.totalCycles) * 100);
    },
  },
  methods: {
    async loadItem() {
      this.loading = true;
      try {
        const res = await this.$apiGetById('/rent', this.$route.params.id);
        this.item = res || {};
      } catch (e) { console.error(e); }
      finally { this.loading = false; }
    },
    reload() {
      this.showEditModal = false; this.showAddDocument = false;
      this.editingDocument = null; this.showAddPayment = false;
      this.loadItem();
    },
    editDocument(doc) { this.editingDocument = doc; },
    async deleteDocument(id) {
      if (!confirm('Delete this document?')) return;
      try { await this.$apiDelete('/rentdocument', id); this.reload(); } catch (e) { console.error(e); }
    },
    async confirmDelete() {
      try { await this.$apiDelete('/rent', this.item.id); this.$router.push({ name: 'Rent-view' }); }
      catch (e) { console.error(e); } finally { this.deleteModalVisible = false; }
    },
    // ── Payment actions ──────────────────────────────────────────────────
    async verifyPayment(id) {
      try {
        await this.$apiPatch('/rentpayment/' + id, 'verify', {
          verified_by: parseInt(localStorage.getItem('userId')) || null,
        });
        this.loadItem();
      } catch (e) { console.error(e); }
    },
    openRejectModal(pay) { this.rejectingPayment = pay; this.rejectionReason = ''; },
    async confirmReject() {
      if (!this.rejectionReason.trim()) return;
      try {
        await this.$apiPatch('/rentpayment/' + this.rejectingPayment.id, 'reject', {
          verified_by:      parseInt(localStorage.getItem('userId')) || null,
          rejection_reason: this.rejectionReason,
        });
        this.rejectingPayment = null;
        this.rejectionReason  = '';
        this.loadItem();
      } catch (e) { console.error(e); }
    },
    async deletePayment(id) {
      if (!confirm('Delete this payment record?')) return;
      try { await this.$apiDelete('/rentpayment', id); this.loadItem(); } catch (e) { console.error(e); }
    },
    // ── Helpers ──────────────────────────────────────────────────────────
    methodIconBg(m) {
      return { telebirr: 'bg-blue-100 text-blue-600', cbebirr: 'bg-yellow-100 text-yellow-600', bank_transfer: 'bg-indigo-100 text-indigo-600', screenshot: 'bg-orange-100 text-orange-600', cash: 'bg-green-100 text-green-600' }[m] || 'bg-gray-100 text-gray-500';
    },
    methodIcon(m) {
      return { telebirr: 'fas fa-mobile-screen-button', cbebirr: 'fas fa-building-columns', bank_transfer: 'fas fa-landmark', screenshot: 'fas fa-image', cash: 'fas fa-money-bill' }[m] || 'fas fa-credit-card';
    },
    methodBadge(m) {
      return { telebirr: 'bg-blue-100 text-blue-700', cbebirr: 'bg-yellow-100 text-yellow-700', bank_transfer: 'bg-indigo-100 text-indigo-700', screenshot: 'bg-orange-100 text-orange-700', cash: 'bg-green-100 text-green-700' }[m] || 'bg-gray-100 text-gray-500';
    },
    payStatusBadge(s) {
      return { pending: 'bg-yellow-100 text-yellow-700', verified: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-600' }[s] || 'bg-gray-100 text-gray-500';
    },
    formatMethod(m) {
      return { telebirr: 'Telebirr', cbebirr: 'CBE Birr', bank_transfer: 'Bank Transfer', screenshot: 'Screenshot', cash: 'Cash' }[m] || m;
    },
    statusBannerClass(s) {
      return { active: 'bg-green-100 text-green-800', expired: 'bg-gray-100 text-gray-700', terminated: 'bg-red-100 text-red-800', pending: 'bg-yellow-100 text-yellow-800' }[s] || 'bg-gray-100 text-gray-700';
    },
    statusBadge(s) {
      return { active: 'bg-green-100 text-green-700', expired: 'bg-gray-100 text-gray-500', terminated: 'bg-red-100 text-red-600', pending: 'bg-yellow-100 text-yellow-700' }[s] || 'bg-gray-100 text-gray-500';
    },
    formatDate(ts) {
      if (!ts) return '—';
      return new Date(ts).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    },
  },
  mounted() { this.loadItem(); },
};
</script>

<style scoped>
.detail-row { @apply flex items-center justify-between gap-4; }
.detail-label { @apply text-xs text-gray-400 shrink-0 w-24; }
.detail-value { @apply text-gray-800 text-xs text-right; }
</style>
