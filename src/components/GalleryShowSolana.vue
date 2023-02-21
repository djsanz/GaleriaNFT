<template>
	<div class="flex flex-col align-middle items-center justify-center border">
		<div class="text-3xl font-bold">
			GalleryShow
		</div>
		<div class="text-xl font-bold">
			Address: {{ address }}
		</div>

		<div class="text-2xl font-bold text-red-500">
			SubChain: "Ethereum" - {{ ethNFTs.Total }}
		</div>
		<div v-for="Colleccion in ethNFTs.Colleciones" :key="Colleccion.token_id">
			<div class="">
				{{ Colleccion.name }} - {{ Colleccion.symbol }} - {{ Colleccion.nfts.length }}
			</div>
		</div>
<!-- 
		<div class="text-2xl font-bold text-red-500">
			SubChain: "Polygon" - {{ polygonNFTs.Total }}
		</div>
		<div v-for="Colleccion in polygonNFTs.Colleciones" :key="Colleccion.token_id">
			<div class="">
				{{ Colleccion.name }} - {{ Colleccion.symbol }} - {{ Colleccion.nfts.length }}
			</div>
		</div>

		<div class="text-2xl font-bold text-red-500">
			SubChain: "Arbitrum" - {{ ArbitrumNFTs.Total }}
		</div>
		<div v-for="Colleccion in ArbitrumNFTs.Colleciones" :key="Colleccion.token_id">
			<div class="">
				{{ Colleccion.name }} - {{ Colleccion.symbol }} - {{ Colleccion.nfts.length }}
			</div>
		</div>

		<div class="text-2xl font-bold text-red-500">
			SubChain: "Optimism" - {{ OptimismNFTs.Total }}
		</div>
		<div v-for="Colleccion in OptimismNFTs.Colleciones" :key="Colleccion.token_id">
			<div class="">
				{{ Colleccion.name }} - {{ Colleccion.symbol }} - {{ Colleccion.nfts.length }}
			</div>
		</div> -->
	</div>
</template>

<script>
import { EthSubChain, GetAlchemyNFTs, GetMoralisNFTs } from '../helpers/BlockChainAPI.js'

export default {
	name: 'GalleryShowSolana',
	props: {
		address: {
			type: String
		}
	},
	data() {
		return {
			ethNFTs: {},
			polygonNFTs: {},
			ArbitrumNFTs: {},
			OptimismNFTs: {},
			BinanceNFTs: {}
		}
	},
	mounted() {
		GetAlchemyNFTs(this.address,EthSubChain.Ethereum).then((data) => {
			this.ethNFTs = data
			// console.log("Eth:",data)
		})
		// GetAlchemyNFTs(this.address,EthSubChain.Polygon).then((data) => {
		// 	this.polygonNFTs = data
		// })
		// GetAlchemyNFTs(this.address,EthSubChain.Arbitrum).then((data) => {
		// 	this.ArbitrumNFTs = data
		// })
		// GetAlchemyNFTs(this.address,EthSubChain.Optimism).then((data) => {
		// 	this.OptimismNFTs = data
		// })

		// 0xd8da6bf26964af9d7eed9e03e53415d37aa96045
		GetMoralisNFTs(this.address,"bsc").then((data) => {
			this.BinanceNFTs = data
		})
		
	}
}
</script>