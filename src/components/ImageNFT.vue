<template>
	<a :href="SRC.startsWith('data:')?null:SRC" target="_blank" rel="noreferrer">
		<img v-if="Error" src="@/assets/images/404.png" :alt="ALT" :class="CLASSNAME" :type="TYPE" />
		<img v-else-if="!Loaded" src="@/assets/gif/Loading.gif" :alt="ALT" :class="CLASSNAME" :type="TYPE" />
		<img v-if="TipoImagen.includes(TYPE) || !TYPE" v-show="Loaded" :src="SRC" :alt="ALT" :class="CLASSNAME" :type="TYPE" @load="LoadImage" @error="SetError"/>
		<video v-else-if="TYPE=='video/mp4' || TYPE=='mp4'" :class="CLASSNAME" autoPlay muted loop>
			<source :src="SRC" type='video/mp4' />
			Your browser does not support the video tag.
		</video>
		<iframe v-else-if="TYPE=='text/html'" width="100%" height="100%" title="Animation" :src="SRC"></iframe>
		<img v-else src="@/assets/images/404.png" :alt="ALT" :class="CLASSNAME" :type="TYPE" />
	</a>
</template>

<script>
export default {
	name: 'ImageNFT',
	props: {
		src: {
			type: String,
			required: true
		},
		alt: {
			type: String,
			required: true
		},
		type: {
			type: String,
		},
		className: {
			type: String,
		}
	},
	data: function () {
		return {
			SRC: this.src,
			ALT: this.alt,
			TYPE: this.type,
			CLASSNAME: this.className,
			Loaded: false,
			Error: false,
			TipoImagen: ["image/png", "image/jpg", "image/jpeg", "image/gif","image/svg+xml","gif","jpg","jpeg","png","svg+xml","svg+xml; charset=utf-8"]
		}
	},
	methods: {
		LoadImage: function () {
			this.Loaded = true
		},
		SetError: function () {
			this.Error = true
		}
	},
	beforeMount: function () {
		if ((this.SRC != null) && ((this.TYPE == "video/mp4")||(this.TYPE == ""))){
			if (this.SRC.slice(-4) == ".glb"){
				this.TYPE = "model/gltf-binary"
			}else if (this.SRC.slice(-4) == ".gltf") {
				this.TYPE = "model/gltf+json"
			}else if (this.SRC.slice(-4) == ".mp4") {
				this.TYPE = "video/mp4"
			}else if (this.SRC.slice(-4) == ".png"){
				this.TYPE = "image/png"
			}else if (this.SRC.slice(-4) == ".jpg"){
				this.TYPE = "image/jpg"
			}else if (this.SRC.slice(-4) == ".jpeg"){
				this.TYPE = "image/jpeg"
			}else if (this.SRC.slice(-4) == ".gif"){
				this.TYPE = "image/gif"
			}else if (this.SRC.slice(-5) == ".html"){
				this.TYPE = "text/html"
			}else if (this.TYPE == ""){
				this.TYPE = "image/png"
			}
		}
	},
	mounted: function () {
		if ((this.TYPE != '') && (!this.TipoImagen.includes(this.TYPE)) ) {
			this.Loaded = true
		}
	}
}
</script>