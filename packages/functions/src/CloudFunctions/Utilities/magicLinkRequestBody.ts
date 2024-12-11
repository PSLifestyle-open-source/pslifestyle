import * as emailTranslations from "./EmailTranslations/emailTranslations.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const translations: { [key: string]: any } = emailTranslations;

export function magicLinkRequestBody(
  email: string,
  languageCode: string,
  appURL: string,
  magicLinkToken: string,
) {
  return {
    headerFromAddress: "change@me.domain", // Sender address
    headerFromName: "ChangeMe", // Sender name
    headerToName: "",
    headers: [
      {
        name: "X-Flow",
        value: "flow2",
      },
    ],
    messageType: "EMAIL",
    recipientAddress: email,
    senderAddress: "change@me.domain", // Can be empty
    subject: translations[languageCode].subject, // Message subject
    html: `
          <div>
            <h1>${translations[languageCode].subject}</h1>
            <p>${translations[languageCode].greeting}</p>
            <a href=${appURL}checklogin?=${magicLinkToken}>${translations[languageCode].clickHereToSignIn}</a>
            <p>${translations[languageCode].signInPersistence}</p>
            <p>
                ${translations[languageCode].info_1} 
                ${translations[languageCode].info_2}
            </p>
            <p>${translations[languageCode].info_3}</p>
          </div>
          `,
    text: "Text field contents - in case there is no content in html-field", // if html is empty, this appears
  };
}
