# UI Window V1 Checklist

## Scope Lock

This checklist implements only the V1 contract in:

- `docs/ui-window-proposal.md`
- `docs/ui-window-v1-spec.md`

## Runtime

- [ ] add `js/ui/ui.window.js`
- [ ] add `css/ui/ui.window.css`
- [ ] implement `createWindowManager(options)`
- [ ] implement `manager.createWindow(options)`
- [ ] implement window open / close / focus
- [ ] implement z-index stack management
- [ ] implement title-bar drag
- [ ] implement edge / corner resize
- [ ] implement minimize / restore
- [ ] implement maximize / restore
- [ ] implement taskbar for minimized windows
- [ ] clamp movement and resize to viewport bounds
- [ ] implement `setTitle`, `setContent`, `setPosition`, `setSize`, `getState`, `destroy`

## Loader

- [ ] register `ui.window` in `js/ui/ui.loader.js`
- [ ] add `ui.window` to an appropriate loader group

## Demo

- [ ] add `demos/demo.window.html`
- [ ] prove multiple windows
- [ ] prove focus / stacking
- [ ] prove drag and resize
- [ ] prove minimize / restore via taskbar
- [ ] prove maximize / restore
- [ ] add demo metadata for right-column manual rendering
- [ ] add nav/catalog links

## Docs

- [ ] document `createWindowManager(options)` in `README.md`
- [ ] document manager and window option tables in `README.md`
- [ ] document returned APIs in `README.md`
- [ ] update project structure in `README.md`
- [ ] update `CHANGELOG.md`
- [ ] update `docs/pbb-refactor-playbook.md` with window-system ownership rules

## Regression

- [ ] add `tests/window.regression.html`
- [ ] add `tests/window.regression.mjs`
- [ ] cover stack order
- [ ] cover minimize / restore
- [ ] cover maximize / restore
- [ ] cover minimum resize bounds
- [ ] cover destroy cleanup

## Completion Gate

V1 is complete when:

- runtime API matches `docs/ui-window-v1-spec.md`
- demo exists and proves the core interactions
- regression harness passes
- loader/docs/changelog/playbook are updated
