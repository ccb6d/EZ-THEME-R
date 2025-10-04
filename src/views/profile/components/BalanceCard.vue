<template>
  <div class="profile-skeleton">
    <div class="profile-card">
      <div class="card-header">
        <h3>{{ $t('wallet.balance.title') || '账户余额' }}</h3>
      </div>
      <div class="settings-content">
        <div class="balance-info">
          <div class="balance-amount">
            <span class="currency-symbol">{{ currencySymbol }}</span>
            <span class="amount">{{ formatAmount(balance) }}</span>
          </div>
          <button class="action-btn" @click="goToDeposit">
            <IconWallet :size="18" />
            {{ $t('wallet.deposit.button') || '充值' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { IconWallet } from '@tabler/icons-vue';

const props = defineProps({
  userInfo: {
    type: Object,
    required: true
  },
  config: {
    type: Object,
    required: true
  },
});

const router = useRouter();

// 从 props.userInfo 中获取余额
const balance = computed(() => {
  return props.userInfo?.balance || 0;
});

// 默认货币符号，如果 config 中有货币信息可以替换
const currencySymbol = computed(() => {
  return props.config?.currency_symbol || '¥';
});

const formatAmount = (amount) => {
  return (parseFloat(amount) / 100).toFixed(2);
};

const goToDeposit = () => {
  router.push('/wallet/deposit');
};
</script>

<style scoped lang="scss">
.profile-skeleton {
  .profile-card {
    background-color: var(--card-bg);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid var(--border-color);
    margin-bottom: 24px;
    overflow: hidden;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      transform: translateX(-100%);
      background-image: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0,
        rgba(255, 255, 255, 0.1) 20%,
        rgba(255, 255, 255, 0.2) 60%,
        rgba(255, 255, 255, 0) 100%
      );
      animation: shimmer 2s infinite;
      z-index: 1;
    }
  }

  .card-header {
    padding: 15px 20px;
    border-bottom: 1px solid var(--border-color);
    background-color: rgba(var(--theme-color-rgb), 0.03);

    h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      color: var(--text-color);
    }
  }

  .settings-content {
    padding: 16px 20px;

    .balance-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;

      .balance-amount {
        display: flex;
        align-items: baseline;

        .currency-symbol {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-color);
          margin-right: 4px;
        }

        .amount {
          font-size: 28px;
          font-weight: 700;
          color: var(--theme-color);
        }
      }

      .action-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        border-radius: 8px;
        background-color: var(--theme-color);
        color: white;
        border: none;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background-color: rgba(var(--theme-color-rgb), 0.9);
          transform: translateY(-2px);
        }
      }
    }
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(300%);
    }
  }
}
</style>
