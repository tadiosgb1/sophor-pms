<template>
  <div class="p-6 bg-gray-50 min-h-screen flex flex-col md:flex-row gap-6 text-sm">

    <!-- USERS LIST -->
    <div class="w-full md:w-1/3 bg-white rounded-xl border overflow-y-auto h-[80vh]">
      <div class="p-4 border-b font-semibold">Users</div>

      <div v-for="u in users" :key="u.id"
        @click="selectUser(u)"
        class="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-green-50"
        :class="{'bg-green-100': selectedUser?.id === u.id}"
      >
        <div class="flex items-center gap-3">
          <div class="w-3 h-3 rounded-full"
               :class="onlineUsers.includes(u.id) ? 'bg-green-500' : 'bg-gray-300'"></div>
          <span>{{ u.first_name }} {{ u.last_name }}</span>
        </div>

        <span v-if="unreadMessages[u.id]"
          class="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
          {{ unreadMessages[u.id] }}
        </span>
      </div>
    </div>

    <!-- CHAT BOX -->
    <div class="w-full md:w-2/3 flex flex-col bg-white rounded-xl border h-[80vh]">

      <!-- HEADER -->
      <div class="p-4 border-b flex justify-between">
        <h2 class="font-semibold">
          {{ selectedUser ? selectedUser.first_name + ' ' + selectedUser.last_name : 'Select a user' }}
        </h2>
        <span v-if="selectedUser">
          {{ onlineUsers.includes(selectedUser.id) ? 'Online' : 'Offline' }}
        </span>
      </div>

      <!-- MESSAGES -->
      <div class="flex-1 p-4 overflow-y-auto space-y-2" ref="messagesContainer">
        <div v-for="msg in messages" :key="msg.id"
          :class="{ 'text-right': msg.senderId === currentUserId }">

          <div
            :class="msg.senderId === currentUserId ? 'bg-green-200' : 'bg-gray-200'"
            class="inline-block px-3 py-2 rounded-lg max-w-[70%]"
          >
            {{ msg.message }}
          </div>
        </div>

        <div v-if="typingUser" class="text-gray-400 italic text-sm">
          {{ typingUser.first_name }} is typing...
        </div>
      </div>

      <!-- INPUT -->
      <div class="p-4 border-t flex gap-2">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          @input="emitTyping"
          class="flex-1 border rounded-lg px-4 py-2"
          placeholder="Type your message..."
          :disabled="!selectedUser"
        />

        <button
          @click="sendMessage"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          :disabled="!selectedUser || !newMessage.trim()"
        >
          Send
        </button>
      </div>

    </div>

  </div>
</template>

<script>
import { io } from "socket.io-client";

export default {
  data() {
    return {
      socket: null,
      users: [],
      onlineUsers: [],
      selectedUser: null,
      messages: [],
      newMessage: "",
      typingUser: null,
      currentUserId: null,
      unreadMessages: {}
    };
  },

  methods: {
    async fetchUsers() {
      const res = await this.$apiGet("/users", { page_size: 200 });
      this.users = res.data.filter(u => u.id !== this.currentUserId);
    },

    async selectUser(user) {
      this.selectedUser = user;
      this.unreadMessages[user.id] = 0;

      this.socket.emit("join_room", {
        user1: this.currentUserId,
        user2: user.id
      });

      const res = await this.$apiGet(`/chat/room/${this.currentUserId}/${user.id}`);
      this.messages = res.data || [];
      this.scrollToBottom();
    },

    sendMessage() {
      if (!this.newMessage.trim()) return;

      this.socket.emit("send_message", {
        senderId: this.currentUserId,
        receiverId: this.selectedUser.id,
        message: this.newMessage
      });

      this.newMessage = "";
    },

    emitTyping() {
      if (!this.selectedUser) return;
      this.socket.emit("typing", {
        senderId: this.currentUserId,
        receiverId: this.selectedUser.id
      });
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const el = this.$refs.messagesContainer;
        if (el) el.scrollTop = el.scrollHeight;
      });
    }
  },

  mounted() {
    this.currentUserId = parseInt(localStorage.getItem("userId"));
    if (!this.currentUserId) return;

    this.fetchUsers();

    this.socket = io("http://localhost:5000");
    this.socket.emit("user_online", this.currentUserId);

    this.socket.on("update_online", users => {
      this.onlineUsers = users;
    });

    // Receiving messages
    this.socket.on("receive_message", msg => {
      // if message belongs to selected chat
      if (
        this.selectedUser &&
        [msg.senderId, msg.receiverId].includes(this.selectedUser.id)
      ) {
        this.messages.push(msg);
        this.scrollToBottom();
      } else {
        // unread count
        this.unreadMessages[msg.senderId] =
          (this.unreadMessages[msg.senderId] || 0) + 1;
      }
    });

    // Typing indicator
    this.socket.on("user_typing", ({ userId }) => {
      if (this.selectedUser?.id === userId) {
        this.typingUser = this.users.find(u => u.id === userId);
        setTimeout(() => (this.typingUser = null), 2000);
      }
    });
  }
};
</script>