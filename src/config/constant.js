export const userKnow = () => `<section lang="zh-CN" aria-labelledby="notice-title" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial;line-height:1.6;">
  <h1 id="notice-title" style="font-size:1.25rem;margin:0 0 0.5rem 0;">用户须知</h1>

  <p style="margin:0 0 0.75rem 0;">
    感谢您选择我们的代理服务 😊 我们始终注重服务质量，致力于为您提供稳定、安全、流畅的体验。为了保障您和平台的权益，请您务必仔细阅读以下说明：
  </p>

  <ul style="margin:0 0 0.75rem 1.25rem;padding:0;">
    <li><strong>合规使用：</strong> 严禁将本服务用于任何违法、违规或侵害他人权益的行为，否则后果由用户自行承担。</li>
    <li><strong>合理使用：</strong> 请避免过度或异常使用，以免影响您或他人的正常体验。</li>
    <li><strong>隐私保护：</strong> 本平台尊重并保护用户隐私，不会主动记录或保存您的使用日志。</li>
    <li><strong>服务更新：</strong> 平台会持续优化和升级，请及时关注 <a href="https://t.me/+M1A9z_HOCT5hOWI5" target="_blank">最新通知</a> 。</li>
    <li><strong>沟通支持：</strong> 如有疑问或问题，可随时通过工单或网站在线客服联系我们，我们将尽快为您处理。</li>
  </ul>

  <p style="margin:0 0 0.75rem 0;font-size:0.95rem;">
    <em>免责声明：</em> 本平台仅提供中立的代理服务，不对用户的具体使用行为承担责任。用户因使用本服务导致的任何直接或间接损失，本平台不承担法律责任。
  </p>

  <p style="margin:0 0 0.75rem 0;font-size:0.95rem;">
    使用本服务即表示您已阅读、理解并同意以上条款。感谢您的理解与支持，祝您使用愉快！
  </p>

  <footer style="margin-top:0.5rem;font-size:0.85rem;color:#555;">
    <p style="margin:0;">© 本平台 保留所有权利</p>
  </footer>
</section>`

export const shopPopup = () => `<p><strong>常规套餐默认每月订单日重置流量，您当月未用使用完的流量，不会累积到下个月</strong></p>`

export const buyConfirm = () => `<p><strong style="color: red">使用教程请参考：<a href="https://google.com" target="_blank">https://google.com</a></strong></p> <p><strong style="color: red">请在确认了解使用方法后再购买，本商品不支持退款</strong></p>`

export const ticketPopup = () => `<p>请您准确描述您的问题，再提交工单，以便我们更快帮助您。</p>`

export const getAppLink = (type) => {
  let link = `https://${window.location.hostname}`
  
  switch (type) {
    case 'android':
      link += '/client/cmfa-2.11.16-meta-arm64-v8a-release.apk'
      break
    case 'ios':
      link = 'https://apps.apple.com/us/app/shadowrocket/id932747118'
      break
    case 'windows':
      link += '/client/Clash.Verge_2.4.2_x64-setup.exe'
      break
    case 'macos':
      link = 'https://google.com/download'
      break
    case 'linux':
      link = 'https://google.com/guide/linux'
    case 'openwrt':
      link = 'https://google.com/guide/openwrt'
      break
    default:
      link += '/client/cmfa-2.11.16-meta-arm64-v8a-release.apk'
  }
  return link
}

export const getThemeColor = () => {
  const CACHE_KEY = "myThemeColor";
  const cachedColor = localStorage.getItem(CACHE_KEY);
  if (cachedColor) return cachedColor;
  
  // 精选调色板（去掉 #9e9d24，换成更舒服的绿色）
  const colors = [
    "#355cc2", // 主题蓝
    "#4a90e2",
    "#5c6bc0",
    "#3f51b5",
    "#1976d2",
    "#26a69a",
    "#009688",
    "#43a047",
    "#7cb342",
    "#fbc02d",
    "#fb8c00",
    "#f4511e",
    "#d32f2f",
    "#c2185b",
    "#8e24aa",
    "#6a1b9a",
    "#5e35b1",
    "#3949ab",
    "#1e88e5",
    "#039be5",
    "#00acc1",
    "#00897b",
    "#2e7d32", // 保留深绿
    "#66bb6a", // ✅ 新加：清新的绿色，替换掉原来的土绿
    "#f57f17",
    "#e65100",
    "#b71c1c"
  ];
  
  // 随机取一个
  const picked = colors[Math.floor(Math.random() * colors.length)];
  localStorage.setItem(CACHE_KEY, picked);
  return picked;
}
