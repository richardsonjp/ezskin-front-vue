<template>
  <div>
    <b-alert :show="error != ''" dismissible variant="danger"  @dismissed="emptyMessage('error')">
      <span v-html="error">{{ error }}</span>
    </b-alert>
    <b-alert :show="success != ''" dismissible variant="success" @dismissed="emptyMessage('success')">
      <span v-html="success">{{ success }}</span>
    </b-alert>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: String,
      default: ''
    },
    success: {
      type: [String],
      default: ''
    },
  },
  methods: {
    emptyMessage(alertType) {
      this.$emit('empty-message', alertType)
    }
  }
}
</script>
