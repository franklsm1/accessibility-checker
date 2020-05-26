# Website Accessibiliity Checker
#### A UI taking a url and producing accessibility results
Thanks to Andrew Pulley ([@apulley](https://github.com/apulley)) for the puppeteer / axe integration code
 
##### You can view the live application [here](accessibility.allstate.io)
### Steps to run app locally
1. clone the repo:
1. inside the cloned repo install the server and UI dependencies:
    - `npm run installBoth`
1. build the client (UI) static files:
    - `npm run build`
1. run the application locally:
    - `npm start`
1. visit http://localhost:8080 to see the site running locally

### Steps to run container locally (assuming docker is installed)
1. Build the container
    - `docker build -t accessibility-checker .`
1. Run the container
    - `docker run --privileged -p 8087:443 --name accessibility-checker -d accessibility-checker`
1. Visit http://localhost:8087 to view the app

##### Helpful Docker commands:
- SSH into container: `docker exec -it accessibility-checker bash`
- Stop container: `docker stop accessibility-checker`
- Remove container: `docker rm accessibility-checker`
- View container logs: `docker logs accessibility-checker`
- Remove dangling images: `docker image prune`

### App Screenshot
**Example URL to analyze:** https://dequeuniversity.com/demo/mars/
![Example Accessiblitity Report](https://github.com/franklsm1/accessibility-checker/raw/master/ExampleUIOutput.png)
