# node remote control

simple node.js app to remotly control the mouse cursor of windows with a mobile browser.

## Requirements

- node.js 4.2.6 (maybe more versions are supported)
- compass
- windows OS (tested on Win10)
- android smartphone with chrome browser (I didn't test other browsers yet)

## Installation

- checkout this repository
- run `npm install` and `bower install`

## Usage

- go to the repository
- run `grunt dev` or `node www/app.js`
    - if there are no errors, it seems to be running
- lookup the ip address of your computer (ipconfig in cmd)
- open a mobile browser and type in that ip, plus port 8080
    + Example: `192.168.2.103:8080`
- if the loaded website is red, it's working
- swipe and watch your cursor dancing
    - **swipe** to move
    - **tap** to single left click
    - **double tap** to double left click
    - **hold** to right click

## Issues

- this was done in a 4 hour run, so do not expect high performance
- node might die after excessive usage

## License

MIT
