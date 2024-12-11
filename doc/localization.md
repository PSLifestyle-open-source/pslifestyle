# Localization

## Tools

- Google Sheets - Source of translations for questionnaire (questions), actions (recommendation/plan page) and emails. 
- [react-i18next](https://react.i18next.com/) - JS library that inserts the correct strings from JSON files based on the chosen language and a translation key.
- Google Storage - Storage where translations are synchronized and stored.
- Locales folder `packages/functions/locales` - Where static UI translations are stored in JSON files.

## Regular work process

- A dev works on a feature, uses translation keys and `t('translationKey')` syntax in the code. Adds those translation keys with some value (and new namespaces if needed) to the English JSON files.

## Interpolation example

In a component:

```
<p>{t('currentFootprint', { ns: 'questionnaire', footprintInNumber: footprint })}</p>
```

In JSON file (questionnaire.json):

```
{
    "currentFootprint": "Your carbon footprint so far: {{footprintInNumber}} kgCO2"
}
```
