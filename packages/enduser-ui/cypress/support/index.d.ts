/// <reference types="cypress" />
import { RootState } from "../../src/app/store";
import { NavigateOptions, To } from "react-router-dom";

export interface Question {
  question: string;
  choice: string;
  // if set marks beginning of new category
  category?: string;
}

export interface Demographics {
  age: number;
  gender: string;
  location: string;
  income: string;
}

export interface AnswerSet {
  answers: Question[];
  demographics?: Demographics;
  totalFootprint: string;
}

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Select default country and language for tests.
       */
      selectCountryAndLanguage(): Chainable<void>;

      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.data('greeting')
       */
      data(value: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Set value in a slider input.
       * @param value
       */
      setSliderValue(value: number): Chainable<void>;

      /**
       * Set application state to given value (provided that slices support the action).
       * @param newState
       */
      setState(newState: Partial<RootState>): Chainable<void>;

      /**
       * Use React router to navigate to route
       * @param to Route
       * @param options Options
       */
      routerNavigate(to: To, options?: NavigateOptions): Chainable<void>;

      /**
       * Answer questionnaire with given set of answers.
       * @param answerSet Answer set
       */
      answerQuestionnaire(answerSet: AnswerSet): Chainable<void>;
    }
  }
}
