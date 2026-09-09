# Docker Deployment Guide

## Building the Docker Image

The Dockerfile includes ImageMagick installation as a system dependency.

### Build the image:
```bash
docker build -t matchymatch:latest .
```

### Run the container:
```bash
docker run -d -p 8080:80 --name matchymatch matchymatch:latest
```

### Using Docker Compose:
```bash
docker-compose up -d
```

## Image Details

- **Base Images**: 
  - Build stage: `node:20-alpine`
  - Production stage: `nginx:alpine`
- **System Dependencies**: ImageMagick (installed via apk)
- **Port**: 80 (mapped to 8080 on host)
- **Build Type**: Multi-stage build for optimized image size

## Accessing the Application

Once running, access the application at:
- Direct Docker: http://localhost:8080
- Docker Compose: http://localhost:8080

## Verifying ImageMagick Installation

To verify ImageMagick is installed in the container:
```bash
docker exec matchymatch convert --version
```

## Stopping the Container

```bash
docker stop matchymatch
# or with docker-compose
docker-compose down
```
