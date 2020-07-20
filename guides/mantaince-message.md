## Setup a maintenance message

Following the [Orcid Source banner configuration](https://github.com/ORCID/ORCID-Internal/wiki/Setting-a-Maintenance-Message) will work the same way on Orcid Angular to display a maintenance message.

## Configuring closable and/or regular maintenance messages

Optionally orcid-angular can have closable messages, meaning that the user can click an "UNDERSTOOD" button to close it.

The same [Orcid Source banner config](https://github.com/ORCID/ORCID-Internal/wiki/Setting-a-Maintenance-Message) must be followed but the messages need to be wrapped with an HTML `div` tag and either of the following attributes:

- a `closable` class and have a unique ID: this will be show on top of the application with a "UNDERSTOOD" button, once this button is clicked a cookie will be create with the same ID and it wont be shown again.
- a `regular` class: this will be show on as classic message.

For instance:

```
<div class="regular">
    ORCID is monitoring the COVID-19 pandemic. Rest assured that access to the Registry and our support desk, as well as member integrations, will continue as normal. Please
    <a href="https://orcid.org/blog/2020/03/12/orcid%E2%80%99s-response-covid-19">
        read more about ORCID&apos;s response to the pandemic
        </a>
</div>

<div class="closable" id="closable-unique-name">
    The privacy policy wast update on april 2019
    <a href="https://orcid.org/privacy-policy" target="blank" class="mat-button-font black-url">read more about it</a>
</div>

```

---

#### Note

If Orcid Angular does not detect the presence of any of these `regular` or `closable` classes, all the configured content will be display as a `regular` message, in the same way that is done on Orcid Source.
