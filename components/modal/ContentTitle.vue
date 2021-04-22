<template>
  <!-- 小标题模板 -->
  <div class="py-4 subtitle-1">
    <v-row align="center">
      <v-col align="start">
        <span class="pl-2 font-weight-bold opacity-secondary">
          <slot></slot>
        </span>
      </v-col>
      <v-col align="end">
        <span class="pr-0">
          <slot name="action"></slot>
        </span>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  components: {},
}
</script>
