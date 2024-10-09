# dependencies docker build

# match version from .tool-versions
FROM maven:3.6.3-jdk-11 AS maven

ARG build_env

WORKDIR /build

# copy only poms for max cachability of just dependency downloads
COPY pom.xml .

# download maven dependencies and ignore that some components will fail
RUN mvn -T 1C --batch-mode dependency:resolve --fail-never -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=warn

COPY ./scripts ./scripts
# for yarn build
COPY *.json .
COPY *.lock .

COPY ./src ./src

RUN mvn -T 1C --batch-mode \
              -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=warn \
              --file "pom.xml" \
              --activate-profiles "${build_env}" -Dnodejs.workingDirectory=. \
              package -Dmaven.test.skip


# For Java 11 and Tomcat 9
#FROM tomcat:9.0.93-jdk11-temurin-jammy
FROM tomcat:9.0.91-jdk11-temurin-focal

# copy war file from build
COPY --from=maven /build/target/*.war /usr/local/tomcat/webapps/orcid-frontend.war

