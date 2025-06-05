# Konzert-, Theater-, Kino-besuche und Teilahme an kulturellen Veranstaltungen von Arthur Schnitzler



* build with [DSE-Static-Cookiecutter](https://github.com/acdh-oeaw/dse-static-cookiecutter)


## initial (one time) setup

* run `./shellscripts/script.sh`

* run `ant`

## set up GitHub repo
* create a public, new, and empty (without README, .gitignore, license) GitHub repo https://github.com/arthur-schnitzler/schnitzler-kultur 
* run `git init` in the root folder of your application schnitzler-kultur
* execute the commands described under `…or push an existing repository from the command line` in your new created GitHub repo https://github.com/arthur-schnitzler/schnitzler-kultur

## start dev server

* `cd html/`
* `python -m http.server`
* go to [http://0.0.0.0:8000/](http://0.0.0.0:8000/)

## publish as GitHub Page

* go to https://https://github.com/arthur-schnitzler/schnitzler-kultur/actions/workflows/build.yml
* click the `Run workflow` button


## dockerize your application

* To build the image run: `docker build -t schnitzler-kultur .`
* To run the container: `docker run -p 80:80 --rm --name schnitzler-kultur schnitzler-kultur`
* in case you want to password protect you server, create a `.htpasswd` file (e.g. https://htpasswdgenerator.de/) and modifiy `Dockerfile` to your needs; e.g. run `htpasswd -b -c .htpasswd admin mypassword`

### run image from GitHub Container Registry

`docker run -p 80:80 --rm --name schnitzler-kultur ghcr.io/arthur-schnitzler/schnitzler-kultur:main`

### third-party libraries

the code for all third-party libraries used is included in the `html/vendor` folder, their respective licenses can be found either in a `LICENSE.txt` file or directly in the header of the `.js` file