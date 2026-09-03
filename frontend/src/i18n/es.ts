const es = {
  translation: {
    // =========================
    // NAVBAR
    // =========================
    nav: {
      dashboard: 'Panel',
      categories: 'Categorías',
      transactions: 'Transacciones',
      budgets: 'Presupuestos', // Añadido
      logout: 'Cerrar sesión'
    },

    // =========================
    // COMMON
    // =========================
    common: {
      loading: 'Cargando...',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      retry: 'Reintentar',
      unableToLoad: 'No se pudo cargar',
      unexpectedError: 'Error inesperado',
      errorCreating: 'Error al crear',
      errorDeleting: 'Error al eliminar',
      tryAgain: 'Por favor, inténtalo de nuevo.',
      updating: 'Actualizando...'
    },

    // =========================
    // TRANSACTIONS
    // =========================
    transactions: {
      title: 'Transacciones',
      description: 'Controla tus ingresos y gastos.',
      addTransaction: 'Añadir transacción',
      yourTransactions: 'Tus transacciones',
      transactionsCount: '{{count}} transacciones',
      search: 'Buscar',
      searchPlaceholder: 'Buscar transacciones...',
      type: 'Tipo',
      category: 'Categoría',
      month: 'Mes',
      sortBy: 'Ordenar por',
      allTypes: 'Todos los tipos',
      allCategories: 'Todas las categorías',
      allMonths: 'Todos los meses',
      income: 'Ingreso',
      expense: 'Gasto',
      newestFirst: 'Fecha — Más recientes',
      oldestFirst: 'Fecha — Más antiguas',
      highestAmount: 'Importe — Mayor primero',
      lowestAmount: 'Importe — Menor primero',
      descriptionAZ: 'Descripción — A → Z',
      descriptionZA: 'Descripción — Z → A',
      noTransactions: 'No hay transacciones',
      noTransactionsDescription: 'Añade tu primer ingreso o gasto para comenzar a controlar tus finanzas.',
      clearFilters: 'Limpiar filtros',
      previous: 'Anterior',
      next: 'Siguiente',
      page: 'Página',
      of: 'de',
      loading: 'Cargando transacciones...',
      financeManagement: 'GESTIÓN FINANCIERA',
      exporting: 'Exportando...',
      exportCsv: 'Exportar CSV',
      // Añadidas para los formularios
      //description: 'Descripción',
      amount: 'Importe',
      date: 'Fecha',
      noCategoriesAvailable: 'No hay categorías disponibles'
    },

    // =========================
    // CATEGORIES
    // =========================
    categories: {
      title: 'Categorías',
      description: 'Gestiona tus categorías de ingresos y gastos.',
      addCategory: 'Añadir categoría',
      yourCategories: 'Tus categorías',
      income: 'Ingresos',
      expense: 'Gastos',
      count: '{{count}} categorías',
      // Añadidas para los componentes
      noCategories: 'No hay categorías',
      noCategoriesDescription: 'Crea tu primera categoría para empezar a organizar tus finanzas.',
      namePlaceholder: 'Nombre de la categoría'
    },

    // =========================
    // BUDGETS
    // =========================
    budgets: {
      title: 'Presupuestos',
      description: 'Controla tus gastos mensuales.',
      createBudget: 'Crear presupuesto',
      yourBudgets: 'Tus presupuestos',
      trackSpending: 'Controla tus gastos por categoría.',
      totalBudget: 'Presupuesto total',
      totalSpent: 'Total gastado',
      remaining: 'Restante',
      count: '{{count}} presupuestos',
      noBudgets: 'No hay presupuestos',
      noBudgetsDescription: 'Crea tu primer presupuesto mensual.',
      noBudgetsForMonth: 'No hay presupuestos para este mes',
      noBudgetsForMonthDescription: 'Crea un presupuesto para empezar a controlar tus gastos.',
      budgetManagement: 'GESTIÓN DE PRESUPUESTOS',
      // Añadidas para los componentes
      selectCategory: 'Seleccionar categoría',
      deleteBudget: 'Eliminar presupuesto',
      overBudget: 'Sobrepasado'
    },

    // =========================
    // DASHBOARD
    // =========================
    dashboard: {
      title: 'Panel',
      description: 'Resumen de tus finanzas.',
      balance: 'Balance',
      income: 'Ingresos',
      expenses: 'Gastos',
      recentTransactions: 'Transacciones recientes',
      expensesByCategory: 'Gastos por categoría',
      whereMoneyGoing: 'A dónde va tu dinero.',
      budgetVsSpent: 'Presupuesto vs gastado',
      compareBudget: 'Compara tu presupuesto con tus gastos reales.',
      latestActivity: 'Tu actividad financiera más reciente.',
      financeOverview: 'RESUMEN FINANCIERO',
      // Añadidas para los gráficos
      noExpenseData: 'No hay datos de gastos disponibles.',
      noBudgetData: 'No hay datos de presupuesto disponibles.'
    },

    // =========================
    // AUTH
    // =========================
    auth: {
      login: 'Iniciar sesión',
      register: 'Registrarse',
      email: 'Correo electrónico',
      password: 'Contraseña',
      username: 'Usuario',
      loginButton: 'Entrar',
      registerButton: 'Crear cuenta',
      logout: 'Cerrar sesión',
      loggingIn: 'Iniciando sesión...',
      creatingAccount: 'Creando cuenta...',
      noAccount: '¿No tienes una cuenta?',
      haveAccount: '¿Ya tienes una cuenta?'
    }
  }
};

export default es;