// import Moralis  from 'moralis';
// import { EvmChain } from '@moralisweb3/evm-utils';
import { Buffer } from 'buffer'
import { UrlRender } from './Utils.js'
import axios from 'axios'

const AlchemyApiKey = process.env.VUE_APP_AlchemyApiKey
const MoralisApiKey = process.env.VUE_APP_MoralisApiKey

export const EthSubChain = Object.freeze({ Ethereum: "eth-mainnet", Polygon: "polygon-mainnet", Arbitrum: "arb-mainnet", Optimism: "opt-mainnet" });

export async function GetAlchemyNFTs(_Address, _SubChain) {
	// fetch('https://eth-mainnet.g.alchemy.com/nft/v2/docs-demo/getNFTs?owner=vitalik.eth&pageSize=100&withMetadata=false', options)
	const Url = `https://${_SubChain}.g.alchemy.com/nft/v2/${AlchemyApiKey}/getNFTs?owner=${_Address}`
	try {
		const res = await fetch(Url);
		const data = await res.json();
		const result = {
			status: res.status,
			data: data
		};
		console.log("Eth:", result)
		let ListaNFTsOrdenada = {}
		let Total = 0
		for (let i = 0; i < result.data.ownedNfts.length; i++) {
			let TokenAddress, TokenId, Name, Symbol
			try { TokenAddress = result.data.ownedNfts[i].contract.address }
			catch { TokenAddress = "" }
			try { TokenId = result.data.ownedNfts[i].id.tokenId }
			catch { TokenId = "" }
			try { Name = result.data.ownedNfts[i].contractMetadata.name }
			catch { Name = "" }
			try { Symbol = result.data.ownedNfts[i].contractMetadata.symbol }
			catch { Symbol = "" }
			let MetadataURL, ImageURL, ImageType
			try { MetadataURL = result.data.ownedNfts[i].tokenUri.gateway }
			catch { MetadataURL = null }
			try { ImageURL = result.data.ownedNfts[i].media.gateway }
			catch { ImageURL = null }
			try { ImageType = result.data.ownedNfts[i].media.format }
			catch { ImageType = null }

			if (!Object.prototype.hasOwnProperty.call(ListaNFTsOrdenada, TokenAddress)) {
				ListaNFTsOrdenada[TokenAddress] = {
					token_id: TokenAddress,
					name: Name,
					symbol: Symbol,
					nfts: []
				}
			}
			ListaNFTsOrdenada[TokenAddress].nfts.push(
				{
					serial_number: TokenId,
					metadata_url: MetadataURL,
					image: ImageURL,
					type: ImageType
				}
			)
			Total += 1
		}
		return { Colleciones: ListaNFTsOrdenada, Total: Total };
	} catch (err) {
		console.error(err.message, "Url:", Url);
	}
}

export async function GetSolanaNFTs(_Address) {
	// https://solana-gateway.moralis.io/account/mainnet/ACzcgz7gq2qiKKaCxvGCPB3DU4Hne2CztqH1sDuYWsfF/nft
	const Url = `https://solana-gateway.moralis.io/account/mainnet/${_Address}/nft`
	var myHeaders = new Headers();
	myHeaders.append("X-API-Key", MoralisApiKey);
	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	}
	try {
		const res = await fetch(Url, requestOptions);
		const data = await res.json();
		let Nfts = {}
		let Total = 0
		for (let i = 0; i < data.length; i++) {
			var config = {
				method: 'get',
				maxBodyLength: Infinity,
				url: `https://solana-gateway.moralis.io/nft/mainnet/${data[i].mint}/metadata`,
				headers: { 'X-API-Key': MoralisApiKey},
				timeout: 2500
			}
			const NftInfo = await axios(config)
			let SerialNumber = NftInfo.data.mint
			let Name = data[i].name?data[i].name:data[i].symbol
			const Partes = Name.split(" #")
			if (Partes.length > 1) {
				Name = Partes[0]
				SerialNumber = Partes[1]
			}
			if (!Object.prototype.hasOwnProperty.call(Nfts, Name)) {
				Nfts[Name] = {
					token_id: data[i].mint,
					name: Name,
					symbol: data[i].symbol,
					fees: null,
					supply: null,
					selected: false,
					nfts: []
				}
			}
			Nfts[Name].nfts.push(
				{
					serial_number:SerialNumber,
					metadata_url: NftInfo.data.metaplex.metadataUri,
					image: null,
					type: null,
					token_id: data[i].mint
				}
			)
			Total += 1
		}
		return { Colecciones: Nfts, Total: Total };
	} catch (err) {
		console.error(err.message, "Url:", Url);
	}

}
export async function GetMoralisNFTs(_Address, _SubChain) {
	// curl --request GET \
	//  --url 'https://deep-index.moralis.io/api/v2/0xd8da6bf26964af9d7eed9e03e53415d37aa96045/nft?chain=bsc&format=decimal' \
	//  --header 'accept: application/json' \
	//  --header 'X-API-Key: YOUR_API_KEY' 

	// const Moralis = require("moralis").default;
	// await Moralis.start({apiKey: MoralisApiKey});
	const Url = `https://deep-index.moralis.io/api/v2/${_Address}/nft?chain=${_SubChain}&format=decimal`
	var myHeaders = new Headers();
	myHeaders.append("X-API-Key", MoralisApiKey);
	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	};
	try {
		const res = await fetch(Url, requestOptions);
		const data = await res.json();
		// console.log(data);

		// let ListaNFTsOrdenada = {}
		// for (let i = 0; i < result.data.ownedNfts.length; i++) {
		// 	// Salida[result.data.ownedNfts[i].contract.address] = result.data[i].Fichero.slice(0,-4)
		// 	let TokenAddress, TokenId, Name, Symbol
		//     try{TokenAddress = result.data.ownedNfts[i].contract.address}
		//     catch{TokenAddress = ""}
		//     try{TokenId = result.data.ownedNfts[i].id.tokenId}
		//     catch{TokenId = ""}
		//     try{Name = result.data.ownedNfts[i].contractMetadata.name}
		//     catch{Name = ""}
		//     try{Symbol = result.data.ownedNfts[i].contractMetadata.symbol}
		//     catch{Symbol = ""}
		// 	let MetadataURL, ImageURL, ImageType
		//     try{MetadataURL = result.data.ownedNfts[i].tokenUri.gateway}
		//     catch{MetadataURL = null}
		//     try{ImageURL = result.data.ownedNfts[i].media.gateway}
		//     catch{ImageURL = null}
		//     try{ImageType = result.data.ownedNfts[i].media.format}
		//     catch{ImageType = null}

		// 	// if (!ListaNFTsOrdenada.hasOwnProperty(TokenAddress)){
		// 	if (!Object.prototype.hasOwnProperty.call(ListaNFTsOrdenada, TokenAddress)){
		//         ListaNFTsOrdenada[TokenAddress] = {
		//             token_id:TokenAddress,
		//             name:Name,
		//             symbol:Symbol,
		//             nfts:[]
		//         }
		//     }
		//     ListaNFTsOrdenada[TokenAddress].nfts.push(
		//         {
		//             serial_number:TokenId,
		//             metadata_url:MetadataURL,
		//             image:ImageURL,
		//             type:ImageType
		//         }
		//     )
		// }
		return data;
	} catch (err) {
		console.error(err.message, "Url:", Url);
	}
}

