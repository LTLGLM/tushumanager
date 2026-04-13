<template>
  <div>
    <img
      src="@/assets/logo.png"
      alt=""
      :style="{ height: height + 'px', width: width + 'px' }"
    />
  </div>
</template>

<script>
export default {
  props: ["height", "width"],
};
</script>

<style lang="scss" scoped></style>
