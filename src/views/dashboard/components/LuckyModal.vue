<script setup>
import { IconAlertTriangle, IconCircle, IconCircleCheck, IconX } from "@tabler/icons-vue";
import { computed, reactive, ref, nextTick, onMounted, onUnmounted } from "vue";
import { checkInReq } from "@/api/user";
import { useToast } from "@/composables/useToast";
import BgImg from '@/assets/images/check-in/bg.png'
import TagImg from '@/assets/images/check-in/tag.png'
import GoImg from '@/assets/images/check-in/go.png'
import PrizeImg from '@/assets/images/check-in/prize.png'
import NoPrizeImg from '@/assets/images/check-in/no-prize.png'

const emit = defineEmits(['checkinSuccess']);
const { showToast } = useToast();

// 监听窗口大小变化
const handleResize = () => {
  // 触发响应式更新
  isMobile.value = window.innerWidth < 768;
  isSmallScreen.value = window.innerWidth < 350;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const filters = [
  { label: 'GB', value: 'GB' },
  { label: 'MB', value: 'MB' },
];

const blocks = [
  {
    padding: '30px',
    imgs: [
      { src: BgImg, width: '100%', height: '100%', rotate: true },
    ],
  },
  {
    imgs: [{ src: TagImg, width: '20px', top: '-20px' }],
  },
]

let prizes = ref([])
const buttons = [{
  radius: isMobile ? (isSmallScreen ? '25vw' : '30vw') : '40px',
  background: '#f8def8',
  pointer: true,
  imgs: [{ src: GoImg, width: '100%', top: '-100%' }]
}]

const showModal = ref(false)
const loading = ref(false)
const selectedFilter = ref('GB')
const hasReq = ref(false)
const myLucky = ref(null)

const formData = reactive({
  input: 0
})

const messageInfo = reactive({
  type: 'success',
  message: ''
})

const isMobile = computed(() => window.innerWidth < 768);
const isSmallScreen = computed(() => window.innerWidth < 350);

const generateTrafficList = (value, prizeValue, unit = "GB") => {
  unit = unit.toUpperCase();
  if (unit !== "GB" && unit !== "MB") {
    throw new Error("unit 必须是 'GB' 或 'MB'");
  }

  // 根据单位确定计算值
  let calculatedValue = value;
  if (unit === "MB") {
    calculatedValue = value / 1024; // 转换为GB进行计算
  }

  // prizeValue 固定是字节，直接转换为GB进行计算和显示
  const calculatedPrizeValue = prizeValue / (1024 * 1024 * 1024); // 转换为GB

  // 格式化输出：>=1GB 用 GB，<1GB 用 MB
  function formatValue(val) {
    const sign = val >= 0 ? "+" : "-";
    const absVal = Math.abs(val);

    // 根据值的大小决定显示单位
    if (absVal >= 1) {
      return `${sign}${absVal.toFixed(2)}GB`;
    } else {
      // 小于1GB时转换为MB显示
      const mbValue = absVal * 1024;
      return `${sign}${mbValue.toFixed(2)}MB`;
    }
  }

  const trafficList = [];

  // 随机生成 5 个数，增加小值出现的概率
  while (trafficList.length < 5) {
    // 使用不同的策略生成随机数，增加小值概率
    let rand;
    if (Math.random() < 0.2) {
      // 20%概率生成小于1GB的值
      rand = (Math.random() * 2 - 1) * Math.min(calculatedValue, 1); // 限制在1GB以内
    } else {
      // 70%概率生成正常范围的值
      rand = (Math.random() * 2 - 1) * calculatedValue; // [-calculatedValue, +calculatedValue]
    }
    trafficList.push(rand);
  }

  // 随机插入目标值
  const idx = Math.floor(Math.random() * 6);
  trafficList.splice(idx, 0, calculatedPrizeValue);

  // 转换为字符串
  const formattedList = trafficList.map(v => formatValue(v));

  // 返回格式化后的数组和中奖值的索引
  return { list: formattedList, prizeIndex: idx };
}

const generatePrize = (value, prizeValue, unit) => {
  try {
    const result = generateTrafficList(value, prizeValue, unit)
    const { list, prizeIndex } = result
    if (list) {
      const newList = list.map((item,index) => {
        return { fonts: [{ text: item, top: '10%' }],
          background: index % 2 == 0 ? '#f8def8' : '#f8def8',
          imgs: [{ src: item.startsWith('+') ? PrizeImg : NoPrizeImg, width: '45%', top: '35%' }]
        }
      })
      prizes.value = newList
      startCallback(prizeIndex)
    }
  } catch (e) {
    console.log(e)
  }
}

const openModal = () => {
  formData.input = 0
  selectedFilter.value = 'GB'
  hasReq.value = false
  showModal.value = true
}

const setFilter = (filter) => {
  selectedFilter.value = filter;
};

const confirm = async () => {
  if(hasReq.value) {
    showModal.value = false
    return;
  }

  if(formData.input <= 0 ) {
    showToast('运气签到流量不能为0','error', 3000);
    return
  }

  try {
    const params = {
      type: 2,
      input: `${formData.input}${selectedFilter.value}`
    }
    loading.value = true;
    const res = await checkInReq(params)
    const { message, data, traffic } = res;
    messageInfo.type = data ? 'success' : 'error'
    messageInfo.message = message

    if(data) {
      hasReq.value = true
      await nextTick(() => {
        generatePrize(formData.input, traffic, selectedFilter.value)
      })
    } else {
      showToast(messageInfo.message, messageInfo.type, 3000);
    }
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false;
  }
}

const startCallback = (index) => {
  myLucky.value?.play()
  setTimeout(() => {
    myLucky.value?.stop(index)
  }, 3000)
}

const endCallback = () => {
  showToast(messageInfo.message, messageInfo.type, 0);
  // 签到成功后发出事件通知
  if (messageInfo.type == 'success') {
    emit('checkinSuccess');
  }
}

defineExpose({ openModal })
</script>

<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click="showModal = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>运气签到</h3>
            <button class="modal-close" @click="showModal = false">
              <IconX :size="20" />
            </button>
          </div>
          <div class="modal-body" v-if="!hasReq">
            <div class="alert alert-warning">
              <IconAlertTriangle :size="22" class="alert-icon" />
              <div class="alert-content">
                <div class="alert-title">{{ $t('invite.withdraw.tip') }}</div>
                <div class="alert-desc">运气签到，输入数值和单位获得浮动流量 <br/>(-100% ~ +100%)，可能获得或扣除流量</div>
              </div>
            </div>

            <div class="transfer-form">
              <div class="form-group">
                <label class="form-label">流量</label>
                <div class="input-with-prefix account-input">
                  <input
                      type="number"
                      v-model="formData.input"
                      class="form-control"
                      placeholder="请输入流量"
                  />
                  <div class="filter-toggle-container">

                    <div class="filter-toggle-wrapper">

                      <div

                          v-for="filter in filters"

                          :key="filter.value"

                          class="filter-option"

                          :class="{ 'active': selectedFilter === filter.value }"

                          @click="setFilter(filter.value)"

                      >

                        <div class="option-icon">

                          <IconCircleCheck v-if="selectedFilter === filter.value" />

                          <IconCircle v-else />

                        </div>

                        <span class="option-text">{{ filter.value }}</span>

                      </div>

                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-body" v-else style="display: flex; justify-content: center; align-items: center;">
            <LuckyWheel
                ref="myLucky"
                :width="isMobile ? (isSmallScreen ? '85vw' : '90vw') :'300px'"
                :height="isMobile ? (isSmallScreen ? '85vw' : '90vw') :'300px'"
                :prizes="prizes"
                :blocks="blocks"
                :buttons="buttons"
                @end="endCallback"
                :defaultConfig="{ offsetDegree: 22.5 }"
                :defaultStyle="{ fontColor: '#000', fontSize: isMobile ? (isSmallScreen ? '11px' : '12px') : '13px'}"
            />
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" @click="showModal = false">
              {{ $t('common.cancel') }}
            </button>
            <button
                class="btn-submit"
                @click="confirm"
            >
              <div v-if="loading" class="loader"></div>
              <span>{{ $t('common.confirm') }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.modal-content {
  background-color: var(--card-background);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  width: 90%;
  max-width: 480px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(var(--theme-color-rgb), 0.15);
  animation: modal-fade-in 0.2s ease-out;
  position: relative;

  // 移动端优化
  @media (max-width: 767px) {
    width: 95%;
    max-width: none;
    margin: 0 10px;
  }

  // 极小屏幕设备优化
  @media (max-width: 350px) {
    width: 98%;
    margin: 0 5px;
  }
}

@keyframes modal-fade-in {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, rgba(var(--theme-color-rgb), 0.05), transparent);
  position: sticky;
  top: 0;
  z-index: 5;
  background-color: var(--card-background);

  h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-color);
    display: flex;
    align-items: center;
    gap: 10px;

    &::before {
      content: '';
      display: block;
      width: 4px;
      height: 18px;
      background-color: var(--theme-color);
      border-radius: 2px;
    }
  }

  .modal-close {
    background: none;
    border: none;
    color: var(--secondary-text-color);
    cursor: pointer;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
    margin: -8px;
    z-index: 10;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
      color: var(--text-color);
      transform: rotate(90deg);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  max-height: calc(90vh - 140px);

  // 移动端优化
  @media (max-width: 767px) {
    padding: 16px;
    max-height: calc(90vh - 120px);
  }

  p {
    color: var(--text-color);
    font-size: 15px;
    line-height: 1.6;
    margin: 0 0 16px;
  }

  .alert {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    border-radius: 12px;
    padding: 16px;
    position: relative;
    overflow: hidden;

    // 移动端优化
    @media (max-width: 767px) {
      padding: 12px;
      margin-bottom: 16px;
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
    }

    .alert-icon {
      flex-shrink: 0;
      margin-right: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .alert-content {
      flex: 1;
    }

    &.alert-warning {
      background-color: rgba(255, 152, 0, 0.08);
      border: 1px solid rgba(255, 152, 0, 0.2);

      &::before {
        background-color: #ff9800;
      }

      .alert-icon {
        color: #ff9800;
        filter: drop-shadow(0 2px 4px rgba(255, 152, 0, 0.3));
      }

      .alert-title {
        font-weight: 600;
        margin-bottom: 4px;
        color: #ff9800;
        font-size: 15px;
      }

      .alert-desc {
        color: var(--text-color);
        opacity: 0.9;
        font-size: 14px;
        line-height: 1.5;
        text-align: justify;

        // 移动端优化
        @media (max-width: 767px) {
          font-size: 13px;
        }
      }
    }
  }

  .form-group {
    margin-bottom: 20px;

    // 移动端优化
    @media (max-width: 767px) {
      margin-bottom: 16px;
    }

    .form-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: var(--text-color);
    }

    .input-with-prefix, .account-input {
      display: flex;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      overflow: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);

      &:focus-within {
        border-color: var(--theme-color);
        box-shadow: 0 0 0 3px rgba(var(--theme-color-rgb), 0.15);
      }

      .input-prefix {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 12px;
        background-color: rgba(var(--theme-color-rgb), 0.08);
        color: var(--text-color);
        font-weight: 500;
        border-right: 1px solid var(--border-color);
      }

      .form-control {
        flex: 1;
        padding: 12px 16px;
        border: none;
        background-color: transparent;
        color: var(--text-color);
        font-size: 16px;
        outline: none;

        // 移动端优化
        @media (max-width: 767px) {
          padding: 10px 12px;
          font-size: 16px; // 保持16px以避免iOS缩放
        }

        &::placeholder {
          color: var(--text-muted);
          opacity: 0.7;
        }
      }
    }

    .form-hint {
      margin-top: 8px;
      font-size: 13px;
      color: var(--text-muted);

      .min-withdraw-hint {
        color: var(--warning-color);
        margin-left: 4px;
        font-weight: 500;
      }
    }

    .error-message {
      margin-top: 8px;
      color: #f44336;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 4px;

      &::before {
        content: '!';
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        background-color: #f44336;
        color: white;
        border-radius: 50%;
        font-size: 12px;
        font-weight: bold;
      }
    }
  }
}

