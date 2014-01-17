clear

echo 'Removing old duckumentation...'
rm -rf docs

echo 'Hatching new duckumentation...'
jsduck --config=jsduck.json src