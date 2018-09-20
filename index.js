const {
  headers,
  serverAddress
} = require("./config/config");

const dataItems = require('./config/data-items');

const indicatorHelper = require("./helper/indicator-helper");
const dataElementHelper = require("./helper/data-element-helper");
const functionRulesHelper = require("./helper/function-rule-helper");

main();

async function main() {
  try {
    const indicators = await indicatorHelper.getAllIndicators(headers, serverAddress);
    const dataElements = await dataElementHelper.getAllDataElements(headers, serverAddress);
    const rules = await functionRulesHelper.getFunctionRules(indicators, dataElements, dataItems);
    // @todo handling updating rules with default ones, rule.json
    const functionPayload = { ...await functionRulesHelper.getFunctionFromServer(headers, serverAddress),
      rules: rules
    }
    await functionRulesHelper.updateFunction(headers, serverAddress, functionPayload);

  } catch (exception) {
    console.log(exception)
  }
}