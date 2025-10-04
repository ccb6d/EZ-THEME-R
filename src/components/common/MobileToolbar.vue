<template>
  <div class="mobile-toolbar">
    <button class="mobile-toolbar-toggle" id="mobile-toolbar-toggle" @click="toggleDropdown" :title="$t('common.options')">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="1"></circle>
        <circle cx="12" cy="5" r="1"></circle>
        <circle cx="12" cy="19" r="1"></circle>
      </svg>
    </button>

    <transition name="fade">
      <div class="mobile-dropdown" v-if="isOpen" ref="dropdown">
        <div class="dropdown-content">
          <div class="dropdown-item" id="mobile-theme-toggle" @click="toggleTheme">
            <div class="item-icon">
              <svg v-if="isDarkTheme" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </div>
            <span class="item-text">主题</span>
          </div>
          <div class="dropdown-item" id="mobile-language-selector" @click="openLanguageSelector">
            <div class="item-icon">
              <span class="flag-icon" v-html="getCurrentLanguageFlag()"></span>
            </div>
            <span class="item-text">语言</span>
          </div>
          <div class="dropdown-item" id="mobile-user-menu" @click="toggleUserMenu">
            <div class="item-icon">
              <img 
                v-if="avatarUrl" 
                :src="avatarUrl" 
                alt="User Avatar" 
                class="avatar-image"
              />
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <span class="item-text">用户</span>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- Language selector dropdown that can be opened from mobile toolbar -->
    <transition name="fade">
      <div class="language-dropdown" v-if="isLanguageOpen" ref="languageDropdown">
        <div
          v-for="lang in languages"
          :key="lang.code"
          class="language-item"
          :class="{ 'active': currentLanguage === lang.code }"
          @click="changeLanguage(lang.code)"
        >
          <span class="flag-icon" v-html="lang.flag"></span>
          <span class="lang-name">{{ lang.name }}</span>
        </div>
      </div>
    </transition>
    
    <!-- User menu dropdown -->
    <transition name="fade">
      <div class="user-dropdown" v-if="isUserMenuOpen" ref="userDropdown">
        <div class="user-dropdown-content">
          <div class="menu-item" @click="navigateTo('/profile')">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>用户中心</span>
          </div>
          
          <div class="menu-item" v-if="isXiaoV2board" @click="navigateTo('/wallet/deposit')">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            <span>我的钱包</span>
          </div>
          
          <div class="menu-item" @click="navigateTo('/profile?openPasswordModal=true')">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>修改密码</span>
          </div>
          
          <div class="divider"></div>
          
          <div class="menu-item logout" @click="logout">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>退出登录</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useTheme } from '@/composables/useTheme';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setLanguage } from '@/i18n';
import { useToast } from '@/composables/useToast';
import { isXiaoV2board } from '@/utils/baseConfig';

// Import flags
import vnFlag from '@/assets/i18N/VN.svg';
import cnFlag from '@/assets/i18N/CN.svg';
import gbFlag from '@/assets/i18N/GB.svg';
import hkFlag from '@/assets/i18N/HK.svg';
import jpFlag from '@/assets/i18N/JP.svg';
import krFlag from '@/assets/i18N/KR.svg';
import ruFlag from '@/assets/i18N/RU.svg';
import irFlag from '@/assets/i18N/IR.svg';

