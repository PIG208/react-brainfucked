# react-brainfucked

![CI](https://github.com/PIG208/react-brainfucked/actions/workflows/ci.yml/badge.svg)

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

An implementation and visualization for Brainfuck.

## Features

- Functional programming flavored interpreter based on reducers and immutable states
- Full TypeScript support
- Blocking I/O streams simulation
- Visual step debugging tool
- Decoupled data-driven React components
- Checked by automated test workflows

## Project

This project is divided into four main components with Non-UI and UI parts:

### Core
- The interpreter.
- Handle the stream of brainfuck instructions, maintain the program states, not a part of the UI.

### Editor
- The code editor.
- Highlight code.

### Console
- Support basic I/O.

### Visualization
- Visualize memory blocks, display parsed program.
