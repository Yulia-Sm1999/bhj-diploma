/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (!element) {
      throw new Error('Ошибка! Элемент не найден');
    } else {
      this.element = element;
      this.registerEvents();
    }
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const incomeToCreate = document.querySelector('.create-income-button');
    const expenseToCreate = document.querySelector('.create-expense-button');
    incomeToCreate.addEventListener('click', () => {
      App.getModal('newIncome').open();
    });
    expenseToCreate.addEventListener('click', () => {
      App.getModal('newExpense').open();
    });
  }
}
