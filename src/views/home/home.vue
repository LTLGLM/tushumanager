<template>
  <div class="welcome-screen">
    <div class="welcome-content">
      <div class="title-section">
        <div class="main-title">{{ displayText }}</div>
        <div class="cursor" :class="{ 'blink': isMainComplete }">|</div>
      </div>
      <div class="subtitle-section" v-show="isMainComplete">
        <div class="subtitle">{{ displaySubText }}</div>
        <div class="cursor" :class="{ 'blink': isAllComplete }">|</div>
      </div>
    </div>
    <div class="background-effects">
      <div v-for="n in 20" :key="n" class="circle" 
           :style="{ 
             '--delay': n * 0.5 + 's',
             '--size': Math.random() * 100 + 50 + 'px',
             '--left': Math.random() * 100 + '%',
             '--duration': 5 + Math.random() * 5 + 's'
           }">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      mainText: '校园二手交易平台后台管理系统',
      subText: '让闲置物品流转起来，让校园生活更加美好。',
      displayText: '',
      displaySubText: '',
      isMainComplete: false,
      isAllComplete: false,
      mainSpeed: 150,
      subSpeed: 100
    }
  },
  mounted() {
    this.startTyping()
  },
  methods: {
    startTyping() {
      let mainIndex = 0
      const typeMainText = () => {
        if (mainIndex < this.mainText.length) {
          this.displayText += this.mainText.charAt(mainIndex)
          mainIndex++
          setTimeout(typeMainText, this.mainSpeed)
        } else {
          this.isMainComplete = true
          setTimeout(this.typeSubTitle, 500)
        }
      }
      typeMainText()
    },
    typeSubTitle() {
      let subIndex = 0
      const typeSubText = () => {
        if (subIndex < this.subText.length) {
          this.displaySubText += this.subText.charAt(subIndex)
          subIndex++
          setTimeout(typeSubText, this.subSpeed)
        } else {
          this.isAllComplete = true
        }
      }
      typeSubText()
    }
  }
}
</script>

<style lang="scss" scoped>
.welcome-screen {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a1c20 0%, #2c3e50 100%);
  position: relative;
  overflow: hidden;
  
  .welcome-content {
    position: relative;
    z-index: 2;
    padding: 40px;
    
    .title-section, .subtitle-section {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .main-title {
      color: #ffffff;
      font-size: 46px;
      font-weight: 600;
      letter-spacing: 4px;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.3),
                   0 0 20px rgba(255, 255, 255, 0.2),
                   0 0 30px rgba(255, 255, 255, 0.1);
      animation: glow 2s ease-in-out infinite alternate;
    }

    .subtitle {
      color: #a8b6c7;
      font-size: 22px;
      font-weight: 300;
      line-height: 1.6;
      margin-top: 30px;
      text-align: center;
      max-width: 800px;
      opacity: 0;
      animation: fadeIn 1s ease forwards;
      text-shadow: 0 0 5px rgba(168, 182, 199, 0.3);
    }

    .cursor {
      width: 3px;
      height: 46px;
      background-color: #ffffff;
      margin-left: 8px;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);

      &.blink {
        animation: blink 1s infinite;
      }

      &:last-child {
        height: 28px;
      }
    }
  }

  .background-effects {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;

    .circle {
      position: absolute;
      left: var(--left);
      top: -100px;
      width: var(--size);
      height: var(--size);
      background: radial-gradient(circle at center, 
        rgba(255, 255, 255, 0.1) 0%,
        rgba(255, 255, 255, 0.05) 30%,
        rgba(255, 255, 255, 0) 70%);
      border-radius: 50%;
      animation: float var(--duration) ease-in-out infinite;
      animation-delay: var(--delay);
      opacity: 0;
    }
  }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes fadeIn {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes glow {
  from {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.3),
                 0 0 20px rgba(255, 255, 255, 0.2),
                 0 0 30px rgba(255, 255, 255, 0.1);
  }
  to {
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.4),
                 0 0 30px rgba(255, 255, 255, 0.3),
                 0 0 40px rgba(255, 255, 255, 0.2);
  }
}

@keyframes float {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  20% {
    opacity: 0.5;
  }
  50% {
    transform: translateY(calc(100vh + 100px));
    opacity: 0.3;
  }
  100% {
    transform: translateY(calc(100vh + 100px));
    opacity: 0;
  }
}
</style>
