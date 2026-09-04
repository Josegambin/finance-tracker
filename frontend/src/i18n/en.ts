const en = {
  translation: {
    // =========================
    // NAVBAR
    // =========================
    nav: {
      dashboard: 'Dashboard',
      categories: 'Categories',
      transactions: 'Transactions',
      budgets: 'Budgets', // Added
      logout: 'Logout'
    },

    // =========================
    // COMMON
    // =========================
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      retry: 'Retry',
      unableToLoad: 'Unable to load',
      unexpectedError: 'Unexpected error',
      errorCreating: 'Error creating',
      errorDeleting: 'Error deleting',
      tryAgain: 'Please try again.',
      updating: 'Updating...'
    },

    // =========================
    // TRANSACTIONS
    // =========================
    transactions: {
      title: 'Transactions',
      description: 'Track your income and expenses.',
      addTransaction: 'Add transaction',
      yourTransactions: 'Your transactions',
      transactionsCount: '{{count}} transactions',
      search: 'Search',
      searchPlaceholder: 'Search transactions...',
      type: 'Type',
      category: 'Category',
      month: 'Month',
      sortBy: 'Sort by',
      allTypes: 'All types',
      allCategories: 'All categories',
      allMonths: 'All months',
      income: 'Income',
      expense: 'Expense',
      newestFirst: 'Date — Newest first',
      oldestFirst: 'Date — Oldest first',
      highestAmount: 'Amount — Highest first',
      lowestAmount: 'Amount — Lowest first',
      descriptionAZ: 'Description — A → Z',
      descriptionZA: 'Description — Z → A',
      noTransactions: 'No transactions yet',
      noTransactionsDescription: 'Add your first income or expense to start tracking your finances.',
      created: 'Transaction created successfully.',
      clearFilters: 'Clear filters',
      previous: 'Previous',
      next: 'Next',
      page: 'Page',
      of: 'of',
      loading: 'Loading transactions...',
      financeManagement: 'FINANCE MANAGEMENT',
      exporting: 'Exporting...',
      exportCsv: 'Export CSV',
      // Added for the forms
    // description: 'Description',
      amount: 'Amount',
      date: 'Date',
      noCategoriesAvailable: 'No categories available'
    },

    // =========================
    // CATEGORIES
    // =========================
    categories: {
      title: 'Categories',
      description: 'Manage your income and expense categories.',
      addCategory: 'Add category',
      yourCategories: 'Your categories',
      income: 'Income',
      expense: 'Expense',
      count: '{{count}} categories',
      // Added for the components
      noCategories: 'No categories yet',
      noCategoriesDescription: 'Create your first category to start organizing your finances.',
      created: 'Category created successfully.',
      namePlaceholder: 'Category name'
    },

    // =========================
    // BUDGETS
    // =========================
    budgets: {
      title: 'Budgets',
      description: 'Control your monthly spending.',
      createBudget: 'Create budget',
      yourBudgets: 'Your budgets',
      trackSpending: 'Track your spending by category.',
      totalBudget: 'Total budget',
      totalSpent: 'Total spent',
      remaining: 'Remaining',
      count: '{{count}} budgets',
      noBudgets: 'No budgets yet',
      noBudgetsDescription: 'Create your first monthly budget.',
      noBudgetsForMonth: 'No budgets for this month',
      noBudgetsForMonthDescription: 'Create a budget to start tracking your spending.',
      created: 'Budget created successfully.',
      budgetManagement: 'BUDGET MANAGEMENT',
      // Added for the components
      selectCategory: 'Select category',
      deleteBudget: 'Delete budget',
      overBudget: 'Over budget'
    },

    // =========================
    // DASHBOARD
    // =========================
    dashboard: {
      title: 'Dashboard',
      description: 'Overview of your finances.',
      balance: 'Balance',
      income: 'Income',
      expenses: 'Expenses',
      recentTransactions: 'Recent transactions',
      expensesByCategory: 'Expenses by category',
      whereMoneyGoing: 'Where your money is going.',
      budgetVsSpent: 'Budget vs spent',
      compareBudget: 'Compare your budget with your actual spending.',
      latestActivity: 'Your latest financial activity.',
      financeOverview: 'FINANCE OVERVIEW',
      // Added for the charts
      noExpenseData: 'No expense data available.',
      noBudgetData: 'No budget data available.'
    },

    // =========================
    // AUTH
    // =========================
    auth: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      username: 'Username',
      loginButton: 'Login',
      registerButton: 'Create account',
      logout: 'Logout',
      loggingIn: 'Logging in...',
      creatingAccount: 'Creating account...',
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?'
    }
  }
};

export default en;