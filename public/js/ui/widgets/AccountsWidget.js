/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (!element) {
      throw new Error('Ошибка! Элемент не найден');
    } else {
      this.element = element;
      this.registerEvents();
      this.update();
    }
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const accountToCreate = this.element.querySelector('.create-account');
    accountToCreate.addEventListener('click', () => {
      App.getModal('createAccount').open();
    });
    
    let createdAccounts = [...this.element.querySelectorAll('.account')];
    if (createdAccounts) {
      createdAccounts.forEach(account => {
        account.addEventListener('click', () => {
          this.onSelectAccount(account);
        });
      });
    }
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if (User.current()) {
      Account.list(User.current(), response => {
        if (response.success == true) {
          this.clear();
          response.data.forEach(account => {
            this.renderItem(account);
          });
          this.registerEvents();
        }
      })
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    [...document.querySelectorAll('.account')].forEach(account => account.remove());
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    let activeAccounts = [...document.querySelectorAll('.active')];
    if (activeAccounts) {
      activeAccounts.forEach(el => el.classList.remove('active'));
    };    

    element.classList.add('active');
    App.showPage( 'transactions', { account_id: element.dataset.id });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    let accountToInsert = `
      <li class="active account" data-id=${item.id}>
        <a href="#">
            <span>${item.name}</span> /
            <span>${item.sum} ₽</span>
        </a>
      </li>
    `
    this.element.insertAdjacentHTML('beforeend', accountToInsert);
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    this.getAccountHTML(data);
  }
}
