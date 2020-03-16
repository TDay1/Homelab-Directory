# Homelab Directory

> A lightweight, zero external dependency, homelab service directory for internal use.

## What does Homelab-Directory give you?
* An aesthetically pleasing "dashboard" interface for the web services of your homelab/home server.
* Zero external running dependencies (eg; no external database required).
* Only requires ~40 mb of Ram and a slither of CPU resources to run, leaving more resources for your actual applications.
* Simple user experience. Install Homelab-Directory in 3 commands, and start it in one.  



## Usage

### Basic installation

Step 0: [Install NodeJS](https://nodejs.org/en/download/) 

If NodeJS is installed, simply type the following commands: 
```
$ git clone https://github.com/TDay1/homelab-directory.git
$ cd homelab-directory-master
$ npm install
```

Then you may edit the [config file](#Config)

Then to  run, in the project folder, type:
```
$ npm run start
```

**Warning:** Homelab-Directory exposes itself as a regular HTTP service on port 8080. It is highly recommended to run this service through a reverse proxy such as [NGINX](http://nginx.org/) or [Traefik](https://github.com/containous/traefik) to provide HTTPS before exposing it to the outside world.

### Config
In the root of the project directory, there is a file called config.json. This file can be used to configure the site. Currently it contains the following options:
* siteName
* siteURL
* sitePort


### Todo:
* Make it so cropper.js cropper won't go outside image - delayed
* Add a feature to rearrange the apps - delayed
