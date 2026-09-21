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
