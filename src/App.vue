<template>
	<div class="font-Roboto text-white bg-black bg-gradient-to-r from-gray-900 pt-2 sm:pt-4 px-2 sm:px-10 space-y-2 min-h-screen flex flex-col text-center overflow-x-clip">
		<TituloApp/>
		<InputData/>
		<PieApp/>
	</div>
</template>

<script>
import TituloApp from './components/TituloApp.vue'
import InputData from './components/InputData.vue'
import PieApp from './components/PieApp.vue'

export default {
  name: 'App',
  components: {
    TituloApp,
	InputData,
	PieApp
  }
}
</script>
