clear

cd AppInspector
sencha app build production -c
cd ..

if [ ! -d "./deploy" ]; then
    # create the directory if it does not exist
    mkdir "./deploy"
fi

cp -R AppInspector/build/production/AI ./deploy/AppInspector

cp background.* ./deploy
cp devtools-page.* ./deploy
cp manifest.json ./deploy
