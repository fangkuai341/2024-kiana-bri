<template>
  <div class="container">
    <div
      class="grid"
      :style="{
        height: `85vh`,
        width: `${gridWidth}px`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }"
    >
      <div
        v-for="(block, index) in blocks"
        :key="index"
        class="block"
        :style="getBlockStyle(block)"
        @click="handleClick(block)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from "vue";

// 图片路径和网格配置
const blackWhiteImage = "/images/black-white.png"; // 黑白图片路径
const colorImage = "/images/color.png"; // 彩色图片路径
const rows = 20; // 行数
const cols = 20; // 列数

// 响应式数据
const blocks = reactive([]);
const imageWidth = ref(0); // 原始图片宽度
const imageHeight = ref(0); // 原始图片高度
const gridHeight = 0.85 * window.innerHeight; // 网格高度为 85vh

// 动态计算网格宽度，保持图片宽高比
const gridWidth = computed(() => {
  return (imageWidth.value / imageHeight.value) * gridHeight;
});

// 初始化网格
const initializeBlocks = () => {
  const img = new Image();
  img.src = blackWhiteImage;
  img.onload = () => {
    imageWidth.value = img.width;
    imageHeight.value = img.height;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        blocks.push({
          row,
          col,
          clicked: false,
        });
      }
    }
  };
};

// 获取每个块的样式
const getBlockStyle = (block) => {
  const blockWidth = gridWidth.value / cols;
  const blockHeight = gridHeight / rows;
  return {
    width: `${blockWidth}px`,
    height: `${blockHeight}px`,
    backgroundImage: `url(${block.clicked ? colorImage : blackWhiteImage})`,
    backgroundPosition: `-${block.col * blockWidth}px -${
      block.row * blockHeight
    }px`,
    backgroundSize: `${gridWidth.value}px ${gridHeight}px`,
  };
};

// 点击处理
const handleClick = (block) => {
  block.clicked = true;
  console.log(`Clicked Block: Row ${block.row}, Col ${block.col}`);
};

// 生命周期
onMounted(() => {
  initializeBlocks();
});
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.grid {
  display: grid;
  position: relative;
}
.block {
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.1); /* 可根据需要隐藏边框 */
  cursor: pointer;
}
</style>
