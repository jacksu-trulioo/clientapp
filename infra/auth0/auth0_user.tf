# Set up test user for e2e testing.
resource "auth0_user" "user" {
  connection_name = "Username-Password-Authentication"
  user_id = "12345"
  name = "E2E Test User"
  nickname = "e2e_user"
  email = "e2e_user@tfoco.com"
  email_verified = true
  password = "fFq3?$yyRJo9aiRH"
}
