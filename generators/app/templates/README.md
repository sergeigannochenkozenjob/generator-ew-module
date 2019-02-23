# <%- moduleName %>

<%- moduleDescription %>

## Installation

## Usage

## Build

To re-build the development version on each file change:
~~~~
./script/run.sh
~~~~

## Publish

To publish a new version:

* make changes
* increment module version in `package.json`
* sign-in into `npm`: `npm adduser <%- vendorName %>`
* `./script/publish.sh`
