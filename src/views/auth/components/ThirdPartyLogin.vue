<script setup>
import IconGoogle from '@/components/icons/IconGoogle.vue'
import IconTelegram from '@/components/icons/IconTelegram.vue'
import { useRoute } from 'vue-router'
import { oauth } from "@/api/auth";
import TelegramModal from "./TelegramModal.vue";
import { ref } from "vue";

const props = defineProps({
  config: {
    telegram_bot_name: ''
  }
})

const route = useRoute()
const telegramModalRef = ref(null)

const socialLoginPopup = (url) => {
  window.open(url, 'oauth', 'width=600,height=700')
}

const socialLogin = async (type) => {
  if(type == "google") {
    try {
      const { code } = route.query;
      const params = {
        type,
        code: code ? code : '',
        redirect: `${window.location.origin}/verify.html`,
      }
      const res = await oauth(params)

      const url = (res.data && res.data.url) || (typeof res.data === 'string' ? res.data : null)
      if (!url) throw new Error('后端未返回授权 URL')

      socialLoginPopup(url)
      console.log('打开授权页面：', url)
    } catch (err) {
      console.error('登录失败:', err)
    }
  } else if (type == "telegram") {
    // 弹窗
    telegramModalRef.value?.openModal()
  }

}
</script>

<template>
  <div class="third-party-login">
    <button type="button" class="btn btn-social" @click="socialLogin('google')">
      <IconGoogle class="icon-social" />
      <span class="btn-text">Google</span>
    </button>
    <button type="button" class="btn btn-social" @click="socialLogin('telegram')">
      <IconTelegram class="icon-social" />
      <span class="btn-text">Telegram</span>
    </button>
  </div>
  <TelegramModal ref="telegramModalRef" :config="props.config" />
</template>

<style scoped lang="scss">
.third-party-login {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .btn {
    height: 45px;
    border-radius: 8px;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    border: 1px solid var(--border-color, #e0e0e0);
    background-color: var(--input-bg-color, #f9f9f9);
    color: var(--primary-text-color);
    font-weight: 500;
    width: 100%;

    &:hover {
      border-color: var(--theme-color);
      background-color: var(--input-focus-bg-color, #fff);
      transform: none;
    }

    &:active {
      transform: translateY(1px);
    }
  }

  .icon-social {
    width: 20px;
    height: 20px;
    margin-right: 12px;
    flex-shrink: 0;
  }

  .btn-text {
    font-size: 0.95rem;
    font-weight: 500;
  }
}

// 移动端适配
@media (max-width: 768px) {
  .third-party-login {
    .btn {
      height: 50px; // 移动端增加按钮高度，便于点击
      font-size: 16px; // 防止iOS缩放
      
      .btn-text {
        font-size: 1rem; // 移动端文字稍大
      }
      
      .icon-social {
        width: 22px;
        height: 22px;
        margin-right: 10px;
      }
    }
  }
}

@media (max-width: 480px) {
  .third-party-login {
    gap: 10px; // 小屏幕减少间距
    
    .btn {
      height: 48px;
      padding: 0 12px;
      
      .btn-text {
        font-size: 0.95rem;
      }
    }
  }
}

// 暗色主题适配
.dark-theme {
  .third-party-login {
    .btn {
      background-color: var(--input-bg-color, #333);
      border-color: var(--input-border-color, #444);
      color: var(--primary-text-color);

      &:hover {
        background-color: var(--input-focus-bg-color, #3a3a3a);
        border-color: var(--theme-color);
      }
    }
  }
}
</style>
