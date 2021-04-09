Cypress.Commands.add('createFunding', () => {
    cy.getCookie('XSRF-TOKEN').then((cookie) => {
      cy.request({
        method: 'POST',
        url: 'fundings/funding.json', // baseUrl is prepended to url
        body: {
            "visibility": {
                "errors": [],
                "required": true,
                "getRequiredMessage": null,
                "visibility": "LIMITED"
            },
            "errors": [],
            "fundingTitle": {
                "errors": [],
                "title": {
                    "errors": [],
                    "value": "Funding title",
                    "required": true,
                    "getRequiredMessage": null
                },
                "translatedTitle": {
                    "errors": [],
                    "content": "Translated title",
                    "languageCode": "es",
                    "languageName": "",
                    "required": false,
                    "getRequiredMessage": null
                }
            },
            "description": {
                "errors": [],
                "value": "This is the description",
                "required": true,
                "getRequiredMessage": null
            },
            "fundingName": {
                "errors": [],
                "value": "Org name",
                "required": true,
                "getRequiredMessage": null
            },
            "fundingType": {
                "errors": [],
                "value": "award",
                "required": true,
                "getRequiredMessage": null
            },
            "organizationDefinedFundingSubType": {
                "subtype": {
                    "errors": [],
                    "value": "Funding subtype",
                    "required": true,
                    "getRequiredMessage": null
                },
                "alreadyIndexed": false
            },
            "currencyCode": {
                "errors": [],
                "value": "CRC",
                "required": true,
                "getRequiredMessage": null
            },
            "amount": {
                "errors": [],
                "value": "1000000",
                "required": true,
                "getRequiredMessage": null
            },
            "url": {
                "errors": [],
                "value": "http://qa.orcid.org",
                "required": true,
                "getRequiredMessage": null
            },
            "startDate": {
                "errors": [],
                "month": "01",
                "day": "",
                "year": "2000",
                "required": true,
                "getRequiredMessage": null
            },
            "endDate": {
                "errors": [],
                "month": "12",
                "day": "",
                "year": "2031",
                "required": true,
                "getRequiredMessage": null
            },
            "contributors": null,
            "externalIdentifiers": [{
                "errors": [],
                "externalIdentifierId": {
                    "errors": [],
                    "value": "1234567890",
                    "required": true,
                    "getRequiredMessage": null
                },
                "externalIdentifierType": {
                    "errors": [],
                    "value": "Grant number",
                    "required": true,
                    "getRequiredMessage": null
                },
                "url": {
                    "errors": [],
                    "value": "http://google.com/granturl",
                    "required": true,
                    "getRequiredMessage": null
                },
                "relationship": {
                    "errors": [],
                    "value": "self",
                    "required": true,
                    "getRequiredMessage": null
                },
                "normalized": null,
                "normalizedUrl": null
            }],
            "putCode": null,
            "sourceName": "",
            "source": null,
            "assertionOriginOrcid": "",
            "assertionOriginClientId": "",
            "assertionOriginName": "",
            "disambiguatedFundingSourceId": null,
            "disambiguationSource": null,
            "city": {
                "errors": [],
                "value": "San Jose",
                "required": true,
                "getRequiredMessage": null
            },
            "region": {
                "errors": [],
                "value": "Guadalupe",
                "required": true,
                "getRequiredMessage": null
            },
            "country": {
                "errors": [],
                "value": "CR",
                "required": true,
                "getRequiredMessage": null
            },
            "countryForDisplay": null,
            "fundingTypeForDisplay": null,
            "dateSortString": null,
            "createdDate": null,
            "lastModified": null
        },
        headers: {
          'X-XSRF-TOKEN': cookie.value,
        },
      })
    })
  })