export default {
  name: 'MobileToolbar',
  setup() {
    const isOpen = ref(false);
    const isLanguageOpen = ref(false);
    const isUserMenuOpen = ref(false);
    const dropdown = ref(null);
    const languageDropdown = ref(null);
    const userDropdown = ref(null);
    const { theme, toggleTheme } = useTheme();
    const { locale } = useI18n();
    const router = useRouter();
    const store = useStore();
    const { showToast } = useToast();
    
    const isDarkTheme = computed(() => theme.value === 'dark');
    const username = computed(() => store.getters.username);
    const avatarUrl = computed(() => store.getters.avatarUrl || '');
    
    const languages = [
      {
        code: 'zh-CN',
        name: '简体中文',
        flag: `<img src="${cnFlag}" alt="简体中文" class="flag-image" style="width: 100%; height: 100%; object-fit: cover;">`
      },
      {
        code: 'zh-TW',
        name: '繁體中文',
        flag: `<img src="${hkFlag}" alt="繁體中文" class="flag-image" style="width: 100%; height: 100%; object-fit: cover;">`
      },
      {
        code: 'en-US',
        name: 'English',
        flag: `<img src="${gbFlag}" alt="English" class="flag-image" style="width: 100%; height: 100%; object-fit: cover;">`
      },
      {
        code: 'ja-JP',
        name: '日本語',
        flag: `<img src="${jpFlag}" alt="日本語" class="flag-image" style="width: 100%; height: 100%; object-fit: cover;">`
      },
      {
        code: 'ko-KR',
        name: '한국어',
        flag: `<img src="${krFlag}" alt="한국어" class="flag-image" style="width: 100%; height: 100%; object-fit: cover;">`
      },
      {
        code: 'ru-RU',
        name: 'Русский',
        flag: `<img src="${ruFlag}" alt="Русский" class="flag-image" style="width: 100%; height: 100%; object-fit: cover;">`
      },
      {
        code: 'fa-IR',
        name: 'فارسی',
        flag: `<img src="${irFlag}" alt="فارسی" class="flag-image" style="width: 100%; height: 100%; object-fit: cover;">`
      },
      {
        code: 'vi-VN',
        name: 'Tiếng Việt',
        flag: `<img src="${vnFlag}" alt="Tiếng Việt" class="flag-image" style="width: 100%; height: 100%; object-fit: cover;">`
      },
    ];
    
    const currentLanguage = computed(() => locale.value);
    
    const getCurrentLanguageFlag = () => {
      const lang = languages.find(l => l.code === currentLanguage.value);
      return lang ? lang.flag : '';
    };
    
    const changeLanguage = (langCode) => {
      setLanguage(langCode);
      isLanguageOpen.value = false;
      isOpen.value = false;

      const event = new CustomEvent('languageChanged', { detail: langCode });
      window.dispatchEvent(event);
    };
    
    const openLanguageSelector = () => {
      isLanguageOpen.value = true;
      isUserMenuOpen.value = false;
      isOpen.value = false;
      
      nextTick(() => {
        if (languageDropdown.value) {
          const rect = languageDropdown.value.getBoundingClientRect();
          if (rect.right > window.innerWidth) {
            languageDropdown.value.style.right = '0';
            languageDropdown.value.style.left = 'auto';
          }
          if (rect.bottom > window.innerHeight) {
            languageDropdown.value.style.bottom = 'calc(100% + 8px)';
            languageDropdown.value.style.top = 'auto';
          }
        }
      });
    };
    
    const toggleUserMenu = () => {
      isUserMenuOpen.value = !isUserMenuOpen.value;
      isLanguageOpen.value = false;
      isOpen.value = false;
      
      nextTick(() => {
        if (userDropdown.value) {
          const rect = userDropdown.value.getBoundingClientRect();
          if (rect.right > window.innerWidth) {
            userDropdown.value.style.right = '0';
            userDropdown.value.style.left = 'auto';
          }
          if (rect.bottom > window.innerHeight) {
            userDropdown.value.style.bottom = 'calc(100% + 8px)';
            userDropdown.value.style.top = 'auto';
          }
        }
      });
    };
    
    const navigateTo = (path) => {
      isUserMenuOpen.value = false;
      isOpen.value = false;
      router.push(path);
    };
    
    const logout = async () => {
      try {
        localStorage.removeItem('token'); 
        isUserMenuOpen.value = false;
        isOpen.value = false;
        
        showToast('退出登录成功', 'success', 3000);
        
        setTimeout(() => {
          router.push('/login');
        }, 500);
      } catch (error) {
        console.error('退出登录失败:', error);
        showToast('退出登录失败', 'error');
      }
    };

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value;
      isLanguageOpen.value = false;
      isUserMenuOpen.value = false;

      if (isOpen.value) {
        nextTick(() => {
          if (dropdown.value) {
            const rect = dropdown.value.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
              dropdown.value.style.right = '0';
              dropdown.value.style.left = 'auto';
            }
            if (rect.bottom > window.innerHeight) {
              dropdown.value.style.bottom = 'calc(100% + 8px)';
              dropdown.value.style.top = 'auto';
            }
          }
        });
      }
    };

    const handleClickOutside = (event) => {
      const toolbar = document.querySelector('.mobile-toolbar');
      if (toolbar && !toolbar.contains(event.target)) {
        isOpen.value = false;
        isLanguageOpen.value = false;
        isUserMenuOpen.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      isOpen,
      isLanguageOpen,
      isUserMenuOpen,
      toggleDropdown,
      openLanguageSelector,
      toggleUserMenu,
      changeLanguage,
      navigateTo,
      logout,
      dropdown,
      languageDropdown,
      userDropdown,
      isDarkTheme,
      toggleTheme,
      getCurrentLanguageFlag,
      currentLanguage,
      languages,
      username,
      avatarUrl,
      isXiaoV2board: isXiaoV2board()
    };
  }
};
</script>

