# node remote control

simple node.js/android app to remotly control the mouse cursor of windows with a mobile browser.

## Requirements

- node.js 4.2.6 (maybe more versions are supported)
- [compass](http://compass-style.org/)
- [bower](https://bower.io/)
- windows OS (tested on Win10)
- android smartphone with chrome browser (I didn't test other browsers yet)

### Android App Emulation

- Cordova 6.5.0
- Android Studio 2.3
- jdk 1.8
- Apache Ant
- Environment Variables
    + JAVA_HOME: path/to/jdk1.8
    + ANDROID_HOME: path/to/android/sdk
    + ANT_HOME: path/to/ant
    + add to PATH: %JAVA_HOME%\bin;%ANT_HOME%\bin;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;
- run Android Studio
    + File > Settings > Appearance & Behavior > System Settings > Android SDK
    + install Android 6.0 (Marshmallow) and accept the terms
    + import the phonegap project and create an emulator via Android Virtual Device Manager
        * name "Nexus 5X API 23"

## Development

- only once:
    + `npm install`
    + `bower install`
- `grunt dev` - browser
- `grunt emulator` - start android emulator
- `grunt emulate` - build app and run in emulator

## Usage

- swipe and watch your cursor dancing
    - **swipe** to move
    - **tap** to single left click
    - **double tap** to double left click
    - **hold** to hold
    - buttons on top
        + **left** - tap = left click
        + **middle** - swipe vertically = scroll wheel
        + **right** - tap = right click

## Issues

- node might die after excessive usage
- for now, the phonegap part uses the static local ip 192.168.2.200 for connecting to the server
    + you may change it in `phonegap/config.xml` and `phonegap/www/index.html`

## License

MIT
