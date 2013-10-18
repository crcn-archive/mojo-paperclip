all:
	./node_modules/.bin/coffee -b -o lib -c src;


all-watch:
	./node_modules/.bin/coffee -b -o lib -cw src;

clean:
	rm -rf lib;
