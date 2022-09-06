resource "auth0_client" "app" {
  name                       = "MyTFO App"
  description                = "Web application for creating and managing accounts."
  app_type                   = "regular_web"
  grant_types                = ["authorization_code", "implicit", "refresh_token", "http://auth0.com/oauth/grant-type/password-realm", "password"]
  callbacks                  = [for uri in var.application_uris : uri]
  web_origins                = var.application_uris
  allowed_logout_urls        = [for uri in var.application_uris : "${uri}/login"]
  oidc_conformant            = true
  token_endpoint_auth_method = "none"

  jwt_configuration {
    alg = "RS256"
  }
}
