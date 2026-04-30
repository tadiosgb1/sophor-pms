<template>
  <div class="flex h-[calc(100vh-4rem)] bg-gray-100 overflow-hidden">

    <!-- ── SIDEBAR: user list ─────────────────────────────────────────── -->
    <aside class="w-72 flex flex-col bg-white border-r shrink-0">

      <!-- Header -->
      <div class="px-4 py-3 border-b">
        <h2 class="font-semibold text-gray-800 text-sm">Messages</h2>
        <input
          v-model="search"
          type="text"
          placeholder="Search users…"
          class="mt-2 w-full text-xs border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-400"
        />
      </div>

      <!-- User list -->
      <ul class="flex-1 overflow-y-auto divide-y">
        <li
          v-for="u in filteredUsers"
          :key="u.id"
          @click="openConversation(u)"
          class="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-orange-50 transition-colors"
          :class="{ 'bg-orange-50': selectedUser?.id === u.id }"
        >
          <!-- Avatar -->
          <div class="relative shrink-0">
            <div class="w-9 h-9 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-semibold text-sm uppercase">
              {{ initials(u) }}
            </div>
            <span
              class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white"
              :class="onlineUsers.includes(u.id) ? 'bg-green-500' : 'bg-gray-300'"
            ></span>
          </div>

          <!-- Name + last message preview -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-800 truncate">
                {{ u.first_name }} {{ u.last_name }}
              </span>
              <span v-if="unread[u.id]"
                class="ml-1 shrink-0 text-[10px] bg-orange-500 text-white rounded-full px-1.5 py-0.5 font-bold">
                {{ unread[u.id] }}
              </span>
            </div>
            <p class="text-xs text-gray-400 truncate">
              {{ onlineUsers.includes(u.id) ? 'Online' : 'Offline' }}
            </p>
          </div>
        </li>

        <li v-if="filteredUsers.length === 0" class="px-4 py-6 text-center text-xs text-gray-400">
          No users found
        </li>
      </ul>
    </aside>

    <!-- ── MAIN: chat window ──────────────────────────────────────────── -->
    <div class="flex flex-col flex-1 min-w-0">

      <!-- Empty state -->
      <div v-if="!selectedUser" class="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
        <i class="fas fa-comments text-5xl text-orange-200"></i>
        <p class="text-sm">Select a conversation to start chatting</p>
      </div>

      <template v-else>

        <!-- Chat header -->
        <div class="flex items-center gap-3 px-5 py-3 bg-white border-b shadow-sm shrink-0">
          <div class="relative">
            <div class="w-9 h-9 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-semibold text-sm uppercase">
              {{ initials(selectedUser) }}
            </div>
            <span
              class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white"
              :class="onlineUsers.includes(selectedUser.id) ? 'bg-green-500' : 'bg-gray-300'"
            ></span>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800">
              {{ selectedUser.first_name }} {{ selectedUser.last_name }}
            </p>
            <p class="text-xs" :class="onlineUsers.includes(selectedUser.id) ? 'text-green-500' : 'text-gray-400'">
              {{ onlineUsers.includes(selectedUser.id) ? 'Online' : 'Offline' }}
            </p>
          </div>
        </div>

        <!-- Messages area -->
        <div
          ref="msgArea"
          class="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gray-50"
        >
          <div v-if="loadingMessages" class="flex justify-center py-8">
            <i class="fas fa-spinner fa-spin text-orange-400 text-xl"></i>
          </div>

          <template v-else>
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="flex"
              :class="msg.senderId === currentUserId ? 'justify-end' : 'justify-start'"
            >
              <!-- Incoming avatar -->
              <div
                v-if="msg.senderId !== currentUserId"
                class="w-7 h-7 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 text-xs font-semibold uppercase mr-2 shrink-0 self-end"
              >
                {{ initials(selectedUser) }}
              </div>

              <div class="max-w-[65%] flex flex-col"
                :class="msg.senderId === currentUserId ? 'items-end' : 'items-start'">
                <div
                  class="px-3.5 py-2 rounded-2xl text-sm leading-relaxed break-words"
                  :class="msg.senderId === currentUserId
                    ? 'bg-orange-500 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'"
                >
                  {{ msg.message }}
                </div>
                <span class="text-[10px] text-gray-400 mt-0.5 px-1">
                  {{ formatTime(msg.createdAt) }}
                </span>
              </div>
            </div>

            <!-- Typing indicator -->
            <div v-if="isTyping" class="flex items-end gap-2">
              <div class="w-7 h-7 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 text-xs font-semibold uppercase shrink-0">
                {{ initials(selectedUser) }}
              </div>
              <div class="bg-white shadow-sm rounded-2xl rounded-bl-sm px-4 py-2.5 flex gap-1 items-center">
                <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay:0ms"></span>
                <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay:150ms"></span>
                <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay:300ms"></span>
              </div>
            </div>
          </template>
        </div>

        <!-- Input bar -->
        <div class="px-4 py-3 bg-white border-t flex items-end gap-2 shrink-0">
          <textarea
            v-model="draft"
            @keydown.enter.exact.prevent="sendMessage"
            @input="onTyping"
            rows="1"
            placeholder="Type a message… (Enter to send)"
            class="flex-1 resize-none border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400 max-h-32 overflow-y-auto"
          ></textarea>
          <button
            @click="sendMessage"
            :disabled="!draft.trim()"
            class="shrink-0 w-10 h-10 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors"
          >
            <i class="fas fa-paper-plane text-sm"></i>
          </button>
        </div>

      </template>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_APP_BASE_URL_LOCAL?.replace("/api", "") || "http://localhost:5000";

