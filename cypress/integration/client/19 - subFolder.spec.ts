import { parse } from "date-fns"

describe("Sub Folder/List", () => {
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

  it("Screen Validations and functionalities", () => {
    // Go to My Document
    cy.visit("/client/my-documents")
    cy.findAllByText(documentCenterKeys.heading).should("be.visible")
    cy.findAllByLabelText("folder name").should("be.visible")
    cy.findByRole("heading", {
      name: "no of files",
    }).should("not.be.null")
    // Click on any folder
    cy.findAllByLabelText("folder name").eq(0).click()
    // Screen validations
    cy.get('input[aria-label="Select All"]').should("be.visible")
    cy.get('input[aria-label="checkbox"]').should("be.visible")
    cy.findAllByLabelText("Support Icon").should("be.visible")
    cy.findByRole("button", {
      name: "Download",
    }).should("be.visible")
    cy.findByRole("button", {
      name: "Download",
    }).should("be.visible")
  })

  it("Should be able to download selected combination of PDFs and videos", () => {
    // Go to any sub folder
    cy.visit("/client/my-documents")
    cy.findAllByLabelText("folder name").eq(1).click()
    // Select  combination of PDFs and videos
    cy.wait(5000)
    cy.findAllByRole("checkbox", {
      name: "checkbox",
    })
      .eq(0)
      .children()
      .eq(1)
      .click()
    cy.findAllByRole("checkbox", {
      name: "checkbox",
    })
      .eq(2)
      .children()
      .eq(1)
      .click()
    // Click on the popup download button
    cy.findByRole("button", {
      name: "Download Icon",
    }).click()
  })

  it("should redirect to default mail browser for enquiry regarding a document", () => {
    //   Go to any folder
    cy.visit("/client/my-documents")
    cy.findAllByLabelText("folder name").eq(0).click()
    cy.wait(2000)
    // Click on "?" icon
    cy.findAllByRole("link", {
      name: "Support Icon",
    })
      .eq(1)
      .click()
  })

  it("Should be able to download a file", () => {
    //   Go to any sub folder
    cy.visit("/client/my-documents")
    cy.findAllByLabelText("folder name").eq(0).click()
    // Click on the download button
    cy.findAllByRole("button", {
      name: "Download",
    })
      .eq(0)
      .click()
  })

  it("Should arrange the folders in ascending or descending order of the date", () => {
    //   Go to Document center
    cy.visit("/client/my-documents")
    cy.findAllByLabelText("folder name").eq(1).click()
    cy.wait(2000)
    // The Arrow next to the header "Date"
    cy.findByRole("button", {
      name: "Date",
    }).should("be.visible")
    cy.findByLabelText("sort").should("be.visible")
    // Click on the "upper" arrow
    cy.findByLabelText("sort").click()
    const parseDate = (date) => parse(date, "dd/MM/yyyy", new Date())
    cy.findAllByLabelText("date").then(() => {
      cy.findAllByLabelText("date")
        .eq(0)
        .invoke("text")
        .then(($first) => {
          let firstdate = parseDate($first)
          cy.findAllByLabelText("date")
            .eq(2)
            .invoke("text")
            .then(($third) => {
              let thirddate = parseDate($third)
              expect(thirddate).to.be.lte(firstdate)
            })
        })
    })
    // Click on the "lower" arrow
    cy.findByLabelText("sort").click({ force: true })
    cy.findAllByLabelText("date").then(() => {
      cy.findAllByLabelText("date")
        .eq(0)
        .invoke("text")
        .then(($first) => {
          let firstdate = parseDate($first)
          cy.findAllByLabelText("date")
            .eq(2)
            .invoke("text")
            .then(($third) => {
              let thirddate = parseDate($third)
              expect(thirddate).to.be.gte(firstdate)
            })
        })
    })
  })

  it("Should be able to download one or more PDFs", () => {
    //   Go to any sub folder
    cy.visit("/client/my-documents")
    cy.findAllByLabelText("folder name").eq(1).click()
    cy.wait(4000)
    // Select one or more PDFs
    cy.findAllByRole("checkbox", {
      name: "checkbox",
    })
      .eq(3)
      .click({ force: true })
    cy.findAllByRole("checkbox", {
      name: "checkbox",
    })
      .eq(4)
      .click({ force: true })
    // Click on the popup download button
    cy.findByRole("button", {
      name: "Download Icon",
    }).click()
  })

  it("Should be able to download one or more Videos", () => {
    //   Go to any sub folder
    cy.visit("/client/my-documents")
    cy.findAllByLabelText("folder name").eq(1).click()
    cy.wait(2000)
    // Select one or more Videos
    cy.findAllByRole("checkbox", {
      name: "checkbox",
    })
      .eq(0)
      .click({ force: true })
    // Click on the popup download button
    cy.findByRole("button", {
      name: "Download Icon",
    }).click()
  })

  it("Pagination functionality", () => {
    // Go to any sub folder
    cy.visit("/client/my-documents")
    cy.findAllByLabelText("folder name").eq(1).click()
    cy.wait(2000)
    // pagination
    cy.findByLabelText("Page")
      .invoke("text")
      .then((txt) => {
        expect(txt).to.match(/page 1 of [0-9]/i)
      })
    // On clicking right arrow being in the first page
    cy.findByRole("button", {
      name: "nextPage",
    }).click()
    cy.wait(2000)
    cy.findByLabelText("Page")
      .invoke("text")
      .then((txt) => {
        expect(txt).to.match(/page 2 of [0-9]/i)
      })
    // On clicking the left arrow being in between many pages
    cy.findByRole("button", {
      name: "previousPage",
    }).click()
    cy.wait(2000)
    cy.findByLabelText("Page")
      .invoke("text")
      .then((txt) => {
        expect(txt).to.match(/page 1 of [0-9]/i)
      })
  })

  it("Should go back to the previous page", () => {
    // Go to any sub folder
    cy.visit("/client/my-documents")
    cy.findAllByLabelText("folder name").eq(1).click()
    cy.wait(2000)
    // Click on "My Documents" in the breadcrumb
    cy.findAllByRole("link", {
      name: commonKeys.nav.links.myDocuments,
    })
      .eq(0)
      .click()
    cy.findByRole("heading", {
      name: documentCenterKeys.heading,
      level: 1,
    }).should("be.visible")
    // Click on "Back"
    cy.findAllByLabelText("folder name").eq(0).click()
    cy.wait(2000)
    cy.findByRole("button", {
      name: commonKeys.button.back,
    }).click()
    cy.findByRole("heading", {
      name: documentCenterKeys.heading,
      level: 1,
    }).should("be.visible")
  })
})
