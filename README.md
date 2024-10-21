# Rule Engine Application
Hosted link: [ https://rule-engine-sandy.vercel.app/](https://rule-engine-sandy.vercel.app/)

## Overview

This application is a rule engine that determines user eligibility based on attributes such as age, department, salary, and experience. It uses an Abstract Syntax Tree (AST) to represent and manage conditional rules, allowing for dynamic rule creation, combination, and evaluation.

<img width="943" alt="image" src="https://github.com/user-attachments/assets/475ad933-e889-49e8-83de-cffddbe93b3b">

## Features

- **Create Rules:** Define rules using a string format that gets converted into an AST.


  <img width="377" alt="image" src="https://github.com/user-attachments/assets/c43c8035-1ffc-44db-bd08-bf318f855d1f">


- **Combine Rules:** Combine multiple rules into a single AST for more complex evaluations.
  
  <img width="376" alt="image" src="https://github.com/user-attachments/assets/e442140c-50e6-441c-a83a-87e22a848cd2">

- **Evaluate Rules:** Check if the given data meets the criteria defined by the AST.

  <img width="375" alt="image" src="https://github.com/user-attachments/assets/75d39c14-683e-45b8-8efe-7694c83dfaff">


- **Tree Visualization:** Define or Combine Rule would should show Tree Representation.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB installed and running

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Ad1tyaKumar/rule-engine
   cd rule-engine
   ```

2. **Install Backend Dependencies**

   ```bash
   npm install
   ```
   
3. **Start MongoDB**

   Ensure that MongoDB is running on your local machine:

   ```bash
   mongod
   ```
5. **Create and initialize .env file**
    Add the following fields in the .env file
   ```bash
   MONGO_URI={Your mongo db cluster connection URL}
   PORT=3000
   ```

6. **Start the Project**

   ```bash
   npm start
   ```

## Using the app

1.) Add the rules by providing the rule name and rule
```bash
Rule Name: rule1
Rule: ((age > 30 AND department = 'Sales') OR (age < 25 AND
department = 'Marketing')) AND (salary > 50000 OR experience >
5)
```

2.) Evaluate JSON data based on the added rules

## API Endpoints

1. **Create a Rule**
   - **Endpoint:** `/api/create_rule`
   - **Method:** POST
   - **Body:**

     ```json
     {
       "ruleString": "((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)",
       "ruleName": "Rule 1"
     }
     ```
use appropriate spaces in Rules for correct results.

Rule should be in follow format:
variable operator value 

   - **Response:**

     ```json
     {
       "_id": "605c72ef1f4e3a001f4d2e9a",
       "rule_name": "Rule1",
       "rule_ast": { ... }
     }
     ```

2. **Combine Rules**
   - **Endpoint:** `/api/rules/combine_rules`
   - **Method:** POST
   - **Body:**

     ```json
     {
       "ruleIds": ["605c72ef1f4e3a001f4d2e9a", "605c730f1f4e3a001f4d2e9b"]
       "operators: op
     }
     ```
   - **Response:**

     ```json
     {
       "type": "operator",
       "value": operator,
       "left": { ... },
       "right": { ... }
     }
     ```

3. **Evaluate a Rule**
   - **Endpoint:** `/api/rules/evaluate_rule`
   - **Method:** POST
   - **Body:**

     ```json
     {
       "rule": { ... },
       "data": {
         "age": 35,
         "department": "Sales",
         "salary": 60000,
         "experience": 3
       }
     }
     ```
   - **Response:**

     ```json
     {
       "result": true
     }
     ```
