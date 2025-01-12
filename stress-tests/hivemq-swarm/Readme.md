# HiveMQ Swarm

HiveMQ Swarm allows you to simulate the behavior of a large amount of MQTT clients.

## Run from Console

Execute HiveMQ Swarm as a single instance on your local machine:

    ./bin/hivemq-swarm -S scenarios/scenario.xml
    
## Directory Structure

- `/bin`: contains the executables
- `/config`: contains the configuration
- `/extensions`: contains extensions
- `/lib`: contains the dependencies of the executables
- `/license`: contains licenses
- `/scenario`: contains scenarios
- `/scenario-dependencies`: contains files that are depended on by scenarios
- `/third-party-extension`: contains a list of the licenses of third party dependencies

## How to run
- 1. For each service, in their mqtt.ts files, change the protocol from 'mqtts' to 'mqtt'.
- 2. For each service .env file, change the MQTT_HOST to localhost
- 3. For each service .env file, change the MQTT_PORT to 1883
- 4. Make sure you have docker installed ( https://docs.docker.com/get-started/get-docker/ )
- 5. Run the docker by entering 'docker run -p 8080:8080 -p 1883:1883 hivemq/hivemq4' in your terminal.
- 6. In another terminal, navigate to dentiq/stress-tests/hive-mq-swarm and enter ./bin/hivemq-swarm