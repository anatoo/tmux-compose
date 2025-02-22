# `tmux-compose`

`tmux-compose` is yet another [tmuxinator](https://github.com/tmuxinator/tmuxinator) alternative.

 - Start your tmux sessions with one command from the defined config file
 - Built with TypeScript/Node.js

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

# Windows
windows:
  editor: vim
  server: npm run dev
```

Run the following command to start the session. 

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
