output "webapp_url" {
  value = azurerm_linux_web_app.wa.default_hostname
}

output "postgres_fqdn" {
  value = azurerm_postgresql_flexible_server.pg-server.fqdn
}