async function GetHederaTokenInfo(_TokenId){
	const res = await fetch('https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/' + _TokenId);
	const RespTokenInfo = await res.json();
	let Fees = 0
	if (RespTokenInfo.custom_fees.royalty_fees){
		RespTokenInfo.custom_fees.royalty_fees.forEach(Item => {
			Fees += Item.amount.numerator / Item.amount.denominator
		});
	}
	return {name:RespTokenInfo.name,symbol:RespTokenInfo.symbol,fees: Number((Fees*100).toFixed(2)),total_supply:RespTokenInfo.total_supply}
}

export async function GetMetadataNFT(_Url) {
	let ImageURL = null
	let ImageType = null
	let respMetadata = null
	if (!_Url) return {ImageURL,ImageType}
	try{
		const resp = await axios.get(_Url,{timeout:2500})
		respMetadata = resp.data
	} catch (err) {
		console.error(err.message, "GetMetadataNFT:", _Url);
	}
	if (respMetadata) {
		ImageURL = respMetadata.image?.description?UrlRender(respMetadata.image.description):respMetadata.image?UrlRender(respMetadata.image):respMetadata.CID?UrlRender(respMetadata.CID):null
		ImageType = respMetadata.type?respMetadata.type:null
	}
	return {ImageURL,ImageType}
}

export async function GetHederaNFTs(_Account) {
	const BaseURL = 'https://mainnet-public.mirrornode.hedera.com'
	let URL = BaseURL + '/api/v1/accounts/' + _Account + '/nfts?limit=100'
	let Nfts = {}
	let Fin = false
	let Total = 0
	try {
		while (!Fin) {
			console.log("GetHederaNFTs:",URL)
			const res = await fetch(URL);
			const RespListaNFTs = await res.json();
			for (let i = 0; i < RespListaNFTs.nfts.length; i++) {
				let TokenAddress, TokenId, MetadataURL
				TokenAddress = RespListaNFTs.nfts[i].token_id?RespListaNFTs.nfts[i].token_id:""
				TokenId = RespListaNFTs.nfts[i].serial_number?RespListaNFTs.nfts[i].serial_number:""
				if (typeof TokenId !== "string"){
					TokenId = TokenId.toString()
				}
				MetadataURL = UrlRender(Buffer.from(RespListaNFTs.nfts[i].metadata, 'base64').toString('ascii'))
				if (!Object.prototype.hasOwnProperty.call(Nfts, TokenAddress)) {
					const TokenInfo = await GetHederaTokenInfo(TokenAddress)
					Nfts[TokenAddress] = {
						token_id: TokenAddress,
						name: TokenInfo.name,
						symbol: TokenInfo.symbol,
						fees: TokenInfo.fees,
						supply: TokenInfo.total_supply,
						selected: false,
						nfts: []
					}
				}
				Nfts[TokenAddress].nfts.push(
					{
						serial_number: TokenId,
						metadata_url: MetadataURL,
						image: null,
						type: null
					}
				)
				Total += 1
			}
			if (!RespListaNFTs.links.next) {
				Fin = true
			} else {
				URL = BaseURL + RespListaNFTs.links.next
			}
		}
		return { Colecciones: Nfts, Total: Total };
	} catch (err) {
		console.error(err.message, "Url:", URL);
		return null
	}
}