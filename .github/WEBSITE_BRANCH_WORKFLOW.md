# Website Branch Workflow

This document defines the agreed workflow for maintaining this repository's content on `main` while building and evolving the GitHub Pages website on a separate branch.

## Goal

Keep `main` clean and focused on the collection content, while a separate branch holds the website code and presentation layer.

## Branch Roles

### `main`

Use `main` as the **source of truth** for:

- biographies
- portraits and assets used by the collection
- folder structure
- root documentation
- factual content updates

### `website`

Use `website` as the **presentation branch** for:

- GitHub Pages site code
- landing page design
- components, styles, layouts, and interactions
- generated or curated site views built from content already maintained on `main`

## Core Rule

Content flows **from `main` to `website`**.

Do **not** use the `website` branch as the long-term source of truth for repository content.

## Safe Workflow

### 1. Edit content on `main`

All content changes should start on `main`.

Examples:

- add a new computing legend
- revise a biography
- replace a portrait
- improve category organization
- fix links or references

### 2. Commit and push `main`

Once the content update is ready, commit it normally to `main`.

### 3. Switch to `website`

After `main` is updated, move to the website branch.

### 4. Bring `main` into `website`

Update the website branch by merging or rebasing from `main`.

This keeps the website branch current with the latest repository content.

### 5. Make website-only changes on `website`

Examples:

- redesign the homepage
- add filtering or search UI
- improve cards, grids, and navigation
- adjust responsive behavior
- polish styling and branding

### 6. Publish GitHub Pages from `website`

The website branch can be published directly through GitHub Pages, or used as the source branch for a later deployment workflow.

## What Not To Do

### Do not merge `website` back into `main` normally

If the `website` branch contains website files, a normal merge back into `main` will also bring website code into `main`.

That would pollute the clean repository structure.

### Do not edit the same content in both branches

Avoid maintaining separate biography content on both `main` and `website`.

That creates drift, conflicts, and confusion.

### Do not make `website` the content source of truth

The `website` branch should reflect and present the content, not replace the content workflow.

## If Content Was Accidentally Edited On `website`

If a factual or content change is made on `website` by mistake:

1. copy or port that specific content change back to `main`
2. commit it on `main`
3. update `website` from `main` again

Do **not** solve this with a full branch merge from `website` into `main`.

## Mental Model

- `main` = archive / library
- `website` = exhibition / presentation layer

The exhibition should be updated from the archive, not the other way around.

## Recommended Day-To-Day Pattern

1. work on content in `main`
2. push `main`
3. switch to `website`
4. sync `website` with `main`
5. work on site design or UX in `website`
6. push `website`

## Notes For Future AI-Assisted Work

When using AI help in this repository:

- content tasks should generally target `main`
- site design and UI tasks should generally target `website`
- if a task touches both, update `main` first, then bring those changes into `website`

## Temporary Planning Note

This file exists to keep the workflow explicit while the GitHub Pages buildout is being planned and implemented.