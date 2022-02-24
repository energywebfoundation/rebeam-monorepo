FROM openchargingnetwork/ocn-node:1.2.0-rc1 
ARG TARGETPLATFORM
ARG BUILDPLATFORM
RUN echo "I am not cached running on $BUILDPLATFORM, building for $TARGETPLATFORM" > /log
COPY application.properties /ocn-node/src/main/resources/
CMD ["java", "-Dspring.config.location=/ocn-node/src/main/resources/application.properties", "-jar", "/ocn-node/libs/ocn-node-1.2.0-rc1.jar"]
