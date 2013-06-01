
background.js:background.js.template
	perl -pe "s/FLICKR_API_KEY/`cat API_KEY`/g" background.js.template > background.js
clean:
	-rm background.js
	-rm *~
