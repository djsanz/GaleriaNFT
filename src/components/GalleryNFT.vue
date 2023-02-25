<template>
	<div v-if="ShowCargando" className="fixed top-0 left-0 right-0 bg-black/80 flex items-center justify-center w-full h-screen">
      <img src="../assets/gif/Loading.gif" alt='LoadingIMG'/>
    </div>
	<div class="w-full bg-slate-800 rounded-xl">
		<div class="flex text-base sm:text-xl font-bold mb-2 justify-center rounded-t-xl bg-amber-900">
			<div class="pr-3">
				Collections: {{ Object.keys(NFTs.Colecciones).length }}
			</div>
			<div class="px-3">
				NFTs: {{ NFTs.Total }}
			</div>
			<div v-if="NFTs.Value != 0" class="pl-3">
				Value: {{ NFTs.Value }}
			</div>
		</div>
		<div v-for="Index in Object.keys(NFTs.Colecciones)" class="border rounded-md flex-1 m-2 mr-3 bg-gray-900" :key="'Col' + Index">
			<!-- Header -->
			<div @click="async () => await SelectCol(Index)" class="flex flex-1 m-0.5 hover:bg-gray-700 cursor-pointer">
				<div class="mx-2 flex flex-1 place-content-start text-xs sm:text-base items-center">
					<div class="px-2 text-start flex-1 text-clip overflow-hidden ...">
						{{ NFTs.Colecciones[Index].name?NFTs.Colecciones[Index].name:'NoName' }}
					</div>
					<div class="flex flex-col sm:flex-row">
						<div class="px-2">
							NFTs: {{ NFTs.Colecciones[Index].nfts.length }}
						</div>
						<div v-if="NFTs.Colecciones[Index].fees" class="px-2">
							Fees: {{ NFTs.Colecciones[Index].fees }}%
						</div>
						<div v-if="NFTs.Colecciones[Index].supply" class="px-2">
							Supply: {{ NFTs.Colecciones[Index].supply }}
						</div>
						<div v-if="NFTs.Colecciones[Index].floor" class="px-2">
							Floor: {{ NFTs.Colecciones[Index].floor }}
						</div>
					</div>
				</div>
			</div>
			<!-- Galería -->
			<div v-if:="NFTs.Colecciones[Index].selected" className="bg-gray-800 rounded-md justify-center flex flex-wrap m-2">
				<div v-for="NFT in NFTs.Colecciones[Index].nfts" class="m-1 my-3 flex flex-col place-content-center" :key="Index + NFT.serial_number">
					<div className="border rounded-t flex place-content-center bg-gray-900 min-w-max">
						<div class="basis-1/6 min-w-fit">
							<a v-if="LinkMarket(Index)" :href="LinkMarket(Index)" target="_blank" className="" >
								<img src="@/assets/icons/cart.svg" alt="MarketIcon" className="h-6 p-1" />
							</a>
						</div>
						<div className="flex flex-1 justify-center text-white">
							{{ NFT.serial_number.length<12?NFT.serial_number:Acorta(NFT.serial_number) }}
						</div>
						<div class="basis-1/6 min-w-fit">
							<a v-if="LinkExplorer(Index)" :href="LinkExplorer(NFT.token_id?NFT.token_id:NFTs.Colecciones[Index].token_id)" target="_blank" className="">
								<img src="@/assets/icons/explorer.svg" alt="SearchIcon" className="h-6 p-1" />
							</a>
						</div>
					</div>
					<div className="border flex place-content-center">
						<ImageNFT :src="NFT.image?NFT.image:''" alt="NFT" :type="NFT.type?NFT.type:''" className="h-32 sm:h-40" />
					</div>
					<div className="border rounded-b flex place-content-center bg-gray-900">
						<a :href="NFT.metadata_url" target="_blank" rel="noreferrer" :class="NFT.metadata_url?'hover:text-white text-blue-400 text-xs font-bold':'text-gray-900 text-xs font-bold'">Metadata</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ImageNFT from './ImageNFT.vue'
import { GetMetadataNFT } from '../helpers/BlockChainAPI.js'

export default {
	name: 'GalleryNFT',
	props: {
		ListaNFTs: {
			type: Object
		},
		Chain: {
			type: String
		}
	},
	components: {
		ImageNFT
	},
	data: function () {
		return {
			NFTs: {},
			ShowCargando: false,
			Markets: {
				Hedera: {
					MCol:"https://zuse.market/collection/<COL>",
					SCol:"https://hashscan.io/mainnet/token/<COL>"
				},
				Solana: {
					SCol:"https://solscan.io/token/<COL>"
				},
				polygon: {
					MCol:"https://opensea.io/es/assets/matic/<COL>",
					SCol:"https://polygonscan.com/token/<COL>#inventory"
				},
				ethereum: {
					MCol:"https://opensea.io/es/assets/ethereum/<COL>",
					SCol:"https://etherscan.io/token/<COL>#inventory"
				},
				arbitrum: {
					MCol:"https://opensea.io/es/assets/arbitrum/<COL>",
					SCol:"https://arbiscan.io/token/<COL>#inventory"
				},
				optimism: {
					MCol:"https://opensea.io/es/assets/optimism/<COL>",
					SCol:"https://optimistic.etherscan.io/token/<COL>#inventory"
				},
				bsc: {
					MCol:"https://opensea.io/es/assets/bsc/<COL>",
					SCol:"https://bscscan.com/token/<COL>#inventory"
				},
				avalanche :{
					MCol:"https://opensea.io/es/assets/avalanche/<COL>",
					SCol:"https://snowtrace.io/token/<COL>#inventory"
				},
				fantom:{
					SCol:"https://ftmscan.com/token/<COL>#inventory"
				},
				cronos:{
					SCol:"https://cronoscan.com/token/<COL>#inventory"
				},
				palm:{
					SCol:"https://explorer.palm.io/token/<COL>/inventory"
				},
			}
		}
	},
	methods: {
		Acorta(Text){
			if (Text.startsWith("0x")){
				return parseInt(Text, 16)
			}
			return Text.substring(0, 6)+"..."+Text.substring(Text.length-6,Text.length)
		},
		LinkMarket(Col){
			let Salida = this.Markets[this.Chain].MCol?this.Markets[this.Chain].MCol.replace("<COL>",Col.toLowerCase()):null
			return Salida
		},
		LinkExplorer(Col){
			return this.Markets[this.Chain].SCol?this.Markets[this.Chain].SCol.replace("<COL>",Col):null
		},
		async SelectCol(Index) {
			if (!this.NFTs.Colecciones[Index].selected) {
				this.ShowCargando = true
				for (let i = 0; i < this.NFTs.Colecciones[Index].nfts.length; i++) {
					if (this.NFTs.Colecciones[Index].nfts[i].image) continue
					const {ImageURL,ImageType} = await GetMetadataNFT(this.NFTs.Colecciones[Index].nfts[i].metadata_url)
					this.NFTs.Colecciones[Index].nfts[i].image = ImageURL
					this.NFTs.Colecciones[Index].nfts[i].type = ImageType
				}
				this.ShowCargando = false
			}
			this.NFTs.Colecciones[Index].selected=!this.NFTs.Colecciones[Index].selected
		}
	},
	watch: {
		ListaNFTs: {
			immediate: true,
			handler (newVal) {
				this.NFTs = newVal;
			}
		},
	},
}
</script>