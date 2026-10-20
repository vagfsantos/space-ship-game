# space-ship-game

A 2D space ship game built with [play2d-game-library](../play2d-game-library), used as a playground to test the library while it's developed.

## Setup

Both repos must sit side by side:

```
claude_workspace/
  play2d-game-library/
  space-ship-game/
```

`play2d-game-library` is installed from the local folder (`"file:../play2d-game-library"`), which npm links into `node_modules`. The game uses the library's built `dist/`, so build the library first:

```sh
cd ../play2d-game-library && npm install && npm run build
cd ../space-ship-game && npm install
```

## Develop

Run each in its own terminal:

```sh
# terminal 1: rebuild the library on change
cd ../play2d-game-library && npm run dev

# terminal 2: game dev server with hot reload
npm run dev
```

## Build

```sh
npm run build    # type-check + bundle to dist/ (index.html + assets/*.js)
npm run preview  # serve dist/ locally
```

`dist/` uses relative paths, so it can be deployed to any static host.

## License

MIT
