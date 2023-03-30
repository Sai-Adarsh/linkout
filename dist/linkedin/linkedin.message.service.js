"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedinMessageService = void 0;
const linkedin_abstract_service_1 = require("./linkedin.abstract.service");
const string_similarity_1 = require("string-similarity");
const sentiment_1 = __importDefault(require("sentiment"));
const moment_1 = __importDefault(require("moment"));
const gotoUrl_1 = require("../helpers/gotoUrl");
const timer_1 = require("../helpers/timer");
const linkedin_errors_1 = require("../enums/linkedin.errors");
const analyzer = new sentiment_1.default();
class LinkedinMessageService extends linkedin_abstract_service_1.LinkedinAbstractService {
  async process(page, cdp, data) {
    (0, gotoUrl_1.gotoUrl)(
      page,
      data.url
        ? data.url.indexOf("linkedin.com") > -1
          ? data.url
          : "https://www.linkedin.com" + data.url
        : "https://www.linkedin.com/messaging/"
    );
    await this.waitForLoader(page);

    const { name, IgnoreProspectMessages, message } = data;

    await page.waitForSelector('button[aria-label*="Message"]');

    await new Promise((resolve) => setTimeout(resolve, 3000));

    await page.evaluate(async () => {
      document.querySelector('button[aria-label*="Message"]').click();

      await new Promise((resolve) => setTimeout(resolve, 3000));
    });

    try {
      await page.waitForSelector(".msg-form__contenteditable");
    } catch {
      return;
    }

    await page.evaluate(async () => {
      const textBoxes = document.querySelectorAll(".msg-form__contenteditable");
      const lastTextBox = textBoxes[textBoxes.length - 1];
      lastTextBox.classList.add("msg-current_textbox");
    });

    const textArea = await this.moveAndClick(page, ".msg-current_textbox");

    await textArea.type(message, {
      delay: 30,
    });

    await this.moveAndClick(page, ".msg-form__send-button:not(:disabled)");

    return;
  }
}
exports.LinkedinMessageService = LinkedinMessageService;
//# sourceMappingURL=linkedin.message.service.js.map
