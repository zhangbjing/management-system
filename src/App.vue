<template>
  <div id="app">
    <Layout/>
  </div>
</template>

<script>
import './static/css/reset.css'
import Layout from './components/Layout/index'
export default {
  name: 'App',
  components: {
    Layout
  }
}
</script>

<style scope>
  html, body, #app{
    width:100%;
    height: 100%;
  }
</style>
