# syntax=docker/dockerfile:1.7

FROM golang:1.22-alpine AS builder
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git

# Copy go module files first to leverage layer caching
COPY server/go.mod server/go.sum ./
RUN go mod download

# Copy the remaining source
COPY server/ ./

# Build the API binary
RUN CGO_ENABLED=0 GOOS=linux go build -o library-api ./cmd/api

# --
# Final image
# --
FROM alpine:3.20

# Create non-root user
RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

# Copy binary from builder stage
COPY --from=builder /app/library-api ./library-api

# Expose API port
EXPOSE 5050

ENV API_PORT=5050

USER app

CMD ["./library-api"]
