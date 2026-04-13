<template>
  <div>
    <svg :style="{ width: width, height: height }">
      <use :xlink:href="'#icon-' + name" :fill="color" />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    width: {
      type: String,
      default: "16px",
    },
    height: {
      type: String,
      default: "16px",
    },
    color: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped></style>
