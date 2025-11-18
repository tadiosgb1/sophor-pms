<template>
  <div id="chat-app" class="flex h-screen antialiased text-gray-800 bg-gray-100 ml-2">
    <div class="flex flex-row w-full overflow-x-hidden">

      <!-- Sidebar (Conversation List) -->
      <div 
        :class="[
          'flex flex-col flex-shrink-0 bg-white border-r border-gray-200 shadow-xl',
          'w-full sm:w-80', // Full width on mobile, fixed width on desktop
          { 'hidden sm:flex': activeConversationId !== null } // Hide on mobile if a chat is active
        ]"
      >
        
        <!-- Header/Logo Area -->
        <div class="h-12 sm:h-16 px-4 sm:px-6 flex items-center justify-between border-b border-gray-100">
          <h1 class="text-lg font-bold text-gray-800">Messages</h1>
          <div class="flex space-x-1 text-gray-400">
            <!-- Real Estate > Messages Breadcrumb (Smaller on all screens) -->
            <span class="text-xs">Real Estate</span>
            <span class="text-xs font-semibold text-gray-500">></span>
            <span class="text-xs font-semibold text-gray-800">Messages</span>
          </div>
        </div>

        <div class="flex flex-col p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto">
          
          <!-- Search Bar -->
          <div class="relative">
            <input type="text" placeholder="Search..." class="w-full p-2 pl-9 text-xs border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500">
            <span class="absolute inset-y-0 left-0 flex items-center pl-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
          </div>

          <!-- Active Users -->
          <div class="flex flex-col">
            <h2 class="text-sm font-semibold text-gray-600 mb-1">Active</h2>
            <div class="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2">
              <div v-for="(user, index) in activeUsers" :key="index" class="relative flex-shrink-0 cursor-pointer">
                <img :src="user.avatar" :alt="user.name" class="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white">
                <span class="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full ring-1 ring-white"></span>
              </div>
            </div>
          </div>

          <!-- Message Count & Tabs -->
          <div class="flex flex-col space-y-2">
            <div class="flex items-center space-x-1">
              <h2 class="text-sm font-semibold text-gray-600">Message</h2>
              <span class="px-1.5 py-0.5 text-xs font-semibold text-white bg-red-500 rounded-full">5</span>
            </div>

            <div class="flex justify-between p-0.5 bg-gray-100 rounded-xl shadow-inner">
              <button 
                @click="activeTab = 'Chat'"
                :class="['flex-1 p-1 sm:p-2 text-xs font-semibold rounded-lg transition-all', activeTab === 'Chat' ? 'bg-white text-green-500 shadow' : 'text-gray-500 hover:text-green-500']"
              >
                Chat
              </button>
              <button 
                @click="activeTab = 'Group'"
                :class="['flex-1 p-1 sm:p-2 text-xs font-semibold rounded-lg transition-all', activeTab === 'Group' ? 'bg-white text-green-500 shadow' : 'text-gray-500 hover:text-green-500']"
              >
                Group
              </button>
              <button 
                @click="activeTab = 'Contact'"
                :class="['flex-1 p-1 sm:p-2 text-xs font-semibold rounded-lg transition-all', activeTab === 'Contact' ? 'bg-white text-green-500 shadow' : 'text-gray-500 hover:text-green-500']"
              >
                Contact
              </button>
            </div>
          </div>

          <!-- Create New Group -->
          <button class="flex items-center p-2 mt-3 text-green-500 bg-green-100 rounded-xl hover:bg-green-200 transition-colors">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span class="font-semibold text-sm">Create New Group</span>
          </button>

          <!-- Conversation List -->
          <div class="flex flex-col space-y-1 mt-3">
            <div 
              v-for="(conv, index) in conversations" 
              :key="index"
              @click="activeConversationId = conv.id"
              :class="['flex items-center p-2 rounded-xl cursor-pointer transition-colors', conv.id === activeConversationId ? 'bg-green-100' : 'hover:bg-gray-100']"
            >
              <!-- Avatar/Icon -->
              <div :class="['flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mr-2', conv.color]">
                {{ conv.initials }}
              </div>
              
              <!-- Content -->
              <div class="flex-grow min-w-0">
                <p class="font-semibold truncate text-xs sm:text-sm text-gray-800">{{ conv.name }}</p>
                <div class="flex items-center mt-0.5">
                  <span :class="['w-2 h-2 rounded-full mr-1', conv.online ? 'bg-green-500' : 'bg-gray-400']"></span>
                  <p class="text-xs text-gray-500 truncate">{{ conv.lastMessage }}</p>
                </div>
              </div>

              <!-- Status/Time -->
              <div class="flex flex-col items-end text-right ml-1 flex-shrink-0">
                <span class="text-xs text-gray-400 mb-0.5">{{ conv.time }}</span>
                <svg v-if="conv.unread === 0" class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                <span v-else class="px-1.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">{{ conv.unread }}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Chat Area (Messages) -->
      <div 
        :class="[
          'flex flex-col flex-auto h-full bg-white',
          'w-full sm:w-auto', // Full width on mobile, auto width on desktop
          { 'hidden': activeConversationId === null } // Hide if no chat is active (on mobile)
        ]"
      >
        
        <!-- Chat Header (Contact Name and Icons) -->
        <div class="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200">
          <div class="flex items-center">
            <!-- Back button for mobile -->
            <button class="block sm:hidden p-1 mr-2 text-gray-500 hover:text-green-500" @click="activeConversationId = null">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </button>
            <img src="https://i.pravatar.cc/150?img=5" alt="Michael A. Miner" class="w-10 h-10 rounded-full object-cover">
            <div class="ml-3">
              <p class="text-sm sm:text-base font-semibold">Michael A. Miner</p>
              <span class="text-xs text-green-500">online</span>
            </div>
          </div>
          <div class="flex items-center space-x-2 sm:space-x-4 text-gray-500">
            <button class="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            </button>
            <button class="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            </button>
            <button class="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M18 5a1 1 0 100-2 1 1 0 000 2zM12 6a1 1 0 100-2 1 1 0 000 2zM6 6a1 1 0 100-2 1 1 0 000 2zM18 12a1 1 0 100-2 1 1 0 000 2zM12 13a1 1 0 100-2 1 1 0 000 2zM6 13a1 1 0 100-2 1 1 0 000 2zM18 19a1 1 0 100-2 1 1 0 000 2zM12 20a1 1 0 100-2 1 1 0 000 2zM6 20a1 1 0 100-2 1 1 0 000 2z"></path></svg>
            </button>
          </div>
        </div>

        <!-- Chat Body (Messages) -->
        <div class="flex-grow overflow-y-auto p-3 sm:p-4 space-y-3">
          
          <!-- Incoming Message 1 (Text) -->
          <div class="flex items-start">
            <img src="https://i.pravatar.cc/150?img=5" alt="Michael A. Miner" class="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5">
            <div class="ml-3">
              <div class="flex items-end space-x-2 mb-0.5">
                <span class="text-xs font-semibold">Michael A. Miner</span>
                <span class="text-xs text-gray-400">08:30</span>
              </div>
              <div class="bg-gray-100 p-2 text-xs rounded-tr-xl rounded-bl-xl rounded-br-xl max-w-sm shadow-sm">
                <p>Hey Gaston, how's all going?</p>
              </div>
            </div>
          </div>

          <!-- Outgoing Message 1 (Text) - User -->
          <div class="flex justify-end">
            <div class="mr-3 text-right">
              <div class="flex justify-end items-end space-x-2 mb-0.5">
                <span class="text-xs text-gray-400">08:30</span>
                <span class="text-xs font-semibold">you</span>
              </div>
              <div class="bg-green-500 text-white p-2 text-xs rounded-tl-xl rounded-bl-xl rounded-br-xl max-w-sm shadow-sm">
                <p>Yeah, everything good!</p>
              </div>
            </div>
            <img src="https://i.pravatar.cc/150?img=17" alt="You" class="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5">
          </div>

          <!-- Incoming Message 2 (Images) -->
          <div class="flex items-start">
            <img src="https://i.pravatar.cc/150?img=5" alt="Michael A. Miner" class="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5">
            <div class="ml-3">
              <div class="flex items-end space-x-2 mb-0.5">
                <span class="text-xs font-semibold">Michael A. Miner</span>
                <span class="text-xs text-gray-400">08:30</span>
              </div>
              <div class="flex space-x-2 bg-gray-100 p-2 rounded-tr-xl rounded-bl-xl rounded-br-xl max-w-sm shadow-sm">
                <img src="https://placehold.co/80x70/A0AEC0/FFFFFF?text=Img+1" alt="Image 1" class="rounded-lg object-cover w-20 h-16 cursor-pointer">
                <img src="https://placehold.co/80x70/A0AEC0/FFFFFF?text=Img+2" alt="Image 2" class="rounded-lg object-cover w-20 h-16 cursor-pointer">
                <img src="https://placehold.co/80x70/A0AEC0/FFFFFF?text=Img+3" alt="Image 3" class="rounded-lg object-cover w-20 h-16 cursor-pointer">
              </div>
            </div>
          </div>

        </div>

        <!-- Chat Input Area -->
        <div class="p-3 border-t border-gray-200">
          <div class="flex items-center space-x-2 bg-gray-100 rounded-xl p-1.5 sm:p-2">
            
            <!-- Attachment Icon (Left) -->
            <button class="p-1.5 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors flex-shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
            </button>
            
            <!-- Input Field -->
            <input type="text" placeholder="Enter your message" class="flex-auto p-1 sm:p-2 text-sm text-gray-800 bg-gray-100 focus:outline-none placeholder-gray-500">
            
            <!-- Right Icons -->
            <div class="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              <button class="p-1 sm:p-2 text-gray-500 hover:text-green-500 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-9-6h3m-3 0h-3v3m3-3v3m0 0h3m-3 0v3m0 0h-3v-3m3 3h3m-3 0v3"></path></svg>
              </button>
              <button class="p-1 sm:p-2 text-gray-500 hover:text-green-500 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </button>
              <button class="p-1.5 text-green-500 hover:text-green-600 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3-3m0 0l-3-3m3 3H8M7 9v6a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2H9a2 2 0 00-2 2z"></path></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-center text-xs text-gray-400 pt-1 border-t border-gray-100">
          2025 © Lahomes. Crafted by <span class="text-green-500 font-semibold ml-1">Techzaa</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Vue.js Options API Script
