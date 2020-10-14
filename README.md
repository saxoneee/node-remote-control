# node remote control

simple node.js/android app to remotly control the mouse cursor of windows.

## Requirements

- node.js 4.2.6 (maybe more versions are supported)
- [compass](http://compass-style.org/)
- [bower](https://bower.io/)
- windows OS (tested on Win10)
- android smartphone with chrome browser (I didn't test other browsers yet)

### Android App Emulation

- Cordova 10.0.0
- Android Studio 4.0.2
- Gradle
- jdk 1.8
- Apache Ant
- Environment Variables
    + JAVA_HOME: path/to/jdk1.8
    + ANDROID_SDK_ROOT: path/to/android/sdk
    + ANT_HOME: path/to/ant
    + GRADLE_HOME: path/to/gradle
    + add to PATH: %JAVA_HOME%\bin;%ANT_HOME%\bin;%ANDROID_SDK_ROOT%\tools;%ANDROID_SDK_ROOT%\platform-tools;%ANDROID_SDK_ROOT%\emulator;%GRADLE_HOME%\bin;
- run Android Studio
    + File > Settings > Appearance & Behavior > System Settings > Android SDK
    + install Android 10.0 and accept the terms
    + import the phonegap project and create an emulator via Android Virtual Device Manager
        * name "Nexus 5X API 29"
- open cordova/www/index.html and change the internal ip-address to your own

## Development

- only once:
    + `npm install`
    + `bower install`
    + `npm run prepare`
- `npm run dev` - browser
- `npm run run` - start app in android emulator

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

## License

MIT
