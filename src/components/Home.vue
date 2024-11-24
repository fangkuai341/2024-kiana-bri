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
    <a-drawer v-model:open="open" placement="right">
      <a-form :model="formState">
        <a-form-item
          label="cn"
          name="name"
          :rules="[{ required: true, message: '请输入你的cn!' }]"
        >
          <a-input v-model:value="formState.name" :disabled="inputDisabled" />
        </a-form-item>

        <a-form-item
          label="留言"
          name="msg"
          :rules="[{ required: true, message: '请留言!' }]"
        >
          <a-textarea
            :disabled="textareaDisabled"
            v-model:value="formState.msg"
            show-count
            :maxlength="60"
          />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit" @click="submit"
            >提交</a-button
          >
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script setup>
import {
  Drawer as ADrawer,
  Form as AForm,
  Textarea as ATextarea,
  Input as AInput,
  Button as AButton,
  FormItem as AFormItem,
  message,
} from "ant-design-vue";

import { reactive, ref, onMounted, computed } from "vue";
import { setMsg, getMsg, getOneMsg } from "../axios/api.ts";
// 图片路径和网格配置
const blackWhiteImage = "/images/black-white.png"; // 黑白图片路径
const colorImage = "/images/color.png"; // 彩色图片路径
const rows = 20; // 行数
const cols = 20; // 列数
const open = ref(false);

const formState = reactive({
  name: "",
  msg: "",
});
const x = ref(null);
const y = ref(null);
const inputDisabled = ref(false);
const textareaDisabled = ref(false);
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
const initializeBlocks = (colorBlocks = []) => {
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
          clicked: colorBlocks.some((cb) => cb.row === row && cb.col === col),
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
const handleClick = async (block) => {
  //根据x,y值判断是否已经点击过
  let res = await getOneMsg(block.col, block.row, {});
  if (res.code && res.data && res.data.length) {
    //已经点击过
    formState.name = res.data[0].name;
    formState.msg = res.data[0].msg;
    inputDisabled.value = true;
    textareaDisabled.value = true;
  } else {
    //未点击过
    formState.name = "";
    formState.msg = "";
    inputDisabled.value = false;
    textareaDisabled.value = false;
  }
  open.value = true;
  y.value = block.row;
  x.value = block.col;
};
const submit = async () => {
  if (!x.value || !y.value) {
    message.error("请选择坐标");
    return;
  }
  if (!formState.name || !formState.msg) {
    message.error("请填写cn和留言");
    return;
  }
  let res = await setMsg({
    x: x.value,
    y: y.value,
    name: formState.name,
    msg: formState.msg,
  });
  if (res.code === 200) {
    message.success("提交成功");
    let xyBlock = blocks.find(
      (item) => item.row === y.value && item.col === x.value
    );
    x.value = null;
    y.value = null;
    open.value = false;

    xyBlock.clicked = true;
  } else {
    message.error("提交失败");
  }
};
// 生命周期
onMounted(async () => {
  let res = await getMsg({});
  if (res.code === 200) {
    //将res.data转化为{col:x.value,row:y.value}的形式
    let editBlocks = [];
    res.data.forEach((item) => {
      editBlocks.push({
        row: item.y,
        col: item.x,
      });
    });

    initializeBlocks(editBlocks);
  } else {
    message.error("获取失败");
  }
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
