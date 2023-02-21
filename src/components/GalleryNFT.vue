<template>
	<div class="border border-red-700 w-full">
		<div class="text-xl font-bold mb-2">
			Colecciones: {{ Object.keys(ListaNFTs.Colecciones).length }} - NFTs: {{ ListaNFTs.Total }}
		</div>
		<div v-for="Index in Object.keys(ListaNFTs.Colecciones)" class="flex flex-col align-middle items-center justify-center border" :key="'Col' + Index">
			<div class="font-bold flex flex-row w-full align-middle">
				<div class="px-2 text-start flex-1">
					Coleccion: {{ ListaNFTs.Colecciones[Index].name }}
				</div>
				<div class="px-2">
					NFTs: {{ ListaNFTs.Colecciones[Index].nfts.length }}
				</div>
				<div class="px-2">
					Supply: {{ ListaNFTs.Colecciones[Index].supply }}
				</div>
				<div class="px-2">
					Fees: {{ ListaNFTs.Colecciones[Index].fees }}%
				</div>
			</div>
			<div class="text-xl font-bold mb-4">
				Imagenes NFTs
			</div>
			<!-- <div class="flex flex-row align-middle items-center justify-center border">
				<div v-for="NFT in NFTs.Colecciones[Index]" class="flex flex-col align-middle items-center justify-center border" :key="'Nft' + NFT.serial_number">
					<div class="text-xl font-bold">
						NFT: {{ NFT.serial_number }}
					</div>
					<div class="text-xl font-bold">
						{{ NFT.image }}
					</div>
				</div>
			</div> -->
		</div>
	</div>
</template>

<script>

export default {
	name: 'GalleryNFT',
	props: {
		ListaNFTs: {
			type: Object
		}
	}
}
</script>