.modal-footer {
  padding: 16px 24px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  // 移动端优化
  @media (max-width: 767px) {
    padding: 16px 16px 20px;
    gap: 8px;
  }

  button {
    padding: 12px 24px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    // 移动端优化
    @media (max-width: 767px) {
      padding: 10px 20px;
      font-size: 14px;
    }

    &.btn-cancel {
      background-color: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-color);

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        transform: translateY(-2px);
      }
    }

    &.btn-submit {
      background-color: var(--theme-color);
      border: none;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-width: 100px;
      box-shadow: 0 4px 10px rgba(var(--theme-color-rgb), 0.3);

      // 移动端优化
      @media (max-width: 767px) {
        min-width: 80px;
      }

      &:hover:not(:disabled) {
        background-color: rgba(var(--theme-color-rgb), 0.9);
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(var(--theme-color-rgb), 0.4);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        box-shadow: none;
      }

      .loader {
        width: 18px;
        height: 18px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s linear infinite;
      }
    }
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.filter-toggle-container {
  display: flex;
  align-items: center;
  width: 48%;
  padding-left: 2%;

  // 移动端优化
  @media (max-width: 767px) {
    width: 50%;
    padding-left: 4%;
  }

  .filter-toggle-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;

    .filter-option {
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 6px 10px;
      border-radius: 12px;
      width: 60px;

      // 移动端优化
      @media (max-width: 767px) {
        padding: 4px 8px;
        width: 50px;
      }

      &:hover {
        background-color: rgba(var(--theme-color-rgb), 0.05);
      }

      &.active {
        background-color: rgba(var(--theme-color-rgb), 0.08);

        .option-icon {
          color: var(--theme-color);
        }

        .option-text {
          color: var(--text-color);
          font-weight: 600;
        }
      }

      .option-icon {
        margin-right: 6px;
        display: flex;
        align-items: center;
        color: var(--secondary-text-color);
        transition: color 0.3s ease;

        svg {
          width: 18px;
          height: 18px;

          // 移动端优化
          @media (max-width: 767px) {
            width: 16px;
            height: 16px;
          }
        }
      }

      .option-text {
        font-size: 14px;
        color: var(--secondary-text-color);
        transition: color 0.3s ease;

        // 移动端优化
        @media (max-width: 767px) {
          font-size: 13px;
        }
      }
    }
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
