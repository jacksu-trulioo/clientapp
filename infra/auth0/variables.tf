variable "environment" {
  description = "[Required] Environment, e.g. dev"
  type        = string
}

variable "auth0_domain" {
  description = "[Required] Auth0 Domain"
  type        = string
}

variable "auth0_client_id" {
  description = "[Required] Auth0 Client ID"
  type        = string
}

variable "auth0_client_secret" {
  description = "[Required] Auth0 Client Secret"
  type        = string
}

variable "application_uris" {
  description = "[Required] Tuple of URLs for setting up Auth0 application URIs"
  type        = list(string)
}
