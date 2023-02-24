<template>
	<div v-if="ShowCargando" className="fixed top-0 left-0 right-0 bg-black/80 flex items-center justify-center w-full h-screen">
      <img src="../assets/gif/Loading.gif" alt='LoadingIMG'/>
    </div>
	<div class="flex flex-col align-middle items-center justify-center border border-amber-900 rounded-xl">
		<GalleryNFT :ListaNFTs="NFTs" Chain="Hedera"/>
	</div>
</template>

<script>
import { GetHederaNFTs } from '../helpers/BlockChainAPI.js'
import GalleryNFT from './GalleryNFT.vue'

export default {
	name: 'GalleryShowHedera',
	props: {
		address: {
			type: String
		}
	},
	components: {
		GalleryNFT
	},
	data() {
		return {
			NFTs: {Colecciones:[],Total:0},
			ShowCargando: true
		}
	},
	beforeMount: async function () {
		this.NFTs = await GetHederaNFTs(this.address)
		this.ShowCargando = false
	}
}
</script>