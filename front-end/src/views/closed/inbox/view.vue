<template>
  <div class="flex h-screen bg-gray-50 ml-2">
    <div class="w-64 bg-white border-r border-gray-200 flex flex-col p-4 shadow-lg z-10">
      <div class="mb-6">
        <button class="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center shadow-lg transition duration-150 ease-in-out">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
          Compose
        </button>
      </div>

      <nav class="space-y-1">
        <a v-for="link in mainLinks" :key="link.name" :class="link.active ? 'bg-red-50 hover:bg-red-100 text-red-600 font-semibold' : 'text-gray-600 hover:bg-gray-100'"
           class="flex items-center p-3 rounded-lg transition duration-150 ease-in-out cursor-pointer">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="link.icon"></path></svg>
          {{ link.name }}
          <span v-if="link.count" class="ml-auto text-xs px-2 py-0.5 rounded-full" :class="link.active ? 'bg-red-200 text-red-700' : 'bg-gray-200 text-gray-600'">
            {{ link.count }}
          </span>
        </a>
      </nav>

      <hr class="my-4 border-gray-200">

      <div class="space-y-4">
        <div class="flex items-center justify-between text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-700">
          Labels <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
        <div class="flex items-center justify-between text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-700">
          Contacts <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    </div>

    <div class="flex-1 flex overflow-hidden">
      <div class="w-80 bg-white border-r border-gray-200 flex flex-col shadow-inner">
        <div class="p-3 border-b border-gray-200 flex items-center">
          <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input type="text" placeholder="Search in Mails" class="flex-1 focus:outline-none placeholder-gray-400 text-gray-700">
        </div>

        <div class="flex justify-between items-center p-3 border-b border-gray-200 text-gray-500">
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 cursor-pointer hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
          </div>
          <span class="text-sm font-medium">Inbox Mail</span>
        </div>

        <div class="overflow-y-auto flex-1">
          <div v-for="mail in emails" :key="mail.id"
               :class="mail.active ? 'bg-purple-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-800'"
               class="flex items-start p-3 border-b border-gray-200 cursor-pointer transition duration-150 ease-in-out">
            <img :src="mail.avatar" alt="Avatar" class="w-10 h-10 rounded-full mr-3 object-cover flex-shrink-0">
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start">
                <span :class="mail.active ? 'font-bold' : 'font-medium'" class="text-sm truncate">{{ mail.sender }}</span>
                <span :class="mail.active ? 'text-purple-200' : 'text-gray-500'" class="text-xs ml-2 flex-shrink-0">{{ mail.time }}</span>
              </div>
              <p :class="mail.active ? 'text-purple-200' : 'text-gray-600'" class="text-sm leading-tight truncate mt-1">
                {{ mail.subject }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1 flex flex-col bg-white overflow-hidden relative">
        <div class="flex justify-end p-3 border-b border-gray-200 bg-gray-50 items-center">
          <div class="text-xs text-gray-500 mr-4">Search in Mails</div>
          <button class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1.5 px-4 rounded-full text-sm shadow-md transition duration-150 ease-in-out">
            Snoozed
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <div class="flex justify-between items-start">
            <div>
              <div class="flex items-center mb-2">
                <img src="https://i.pravatar.cc/150?img=1" alt="Sender Avatar" class="w-10 h-10 rounded-full object-cover mr-3">
                <div>
                  <div class="text-sm font-medium text-gray-900">diannablair46@dayrep.com</div>
                  <div class="text-xs text-gray-500">to hello@dundermifflin.com</div>
                </div>
              </div>
              <h2 class="text-xl font-bold text-gray-900">Documentation of last meeting</h2>
            </div>
            <div class="text-sm text-gray-500 flex-shrink-0 mt-1">Mon, 1 Apr, 23:12</div>
          </div>

          <div class="text-gray-700 leading-relaxed text-base space-y-4">
            <p>Hey : <span class="text-blue-600 font-semibold cursor-pointer">@Gaston Lapierre</span></p>

            <p>Thank you all for your hard work and dedication to this project. Your contributions are invaluable, and I am confident that together we will achieve our goals successfully. After reviewing the current progress and considering various factors, I would like to share some observations and next steps.</p>

            <p>Additionally, I would like to remind everyone of our upcoming team meeting scheduled for this week. During this meeting, we will discuss the revised timeline in detail and address any concerns or questions you may have ...</p>
            </div>

        </div>

        <div class="p-4 border-t border-gray-200">
          <div class="flex items-start">
            <img src="https://i.pravatar.cc/150?img=1" alt="Your Avatar" class="w-10 h-10 rounded-full object-cover mr-4 flex-shrink-0">
            <div class="flex-1">
              <div class="text-sm text-gray-700 mb-2">To : <span class="font-medium">diannablair46@dayrep.com</span></div>
              <textarea placeholder="Type Message..." rows="3" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"></textarea>

              <div class="flex justify-between items-center mt-3">
                <div class="flex space-x-3 text-gray-500">
                  <svg class="w-5 h-5 cursor-pointer hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a2 2 0 00-2.828-2.828l-6.414 6.414a2 2 0 102.828 2.828l6.586-6.586"></path></svg>
                  <svg class="w-5 h-5 cursor-pointer hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-2-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <span class="text-xs text-gray-500">...</span>
                </div>
                
                <div class="space-x-2">
                  <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg text-sm transition duration-150 ease-in-out">
                    Forward
                  </button>
                  <button class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition duration-150 ease-in-out">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InboxScreen',
  data() {
    return {
      // Data for Sidebar Navigation
      mainLinks: [
        { name: 'Your Inbox', count: 5, active: true, icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h4M17 16l4-4m-4 4l-4-4m4 4v7' },
        { name: 'Important', count: 0, active: false, icon: 'M11.05 13.05l-3.279 3.279c-.394.394-.61.928-.61 1.488s.216 1.094.61 1.488l3.279 3.279c.394.394.928.61 1.488.61s1.094-.216 1.488-.61l3.279-3.279c.394-.394.61-.928.61-1.488s-.216-1.094-.61-1.488L14.038 13.05' }, // A placeholder icon
        { name: 'Snoozed', count: 0, active: false, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
        { name: 'Draft', count: 8, active: false, icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
        { name: 'Sent', count: 0, active: false, icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' },
        { name: 'Promotions', count: 3, active: false, icon: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
        { name: 'Update', count: 14, active: false, icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
        { name: 'More', count: 0, active: false, icon: 'M19 9l-7 7-7-7' },
      ],
      // Data for Email List
      emails: [
        { id: 1, sender: 'Michael A. Miner', subject: 'Thank you all for your hard...', time: '10:37 AM', active: false, avatar: 'https://i.pravatar.cc/150?img=4' },
        { id: 2, sender: 'Theresa T. Brose', subject: 'In recognition of your achieve...', time: '10:27 AM', active: true, avatar: 'https://i.pravatar.cc/150?img=5' },
        { id: 3, sender: 'James L. Erickson', subject: 'Additionally, I would like to remind eve...', time: '09:57 AM', active: false, avatar: 'https://i.pravatar.cc/150?img=6' },
        { id: 4, sender: 'Lily W. Wilson', subject: 'After reviewing the current progres...', time: '09:07 AM', active: false, avatar: 'https://i.pravatar.cc/150?img=7' },
        { id: 5, sender: 'Sarah M. Brooks', subject: 'After reviewing the current progres...', time: '08:17 AM', active: false, avatar: 'https://i.pravatar.cc/150?img=8' },
        // Add more mock emails for scrolling effect
        { id: 6, sender: 'John Doe', subject: 'Project Status Update', time: '07:30 AM', active: false, avatar: 'https://i.pravatar.cc/150?img=9' },
        { id: 7, sender: 'Jane Smith', subject: 'New Marketing Strategy', time: 'Yesterday', active: false, avatar: 'https://i.pravatar.cc/150?img=10' },
        { id: 8, sender: 'Acme Corp', subject: 'Invoice #12345', time: 'Yesterday', active: false, avatar: 'https://i.pravatar.cc/150?img=11' },
       { id: 1, sender: 'Michael A. Miner', subject: 'Thank you all for your hard...', time: '10:37 AM', active: false, avatar: 'https://i.pravatar.cc/150?img=4' },
        { id: 2, sender: 'Theresa T. Brose', subject: 'In recognition of your achieve...', time: '10:27 AM', active: false, avatar: 'https://i.pravatar.cc/150?img=5' },
        { id: 3, sender: 'James L. Erickson', subject: 'Additionally, I would like to remind eve...', time: '09:57 AM', active: false, avatar: 'https://i.pravatar.cc/150?img=6' },
        { id: 4, sender: 'Lily W. Wilson', subject: 'After reviewing the current progres...', time: '09:07 AM', active: false, avatar: 'https://i.pravatar.cc/150?img=7' },
        { id: 5, sender: 'Sarah M. Brooks', subject: 'After reviewing the current progres...', time: '08:17 AM', active: false, avatar: 'https://i.pravatar.cc/150?img=8' },
        // Add more mock emails for scrolling effect
        { id: 6, sender: 'John Doe', subject: 'Project Status Update', time: '07:30 AM', active: false, avatar: 'https://i.pravatar.cc/150?img=9' },
        { id: 7, sender: 'Jane Smith', subject: 'New Marketing Strategy', time: 'Yesterday', active: false, avatar: 'https://i.pravatar.cc/150?img=10' },
       
    ],
    };
  },
};
</script>