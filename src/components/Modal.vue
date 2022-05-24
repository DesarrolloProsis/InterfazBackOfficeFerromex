<template>
    <teleport to="body">
      <div v-if="showModal" ref="modal-backdrop" class="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50">
        <div class="flex items-start justify-center min-h-screen pt-24 text-center">
          <div
              class="w-1/2 bg-white rounded-lg text-left overflow-hidden shadow-xl"
              role="dialog"
              ref="modal"
              aria-modal="true"
              aria-labelledby="modal-headline"
          >
            <slot>
              Este es mi modal</slot>
          </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import { ref, watch } from 'vue';
const props = {
  show: {
    type: Boolean,
    default: false,
  },
};
export default {
  name: 'Modal',
  props,
  setup(props){
    const showModal = ref(false);
    watch(
      () => props.show,
      show => {
        showModal.value = show;
        console.log(showModal.value)
        },
    );
    return {
      showModal,
    }
  }
}
</script>
