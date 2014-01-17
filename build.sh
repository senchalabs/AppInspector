clear

cd AppInspector
sencha app build production -c
cd ..

cp -R AppInspector/build/production/AI ./deploy/AppInspector

cp background.* ./deploy
cp devtools-page.* ./deploy
cp manifest.json ./deploy