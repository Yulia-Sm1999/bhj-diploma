/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (!element) {
      throw new Error('Ошибка! Элемент не найден');
    } else {
      this.element = element;
      this.registerEvents();
      this.lastOptions;
    }
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(TransactionsPage.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeAccountBtn = this.element.querySelector('.remove-account');
    // const removeTransactionBtn = this.element.querySelector('.transaction__remove');

      removeAccountBtn.addEventListener('click', () => this.removeAccount());
      // removeTransactionBtn.addEventListener('click', () => this.removeTransaction());
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (TransactionsPage.lastOptions) {
      let confirmAnswer = confirm('Вы действительно хотите удалить счёт?');
      if (confirmAnswer == true) {
        Account.remove(TransactionsPage.lastOptions, response => {
          if (response.success == true) {
            App.updateWidgets();
            App.updateForms();
            TransactionsPage.clear();
          }
        });
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    let confirmAnswer = confirm('Вы действительно хотите удалить эту транзакцию?');
    if (confirmAnswer == true) {
      Transaction.remove(id, response => {
        if (response.success == true) {
          App.update();
        }
      })
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (options) {
      TransactionsPage.lastOptions = options;
      Account.get(TransactionsPage.lastOptions.account_id, response => {
        if (response.success == true) {
          this.renderTitle(response.data.name);
        }
      });

      Transaction.list(options, response => {
        this.renderTransactions(response.data);
      })
    } 
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle(this.options.name);
    this.lastOptions = '';
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    const accountTitle = this.element.querySelector('.content-title');
    accountTitle.innerText = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    let parsedTime = new Date(date);
    let formatedDay = parsedTime.toLocaleString('ru', {       
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });  

    let formatedTime = parsedTime.toLocaleString('ru', {    
      hour: 'numeric',
      minute: 'numeric', 
    });  

    let formatedDate = formatedDay + ' в ' + formatedTime;
    return formatedDate;
    };

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    let transactionToRender = `
    <div class="transaction ${item.type == 'income' ? 'transaction_income' : 'transaction_expense'} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
              <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
              <h4 class="transaction__title">${item.name}</h4>
              <div class="transaction__date">${this.formatDate(item.created_at)}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
          ${item.sum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
            <button class="btn btn-danger transaction__remove" data-id="${item.account_id}">
                <i class="fa fa-trash"></i>  
            </button>
        </div>
    </div>
    `
    return transactionToRender;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    let contentSection = document.querySelector('section.content');
    contentSection.innerHTML = '';
    data.forEach(transaction => {
      contentSection.insertAdjacentHTML('beforeend', this.getTransactionHTML(transaction));
    }); 
    
    let removeTransactionBtn = [...this.element.querySelectorAll('.transaction__remove')];
    for (let i = 0; i < data.length; i++) {
      removeTransactionBtn[i].addEventListener('click', () => {
        this.removeTransaction({'id': data[i].id});
      });
    }
  }
}