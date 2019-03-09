# <%- moduleName %>

<%- moduleDescription %>

## Installation

## Usage

## Build

To re-build the development version on each file change:
~~~~
./script/run.sh
~~~~

## Development link

~~~
cd <%- moduleName %>/
npm link
cd whatever-project
npm link <%- moduleName %>
~~~

## Publish

To publish a new version:

* make changes
* increment module version in `package.json`
* sign-in into `npm`: `npm adduser <%- vendorName %>`
* `./script/publish.sh`
