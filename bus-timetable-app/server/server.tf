resource "azurerm_service_plan" "sp" {
  name                = "${var.app_name}-service-plan"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" "wa" {
  name                = "${var.app_name}-web-app"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_service_plan.sp.location
  service_plan_id     = azurerm_service_plan.sp.id
  https_only          = true

  site_config {
    application_stack {
      node_version = "22-lts"
    }
  }

  app_settings = {
    DB_USER     = azurerm_postgresql_flexible_server.pg-server.administrator_login
    DB_PASSWORD = azurerm_postgresql_flexible_server.pg-server.administrator_password
    DB_HOST     = azurerm_postgresql_flexible_server.pg-server.fqdn
    DB_PORT     = "5432"
    DB_NAME     = var.postgres_database_name
  }
}

resource "azurerm_app_service_source_control" "sc" {
  app_id                 = azurerm_linux_web_app.wa.id
  repo_url               = var.repo_url
  branch                 = var.repo_branch
  use_manual_integration = false
}
