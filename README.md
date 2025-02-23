# `tmux-compose`

![NPM Version](https://img.shields.io/npm/v/tmux-compose)

`tmux-compose` is yet another [tmuxinator](https://github.com/tmuxinator/tmuxinator) alternative.

 - Start your tmux sessions from the defined config file
 - Built with TypeScript

## Install

```bash
npm install -g tmux-compose
```

## Usage

Create a config file: `tmux-compose.yaml`.

```yaml
# tmux-compose.yaml

# Session name
name: my-session

# Root directory of your project(optional)
root: ./

windows:
  # Window names and commands to run
  editor: vim
  server: npm run dev
```

Run the following command to start the session in same directory. 

```bash
$ tmux-compose start
```

`my-session` will be created and attached to the session.

`-c` option is available to specify the config file.

```bash
$ tmux-compose start -c tmux-compose.yaml
```

## License

MIT

## Development

Prerequisites:

 - Node.js
 - Bun

Tasks:

 - `bun install`: Install dependencies
 - `bun run test`: Run tests
 - `bun run build`: Build
