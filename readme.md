# Tomb Viewer

This is WebGL based viewer and renderer for classic Tomb Raider levels.

It is written in TypeScript with Vite.js and uses my [GSOTS3D](https://github.com/benc-uk/gsots3d) library for all 3D rendering, it is a standalone static webapp.

Status:

- Tomb Raider 1 support only
- Level file parsing
- Texture data loaded from level file
- Level geometry rendered with correct textures and normals

![](./screens/sphinx.png)
![](./screens/folly.png)
![](./screens/valley.png)
![](./screens/atlantis.png)
![](./screens/egypt.png)

Todo:

- Update lighting
- Items
- Static meshes

# Try It

The app is deployed to GitHub pages:

### [code.benco.io/tomb-viewer/](http://code.benco.io/tomb-viewer/)

Controls:

- Cursors keys or WASD to move
- Mouse to look around
- Keys '[' and ']' to move up & down
- Keys 1 & 2 to rotate the light, 3 & 4 to raise and lower it

# Status

[![Build](https://github.com/benc-uk/tomb-viewer/actions/workflows/static.yml/badge.svg)](https://github.com/benc-uk/tomb-viewer/actions/workflows/static.yml) [![CI](https://github.com/benc-uk/tomb-viewer/actions/workflows/ci.yaml/badge.svg)](https://github.com/benc-uk/tomb-viewer/actions/workflows/ci.yaml)

# References

Would simply been impossible without the 'TRosettaStone 3' (aka TRS or TRS3)
https://opentomb.github.io/TRosettaStone3/trosettastone.html

Also available here
https://trwiki.earvillage.net/doku.php?id=trs
