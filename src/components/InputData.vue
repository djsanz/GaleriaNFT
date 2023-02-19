<template>
	<div class="flex flex-col align-middle items-center justify-center text-center p-2">
		<div class="flex w-full">
			<!-- <div class="flex">
				Supported Chains:
			</div> -->
			<div class="flex flex-1 justify-center items-center align-middle h-16">
				<div class="mx-2" :class="this.formulario.chain == 'Hedera'?'border-green-600 border-2 rounded-xl p-2 bg-slate-800':''">
					<img src="@/assets/images/Hedera.png" class="inline h-10 rounded-xl bg-slate-400 p-2" />
				</div>
				<div class="mx-2" :class="this.formulario.chain == 'Solana'?'border-green-600 border-2 rounded-xl p-2 bg-slate-800':''">
					<img src="@/assets/images/Solana.png" class="inline h-10 rounded-xl bg-slate-400 p-2" />
				</div>
				<div class="mx-2" :class="this.formulario.chain == 'Ethereum'?'border-green-600 border-2 rounded-xl p-2 bg-slate-800':''">
					<img src="@/assets/images/Ethereum.png" class="inline h-10 rounded-xl bg-slate-400 p-1" />
				</div>
			</div>
		</div>
		<div class="flex w-full justify-center mt-2">
			<!-- <div class="mr-2">Account:</div> -->
			<div class="mr-2">
				<input type="text" size="50"
					class="border border-amber-600 text-black font-bold rounded-lg text-center bg-slate-300 text-xs sm:text-base"
					placeholder="Address"
					v-model="formulario.account"
					@keyup="findChain"
					>
			</div>
			<div>
				<button
					type="submit" @click.prevent="submit"
					:class="disableSubmitButton?'hover:cursor-not-allowed opacity-50':''"
					class="rounded-lg px-2 border border-blue-700 bg-blue-700 text-black font-bold hover:opacity-70 hover:border hover:border-amber-600">
					Load NFTs
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { PublicKey } from '@solana/web3.js'
import Web3 from 'web3';

export default {
	name: 'InputData',
	data() {
		return {
			formulario:{
				chain: '',
				account: ''
			},
			disableSubmitButton: true,
			errores: []
		}
	},
	methods: {
		findChain() {
			// Ethereum - 0xAa9FB1a84b38B2510160C75Cc8ce12A6e6CEd432
			// Hedera - 0.0.1074226 o 0.0.1074226-bogfa
			// Hedera - /^0\.0\.[1-9]\d{0,4}$/
			// 0.0.12345
			// Solana - C66MoRaMasyasFUuHNv22VP3qdztepPXDXanuRH6Lvex
			// Solana - 9ig8oacMxvVWgLv8pXmL1fcjErwn75WYDs5CTdDnYCNm
			// Solana - worm2ZoG2kUd4vFXhvjh93UUH596ayRfgQ2MgjNMTtha
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
			} else {
				this.formulario.chain = '';
				this.disableSubmitButton = true;
			}
		},
	}
}
</script>