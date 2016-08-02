compile:
	webpack --progress --colors --profile

watch:
	webpack --progress --colors -w --profile

mock-paws-services:
	node --harmony mock-paws-services.js

mock-transfer-services:
	node --harmony mock-transfer-services.js

static-server:
	webpack-dev-server --hot --debug --content-base public/


py-static-server:
	cd public && python -m SimpleHTTPServer 8080
