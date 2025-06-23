variable "subscription_id" {
  description = "The Azure subscription ID where the resources will be created."
  type        = string
}

variable "app_name" {
  description = "The name of the resource group where the Azure resources will be created."
  type        = string
  default     = "bus-timetable-app-server"
}

variable "location" {
  description = "The Azure region where the resources will be deployed."
  type        = string
  default     = "Italy North"
}

variable "postgres_server_name" {
  description = "The name of the PostgreSQL flexible server."
  type        = string
}

variable "postgres_administrator_login" {
  description = "The administrator login for the PostgreSQL server."
  type        = string
  sensitive   = true
}

variable "postgres_administrator_password" {
  description = "The administrator password for the PostgreSQL server."
  type        = string
  sensitive   = true
}

variable "postgres_database_name" {
  description = "The name of the PostgreSQL database to create."
  type        = string
  sensitive   = true
}

variable "postgres_version" {
  description = "The version of PostgreSQL to use."
  type        = string
  default     = "15"
}

variable "repo_url" {
  description = "The URL of the Git repository for the web app source code."
  type        = string
}

variable "repo_branch" {
  description = "The branch of the Git repository to use for the web app source code."
  type        = string
  default     = "main"
}
