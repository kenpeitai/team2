
FROM gradle:8.9.0-jdk21-alpine AS build
WORKDIR /workspace

# 复制源代码和配置文件
COPY . .
RUN gradle clean bootJar --no-daemon

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /workspace/build/libs/*-SNAPSHOT.jar /app/app.jar
VOLUME ["/data"]
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]


