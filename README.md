# QuizApp Readme

QuizApp is a modern quiz website built with ReactJS, Vite, and Tailwind CSS. It utilizes a Quiz API to provide a wide range of quizzes on various topics. Whether you want to test your knowledge in science, history, pop culture, or any other category, QuizApp has got you covered.

## Table of Contents

- [QuizApp Readme](#quizapp-readme)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Install dependencies:](#install-dependencies)
    - [Running the App](#running-the-app)
    - [Tech Stack](#tech-stack)
    - [Features](#features)
    - [API Integration](#api-integration)

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js: [Download Here](https://nodejs.org/)
- npm (Node Package Manager): This comes with Node.js installation.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/quizzy-app.git
```

2. Change into the project directory:
```bash
cd quiz-app
```

### Install dependencies:
``` bash
npm install
```

### Running the App
To start the development server, run:
``` bash
npm run dev
```


This will launch the application on http://localhost:5137. Open your browser and navigate to this URL to explore QuizApp.

### Tech Stack
- ```ReactJS```: A JavaScript library for building user interfaces.
- ```Vite```: A fast, opinionated frontend build tool that aims to provide a seamless development experience.
- ```Tailwind CSS```: A utility-first CSS framework for rapidly building custom designs.
- ```Quiz API```: An external API providing a variety of quizzes.

### Features
- Choose from a diverse range of quizzes.
- Track your quiz progress and scores.
- Responsive design for a seamless experience on different devices.
- Engaging user interface with smooth transitions and animations.

### API Integration
QuizApp integrates with an external Quiz API to fetch quiz questions and categories dynamically. The services folder contains modules responsible for handling API requests.

To configure the API endpoint or API key, refer to the relevant service file.
