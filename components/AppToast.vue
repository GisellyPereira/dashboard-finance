<script setup lang="ts">
const { message } = useFinanceNotification();
const visible = ref(false);
let timer: ReturnType<typeof setTimeout>;
watch(message, () => {
  clearTimeout(timer);
  visible.value = true;
  timer = setTimeout(() => {
    visible.value = false;
  }, 4500);
});
onBeforeUnmount(() => clearTimeout(timer));
</script>
<template>
  <Transition name="toast"
    ><div v-if="visible" class="app-toast" role="status">
      <AppIcon name="check" :size="18" />{{ message.text }}
    </div></Transition
  >
</template>
