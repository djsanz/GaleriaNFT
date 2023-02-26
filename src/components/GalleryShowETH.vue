<template>
	<div v-if="ShowCargando" className="fixed top-0 left-0 right-0 bg-black/80 flex items-center justify-center w-full h-screen">
      <img src="../assets/gif/Loading.gif" alt='LoadingIMG'/>
    </div>
	<div class="flex flex-wrap justify-center p-2">
		<button @click="SelectChain('ethereum')" class="flex m-2 border-2 rounded-xl p-1" :class="SelectedChain == 'ethereum'?'border-green-600 border-2':SelectedChain?'opacity-20':''">
			<div class="pr-2">
				<img src="@/assets/chains/ethereum.webp" class="inline h-5 sm:h-8 rounded-full" />
			</div>
			<div class="items-center align-middle flex p-1">Ethereum</div>
		</button>
		<button @click="SelectChain('polygon')" class="flex m-2 border-2 rounded-xl p-1" :class="SelectedChain == 'polygon'?'border-green-600 border-2':SelectedChain?'opacity-20':''">
			<div class="pr-2">
				<img src="@/assets/chains/polygon.webp" class="inline h-5 sm:h-8 rounded-full" />
			</div>
			<div class="items-center align-middle flex p-1">Polygon</div>
		</button>
		<button @click="SelectChain('bsc')" class="flex m-2 border-2 rounded-xl p-1" :class="SelectedChain == 'bsc'?'border-green-600 border-2':SelectedChain?'opacity-20':''">
			<div class="pr-2">
				<img src="@/assets/chains/binance.webp" class="inline h-5 sm:h-8 rounded-full" />
			</div>
			<div class="items-center align-middle flex p-1">Binance</div>
		</button>
		<button @click="SelectChain('arbitrum')" class="flex m-2 border-2 rounded-xl p-1" :class="SelectedChain == 'arbitrum'?'border-green-600 border-2':SelectedChain?'opacity-20':''">
			<div class="pr-2">
				<img src="@/assets/chains/arbitrum.webp" class="inline h-5 sm:h-8 rounded-full" />
			</div>
			<div class="items-center align-middle flex p-1">Arbitrum</div>
		</button>
		<button @click="SelectChain('optimism')" class="flex m-2 border-2 rounded-xl p-1" :class="SelectedChain == 'optimism'?'border-green-600 border-2':SelectedChain?'opacity-20':''">
			<div class="pr-2">
				<img src="@/assets/chains/optimism.webp" class="inline h-5 sm:h-8 rounded-full" />
			</div>
			<div class="items-center align-middle flex p-1">Optimism</div>
		</button>
		<button @click="SelectChain('avalanche')" class="flex m-2 border-2 rounded-xl p-1" :class="SelectedChain == 'avalanche'?'border-green-600 border-2':SelectedChain?'opacity-20':''">
			<div class="pr-2">
				<img src="@/assets/chains/avalanche.webp" class="inline h-5 sm:h-8 rounded-full" />
			</div>
			<div class="items-center align-middle flex p-1">Avalanche</div>
		</button>
		<button @click="SelectChain('cronos')" class="flex m-2 border-2 rounded-xl p-1" :class="SelectedChain == 'cronos'?'border-green-600 border-2':SelectedChain?'opacity-20':''">
			<div class="pr-2">
				<img src="@/assets/chains/cronos.webp" class="inline h-5 sm:h-8 rounded-full" />
			</div>
			<div class="items-center align-middle flex p-1">Cronos</div>
		</button>
		<button @click="SelectChain('fantom')" class="flex m-2 border-2 rounded-xl p-1" :class="SelectedChain == 'fantom'?'border-green-600 border-2':SelectedChain?'opacity-20':''">
			<div class="pr-2">
				<img src="@/assets/chains/fantom.webp" class="inline h-5 sm:h-8 rounded-full" />
			</div>
			<div class="items-center align-middle flex p-1">Fantom</div>
		</button>
		<button @click="SelectChain('palm')" class="flex m-2 border-2 rounded-xl p-1" :class="SelectedChain == 'palm'?'border-green-600 border-2':SelectedChain?'opacity-20':''">
			<div class="pr-2">
				<img src="@/assets/chains/palm.webp" class="inline h-5 sm:h-8 rounded-full" />
			</div>
			<div class="items-center align-middle flex p-1">Palm</div>
		</button>
	</div>
	<div v-if="SelectedChain" class="flex flex-col align-middle items-center justify-center border border-amber-900 rounded-xl">
		<GalleryNFT :ListaNFTs="NFTs" :Chain="SelectedChain"/>
	</div>
</template>

<script>
import { EthAlchemyChain, GetAlchemyNFTs, EthMoralisChain, GetMoralisNFTs } from '../helpers/BlockChainAPI.js'
import GalleryNFT from './GalleryNFT.vue'

export default {
	name: 'GalleryShowETH',
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
			ShowCargando: false,
			SelectedChain: null
		}
	},
	methods: {
		SelectChain: function (Chain) {
			if (this.SelectedChain == Chain) {
				this.SelectedChain = null,
				this.NFTs = {Colecciones:[],Total:0}
			}else{
				this.SelectedChain = Chain
				this.UpdateNFTs()
			}
		},
		UpdateNFTs: async function () {
			this.ShowCargando = true
			if (EthAlchemyChain[this.SelectedChain]){
				// console.log("Alchemy: ",EthAlchemyChain[this.SelectedChain])
				this.NFTs = await GetAlchemyNFTs(this.address,EthAlchemyChain[this.SelectedChain])
			}else if (EthMoralisChain[this.SelectedChain]){
				// console.log("Moralis: ",EthMoralisChain[this.SelectedChain])
				this.NFTs = await GetMoralisNFTs(this.address,EthMoralisChain[this.SelectedChain])
			}
			// console.log("Nfts:",this.NFTs)
			this.ShowCargando = false
		}
	}

}
</script>