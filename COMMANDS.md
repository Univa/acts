# Commands

All commands must begin with a prefix. The default command prefixes are:

`! $ or #`

These prefixes can be changed with the `set` command

## Command List

`set <setting> <value>`

- Sets the given setting to a given value. Mostly used to change settings without having to go to the settings scene.

- See `this.state.settings` in [App.jsx](src/App.jsx) for a list of settings that you can change.

- Settings are __case-sensitive__

- Example: `!set cmdPrefixes @ # $`

`type`

- Switches to the typing scene

`settings`

- Switches to the settings scene

`bank`

- Switches to the word bank scene, which is used to set words for the "Custom" word bank.

`help`

- Shows this README file in the browser.
