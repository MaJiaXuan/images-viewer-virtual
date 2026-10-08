<template>
  <div class="demo-preview">
    <div class="demo-toolbar">
      <button class="demo-btn" @click="toggle" :disabled="loading">
        {{ loading ? '加载中...' : show ? '🔽 收起示例' : '▶ 运行示例' }}
      </button>
      <span v-if="error" class="demo-error">{{ error }}</span>
    </div>
    <div v-if="show" class="demo-container">
      <iframe
        ref="iframe"
        :srcdoc="srcdoc"
        frameborder="0"
        class="demo-iframe"
        :style="{ height: height + 'px' }"
        allow="fullscreen; clipboard-write; clipboard-read"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  code: { type: String, required: true },
  images: { type: [Number, String], default: 10 },
  height: { type: Number, default: 400 },
})

const show = ref(false)
const loading = ref(false)
const error = ref('')
const libraryCode = ref('')
const libraryCSS = ref('')
const iframe = ref(null)

const generateImage = `function generateImage(seed, width, height) {
  const hue = Math.round((seed * 137.508) % 360);
  const sat = Math.round(50 + (seed * 7) % 30);
  const light = Math.round(40 + (seed * 13) % 25);
  const hue2 = Math.round((hue + 30) % 360);
  const sat2 = Math.round(sat - 10);
  const light2 = Math.round(light + 10);
  const fontSize = Math.round(width / 15);
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = 'hsl(' + hue + ',' + sat + '%,' + light + '%)';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = 'hsl(' + hue2 + ',' + sat2 + '%,' + light2 + '%)';
  for (var row = 0; row < 8; row++) {
    for (var col = 0; col < 12; col++) {
      if ((row + col + seed) % 3 === 0) {
        ctx.fillRect(
          Math.round(col * width / 12),
          Math.round(row * height / 8),
          Math.round(width / 12),
          Math.round(height / 8)
        );
      }
    }
  }
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = 'bold ' + fontSize + 'px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('图片 ' + (seed + 1), width / 2, height / 2);
  return canvas.toDataURL('image/png');
}`

const count = computed(() =>
  typeof props.images === 'string' ? parseInt(props.images) : props.images
)

const imagesArray = computed(
  () => `Array.from({ length: ${count.value} }, (_, i) => ({
  url: generateImage(i, 1920, 1080),
  thumbnail: generateImage(i, 200, 150),
  title: '图片 ' + (i + 1)
}))`
)

const srcdoc = computed(() => {
  const safeCode = props.code.replace(/<\/script>/gi, '<\\/script>')
  const css = libraryCSS.value || ''
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Demo</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  ${css}
</style>
</head>
<body>
  <div style="position:fixed;inset:0;background:#0a0a0f;display:flex;flex-direction:column;align-items:center;justify-content:center;">
    <button id="runBtn" style="padding:10px 24px;background:#4a9eff;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px;transition:background 0.2s;" onmouseover="this.style.background='#3a8eef'" onmouseout="this.style.background='#4a9eff'">运行示例</button>
    <div id="msg" style="margin-top:16px;color:#999;font-size:13px;padding:0 20px;text-align:center;"></div>
  </div>
  <script>
    ${libraryCode.value}
  <\/script>
  <script>
    ${generateImage}
    const images = ${imagesArray.value};
    const btn = document.getElementById('runBtn');
    const msg = document.getElementById('msg');
    btn.addEventListener('click', () => {
      msg.textContent = '正在运行...';
      try {
        ${safeCode}
        msg.textContent = '';
        btn.style.display = 'none';
      } catch (e) {
        msg.textContent = '运行错误: ' + e.message;
        console.error(e);
      }
    });
  <\/script>
</body>
</html>
  `.trim()
})

const loadLibrary = async () => {
  if (libraryCode.value) return
  loading.value = true
  error.value = ''
  try {
    const base = document.querySelector('base')?.getAttribute('href') || '/images-viewer-virtual/'
    const [jsRes, cssRes] = await Promise.all([
      fetch(base + 'dist/images-viewer.umd.js'),
      fetch(base + 'dist/images-viewer-virtual.css'),
    ])
    if (!jsRes.ok) throw new Error('JS HTTP ' + jsRes.status)
    if (!cssRes.ok) throw new Error('CSS HTTP ' + cssRes.status)
    libraryCode.value = await jsRes.text()
    libraryCSS.value = await cssRes.text()
  } catch (e) {
    console.error('加载 ImagesViewer 库失败:', e)
    error.value = '加载库失败: ' + e.message
  } finally {
    loading.value = false
  }
}

const toggle = async () => {
  if (!show.value) {
    await loadLibrary()
  }
  if (error.value) return
  show.value = !show.value
  if (show.value) {
    setTimeout(() => {
      const el = iframe.value
      if (el && el.contentDocument) {
        const btn = el.contentDocument.getElementById('runBtn')
        if (btn) btn.click()
      }
    }, 300)
  }
}
</script>

<style scoped>
.demo-preview {
  margin: 16px 0;
  border: 1px solid #2a2a3e;
  border-radius: 8px;
  overflow: hidden;
}
.demo-toolbar {
  padding: 12px 16px;
  background: #1a1a2e;
  border-bottom: 1px solid #2a2a3e;
  display: flex;
  align-items: center;
  gap: 12px;
}
.demo-btn {
  padding: 6px 16px;
  background: #4a9eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}
.demo-btn:hover {
  background: #3a8eef;
}
.demo-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.demo-error {
  color: #ff6b6b;
  font-size: 13px;
}
.demo-container {
  background: #0a0a0f;
}
.demo-iframe {
  width: 100%;
  display: block;
}
</style>
