<template>
	<div class="flex flex-col align-middle items-center justify-center text-center pb-2">
		<form @submit.prevent="submit">
			<div class="flex w-full">
				<div class="flex flex-1 justify-center items-center align-middle h-12 sm:h-16">
					<div class="mx-2" :class="this.formulario.chain == 'Hedera'?'border-green-600 border-2 rounded-xl p-2 bg-slate-800':''">
						<img
							src="@/assets/images/Hedera.png" class="inline h-7 sm:h-10 rounded-xl bg-slate-400 p-2"
							:class="this.formulario.chain != 'Hedera' && this.formulario.chain != ''?'blur-sm':''" />
					</div>
					<div class="mx-2" :class="this.formulario.chain == 'Solana'?'border-green-600 border-2 rounded-xl p-2 bg-slate-800':''">
						<img
							src="@/assets/images/Solana.png" class="inline h-7 sm:h-10 rounded-xl bg-slate-400 p-2"
							:class="this.formulario.chain != 'Solana' && this.formulario.chain != ''?'blur-sm':''" />
					</div>
					<div class="mx-2" :class="this.formulario.chain == 'Ethereum'?' border-green-600 border-2 rounded-xl p-2 bg-slate-800':''">
						<img
							src="@/assets/images/Ethereum.png" class="inline h-7 sm:h-10 rounded-xl bg-slate-400 p-1"
							:class="this.formulario.chain != 'Ethereum' && this.formulario.chain != ''?'blur-sm':''" />
					</div>
				</div>
			</div>
			<div class="flex w-full justify-center mt-2">
				<div class="mr-2 flex flex-1">
					<input type="text"
						class="flex flex-1 border-amber-600 text-black font-bold rounded-lg text-center bg-slate-300 text-xs sm:text-base"
						placeholder="Account Address" v-model="formulario.account"
						@keyup="findChain($event)" @submit="submit"
						>
				</div>
				<div>
					<button
						type="submit"
						:class="disableSubmitButton?'hover:cursor-not-allowed opacity-40':''"
						class="rounded-lg px-2 border border-blue-700 bg-blue-700 text-black font-bold hover:opacity-70 hover:border hover:border-amber-600">
						LOAD
					</button>
				</div>
			</div>
		</form>
	</div>
	<GalleryShowETH v-if="showGallery && formulario.chain == 'Ethereum'" :address=formulario.account />
	<GalleryShowHedera v-if="showGallery && formulario.chain == 'Hedera'" :address=formulario.account />
	<GalleryShowSolana v-if="showGallery && formulario.chain == 'Solana'" :address=formulario.account />
	<div class="flex flex-col align-middle items-center justify-center text-center pb-2"></div>
</template>

<script>
import { PublicKey } from '@solana/web3.js'
import Web3 from 'web3';
import GalleryShowETH from './GalleryShowETH.vue'
import GalleryShowHedera from './GalleryShowHedera.vue'
import GalleryShowSolana from './GalleryShowSolana.vue'

export default {
	name: 'InputData',
	components: {
		GalleryShowETH,
		GalleryShowHedera,
		GalleryShowSolana
	},
	data() {
		return {
			formulario:{
				chain: '',
				account: ''
			},
			disableSubmitButton: true,
			showGallery: false
		}
	},
	methods: {
		findChain(event) {
			if (event.code == 'Enter'){
				return
			}
			// Ethereum - 0xAa9FB1a84b38B2510160C75Cc8ce12A6e6CEd432
			// Ethereum - 0x0DEc0C4768Fb5987D581AeA5E2ECBe0D6a490784
			// Ethereum - 0x677F828b252e02E7050e7DDB43655cAEA1CB1F7e
			// Ethereum - 0x543F3B7233F461935255ba32F71b9D910F91f6A0

			// Hedera - 0.0.1074226
			// Hedera - 0.0.1074226-bogfa
			// Hedera - 0.0.848819
			// Hedera - 0.0.640856 Video y Fichero GLB
			// Hedera - 0.0.996099 ASHFALL
			// Hedera - 0.0.523118

			// Solana - C66MoRaMasyasFUuHNv22VP3qdztepPXDXanuRH6Lvex
			// Solana - ACzcgz7gq2qiKKaCxvGCPB3DU4Hne2CztqH1sDuYWsfF

			this.formulario.chain = '';
			this.disableSubmitButton = true;
			this.showGallery = false;
			if (/^0x[a-fA-F0-9]{40}$/.test(this.formulario.account)) {
				if (Web3.utils.isAddress(this.formulario.account)){
					this.formulario.chain = 'Ethereum';
					this.disableSubmitButton = false;
				}
			} else if (/^(0|(?:[1-9]\d*))\.(0|(?:[1-9]\d*))\.(0|(?:[1-9]\d*))(?:-([a-z]{5}))?$/.test(this.formulario.account)){
					this.formulario.chain = 'Hedera';
					this.disableSubmitButton = false;
			} else if (this.formulario.account.length == 44) {
				try {
					if (PublicKey.isOnCurve(new PublicKey(this.formulario.account))){
						this.formulario.chain = 'Solana';
						this.disableSubmitButton = false;
					}
				} catch {
					//a
				}
			}
		},
		submit(){
			if (this.formulario.chain != ''){
				this.showGallery = true;
			}
		}
	}
}
</script>