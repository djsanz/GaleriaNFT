<template>
	<div class="font-Roboto flex-row h-full min-h-screen text-center text-white bg-black bg-gradient-to-r from-gray-900 pt-2 sm:pt-4 px-2 sm:px-10 space-y-2">
		<TituloApp/>
		<InputData/>
	</div>
</template>

<script>
import TituloApp from './components/TituloApp.vue'
import InputData from './components/InputData.vue'

export default {
  name: 'App',
  components: {
    TituloApp,
	InputData
  }
}
</script>
