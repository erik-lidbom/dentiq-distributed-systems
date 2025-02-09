# DentiQ 🧑🏽‍⚕️🪥

Welcome to the DentiQ!

DentiQ is a dental appointment management system designed to streamline the interaction between patients and dentists. The system provides an intuitive and responsive interface for patients to book and manage appointments, while offering dentists tools to handle schedules and bookings efficiently.

## Visuals
For visuals, [press this link](https://git.chalmers.se/courses/dit355/2024/student_teams/dit356_2024_03/dentiq/-/wikis/home/Miscellaneous/UI).
## Tech Stack
[Vue.js](https://vuejs.org/) (Clients)<br>
[Tailwind](https://tailwindcss.com/) (Clients)<br>
[TypeScript](https://www.typescriptlang.org/) (Clients, server and services)<br>
[Express.js](https://expressjs.com/) (Server and services)<br>
[Node.js](https://nodejs.org/en/) (Clients, server and services)<br>
[HiveMQ](https://www.hivemq.com/) (Server and services)
## Architecture
[Component Diagram](https://ibb.co/Z6sTPVF)<br>
[Use-Case Diagram](https://ibb.co/tpg0rqP)<br>
[Deployment Diagram](https://ibb.co/6mvjWkF)


## Pre Requirements
The requirements to run this project is **node.js**. You need to ensure that you have a compatible version installed on your machine, and this project uses 18.x.x. You can read more about installation [here](https://nodejs.org/en/).

### How to run
To install and run the clients, gateway and services, you need to navigate to each component in its subfolder in this monorepo. As an example, to navigate to the authentication-service, you would navigate to `dentiq/services/authentication-service`

1. Navigate to the component in your chosen CLI (Command Line Interface)
2. run `npm install` for said component to install dependencies
3. run `npm start` to start the component
4. Repeat the above steps for each component (*Note: you need to do this in separate nodes in your CLI*).

## Continious Intergration
The team implemented a continious integration practice to ensure no defect code was pushed to the main branch. We also made use of postman for end-to-end testing, as well as for stress-testing the system. In regards of our broker, HiveMQ, we utilized HiveMQ-swarm to ensure high performance during peak loads of the system, you can read more about it [here](https://docs.hivemq.com/hivemq-swarm/latest/index.html).

## Team Members
*Note: We had assigned roles, such as backend or frontend developer, but as the lifetime of the project moved forward, deviations of said roles occured.*<br>

| Name | Role |
| ------ | ------ |
| [Andreas Haataja](https://github.com/andreashaataja) |   Backend Developer & Scrum Master    |
|  Erik Lidbom      |    Full-Stack Developer    |
| [Lilly Heier](https://github.com/lillyh04)    |    Frontend Developer & UI Designer    |
| [Nabil Al-Sayed](https://github.com/nabil-alsayed)    |    Full-Stack Developer & UI Designer    |
| [Utkarsh Singh](https://github.com/Utkarsh26503)    |    Backend Developer    |



