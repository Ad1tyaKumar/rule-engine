import React, { useEffect, useState } from 'react';
import './App.css'
import axios from 'axios';
import { Rule } from './types/interface';

const backendUrl = 'https://rule-engine.onrender.com';

const RuleEngine: React.FC = () => {
  const [ruleName, setRuleName] = useState<string>('');
  const [ruleString, setRuleString] = useState<string>('');
  const [createRuleResult, setCreateRuleResult] = useState<string>('');
  const [combineRules, setCombineRules] = useState<string[]>(['']);
  const [operator, setOperator] = useState<string>('AND');
  const [combineRuleResult, setCombineRuleResult] = useState<string>('');
  const [evaluateAST, setEvaluateAST] = useState<string>('');
  const [evaluateData, setEvaluateData] = useState<string>('');
  const [evaluateRuleResult, setEvaluateRuleResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [rules, setRules] = useState<Rule[]>([]);
  const [error, setError] = useState<string>('');

  const fetchAllRules = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/rules/`);
      const result = response.data;
      console.log(result);
      setRules(result.rules);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllRules();
  }, [])

  const generateTreeHTML = (node: any, prefix = '', isLeft = true): string => {
    console.log(node, 'node');

    if (!node) return '';

    let treeHTML = '';
    treeHTML += `${prefix}${isLeft ? '├── ' : '└── '}${node.type === 'operator' ? node.operator : `${node.key} ${node.operator} ${node.value}`}<br>`;

    if (node.left) treeHTML += generateTreeHTML(node.left, `${prefix}${isLeft ? '│   ' : '    '}`, true);
    if (node.right) treeHTML += generateTreeHTML(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);

    return treeHTML;
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    setError("");

    try {
      e.preventDefault();
      const response = await axios.post(`${backendUrl}/api/rules/create_rule`, { ruleName, ruleString });
      const result = response.data;
      let treeHTML = generateTreeHTML(result.ruleAST);
      treeHTML += `<br><p>Rule Name: ${result.ruleName}</p>`;
      setCreateRuleResult(treeHTML);
      fetchAllRules();
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error) && error.response) {
        setError("Create:" + error.response.data.msg);
      } else {
        setError('Create: An unknown error occurred');
      }
    }
  };

  const handleCombineRules = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(`${backendUrl}/api/rules/combine_rules`, { rules: combineRules, op: operator });
      const result = response.data;
      let treeHTML = generateTreeHTML(result.ruleAST);
      treeHTML += `<br><p>Rule Name: ${result.ruleName}</p>`;
      setCombineRuleResult(treeHTML);
      fetchAllRules();
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error) && error.response) {
        setError("Combine:" + error.response.data.msg);
      } else {
        setError('Combine: An unknown error occurred');
      }
    }
  };

  const handleAddRule = () => {
    setCombineRules([...combineRules, '']);
  };

  const handleEvaluateRule = async (e: React.FormEvent) => {
    setError("");
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/rules/evaluate_rule`, { ast: evaluateAST, data: JSON.parse(evaluateData) });
      const result = response.data;
      console.log(JSON.stringify(result));

      setEvaluateRuleResult(JSON.stringify(result));
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error) && error.response) {
        setError("Evaluate:" + error.response.data.msg);
      } else {
        setError('Evaluate: An unknown error occurred');
      }
    }
  };

  const deleteRule = async (name: string) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/rules/${name}`);
      if (response.data.success) {
        fetchAllRules();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <h1>Rule Engine</h1>
      <div className="container">
        <div>
          <h2>Create Rule</h2>
          <form onSubmit={handleCreateRule}>
            <div>
              <label htmlFor="ruleName">Rule Name:</label>
              <input
                type="text"
                id="ruleName"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="ruleString">Rule:</label>
              <input
                type="text"
                id="ruleString"
                value={ruleString}
                onChange={(e) => setRuleString(e.target.value)}
                required
              />
            </div>
            <button type="submit">Create Rule</button>
          </form>
          {
            error !== "" && error.split(":")[0] === "Create" ? <div className="error">{error.split(":")[1].trim()}</div> :
              <pre dangerouslySetInnerHTML={{ __html: createRuleResult }} />
          }
        </div>
        <div>

          <h2>Combine Rules</h2>
          <form onSubmit={handleCombineRules}>
            <h3>Enter Rules to Combine:</h3>
            {combineRules.map((rule, index) => (
              <div className="rule-container" key={index}>
                <label htmlFor={`combine-rule${index + 1}`}>Rule {index + 1}:</label>
                <input
                  type="text"
                  id={`combine-rule${index + 1}`}
                  value={rule}
                  onChange={(e) => {
                    const newRules = [...combineRules];
                    newRules[index] = e.target.value;
                    setCombineRules(newRules);
                  }}
                  required
                />
                {index === 0 && (
                  <>
                    <label htmlFor="operator1">Operator:</label>
                    <select
                      id="operator1"
                      value={operator}
                      onChange={(e) => setOperator(e.target.value)}
                    >
                      <option value="AND">AND</option>
                      <option value="OR">OR</option>
                    </select>
                  </>
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddRule}>
              Add Another Rule
            </button>
            <button type="submit">Combine Rules</button>
          </form>
          {
            error !== "" && error.split(":")[0] === "Combine" ? <div className="error">{error.split(":")[1].trim()}</div> :
              <pre dangerouslySetInnerHTML={{ __html: combineRuleResult }} />
          }
        </div>
        <div>
          <h2>Evaluate Rule</h2>
          <form onSubmit={handleEvaluateRule}>
            <div>
              <label htmlFor="evaluate-ast">Rule Name:</label>
              <input
                type="text"
                id="evaluate-ast"
                value={evaluateAST}
                onChange={(e) => setEvaluateAST(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="evaluate-data">Data JSON:</label>
              <textarea
                id="evaluate-data"
                value={evaluateData}
                onChange={(e) => setEvaluateData(e.target.value)}
                required
              />
            </div>
            <button type="submit">Evaluate Rule</button>
          </form>
          {
            error !== "" && error.split(":")[0] === "Evaluate" ? <div className="error">{error.split(":")[1].trim()}</div> :
              <pre>{evaluateRuleResult}</pre>
          }
        </div>
      </div>
      <div className='allRulesContainer'>
        {
          rules && rules.length === 0 && !loading ? (
            <h2>
              No Rules Defined
            </h2>
          ) :
            <h2>
              Previously Defined Rules
            </h2>
        }
        <div>
          {
            rules.map((item, index) => {

              if (item.ruleAST) {
                let treeHTML = generateTreeHTML(item.ruleAST);
                treeHTML += `<br><p>Rule Name: ${item.ruleName}</p>`;
                return (
                  <div key={index} className='ruleCard'>
                    <pre dangerouslySetInnerHTML={{ __html: treeHTML }} />
                    <button onClick={() => { deleteRule(item.ruleName) }}>Delete</button>
                  </div>
                )
              }
              return (
                <></>
              )
            })
          }
        </div>
      </div>
    </>
  );
};

export default RuleEngine;
