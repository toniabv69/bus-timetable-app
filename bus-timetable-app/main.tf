terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

# Network for all containers
resource "docker_network" "app_net" {
  name = "bus_app_network"
}

# Persistent volume for Postgres
resource "docker_volume" "pg_data" {
  name = "pg_data"
}

# PostgreSQL container
resource "docker_image" "postgres" {
  name = "postgres:15"
}

resource "docker_container" "postgres" {
  name  = "bus_postgres"
  image = docker_image.postgres.image_id
  networks_advanced {
    name = docker_network.app_net.name
  }
  env = [
    "POSTGRES_USER=admin",
    "POSTGRES_PASSWORD=adminpass",
    "POSTGRES_DB=postgres"
  ]
  volumes {
    volume_name    = docker_volume.pg_data.name
    container_path = "/var/lib/postgresql/data"
  }
  ports {
    internal = 5432
    external = 5432
  }
}

# Backend (Express) container
resource "docker_image" "backend" {
  name = "bus-backend:latest"
  build {
    context = "./server"
  }
}

resource "docker_container" "backend" {
  name  = "bus_backend"
  image = docker_image.backend.image_id
  networks_advanced {
    name = docker_network.app_net.name
  }
  env = [
    "DB_HOST=bus_postgres",
    "DB_USER=admin",
    "DB_PASSWORD=adminpass",
    "DB_NAME=postgres",
    "PORT=5000"
  ]
  ports {
    internal = 5000
    external = 5000
  }
  depends_on = [docker_container.postgres]
}

# Frontend (React) container
resource "docker_image" "frontend" {
  name = "bus-frontend:latest"
  build {
    context = "./frontend"
  }
}

resource "docker_container" "frontend" {
  name  = "bus_frontend"
  image = docker_image.frontend.image_id
  networks_advanced {
    name = docker_network.app_net.name
  }
  ports {
    internal = 80
    external = 3000
  }
  depends_on = [docker_container.backend]
} 