<template>
    <div style="width: 320px;">
    <div class="Right-sidebar">
        <slot />
    </div>
</div>
</template>

<style scoped>
.Right-sidebar{
    position: sticky;
  top: 80px;
  margin-top: 20px;
  width: 320px;
  padding-left: 24px;
}

</style>