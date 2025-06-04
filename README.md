![Cover](./assets/cover.png)

# 📦 Sciux - AI Science Creation Kit

Sciux `/ˈsaɪ.næks/` is a creation kit to build interactive STEM content with DSL (Domain Specific Language).

Sciux ecosystem includes:

- [Sciux Lib](https://github.com/sciux-kit/lib) The standard components library for Sciux, includes most of STEM-usual components.
- [Sciux Laplace](https://github.com/sciux-kit/laplace) The renderer of Sciux DSL without any components.

> This repository is the standard components library for Sciux.

## Installation

```bash
npm install sciux # npm
pnpm add sciux # pnpm
yarn add sciux # yarn
```

> `sciux` is a composing package includes all the components in the repository

## Usage

``` ts
import initializeSciux from 'sciux'

initializeSciux()
```

It will register all the components in the repository to the global scope.

Now we have the following sciux code:

``` html
<rows>
  <flexbox>1</flexbox>
  <columns>
    <flexbox>2-1</flexbox>
    <flexbox>2-2</flexbox>
  </columns>
  <columns>
    <flexbox>3-1</flexbox>
    <flexbox>3-2</flexbox>
    <flexbox>3-3</flexbox>
  </columns>
</rows>
```

Now render it on your page:

``` ts
import initializeSciux, { render } from 'sciux'

initializeSciux()

const root = document.getElementById('app')
const code = `The sciux code...`

render(code, root)
```

## Why Name 'Sciux'

Sciux is composed by two words:

```txt
sci     + ux                   = Sciux
science + UX (User Experience) = Sciux
```

`sci` is the abbreviation of `science`, and `ux` is the abbreviation of interaction.

## Packages

| Package | Description |
| --- | --- |
| `sciux` | The core package of Sciux, includes all the components. |
| `sciux-laplace` | The renderer of Sciux DSL without any components. |
| `@sciux/widget` | The display components for Sciux. |
| `@sciux/layout` | The layout components for Sciux. |
| `@sciux/model` | The interactive form components for Sciux. |
| More | More STEM components is coming soon... |

## Contributors

> Sciux Library

![lib](https://contrib.rocks/image?repo=sciux-kit/lib)

> Sciux Laplace

![lib](https://contrib.rocks/image?repo=sciux-kit/laplace)

***Copyright (c) 2025-present**, Sciux Community & BijonAI Team. All rights reserved.*
