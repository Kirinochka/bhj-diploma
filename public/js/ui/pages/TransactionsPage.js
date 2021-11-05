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
    if (!element) throw new Error('Пустой элемент');
    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render();
    if (this.lastOptions) {
      this.render(this.lastOptions);
    }
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    // const removeBtn = this.element.querySelector('.remove-account');
    // const transactionBtn = this.element.querySelector('.transaction__remove');
    // removeBtn.addEventListener('click', () => {
    //   this.removeAccount();
    // });
    // transactionBtn && transactionBtn.addEventListener('click', () => {
    //   console.log(transactionBtn.dataset.id)
    //   this.removeTransaction(transactionBtn.dataset.id)
    // });
    this.element.addEventListener('click', ({target}) => {
      if (target.matches('.remove-account')) {
        this.removeAccount();
      }
      if (target.matches('.transaction__remove')) {
        this.removeTransaction(target.dataset.id);
      }
    })
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets(),
   * либо обновляйте только виджет со счетами
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions) return;
    const isDelete = confirm('Вы действительно хотите удалить счёт?');
    if (isDelete) {
      Account.remove(this.lastOptions, (err, res) => {
        console.log(err)
        if (!res) return;
        App.updateWidgets();
      })
      this.clear();
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    const isDelete = confirm('Вы действительно хотите удалить транзакцию?');
    if (isDelete) {
      Transaction.remove(id, (err, res) => {
        if (!res) return;
        App.update();
      })
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if (!options) return;
    this.lastOptions = options;
    Account.get(options.account_id, (err, res) => {
      if (!res) return;
      this.renderTitle(res.data.name);
    });
    Transaction.list(options, (err, res) => {
      if (!res) return;
      this.renderTransactions(res.data)
    })
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    this.element.querySelector('.content-title')
      .textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const rawDate = new Date(date);
    const day = rawDate.getDate();
    const month = rawDate.getMonth();
    const year = rawDate.getFullYear();
    const hours = rawDate.getHours();
    const minutes = rawDate.getMinutes();
    const nameOfMonths = [
      'Января',
      'Февраля',
      'Марта',
      'Апреля',
      'Мая',
      'Июня',
      'Июля',
      'Июня',
      'Августа',
      'Сентября',
      'Октября',
      'Ноября',
      'Декабря'
    ];
    const formatedDate = `
      ${day} ${nameOfMonths[month]} ${year} г. ${hours < 10 ? '0' + hours: hours}:${minutes < 10 ? '0' + minutes : minutes}
    `;
    return formatedDate;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    const { created_at, id, name, sum, type } = item;
    const date = this.formatDate(created_at);
    const transationClass = type === 'income' ? 'transaction_expense' : 'transaction_income';
    const template = document.createElement('template');
    template.innerHTML = `
      <div class="transaction ${transationClass} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
              <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
              <h4 class="transaction__title">${name}</h4>
              <!-- дата -->
              <div class="transaction__date">${date}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
          <!--  сумма -->
              ${sum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
            <!-- в data-id нужно поместить id -->
            <button class="btn btn-danger transaction__remove" data-id=${id}>
                <i class="fa fa-trash"></i>  
            </button>
        </div>
    </div>
    `;
    return template.content;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const content = this.element.querySelector('.content');
    if (data.length === 0) {
      content.remove();
    } else {
      data.forEach(item => {
        content.append(this.getTransactionHTML(item));
      })
    }
  }
}