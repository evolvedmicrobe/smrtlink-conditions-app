compile:
	webpack --progress --colors --profile

watch:
	webpack --progress --colors -w --profile

clean:
	rm public/js/bundle.js*

build:
	npm install
	bower install

static-server:
	webpack-dev-server --hot --debug --content-base public/


