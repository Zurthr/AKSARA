<template>
    <div>
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