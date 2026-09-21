## Pokedex API

The Home page uses PokeAPI to show Pokemon data.

First, the app gets the full Pokemon list:

```text
https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0
```

This list is saved in `localStorage` with the key `dexter.pokedex.catalog`.
The app uses this list for search and pagination.

For each page, the app loads details in groups of 20 Pokemon. It calls:

```text
https://pokeapi.co/api/v2/pokemon/{id}
```

The app stores the details in `localStorage` with the key
`dexter.pokedex.details`. This avoids loading the same Pokemon details again.

The detail data used by the app is:

- `id`
- `name`
- `base_experience`
- `height`
- `weight`
- ability names
- type names
- `sprites.front_default` as the image

The current list page is also saved in `localStorage` with the key
`dexter.pokedex.page`. If the user opens a Pokemon detail and goes back, the app
keeps the same page.

# Dexter React

This is a React project with Vite.

## Run in development

Install the packages:

```bash
npm install
```

Start the local server:

```bash
npm run dev
```

Open the URL that Vite shows in the terminal.

## Run a production preview

Build the app:

```bash
npm run build
```

Start the preview server:

```bash
npm run preview
```

## Run with Docker

Build the Docker image:

```bash
docker build -t dexter-react .
```

Run the container:

```bash
docker run --rm -p 8080:80 dexter-react
```

Open this URL:

```text
http://localhost:8080
```
