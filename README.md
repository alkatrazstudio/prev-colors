# Previous Colors

An add-on for Thunderbird (https://www.thunderbird.net)
that allows you to quickly choose any of the colors
previously selected via "Choose color for text" dialog window.

![Screenshot of "Previous Colors" add-on](screenshot.png "Screenshot of \"Previous Colors\" add-on")

This add-on is compatible with Thunderbird 68+.


## How to build

The source code for the add-on is located in the `src` folder.

Scripts in the `scripts` folder:

* `build.sh` - build the add-on.

* `ci-build.sh` - build the add-on inside Ubuntu container.


Refer to the official Thunderbird add-on developer tutorial
to learn what to do next:
https://developer.thunderbird.net/add-ons/examples/hello-world-add-on


## Permissions

When installing the add-on the message might appear:

> It requires your permission to:
> - Have full, unrestricted access to Thunderbird, and your computer

Technically, it's correct because this add-on uses WebExtension Experiments (https://thunderbird-webextensions.readthedocs.io/en/latest/how-to/experiments.html). This API is needed for the following things:

* Get and set the last used color.

* Know when a user changes the color via "Choose color for text" dialog window.

Other than that, the add-on also requires `storage` permission for standard WebExtension API.


## How to use

1. Select a desired color via the standard
"Choose color for text" dialog window.

2. This color will be added to the "Previous Colors" dropdown list.

3. To remove a color from this dropdown, click the "X" button next to that color.


## Notes

1. This add-on will work reliably only if the setting
   "Options > General > Language & Appearance > Fonts & Colors > Colors > Override the colors specified by the content with my selections above"
   is set to "Never".
   Otherwise Thunderbird may take full control of the colors and won't allow to the user to choose the font color at all.
   The popup will also become blank because it relies on custom colors too.


## License

GPLv3+ (https://www.gnu.org/licenses/gpl)

(c) Alkatraz Studio, 2020 (https://alkatrazstudio.net)

The main icon (`src/icons/btn.png`) is based on this one:
https://www.svgrepo.com/svg/76351/pencils

The "delete" icon (`src/icons/delete.svg`) is an optimized version of this one:
https://www.svgrepo.com/svg/66823/close
