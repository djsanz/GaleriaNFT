// import Moralis  from 'moralis';
// import { EvmChain } from '@moralisweb3/evm-utils';
import { Buffer } from 'buffer'
import { UrlRender } from './Utils.js'
import axios from 'axios'

const AlchemyApiKey = process.env.VUE_APP_AlchemyApiKey
const MoralisApiKey = process.env.VUE_APP_MoralisApiKey

export const EthAlchemyChain = Object.freeze({ ethereum: "eth-mainnet", polygon: "polygon-mainnet", arbitrum: "arb-mainnet", optimism: "opt-mainnet" });
export const EthMoralisChain = Object.freeze({ avalanche: "avalanche", bsc: "bsc", fantom: "fantom", cronos: "cronos", palm: "palm" });

export async function GetAlchemyNFTs(_Address, _SubChain) {
	// https://docs.alchemy.com/reference/nft-api-quickstart
	const Url = `https://${_SubChain}.g.alchemy.com/nft/v2/${AlchemyApiKey}/getNFTs?owner=${_Address}`
	try {
		const res = await fetch(Url);
		const data = await res.json();
		const result = {
			status: res.status,
			data: data
		};
		// console.log("Eth:", result.data)
		let ListaNFTsOrdenada = {}
		let Total = 0
		let Value = 0
		for (let i = 0; i < result.data.ownedNfts.length; i++) {
			let TokenAddress, TokenId, Name, Symbol
			try { TokenAddress = result.data.ownedNfts[i].contract.address }
			catch { TokenAddress = "" }
			try { TokenId = result.data.ownedNfts[i].id.tokenId }
			catch { TokenId = "" }
			try { Name = result.data.ownedNfts[i].contractMetadata.name ? result.data.ownedNfts[i].contractMetadata.name : result.data.ownedNfts[i].metadata.name }
			catch { Name = "" }
			try { Symbol = result.data.ownedNfts[i].contractMetadata.symbol }
			catch { Symbol = "" }
			let MetadataURL, ImageURL, ImageType, Supply, Fees, Floor
			try { MetadataURL = result.data.ownedNfts[i].tokenUri.gateway }
			catch { MetadataURL = null }
			try { ImageURL = result.data.ownedNfts[i].metadata.animation_url ? UrlRender(result.data.ownedNfts[i].metadata.animation_url) : UrlRender(result.data.ownedNfts[i].metadata.image) }
			catch { ImageURL = null }
			try { ImageType = result.data.ownedNfts[i].metadata.animation_url ? "video/mp4" : result.data.ownedNfts[i].media[0].format }
			catch { ImageType = null }
			try { Supply = result.data.ownedNfts[i].contractMetadata.totalSupply }
			catch { Supply = null }
			try { Fees = 0 }
			catch { Fees = null }
			try {
				Floor = Number(result.data.ownedNfts[i].contractMetadata.openSea.floorPrice.toFixed(4))
				Value += Floor
			}
			catch { Floor = null }

			if (!Object.prototype.hasOwnProperty.call(ListaNFTsOrdenada, TokenAddress)) {
				ListaNFTsOrdenada[TokenAddress] = {
					token_id: TokenAddress,
					name: Name,
					symbol: Symbol,
					fees: Fees,
					supply: Supply,
					floor: Floor,
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
		return { Colecciones: ListaNFTsOrdenada, Total: Total, Value: Number(Value.toFixed(4)) };
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
				headers: { 'X-API-Key': MoralisApiKey },
				timeout: 2500
			}
			const NftInfo = await axios(config)
			let SerialNumber = NftInfo.data.mint
			let Name = data[i].name ? data[i].name : data[i].symbol
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
					serial_number: SerialNumber,
					metadata_url: NftInfo.data.metaplex.metadataUri,
					image: null,
					type: null,
					token_id: data[i].mint
				}
			)
			Total += 1
		}
		return { Colecciones: Nfts, Total: Total, Value: 0 };
	} catch (err) {
		console.error(err.message, "Url:", Url);
	}

}
export async function GetMoralisNFTs(_Address, _SubChain) {
	const Url = `https://deep-index.moralis.io/api/v2/${_Address}/nft?chain=${_SubChain}&format=decimal&normalizeMetadata=true`
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
		// console.log("MoralisRespBruto:",data);
		let ListaNFTsOrdenada = {}
		let Total = 0
		for (let i = 0; i < data.result.length; i++) {
			let TokenAddress, TokenId, Name, Symbol
			try { TokenAddress = data.result[i].token_address }
			catch { TokenAddress = "" }
			try { TokenId = data.result[i].token_id }
			catch { TokenId = "" }
			try { Name = data.result[i].name }
			catch { Name = "" }
			try { Symbol = data.result[i].symbol }
			catch { Symbol = "" }
			let MetadataURL, ImageURL, ImageType
			try { MetadataURL = data.result[i].token_uri }
			catch { MetadataURL = null }
			try { ImageURL = data.result[i].normalized_metadata.image }
			catch { ImageURL = null }
			try { ImageURL = data.result[i].normalized_metadata.animation_url ? UrlRender(data.result[i].normalized_metadata.animation_url) : UrlRender(data.result[i].normalized_metadata.image) }
			catch { ImageURL = null }
			try { ImageType = data.result[i].normalized_metadata.animation_url ? "video/mp4" : '' }
			catch { ImageType = '' }

			if (!Object.prototype.hasOwnProperty.call(ListaNFTsOrdenada, TokenAddress)) {
				ListaNFTsOrdenada[TokenAddress] = {
					token_id: TokenAddress,
					name: data.result[i].normalized_metadata.name ? data.result[i].normalized_metadata.name : Name,
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
		return { Colecciones: ListaNFTsOrdenada, Total: Total, Value: 0 };
	} catch (err) {
		console.error(err.message, "Url:", Url);
	}
}

async function GetHederaTokenInfo(_TokenId) {
	const res = await fetch('https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/' + _TokenId);
	const RespTokenInfo = await res.json();
	let Fees = 0
	if (RespTokenInfo.custom_fees.royalty_fees) {
		RespTokenInfo.custom_fees.royalty_fees.forEach(Item => {
			Fees += Item.amount.numerator / Item.amount.denominator
		});
	}
	return { name: RespTokenInfo.name, symbol: RespTokenInfo.symbol, fees: Number((Fees * 100).toFixed(2)), total_supply: RespTokenInfo.total_supply }
}

export async function GetMetadataNFT(_Url) {
	let ImageURL = null
	let ImageType = null
	let respMetadata = null
	if (!_Url) return { ImageURL, ImageType }
	try {
		const resp = await axios.get(_Url, { timeout: 2500 })
		respMetadata = resp.data
	} catch (err) {
		console.error(err.message, "GetMetadataNFT:", _Url);
	}
	if (respMetadata) {
		ImageURL = respMetadata.image?.description ? UrlRender(respMetadata.image.description) : respMetadata.image ? UrlRender(respMetadata.image) : respMetadata.CID ? UrlRender(respMetadata.CID) : null
		ImageType = respMetadata.type ? respMetadata.type : null
	}
	return { ImageURL, ImageType }
}

export async function GetHederaNFTs(_Account) {
	const BaseURL = 'https://mainnet-public.mirrornode.hedera.com'
	let URL = BaseURL + '/api/v1/accounts/' + _Account + '/nfts?limit=100'
	let Nfts = {}
	let Fin = false
	let Total = 0
	try {
		while (!Fin) {
			// console.log("GetHederaNFTs:", URL)
			const res = await fetch(URL);
			const RespListaNFTs = await res.json();
			for (let i = 0; i < RespListaNFTs.nfts.length; i++) {
				let TokenAddress, TokenId, MetadataURL
				TokenAddress = RespListaNFTs.nfts[i].token_id ? RespListaNFTs.nfts[i].token_id : ""
				TokenId = RespListaNFTs.nfts[i].serial_number ? RespListaNFTs.nfts[i].serial_number : ""
				if (typeof TokenId !== "string") {
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