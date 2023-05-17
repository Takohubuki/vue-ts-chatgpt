<template>
<div class="container">
  <div class="header">
    <h1>Chatbot Playground</h1>
  </div>
  <div class="chat-container">
    <div class="chat-box">
      <div v-for="message, index in messageList" :key="index">
        <div v-if="message.role=='assistant'" class="chat-message">
          <p>{{ message.content }}</p>
        </div>
        <div class="chat-message user" v-else>
          <p>{{ message.content }}</p>
        </div>
      </div>
    </div>
    <div class="chat-input">
      <input type="text" placeholder="Ask something">
      <button @click="makeChatCompletion(messages)">Send</button>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
// const props = defineProps<{}>();
// import { reactive } from 'vue';
import { makeChatCompletion } from '../openai'
import { ref } from 'vue';
import type { ChatMessage } from '../types';
const messages: ChatMessage[] = [
  {
    role: 'user',
    content: 'Hello!'
  },
  {
    role: 'assistant',
    content: 'How can i do for you today?'
  },
  {
    role: 'user',
    content: 'Can you tell me more of your services?'
  },
  {
    role: 'assistant',
    content: 'We provide services of web design, SEO and etc.'
  }
]
const messageList = ref<ChatMessage[]>(messages)

</script>

<style scoped lang="scss">
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 500px;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
}

.chat-box {
  flex: 1;
  padding: 20px;
  overflow-y: scroll;
}

.chat-message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  background-color: #f1f0f0;
}

.chat-message.user {
  background-color: #d3d3d3;
  text-align: right;
}

.chat-input {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f1f0f0;

  input {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 5px;
    margin-right: 10px;
  }
  
  button {
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: #fff;
    cursor: pointer;
  }
}
</style>
