/// <reference types="cypress" />

describe("Testing gmail api library", () => {

    it.skip("Look for an email with specific subject", function() {
      //const subjectToFind = "[ORCID] Welcome to ORCID - verify your email address";
      const subjectToFind = "try sending a link";

      cy.task("checkInbox_from_to_subject", {
            options: {
              from: "kprismm@gmail.com",
              to: "orcidqa+123@gmail.com",
              subject: subjectToFind,
            }
        }).then(email => {
            assert(email.subject === subjectToFind ,"Subject found: "+ email.subject);
            console.log(email.snippet);
            const body = email.snippet;
           /* console.log(body);
            assert.isTrue(
              body(
                "https://www.cypress.io"
              ) >= 0,
              "Found the link!"
            );*/
          });
    });

    it("Look for an email with specific subject and link in the body", function() {
      const subjectToFind = "[ORCID] Welcome to ORCID - verify your email address";
      const linkToFind = "https://sandbox.orcid.org/verify-email/";
      let emailBody;
      let href;
      cy
      .task("readAllMessages", {
        options: {
          from: "support@verify.orcid.org",
          to: "k.madrigal@orcid.org",
          subject: subjectToFind,
          include_body: true,
          //before: new Date(2022, 12, 24, 12, 31, 13), // Before December 24rd, 2022 12:31:13
          //after: new Date(2022, 1, 15, 12, 31, 13) // After Jan 15, 2022
        }
      })
      .then(emails => {
        //there may be multiple emails with same subject and sender
        assert.isNotNull(emails.length);
        
        //grab most recent email
        emailBody = emails[0].body.html;
        cy.log(">>>>>>>>>Email body is: "+ JSON.stringify(emails[0].body));
       
        //convert string to DOM
        const htmlDom = new DOMParser().parseFromString(emailBody, 'text/html');
        cy.log(htmlDom.documentElement.innerHTML);
        
        //grab the anchor elements from the document
        const linksCollection=htmlDom.getElementsByTagName("a");
        href=linksCollection[0].href;//get first link
        cy.log(">>>>>>>found the link: "+ href);
      
        // make an api request for this resource no browser needed
        // drill into the response to check it was successful       
        cy.request(href).its('status').should('eq', 200);

      });      
    });
  });