<template>
  <div style="background-color: black">
    <div class="layer1"></div>
    <div class="layer2"></div>
    <div class="layer3"></div>
    <div class="layer4"></div>
    <div class="layer5"></div>
    <div
      style="
        background-color: transparent;
        height: 100vh;
        width: 100vw;
        display: flex;
        justify-content: center;
      "
    >
      <Home />
    </div>
  </div>
</template>

<script setup>
import Home from "./components/Home.vue";
</script>

<style lang="scss" scoped>
@function getShadows($n) {
  $result: "#{random(100)}vw #{random(100)}vh 0 0 #fff";
  @for $i from 2 through $n {
    $result: "#{$result}, #{random(100)}vw #{random(100)}vh 0 0 #fff";
  }
  @return unquote($result);
}
$d: 400s;
$n: 1000;
@for $i from 2 through 5 {
  $d: $d / 2;
  $n: floor($n / 2);
  .layer#{$i} {
    $size: #{$i}px;
    position: fixed;
    left: 0;
    top: 0;
    width: $size;
    height: $size;
    border-radius: 50%;
    box-shadow: getShadows($n);
    animation: moveUp $d;
    &::after {
      content: "";
      position: inherit;
      left: 0;
      top: 100vh;
      width: inherit;
      height: inherit;
      box-shadow: inherit;
      border-radius: inherit;
    }
  }
}

@keyframes moveUp {
  to {
    transform: translateY(-100vh);
  }
}
</style>
