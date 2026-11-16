FROM eclipse-temurin:25-jdk AS build
WORKDIR /src
COPY apps/api/ ./apps/api/
COPY shared/ ./shared/
RUN cd apps/api && ./mvnw -B -DskipTests package
FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=build /src/apps/api/target/rugby-live-api-0.1.0.jar app.jar
ENV BIND_ADDRESS=0.0.0.0 PORT=8082
USER 10001
EXPOSE 8082
ENTRYPOINT ["java","-jar","app.jar"]
