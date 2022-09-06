describe("View PDF files/videos", () => {
  before(() => {
    cy.loginClient()
  })

  it('Should open file on clicking on "view" button', () => {
    // Go to any sub folder with files in it
    cy.visit("/client/my-documents")
    cy.findAllByLabelText("folder name").eq(1).click()
    // Click on "View" button
    cy.findAllByRole("button", {
      name: "View",
    })
      .eq(2)
      .click()
    cy.get(".react-pdf__Page__canvas", { timeout: 150000 }).should("be.visible")
  })

  it("Should close the file/Document", () => {
    // Open any document
    cy.visit("/client/my-documents")
    cy.findAllByLabelText("folder name").eq(1).click()
    // Click on "close"
    cy.findAllByRole("button", {
      name: "View",
    })
      .eq(2)
      .click()
    cy.get(".react-pdf__Page__canvas", { timeout: 150000 }).should("be.visible")
    cy.findAllByLabelText("Close").last().click()
    // Click on "x" icon on a video
    cy.findAllByRole("button", {
      name: "View",
    })
      .eq(0)
      .click()
    cy.get("video")
      .should("have.prop", "paused", true)
      .and("have.prop", "ended", false)
      .then(($video) => {
        $video[0].play()
      })

    cy.get("video")
      .should("have.prop", "paused", false)
      .and("have.prop", "ended", false)

    cy.wait(3000)

    cy.get("video").then(($video) => {
      $video[0].pause()
    })
    cy.get("video").should(($video) => {
      expect($video[0].duration).to.be.gt(0)
    })
    cy.findAllByLabelText("Close").click()
  })
})
