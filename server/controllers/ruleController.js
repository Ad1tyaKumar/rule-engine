import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import Rule from '../models/Rule.js';
import { parseRuleString, combineNodes, evaluate, printTree } from '../utils/ast.js';
import ErrorHandler from '../utils/errorHandler.js';

// Function to generate a random string of letters
function generateRandomLetterString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
}

// Create Rule Controller
export const createRule = catchAsyncErrors(async (req, res, next) => {
  try {
    const { ruleName, ruleString } = req.body;
    if (!ruleName || !ruleString) {
      return res.status(400).json({ error: 'ruleName and ruleString are required' });
    }
    let rule = await Rule.findOne({
      ruleName
    });

    if (rule) {
      return next(new ErrorHandler("Rule name already exist", 400));
    }
    const rootNode = parseRuleString(ruleString);

    rule = new Rule({ ruleName, ruleAST: rootNode });
    await rule.save();
    printTree(rootNode);
    res.status(201).json(rule);
  } catch (error) {
    return next(new ErrorHandler("Error creating rule", 500));
  }
});

// Combine Rules Controller
export const combineRules = catchAsyncErrors(async (req, res, next) => {
  try {
    const { rules, op } = req.body;
    const ruleDocs = await Rule.find({ ruleName: { $in: rules } });
    if (ruleDocs.length === 0) {
      return next(new ErrorHandler("No matching rule found", 404));
    }
    const ruleASTs = ruleDocs.map(rule => rule.ruleAST);
    const combinedRootNode = combineNodes(ruleASTs, op);
    const randomString = generateRandomLetterString(4);
    const rule = new Rule({ ruleName: `combined${randomString}`, ruleAST: combinedRootNode });
    await rule.save();
    printTree(combinedRootNode);
    res.status(201).json(rule);
  } catch (error) {
    return next(new ErrorHandler("Error combining rule", 500));
  }
});

// Evaluate Rule Controller
export const evaluateRule = catchAsyncErrors(async (req, res, next) => {
  try {
    const { ast, data } = req.body;
    const rule = await Rule.find({ ruleName: ast });

    if (!rule || rule.length === 0) {
      return next(new ErrorHandler("Rule not found", 404));
    }
    const result = evaluate(rule[0].ruleAST, data);
    res.status(200).json({ result });
  } catch (error) {
    return next(new ErrorHandler("Error evaluating rule", 500));
  }
});

export const getAllRules = catchAsyncErrors(async (req, res, next) => {
  try {
    const rules = await Rule.find();
    res.status(200).json({ success: true, rules });
  } catch (error) {
    return next(new ErrorHandler("Error getting rules", 500));
  }
}
);

export const deleteRule = catchAsyncErrors(async (req, res, next) => {
  try {
    const { ruleName } = req.params;
    const rule
      = await Rule.findOneAndDelete({
        ruleName
      });
    if (!rule) {
      return next(new ErrorHandler("Rule not found", 404));
    }
    res.status(200).json({ success: true, rule });
  } catch (error) {
    return next(new ErrorHandler("Error deleting rule", 500));
  }
}
);