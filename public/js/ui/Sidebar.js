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
    const btn = document.querySelector('.sidebar-toggle');
    const body = document.body;
    function func() {
      body.classList.toggle('sidebar-open');
      body.classList.toggle('sidebar-collapse');
    }
    btn.addEventListener('click', func);
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const registerModal = App.getModal('register');
    const loginModal = App.getModal('login');
    const loginBtn = document.querySelector('.menu-item_login');
    const regBtn = document.querySelector('.menu-item_register');
    // const logoutBtn = document.querySelector('')
    regBtn.addEventListener('click', e => {
      e.preventDefault();
      registerModal.open();
    })
    loginBtn.addEventListener('click', e => {
      e.preventDefault();
      loginModal.open();
    })
  }
}