<template>
<div class="container">
  <div class="header">
    <h1>Chatbot Playground</h1>
  </div>
  <div class="chat-container">
    <div class="chat-box" ref="autoScroll">
      <div v-for="message, index in messageList" :key="index">
        <div v-if="message.role=='assistant'" class="chat-message">
          <div v-html="md.render(message.content)"></div>
        </div>
        <div v-else-if="message.role==='user'" class="chat-message user">
          <div v-html="md.render(message.content)"></div>
        </div>
      </div>
    </div>
    <div class="chat-input">
      <input type="text" v-model="message" placeholder="Ask something">
      <button v-if="pendding" @click="cancelChatCompletionRequest">Cancel</button>
      <button v-else @click="addMessage" @keypress.enter="addMessage">Send</button>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { makeChatCompletionStream } from '../server/openai';
import { nextTick, onUpdated, ref } from 'vue';
import { md } from '../server/markdown';
import type { ChatMessage } from '../types';
import { notification } from 'ant-design-vue';
import { GPTError } from '../types';


const decoder = new TextDecoder('utf-8');
const pendding = ref(false);
const messages: ChatMessage[] = [
  {
    role: 'assistant',
    content: 'How can i do for you today?'
  },
]
const messageList = ref<ChatMessage[]>(messages)
const message = ref('')

// add enter event to button
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addMessage();
  }
})
// button event
const addMessage = async () => {
  if (message.value !== '') {
    // adding new messages to message list
    messageList.value.push({
      role: 'user',
      content: message.value
    });

    // clear the input box
    message.value = ''
  }

  try {
    pendding.value = true;
    const response = await makeChatCompletionStream(messageList.value);

    const { body, status } = response;
    if ( status !== 200 ) {
      throw new GPTError(status);
    }

    messageList.value.push({
      role: 'assistant',
      content: ''
    });

    if ( body ) {
      const reader = body.getReader();
      await readerStream(reader);
    }
    pendding.value = false;
  } catch (err: any) {
    openNotification(err.message);
  } finally {
    pendding.value = false;
  }
}

const openNotification = (notification_message: string) => {
  notification['error']({
    message: 'Error!',
    description: notification_message
  });
};

// auto scrolling when component is updated
onUpdated(() => {
  handleScrollBottom();
})

// keep the scroll bar to the bottom
const autoScroll = ref()
const handleScrollBottom = () => {
  nextTick(() => {
    autoScroll.value.scrollTop = autoScroll.value.scrollHeight;
  })
}

// canceling request 
// TODO
const cancelChatCompletionRequest = () => {
  console.log('canceling chat completion');
}

const readerStream = async (
  reader: ReadableStreamDefaultReader<Uint8Array>
) => {
  let partial_line = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const decoded_text = decoder.decode(value, { stream: true });
    // console.log(`decoded: ${decoded_text}`);
    
    const chunk = partial_line + decoded_text;
    // console.log(`chunk: ${chunk}`);
    
    const new_line = chunk.split(/\r?\n/);

    partial_line = new_line.pop() ?? '';

    for (const line of new_line) {
      if (line.length === 0) continue;
      if (line.startsWith(':')) continue;
      if (line === 'data: [DONE]') return;

      console.log(line);
      const json = JSON.parse(line.substring(6));
      const content = json.choices[0].delta.content ?? '';
      messageList.value[messageList.value.length - 1].content += content;
    }
  }
}

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
  height: 4vh;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 88vh;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
}

.chat-box {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
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
