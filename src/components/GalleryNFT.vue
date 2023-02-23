<template>
	<div v-if="ShowCargando" className="fixed top-0 left-0 right-0 bg-black/80 flex items-center justify-center w-full h-screen">
      <img src="../assets/gif/Loading.gif" alt='LoadingIMG'/>
    </div>
	<div class="w-full bg-slate-800 rounded-xl">
		<div class="flex text-xl font-bold mb-2 justify-center rounded-t-xl bg-amber-900">
			<div class="pr-3">
				Colecciones: {{ Object.keys(NFTs.Colecciones).length }}
			</div>
			<div class="pl-3">
				NFTs: {{ NFTs.Total }}
			</div>
		</div>
		<div v-for="Index in Object.keys(NFTs.Colecciones)" class="border rounded-md flex-1 m-2 mr-3 bg-gray-900" :key="'Col' + Index">
			<!-- Header -->
			<div @click="async () => await SelectCol(Index)" class="flex flex-1 m-0.5 hover:bg-gray-700 cursor-pointer">
				<div class="mx-2 flex flex-1 place-content-start text-xs sm:text-base items-center">
					<div class="px-2 text-start flex-1">
						{{ NFTs.Colecciones[Index].name }}
					</div>
					<div class="px-2">
						NFTs: {{ NFTs.Colecciones[Index].nfts.length }}
					</div>
					<div v-if="NFTs.Colecciones[Index].supply" class="px-2">
						Supply: {{ NFTs.Colecciones[Index].supply }}
					</div>
					<div v-if="NFTs.Colecciones[Index].fees" class="px-2">
						Fees: {{ NFTs.Colecciones[Index].fees }}%
					</div>
				</div>
			</div>
			<!-- Galería -->
			<div v-if:="NFTs.Colecciones[Index].selected" className="bg-gray-800 rounded-md justify-center flex flex-wrap m-2">
				<div v-for="NFT in NFTs.Colecciones[Index].nfts" class="m-1 my-3 flex flex-col place-content-center" :key="Index + NFT.serial_number">
					<div className="border rounded-t flex place-content-center bg-gray-900">
						<p className="text-xs md:text-sm lg:text-sm text-white mx-1 capitalize">{{ NFT.serial_number.length<12?NFT.serial_number:NFT.serial_number.substring(0, 7)+"..."+NFT.serial_number.substring(NFT.serial_number.length-7,NFT.serial_number.length) }}</p>
					</div>
					<div className="border flex place-content-center">
						<ImageNFT :src="NFT.image?NFT.image:''" alt="NFT" :type="NFT.type?NFT.type:''" className="h-32 sm:h-40" />
					</div>
					<div className="border rounded-b flex place-content-center bg-gray-900">
						<a :href="NFT.metadata_url" target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-400 hover:text-white">Metadata</a>
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
		}
	},
	components: {
		ImageNFT
	},
	data: function () {
		return {
			NFTs: {},
			ShowCargando: false
		}
	},
	methods: {
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