# react-brainfucked

![CI](https://github.com/PIG208/react-brainfucked/actions/workflows/ci.yml/badge.svg)

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

An implementation and visualization for Brainfuck.

## Project

This project is divided into four main components with Non-UI and UI parts:

### Core
- The interpreter.
- Handle the stream of brainfuck instructions, maintain the program states, not a part of the UI.

### Editor/Linter
- The custom code editor.
- Highlight code, do static checks.

### Console
- Support basic I/O.

### Visualization
- Visualize.

```
src
├── components
│   └── App.tsx
├── core
│   ├── IOStream.ts
│   ├── Interpreter.ts
│   ├── Runner.ts
│   └── utils.ts
├── css
│   ├── App.css
│   └── index.css
├── hooks
│   ├── useBrainfuck.ts
│   └── useStream.ts
├── tests
│   ├── App.test.tsx
│   ├── Fixtures.tsx
│   ├── IOStream.test.ts
│   ├── Intepreter.test.tsx
│   ├── Runner.test.tsx
│   └── hooks.test.tsx
├── react-app-env.d.ts
├── setupTests.ts
├── index.tsx
└── types.ts
```
