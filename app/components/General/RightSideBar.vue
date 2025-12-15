<template>
    <div style="width: 348px;">
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
  padding-left: 0px;
  margin-left:24px;
   padding-bottom: 400px; 
}

</style>