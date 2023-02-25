<template>
	<div class="flex flex-col align-middle items-center justify-center text-center pb-2">
		<form @submit.prevent="submit">
			<div class="flex w-full justify-center mb-2 mt-2">
				Enter Account Address to see the NFTs:
			</div>
			<div class="flex w-full justify-center mb-2 mt-2">
				<div class="mr-2 flex flex-1">
					<input type="text"
						class="flex flex-1 border-amber-600 text-black font-bold rounded-lg text-center bg-slate-300 text-xs sm:text-base"
						placeholder="Account Address" v-model="account">
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
			<div class="flex w-full">
				<div class="flex flex-1 justify-center items-center align-middle h-12 sm:h-16">
					<div class="mx-2" :class="this.chain == 'Hedera'?'border-green-600 border-2 rounded-xl p-2 bg-slate-800':''">
						<img
							src="@/assets/images/Hedera.png" class="inline h-7 sm:h-10 rounded-xl bg-slate-400 p-2"
							:class="this.chain != 'Hedera' && this.chain != ''?'blur-sm':''" />
					</div>
					<div class="mx-2" :class="this.chain == 'Solana'?'border-green-600 border-2 rounded-xl p-2 bg-slate-800':''">
						<img
							src="@/assets/images/Solana.png" class="inline h-7 sm:h-10 rounded-xl bg-slate-400 p-2"
							:class="this.chain != 'Solana' && this.chain != ''?'blur-sm':''" />
					</div>
					<div class="mx-2" :class="this.chain == 'Ethereum'?' border-green-600 border-2 rounded-xl p-2 bg-slate-800':''">
						<img
							src="@/assets/images/Ethereum.png" class="inline h-7 sm:h-10 rounded-xl bg-slate-400 p-1"
							:class="this.chain != 'Ethereum' && this.chain != ''?'blur-sm':''" />
					</div>
				</div>
			</div>
		</form>
	</div>
	<GalleryShowETH v-if="showGallery && chain == 'Ethereum'" :address=account />
	<GalleryShowHedera v-if="showGallery && chain == 'Hedera'" :address=account />
	<GalleryShowSolana v-if="showGallery && chain == 'Solana'" :address=account />
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
			chain: '',
			account: '',
			disableSubmitButton: true,
			showGallery: false
		}
	},
	watch: {
		account: function () {
			this.findChain()
		}
	},
	methods: {
		findChain() {
			this.chain = '';
			this.disableSubmitButton = true;
			this.showGallery = false;
			if (/^0x[a-fA-F0-9]{40}$/.test(this.account)) {
				if (Web3.utils.isAddress(this.account)){
					this.chain = 'Ethereum';
					this.disableSubmitButton = false;
				}
			} else if (/^(0|(?:[1-9]\d*))\.(0|(?:[1-9]\d*))\.(0|(?:[1-9]\d*))(?:-([a-z]{5}))?$/.test(this.account)){
					this.chain = 'Hedera';
					this.disableSubmitButton = false;
			} else if (this.account.length == 44) {
				try {
					if (PublicKey.isOnCurve(new PublicKey(this.account))){
						this.chain = 'Solana';
						this.disableSubmitButton = false;
					}
				} catch {
					//a
				}
			}
		},
		submit(){
			if (this.chain != ''){
				this.showGallery = true;
			}
		}
	}
}
</script>