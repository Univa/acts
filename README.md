# a clean typing site ![Tag](https://img.shields.io/github/v/tag/Univa/acts?sort=semver) ![License](https://img.shields.io/github/license/Univa/acts)

A typing site that is easy on the eyes.

This site was built with React, bootstrapped with create-react-app

[Try it out on GitHub Pages!](https://univa.github.io/acts/)

![Demo](https://user-images.githubusercontent.com/41708691/83413925-9e326900-a3ea-11ea-8c96-4f2db473590f.gif)

## Features

### Fully Themeable
Customize every aspect of the website, including the colors and fonts to suit your style.

![Theme](https://user-images.githubusercontent.com/41708691/83415304-e5b9f480-a3ec-11ea-8086-04baea8371eb.gif)

### Word Banks
Simulate the typing experience of your favourite websites using the available presets, or make your own word bank!

![WordBank](https://user-images.githubusercontent.com/41708691/83417331-f1f38100-a3ef-11ea-8b29-b613a64c54e3.gif)

### Typing Session Data
See how your typing session went by checking out the data generated at the end of the session.

![Graph](https://user-images.githubusercontent.com/41708691/83423831-88787000-a3f9-11ea-8ae9-13ad3de15885.gif)

### Command System
Power users can take advantage of the command system to change any setting on the fly, or navigate to different pages of the site quickly.

![Commands](https://user-images.githubusercontent.com/41708691/83425560-e1e19e80-a3fb-11ea-9232-484715f2e555.gif)

## Commands

All commands must begin with a prefix. The default command prefixes are:

`! : or /`

These prefixes can be changed with the `set` command

### Command List

`set <setting> <value>`

- Sets the given setting to a given value. Mostly used to change settings without having to go to the settings scene.

- See `this.state.settings` in [App.jsx](src/App.jsx) for a list of settings that you can change.

`type`

- Switches to the typing scene

`settings`

- Switches to the settings scene

`bank`

- Switches to the word bank scene, which is used to set words for the "Custom" word bank.

## Installation

If you would like to run a local version of acts, clone this repository. Then in the terminal, run

    npm install

You should be good to build or run acts:

    npm run build

or

    npm start
