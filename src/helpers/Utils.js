export function UrlRender(_URL) {
    let src = null;
    if (_URL){
        try{
			if (typeof miVariable !== "string"){
				_URL = _URL.toString()
			}
            if (_URL.startsWith('data:')) {
                return _URL;
            }
            const UrlOrigen = _URL.split('//');
            if (UrlOrigen?.length === 2) {
                switch (UrlOrigen[0].toLowerCase()) {
                    case 'http:':
                        src = _URL;
                        break;
                    case 'https:':
                        src = _URL;
                        break;
                    case 'ipfs:':
                        src = 'https://ipfs.io/ipfs/' + UrlOrigen[1];
                        break;
                    default:
                        src = null;
                        break;
                }
            }else{
                src = 'https://ipfs.io/ipfs/' + _URL;
            }
        }catch(err){
			console.error(err.message, "Render Url:", _URL);
            src = null
        }
    }
    return src
}