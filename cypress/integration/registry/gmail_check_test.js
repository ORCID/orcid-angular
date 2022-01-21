/// <reference types="cypress" />

describe("Email assertion:", () => {
    it("Look for an email with specific subject and link in email body", function() {
      // debugger; //Uncomment for debugger to work...
      cy
         /*8 .task("readAllMessages", {
          options: {
            from: "s.paparisto@orcid.org",
            subject: "Katrina's kudoboard",
            include_body: true,
            before: new Date(2022, 12, 30), // before dec 30, 2022
            after: new Date(2022, 7, 17) // After july 17, 2022
          }*/
          .task("checkInbox_from_to_subject", {
            options: {
              from: "kprismm@gmail.com",
              to: "orcidqa+123@gmail.com",
              subject: "testing inbox is working"
            }
        })
        .then(email => {
            assert(email.subject === 'testing inbox is working');
            // assert.isAtLeast(
            //   emails.length,
            //   1,
            //   "Expected to find at least one email, but none were found!"
            // );
            //['jfk@jfkl.com'].length,

            // const body = emails[0].body.html;
            //console.log(body);
            /*assert.isTrue(
              body.indexOf(
                "https://www.kudoboard.com/boards/keDtuB0K"
              ) >= 0,
              "Found the link!"
            );*/
          });

     /* cy
        .task("gmail:check", {
          options: {
            from: "s.paparisto@orcid.org",
            subject: "Katrina's kudoboard",
            include_body: true,
            //before: new Date(2019, 8, 24, 12, 31, 13), // Before September 24rd, 2019 12:31:13
            after: new Date(2022, 1, 17) // After August 23, 2019
          }
        })
        .then(emails => {
          assert.isAtLeast(
            emails.length,
            1,
            "Expected to find at least one email, but none were found!"
          );
          const body = emails[0].body.html;
          assert.isTrue(
            body.indexOf(
              "https://www.kudoboard.com/boards/keDtuB0K"
            ) >= 0,
            "Found the link!"
          );
        });*/
    });
  });