export interface RuleASTOperand {
    type: "operand";
    key: string;
    operator: string;
    value: string;
}

export interface RuleASTOperator {
    type: "operator";
    operator: string;
    left: RuleASTOperand | RuleASTOperator;
    right: RuleASTOperand | RuleASTOperator;
}

export interface Rule {
    _id: string;
    ruleName: string;
    ruleAST: RuleASTOperator;
    __v: number;
}