<style lang="scss" scoped>
.mobile-toolbar {
  position: relative;
  display: none;
}

.mobile-toolbar-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  overflow: hidden;
  
  &:hover {
    background-color: rgba(var(--theme-color-rgb), 0.1);
    border-color: var(--theme-color);
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
    color: var(--theme-color);
  }
  
  &:active {
    transform: translateY(0);
    transition: all 0.1s ease;
  }
}

.mobile-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 160px;
  background: rgba(var(--card-background-rgb), 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border-color);
  z-index: 200;
  overflow: hidden;
  padding: 8px 0;
}

.dropdown-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 8px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  
  &:hover {
    background-color: rgba(var(--theme-color-rgb), 0.1);
  }
}

.item-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  
  .flag-icon {
    width: 24px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 3px;
    }
  }
  
  .avatar-image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
}

.item-text {
  font-size: 14px;
  color: var(--text-color);
}

.language-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 130px;
  background: rgba(var(--card-background-rgb), 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border-color);
  z-index: 200;
  overflow: hidden;
}

.language-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 12px;

  .flag-icon {
    width: 24px;
    height: 16px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 3px;
    }

    svg {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &:hover {
    background-color: rgba(var(--theme-color-rgb), 0.1);
  }

  &.active {
    background-color: rgba(var(--theme-color-rgb), 0.2);
    color: var(--theme-color);
    font-weight: 500;
  }
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  background: rgba(var(--card-background-rgb), 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border-color);
  z-index: 200;
  overflow: hidden;
}

.user-dropdown-content {
  .menu-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    svg {
      margin-right: 10px;
      color: var(--text-color);
      transition: color 0.3s ease;
      width: 18px;
      height: 18px;
    }
    
    span {
      font-size: 14px;
      color: var(--text-color);
      transition: color 0.3s ease;
    }
    
    &:hover {
      background-color: rgba(var(--primary-color-rgb), 0.1);
      color: var(--primary-color);
      
      svg, span {
        color: var(--primary-color);
      }
    }
    
    &.logout {
      &:hover {
        background-color: rgba(245, 108, 108, 0.05);
        transition: background-color 0.5s ease;
        
        svg, span {
          color: #f56c6c;
          transition: color 0.5s ease;
        }
      }
    }
  }
  
  .divider {
    height: 1px;
    background-color: var(--border-color);
    margin: 4px 0;
  }
}

@media (max-width: 768px) {
  .mobile-toolbar {
    display: block;
  }
}
</style>