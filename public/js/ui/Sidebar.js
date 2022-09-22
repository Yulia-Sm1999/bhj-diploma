/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    let sidebarBody = document.querySelector('.sidebar-mini');
    let sidebarMenu = document.querySelector('.sidebar-toggle');
    sidebarMenu.addEventListener('click', () => {
      if (sidebarBody.classList.contains('sidebar-open', 'sidebar-collapse')) {
        sidebarBody.classList.remove('sidebar-open', 'sidebar-collapse');
      } else {
        sidebarBody.classList.add('sidebar-open', 'sidebar-collapse');
      }
    })
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const registerElem = document.querySelector('.menu-item_register a');
    registerElem.addEventListener('click', () => {
      const registerForm = App.getModal('register');
      registerForm.open();
    });

    const loginElem = document.querySelector('.menu-item_login a');
    loginElem.addEventListener('click', () => {
      const loginForm = App.getModal('login');
      loginForm.open();
    });

    const logoutElem = document.querySelector('.menu-item_logout a');
    logoutElem.addEventListener('click', () => {
      User.logout((response) => {
        if (response.success == true) {
          App.setState('init');
        }
      });
    })
  }
}