import express from 'express';
const router = express.Router();
import { combineRules, createRule, deleteRule, evaluateRule, getAllRules } from '../controllers/ruleController.js';

router.get('/', getAllRules);
router.delete('/:ruleName', deleteRule);
router.post('/create_rule', createRule);
router.post('/combine_rules', combineRules);
router.post('/evaluate_rule', evaluateRule);

export default router;
