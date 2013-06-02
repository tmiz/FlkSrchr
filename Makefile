
background.js:background.js.template
	perl -pe "s/FLICKR_API_KEY/`cat API_KEY`/g" background.js.template > background.js

createBackgroundTemp:
	perl -pe "s/`cat API_KEY`/FLICKR_API_KEY/g" background.js > background.js.template
	rm background.js

clean:
	-rm background.js
	-rm *~