export default {
  name: "ChatView",

  data() {
    return {
      socket: null,
      users: [],
      search: "",
      onlineUsers: [],
      selectedUser: null,
      messages: [],
      draft: "",
      isTyping: false,
      typingTimer: null,
      loadingMessages: false,
      unread: {},          // { userId: count }
      currentUserId: null,
      seenIds: new Set(),  // prevent duplicate messages
    };
  },

  computed: {
    filteredUsers() {
      const q = this.search.toLowerCase();
      return this.users.filter(u =>
        `${u.first_name} ${u.last_name}`.toLowerCase().includes(q)
      );
    },
  },

  methods: {
    /* ── Helpers ─────────────────────────────────────────────────────── */
    initials(user) {
      if (!user) return "?";
      return `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`;
    },

    formatTime(ts) {
      if (!ts) return "";
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const el = this.$refs.msgArea;
        if (el) el.scrollTop = el.scrollHeight;
      });
    },

    /* ── Data fetching ───────────────────────────────────────────────── */
    async fetchUsers() {
      try {
        const res = await this.$apiGet("/users", { page_size: 500 });
        // $apiGet returns the full response body; paginated endpoint wraps in { data: [...] }
        const list = Array.isArray(res) ? res : (res.data || []);
        this.users = list.filter(u => u.id !== this.currentUserId);
      } catch (e) {
        console.error("fetchUsers error:", e);
      }
    },

    async loadHistory() {
      if (!this.selectedUser) return;
      this.loadingMessages = true;
      this.messages = [];
      this.seenIds = new Set();
      try {
        const msgs = await this.$apiGet(
          `/chat/history/${this.currentUserId}/${this.selectedUser.id}`
        );
        const list = Array.isArray(msgs) ? msgs : (msgs.data || []);
        list.forEach(m => {
          this.seenIds.add(m.id);
          this.messages.push(m);
        });
        this.scrollToBottom();
      } catch (e) {
        console.error("loadHistory error:", e);
      } finally {
        this.loadingMessages = false;
      }
    },

    /* ── Conversation ────────────────────────────────────────────────── */
    async openConversation(user) {
      this.selectedUser = user;
      this.$set ? this.$set(this.unread, user.id, 0) : (this.unread[user.id] = 0);

      // Join the socket room
      this.socket.emit("join_room", {
        user1: this.currentUserId,
        user2: user.id,
      });

      await this.loadHistory();
    },

    /* ── Messaging ───────────────────────────────────────────────────── */
    sendMessage() {
      const text = this.draft.trim();
      if (!text || !this.selectedUser) return;

      this.socket.emit("send_message", {
        senderId: this.currentUserId,
        receiverId: this.selectedUser.id,
        message: text,
      });

      this.draft = "";
    },

    onTyping() {
      if (!this.selectedUser) return;
      this.socket.emit("typing", {
        senderId: this.currentUserId,
        receiverId: this.selectedUser.id,
      });
    },

    /* ── Socket setup ────────────────────────────────────────────────── */
    initSocket() {
      this.socket = io(SOCKET_URL, {
        transports: ["websocket"],
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });

      this.socket.on("connect", () => {
        console.log("Socket connected:", this.socket.id);
        this.socket.emit("user_online", this.currentUserId);
      });

      this.socket.on("disconnect", () => {
        console.warn("Socket disconnected");
      });

      // Online presence
      this.socket.on("update_online", (ids) => {
        this.onlineUsers = ids.map(Number);
      });

      // Incoming message
      this.socket.on("receive_message", (msg) => {
        // Deduplicate
        if (this.seenIds.has(msg.id)) return;
        this.seenIds.add(msg.id);

        const inCurrentChat =
          this.selectedUser &&
          (msg.senderId === this.selectedUser.id || msg.receiverId === this.selectedUser.id);

        if (inCurrentChat) {
          this.messages.push(msg);
          this.scrollToBottom();
        } else {
          // Increment unread badge for the sender
          const sid = msg.senderId;
          this.unread = { ...this.unread, [sid]: (this.unread[sid] || 0) + 1 };
        }
      });

      // Typing indicator
      this.socket.on("user_typing", ({ userId }) => {
        if (this.selectedUser?.id === Number(userId)) {
          this.isTyping = true;
          clearTimeout(this.typingTimer);
          this.typingTimer = setTimeout(() => (this.isTyping = false), 2500);
          this.scrollToBottom();
        }
      });
    },
  },

  async mounted() {
    this.currentUserId = parseInt(localStorage.getItem("userId"));
    if (!this.currentUserId) return;

    await this.fetchUsers();
    this.initSocket();
  },

  beforeUnmount() {
    if (this.socket) this.socket.disconnect();
    clearTimeout(this.typingTimer);
  },
};
</script>

<style scoped>
/* Smooth bounce for typing dots */
@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40%           { transform: translateY(-5px); }
}
.animate-bounce {
  animation: bounce 1.2s infinite ease-in-out;
}
</style>
