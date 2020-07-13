# jupyterlab-skip-traceback

[![Binder][badge-binder]][binder]
[![NPM version][npm-image]][npm-url] [![NPM DM][npm-dm-image]][npm-url] [![Build Status][travis-image]][travis-url]

A JupyterLab extension for rendering Errors with a copy/paste button and expand/collapse.

This is inspired by the notebook version [here](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/tree/master/src/jupyter_contrib_nbextensions/nbextensions/skip-traceback).

![Screenshot](https://github.com/deshaw/jupyterlab-skip-traceback/blob/master/docs/skip-traceback.gif 'Skip Traceback Screenshot')

## Requirements

- JupyterLab >= 2.0

## Install

```bash
jupyter labextension install jupyterlab-skip-traceback
```

## Contributing

### Install

```bash
# Install dependencies
yarn
# Build Typescript source
yarn run build
# Link your development version of the extension with JupyterLab
jupyter labextension link .
# Rebuild Typescript source after making changes
yarn run build
# Rebuild JupyterLab after making any changes
jupyter lab build
```

You can watch the source directory and run JupyterLab in watch mode to watch for changes in the extension's source and automatically rebuild the extension and application.
```bash
# Watch the source directory in another terminal tab
yarn run watch
# Run jupyterlab in watch mode in one terminal tab
jupyter lab --watch
```

### Uninstall

```bash
jupyter labextension uninstall jupyterlab-skip-traceback
```

## History

This plugin was contributed back to the community by the [D. E. Shaw group](https://www.deshaw.com/).

<p align="center">
    <a href="https://www.deshaw.com">
       <img src="https://www.deshaw.com/assets/logos/black_logo_417x125.png" alt="D. E. Shaw Logo" height="75" >
    </a>
</p>

## License

This project is released under a [BSD-3-Clause license](https://github.com/deshaw/jupyterlab-skip-traceback/blob/master/LICENSE.txt).

"Jupyter" is a trademark of the NumFOCUS foundation, of which Project Jupyter is a part.

[npm-url]: https://npmjs.org/package/jupyterlab-skip-traceback
[npm-image]: https://badge.fury.io/js/jupyterlab-skip-traceback.png
[npm-dm-image]: https://img.shields.io/npm/dm/jupyterlab-skip-traceback.svg

[travis-url]: http://travis-ci.org/deshaw/jupyterlab-skip-traceback
[travis-image]: https://secure.travis-ci.org/deshaw/jupyterlab-skip-traceback.png?branch=master

[badge-binder]: https://mybinder.org/badge_logo.svg
[binder]: https://mybinder.org/v2/gh/deshaw/jupyterlab-skip-traceback/master?urlpath=lab%2Ftree%2Fnotebooks%2Findex.ipynb
