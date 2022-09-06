const { _ } = Cypress
describe("My Document", () => {
  let commonKeys
  let documentCenterKeys

  before(() => {
    cy.loginClient()
    cy.fixture("../../public/locales/en/common").then((keys) => {
      commonKeys = keys
    })
    cy.fixture("../../public/locales/en/documentCenter").then((keys) => {
      documentCenterKeys = keys
    })
  })

  it("Should open the Sub folder", () => {
    cy.visit("/client")
    // Go to the Document Center
    cy.findByRole("link", {
      name: commonKeys.nav.links.myDocuments,
    }).click()
    cy.wait(2000)
    cy.findAllByText(documentCenterKeys.heading).should("be.visible")
    cy.findByRole("heading", {
      name: "no of files",
    }).should("not.be.null")
    // Click on any folder
    cy.findAllByLabelText("folder name").eq(1).click()
    cy.findAllByLabelText("file name").should("be.visible")
  })

  it("Should arrange the folders in ascending or descending order", () => {
    // Go to Document center
    cy.intercept("POST", "/api/client/documents/doc-center").as("doccenter")
    cy.visit("/client/my-documents")
    // The Arrow next to the header "Name"
    cy.wait("@doccenter", { timeout: 10000 }).then((interception) => {
      let arr = []
      interception.response.body.data.forEach((singleData) => {
        arr.push(singleData.name)
      })
      var sortdata = _.sortBy(arr)
      cy.findAllByLabelText("folder name").then((folder) => {
        expect(folder[0]).to.contain.text(sortdata[0])
      })
      cy.findByText(/Name/i).click()
      cy.findAllByLabelText("folder name").then((folder) => {
        expect(folder[0]).to.contain.text(sortdata[arr.length - 1])
      })
      // Click on the "lower" arrow
      cy.findAllByLabelText("folder name").then((folder) => {
        expect(folder[0]).to.contain.text(sortdata[arr.length - 1])
      })
      cy.findByRole("img", {
        name: "lower",
      }).click()
      cy.findAllByLabelText("folder name").then((folder) => {
        expect(folder[0]).to.contain.text(sortdata[0])
      })
      // Click on the "upper" arrow
      cy.findAllByLabelText("folder name").then((folder) => {
        expect(folder[0]).to.contain.text(sortdata[0])
      })
      cy.findByRole("img", {
        name: "upper",
      }).click()
      cy.findAllByLabelText("folder name").then((folder) => {
        expect(folder[0]).to.contain.text(sortdata[arr.length - 1])
      })
    })
  })
})
