<template>
  <Penumonia></Penumonia>
</template>

<script>
  import Penumonia from '@/components/Penumonia'
  export default {
    name: 'App',
    components: {
      Penumonia
    }
  }

</script>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    height: 100%;
  }

  body {
    height: 100%;
    min-width: 1400px;
    min-height: 600px;
    background-color: #141827;
  }

</style>
