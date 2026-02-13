// eslint.config.js - ESLint 9.x Flat Config Format
const js = require('@eslint/js');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = [
  // Base recommended config
  js.configs.recommended,
  
  // Prettier integration (disables conflicting rules)
  eslintConfigPrettier,
  
  // Project-specific configuration
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        // Node.js globals
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly',
        
        // Mocha globals
        describe: 'readonly',
        it: 'readonly',
        before: 'readonly',
        after: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        context: 'readonly',
        specify: 'readonly',
      },
    },
    
    rules: {
      // Variables
      'no-unused-vars': ['error', { 
        argsIgnorePattern: '^_', 
        varsIgnorePattern: '^_' 
      }],
      'no-var': 'error',
      'prefer-const': 'warn',
      'no-undef': 'error',
      
      // Code quality
      'no-console': 'off', // Allow console.log in Node.js
      'eqeqeq': 'warn',
      'curly': 'warn',
      'consistent-return': 'warn',
      'no-empty-function': 'warn',
      'require-await': 'warn',
      
      // ES6+ features
      'arrow-spacing': 'error',
      'no-duplicate-imports': 'error',
      'prefer-template': 'warn',
      'template-curly-spacing': 'error',
    },
  },
  
  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      '.cursor/**',
      'package-lock.json',
    ],
  },
];
