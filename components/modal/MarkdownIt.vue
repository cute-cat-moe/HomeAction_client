<template>
  <div>
    <v-row v-if="loading">
      <v-col cols="12" align="center">
        <Loading v-model="loading" :text="loadingText" />
      </v-col>
    </v-row>
    <div v-else class="markdown-body" v-html="htmlText"></div>
  </div>
</template>

<script>
import Loading from '~/components/modal/Loading'

const hljs = require('highlight.js')
const md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value
      } catch (__) {}
    }

    return ''
  },
})

export default {
  components: { Loading },
  model: {
    prop: 'mdText',
    event: 'mdTextOnChange',
  },
  props: {
    mdText: {
      type: String,
      required: true,
    },
    loadingText: {
      type: String,
      required: false,
      default: '正在加载中',
    },
  },
  data: () => ({
    loading: true,
    htmlText: '',
  }),
  watch: {
    mdText() {
      this.render()
    },
  },
  created() {
    this.render()
  },
  methods: {
    render() {
      this.loading = true
      this.htmlText = md.render(this.mdText)
      this.loading = false
    },
  },
}
</script>
