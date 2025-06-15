# Project Learn
Web application project designed to help teachers in monitoring the assimilation of content by their students. Developed in React, Symfony & PHP (with TypeScript and Tailwind CSS).

## Initial Setup
This project runs in a Dockerized environment, therefore a initial setup is required to execute it. [Installation of Chocolatey](https://docs.chocolatey.org/en-us/choco/setup/) (for Windows) is highly recommended, as it will ease the process.

The only command required for the setup is the following:
```
make setup
```
You can refer to the Makefile in the root directory to check the remaining accepted commands.

## API Documentation
To check API documentation, please access **localhost:80/api/doc** with running containers.

## Access Credentials
To access the application as an administrator and to be able to create teacher profiles, use the following credentials:

- **Username:** admin
- **Password:** admin

You can also create new student users through the application interface without logging in.

## Use of Generative AI
This project uses generative AI to assist in the creation of content. In order to use this feature, you need to set the environment variable `VITE_GOOGLE_API_KEY` in your `.env.local` file with a valid Google API Key. You can obtain an API key by following the instructions in the [Google Cloud documentation](https://cloud.google.com/docs/authentication/api-keys).