export default {
  name: 'ResponsiveChatApp',
  data() {
    return {
      activeTab: 'Group',
      // Determines which conversation is currently viewed (null means list view on mobile)
      activeConversationId: 'projectA', 
      activeUsers: [
        { name: 'User 1', avatar: 'https://i.pravatar.cc/150?img=1' },
        { name: 'User 2', avatar: 'https://i.pravatar.cc/150?img=2' },
        { name: 'User 3', avatar: 'https://i.pravatar.cc/150?img=3' },
        { name: 'User 4', avatar: 'https://i.pravatar.cc/150?img=4' },
        { name: 'User 5', avatar: 'https://i.pravatar.cc/150?img=6' },
        { name: 'User 6', avatar: 'https://i.pravatar.cc/150?img=7' },
        { name: 'User 7', avatar: 'https://i.pravatar.cc/150?img=8' },
      ],
      conversations: [
        { 
          id: 'general',
          name: 'General', 
          initials: 'HG', 
          color: 'bg-green-500', 
          online: true, 
          lastMessage: 'Good morning everyone!', 
          time: '10:21 AM', 
          unread: 1,
        },
        { 
          id: 'projectA',
          name: 'Project A', 
          initials: 'Pk', 
          color: 'bg-indigo-400', 
          online: false, 
          lastMessage: 'This themes is awesome!...', 
          time: '10:21 AM', 
          unread: 0,
        },
      ],
    };
  },
};
</script>

<style scoped>
/* Scoped styles for the component (though we primarily use Tailwind classes) */
#chat-app {
  font-family: 'Inter', sans-serif;
}
/* Custom scrollbar styling (optional, for aesthetics) */
.overflow-y-auto::-webkit-scrollbar, .overflow-x-auto::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.overflow-y-auto::-webkit-scrollbar-thumb, .overflow-x-auto::-webkit-scrollbar-thumb {
    background-color: #cbd5e1; /* gray-300 */
    border-radius: 9999px;
}
</style>

<script setup>
// Load Tailwind CSS configuration for the canvas environment
</script>