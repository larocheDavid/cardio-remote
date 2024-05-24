# Utiliser une image Java pour la compilation
FROM maven:3.6.3-openjdk-17 AS build

WORKDIR /app
COPY ./pom.xml ./
COPY ./src ./src/

# Compiler le projet Spring Boot
RUN mvn clean package -DskipTests

# Étape de lancement
FROM eclipse-temurin:17-jre-focal

WORKDIR /app
COPY --from=build /app/target/scratch.fhir-0.0.1-SNAPSHOT.jar ./

CMD ["java", "-jar", "scratch.fhir-0.0.1-SNAPSHOT.jar"]
