# Previous Colors

An add-on for Thunderbird (https://www.thunderbird.net)
that allows you to quickly choose any of the colors
previously selected via "Choose color for text" dialog window.

![Screenshot of "Previous Colors" add-on](screenshot.png "Screenshot of \"Previous Colors\" add-on")

This add-on is compatible with Thunderbird 68+.


## How to build

The source code for the add-on is located in the `src` folder.

Scripts in the `scripts` folder:

* `get-next-version.sh` - get the next version number of the add-on based on git tags.
  You need `git` installed.

* `build.sh [VERSION]` - build the add-on with specified version `VERSION`.
  You need `jq` (https://stedolan.github.io/jq/) and `zip` installed.
  If the version is not specified, it will be taken from `get-next-version.sh`.

* `ci-build.sh` - build scripts for running inside Ubuntu container.


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


## License

GPLv3+ (https://www.gnu.org/licenses/gpl)

(c) Alkatraz Studio, 2020 (https://alkatrazstudio.net)

The main icon (`src/icons/btn.png`) is based on this one:
https://www.svgrepo.com/svg/76351/pencils

The "delete" icon (`src/icons/delete.svg`) is an optimized version of this one:
https://www.svgrepo.com/svg/66823/close