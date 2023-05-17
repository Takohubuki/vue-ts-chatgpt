<script setup lang="ts">
// import { ref } from 'vue'

defineProps<{ msg: string }>()

// const count = ref(0)
</script>

<template>
  <div class="gutter-example">
    <a-row :gutter="16">
      <a-col class="gutter-row" :span="6">
        <div class="gutter-box">
          <a-card title="System" class="chat-prompt">
            <a-textarea :bordered="false" placeholder="You are an Assistant" />
          </a-card>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="14">
        <div class="gutter-box chat-box">

          <div class="message-group">
            <a-divider style="border-color: blue;" orientation="left">User</a-divider>
            <div class="chat-content">
              some texts
            </div>
          </div>
          <div class="message-group">
            <a-divider style="border-color: blue;" orientation="left">Assistant</a-divider>
            <div class="chat-content">
              some texts
            </div>
          </div>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="4">
        <div class="gutter-box hyper-parameters">
          <!-- <input type="text" placeholder="temperature"> -->
          <a-slider :min="0" :max="1" :step="0.01"/>
          <a-slider :min="1" :max="2048" :step="1"/>
          <a-slider :min="0" :max="1" :step="0.01"/>
          <!-- <input type="text" placeholder="token length">
          <input type="text" placeholder="other parameters"> -->
        </div>
      </a-col>
    </a-row>
  </div>
  <div class="chat-input-box">
    <a-input-group compact>
      <a-input style="text-align: left; width: calc(100% - 100px)" />
      <a-button type="primary">Submit</a-button>
    </a-input-group>

    <!-- <input type="text" name="" id="" class="chat-input">
    <a-button type="primary">submit</a-button> -->
  </div>
</template>

<style scoped lang="scss">
.hyper-parameters {
  max-width: 200px;
  input {
    width: 150px;
  }
}
.gutter-example {
  width: calc(100% - 10px);
}
.chat-prompt {
  text-align: left;
}
.message-group {
  width: 100%;
}
.chat-input-box {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  padding: 10px;
}

.chat-box {
  width: calc(100% - 100px);
  height: 80%;

  .chat-content {
    height: 50px;
    text-align: left;
    font-size: 20px;
  }
}
</style>
