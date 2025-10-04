import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

// 创建新手引导实例
export const createDriver = (steps, options = {}) => {
  const defaultOptions = {
    showProgress: true,
    nextBtnText: '下一步',
    prevBtnText: '上一步',
    doneBtnText: '完成',
    closeBtnText: '关闭',
    progressText: '{{current}} / {{total}}',
    onDestroyStarted: (element, step, opts) => {
      // 保存用户已完成引导的状态
      localStorage.setItem('tourCompleted', 'true');
      // 获取driver实例并正确销毁
      const driverObj = opts.driver;
      if (driverObj && typeof driverObj.destroy === 'function') {
        driverObj.destroy();
      }
    },
    ...options
  };

  return driver({
    ...defaultOptions,
    steps: steps
  });
};

// 检查是否应该显示新手引导
export const shouldShowTour = () => {
  return !localStorage.getItem('tourCompleted');
};

// 公告引导步骤
export const announcementSteps = [
  {
    element: '#announcement-btn',
    popover: {
      title: '网站公告',
      description: '点击这里可以查看网站的最新公告和重要通知',
      side: 'bottom',
      align: 'center'
    }
  }
];

// 优惠券引导步骤 (适配移动端和桌面端)
export const couponSteps = [
  {
    element: '#coupon-btn',
    popover: {
      title: '优惠券',
      description: '点击这里可以查看可用的优惠券，在购买套餐时使用',
      side: 'bottom',
      align: 'center'
    }
  },
  {
    element: '#mobile-coupon-btn',
    popover: {
      title: '优惠券',
      description: '点击这里可以查看可用的优惠券，在购买套餐时使用',
      side: 'bottom',
      align: 'center'
    }
  }
];

// 主题切换引导步骤 (适配移动端和桌面端)
export const themeToggleSteps = [
  {
    // 桌面端元素
    element: '#theme-toggle',
    popover: {
      title: '主题切换',
      description: '点击这里可以在深色模式和浅色模式之间切换',
      side: 'bottom',
      align: 'center'
    }
  },
  {
    // 移动端元素 - 在更多菜单中
    element: '#mobile-theme-toggle',
    popover: {
      title: '主题切换',
      description: '在移动端，点击这里可以直接切换主题',
      side: 'bottom',
      align: 'center'
    }
  }
];

// 语言切换引导步骤 (适配移动端和桌面端)
export const languageSelectorSteps = [
  {
    // 桌面端元素
    element: '#language-selector',
    popover: {
      title: '语言切换',
      description: '点击这里可以切换网站显示语言',
      side: 'bottom',
      align: 'center'
    }
  },
  {
    // 移动端元素 - 在更多菜单中
    element: '#mobile-language-selector',
    popover: {
      title: '语言切换',
      description: '在移动端，点击这里可以直接切换语言',
      side: 'bottom',
      align: 'center'
    }
  }
];

// 帮助文档引导步骤
export const helpDocumentSteps = [
  {
    element: '#help-document-card',
    popover: {
      title: '帮助文档',
      description: '点击这里可以查看使用帮助和常见问题解答',
      side: 'bottom',
      align: 'center'
    }
  }
];

// 移动端更多功能引导步骤
export const mobileMoreSteps = [
  {
    element: '#mobile-toolbar-toggle',
    popover: {
      title: '更多功能',
      description: '点击这里可以打开更多功能菜单，包含主题切换、语言切换等选项',
      side: 'bottom',
      align: 'center'
    }
  }
];

// 移动端用户菜单引导步骤
export const mobileUserMenuSteps = [
  {
    element: '#mobile-user-menu',
    popover: {
      title: '用户菜单',
      description: '点击这里可以访问用户中心、修改密码、退出登录等功能',
      side: 'bottom',
      align: 'center'
    }
  }
];
