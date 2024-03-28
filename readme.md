# 🗿 Tomb Viewer 🪙

This is WebGL based viewer / renderer for exploring and showing classic Tomb Raider levels in your browser, with no plugins or WASM nonsense.

It is written entirely in TypeScript with Vite.js and uses my own [GSOTS3D](https://github.com/benc-uk/gsots3d) library for all 3D rendering, it is a standalone static webapp and yeah... It works pretty damn well 🥰

Status:

- Loads and works with Tomb Raider 1 ~ 3
- Level file parsing (for all the parts I need)
- Texture data loaded from level file
- Level geometry rendered with textures and normals
- Coloured lighting in TR3
- Transparency and sprites
- Dynamic effects for water, particles and flames
- Meshes for static scenery and single mesh entities (doors, traps etc)

[![Build](https://github.com/benc-uk/tomb-viewer/actions/workflows/static-build.yml/badge.svg)](https://github.com/benc-uk/tomb-viewer/actions/workflows/static.yml) [![CI](https://github.com/benc-uk/tomb-viewer/actions/workflows/ci.yaml/badge.svg)](https://github.com/benc-uk/tomb-viewer/actions/workflows/ci.yaml)

<a href="./screens/tr1-scion.png"><img src="./screens/tr1-scion.png"></a>
<a href="./screens/tr1-valley.png"><img src="./screens/tr1-valley.png"></a>
<a href="./screens/tr2-bartoli.png"><img src="./screens/tr2-bartoli.png"></a>
<a href="./screens/tr2-xian.png"><img src="./screens/tr2-xian.png"></a>
<a href="./screens/tr3-thames.png"><img src="./screens/tr3-thames.png"></a>
<a href="./screens/tr3-coast.png"><img src="./screens/tr3-coast.png"></a>
<a href="./screens/tr3-temple.png"><img src="./screens/tr3-temple.png"></a>

See [screens directory for more](./screens/)

Todo:

- Improve sprite selection for pickups
- Skyboxes
- Multi-part meshes - V hard for little gain
- Fix animated textures in TR3 - Tough
- Tomb Raider 4 & 5 support - Phenomenally unlikely
- Implement the whole game - Absolutely not happening 🫠

# 🌐 Try It

This is deployed to GitHub pages, just be aware it is note mobile friendly at all!

### [code.benco.io/tomb-viewer](http://code.benco.io/tomb-viewer/)

Controls:

- Cursor keys or WASD to move
- Mouse to look around
- Keys '[' and ']' to move up & down
- '1' key to switch alt rooms
- 'H' to show the help

There are some options available by clicking the cog icon in the top right.

# 🤓 Running locally

Have Node.js installed, clone the repo, and run `npm run dev`, enjoy!

# 📜 References

This whole idea and project would have been completely impossible without the 'TRosettaStone 3' (aka TRS or TRS3) document
https://opentomb.github.io/TRosettaStone3/trosettastone.html

Which is also available here
https://trwiki.earvillage.net/doku.php?id=trs

The source of trview was consulted for reference purposes https://github.com/chreden/trview
