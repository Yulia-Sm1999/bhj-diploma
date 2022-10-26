/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {    
    Account.list(User.current(), response => {
      // console.log(response);
      if (response.success == true) {
        const accountsListForIncome = document.getElementById('income-accounts-list');
        const accountsListForExpense = document.getElementById('expense-accounts-list');

        function formList(accountsListForIncome) {
          accountsListForIncome.innerHTML = '';
          response.data.forEach(account => {
            accountsListForIncome.insertAdjacentHTML('beforeend', `<option value="${account.id}">${account.name}</option>`)
            });
          }
        formList(accountsListForIncome);
        formList(accountsListForExpense);
      }
    })
  };

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, response => {
      console.log(response)
      if (response.success == true) {
        const incomeModal = App.getModal('newIncome');
        const expenseModal = App.getModal('newExpense');

        ((incomeModal.element.style.display == 'block') ? incomeModal : expenseModal).close();
        // if (incomeModal.element.style.display == 'block') {
        //   incomeModal.close();
        // } else if(expenseModal.element.style.display == 'block') {
        //   expenseModal.close();
        // }

        App.update();
      }
    });
  }
}