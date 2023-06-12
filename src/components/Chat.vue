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
import chatRequest from '../server/openai';
import { nextTick, onUpdated, ref } from 'vue';
import { md } from '../server/markdown';
import type { ChatResponseData, ChatMessage, ChatRequest, GPTRequestConfig } from '../types';
import { notification } from 'ant-design-vue';
import { GPTError } from '../types';


const pendding = ref(false)
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

  // sending completion request
  await makeChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: messages
  })
  // }).then((response: GPTResponse) => {
  //   console.log(response);
  //   messageList.value.push(response.data.choices[0].message);
  // }).catch((error) => {
  //   console.log(error)
  //   const error_message = error.message
  //   openNotification(error_message);
  // })
  
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

// Chat completion request implement
const makeChatCompletion = (data: ChatRequest) => {
  return chatRequest<ChatRequest, ChatResponseData>({
    url: '/chat/completions',
    method: 'POST',
    data,
    interceptors: {
      requestInterceptors(res: GPTRequestConfig) {
        console.log('interface request interceptor');
        pendding.value = true
        return res;
      },
      responseInterceptors(result: any) {
        console.log('interface response interceptor');
        pendding.value = false;

        if (result.response) {
          // handlingExceptions(result);
          throw new GPTError(result.response.status);
        }
        handleScrollBottom()
        return result;
      }
    }
  }).then((chat_response: ChatResponseData) => {
    console.log('entering then()');
    // if (chat_response.status != 200) {
    //   throw Error('error!')
    // }
    messageList.value.push(chat_response.choices[0].message);
  }).catch((err) => {
    // console.log(err.message);
    openNotification(err.message);
  })
}

// const handlingExceptions = (result: any) => {
  // console.log(result.response)

  // handling status that is not 200
  // if (result.response.status !== 200) {
  //   const err_info = result.response.data.error;
  //   console.log(err_info);
  //   throw Error(err_info.code);
  // }
// }

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
