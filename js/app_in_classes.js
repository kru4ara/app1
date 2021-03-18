class App {

  data = [] // Массив со всеми данными

  constructor() {
    this.formElement = document.querySelector('.js-form') // Форма
    this.openFormButtonElement = document.querySelector('.js-open-form') // Кнопка открытия формы
    this.closeFormButtonElement = document.querySelector('.js-close-form') // Кнопка закрытия формы
    this.addItemButtonElement = document.querySelector('.js-add-item') // Кнопка добавления елементов в список
    this.openFilterElement = document.querySelector('.js-open-filter-form') // Кнопка открытия фильтра

    this.listWrapElement = document.querySelector('.js-list-wrap') // Подложка списка
    this.inputElement = document.querySelector('.js-input') // Поле ввода имени и фамилии
    this.selectDischargeElement = document.querySelector('.js-select') // Список разрядов
    this.inputNumberElement = document.querySelector('.js-input-number') // Поле ввода отработанных часов

    this.formFilterElement = document.querySelector('.js-form-filter') // Форма-фильтр
    this.inputSearchElement = document.querySelector('.js-input-search') // Поле поиска
    this.openFormFilterButtonElement = document.querySelector('.js-open-filter-form') //Кнопна открытия фильтра
    this.selectSortElement = document.querySelector('.js-select-sort') // Поле сортировки

    this.eventListeners()
  }


  //-------------------------------------------------------------------------------------------------


  eventListeners() {
    this.openFormButtonElement.addEventListener('click', this.handleClickOpenFormButton.bind(this)) // Открытие формы
    this.closeFormButtonElement.addEventListener('click', this.handleClickCloseFormButton.bind(this)) // Закрытие формы
    this.formElement.addEventListener('submit', this.handleSubmitAddItemButton.bind(this)) // Добавление элементов в массив data[]
    this.inputSearchElement.addEventListener('input', this.handleInputSearch.bind(this)) // Поиск элемента
    this.openFormFilterButtonElement.addEventListener('click', this.handleClickToggleFormFilterButton.bind(this)) // Открытие/Закрытие формы-фильтра
    this.selectSortElement.addEventListener('change', this.handleChangeSelectSort.bind(this)) // Сортировка элементов
  }


  handleInputSearch({ target }) {
    const { value } = target

    const resultSearch = this.data.filter((item) => {
      if (item.content.includes(value)) {
        return true
      }
      return false
    })
    if (resultSearch.length) {
      this.createList(resultSearch)
    } else {
      this.listWrapElement.innerHTML = '<div class="text-muted">Совпадений не найдено.</div>'
    }
  }

  handleChangeSelectSort({ target }) {
    const { value } = target

    const resultSort = this.data.sort((a, b) => {
      return b[value] - a[value]
    })
    this.createList(resultSort)
  }

  handleClickToggleFormFilterButton() {
    this.formFilterElement.classList.toggle('island__item_hidden')
  }

  handleClickOpenFormButton() {
    this.formElement.classList.remove('island__item_hidden')
  }

  handleClickCloseFormButton() {
    this.formElement.classList.add('island__item_hidden')
  }

  handleSubmitAddItemButton(event) {
    event.preventDefault()

    const content = this.inputElement.value.trim()
    const date = this.buildDate()
    const time = this.buildTime()
    const discharge = this.selectDischargeElement.value
    const hoursWorked = this.inputNumberElement.value

    if (content) {
      this.data.push({ content, hoursWorked, discharge, date, time })
      //this.inputElement.value = '' // очистить поле
      this.formElement.reset() // очистка формы

      this.createList(this.data)
    } else {
      alert('Заполните Поле!')
    }
  }

  handleClickRemoveButton(event) {
    const { target } = event

    if (target.tagName == 'BUTTON') {
      const { index } = target.dataset

      this.data.splice(index, 1)
      this.createList(this.data)
    }
  }

  createListItem({ content, hoursWorked, discharge, date, time }, index) {
    const template = `
    <li class="list__item" data-index="${index}">
      <span class="badge bg-secondary name">${content}</span>
      <span class="badge bg-warning text-dark ms-auto me-4">${hoursWorked} ч.</span>
      <span class="badge bg-primary text-warning me-4">${this.renderDischarge(discharge)}</span>
      <span class="text-muted me-3">${date}</span>
      <span class="badge rounded-pill bg-dark me-3">${time}</span>
      <button class="btn btn-danger btn-sm" data-index="${index}">&times;</button>
    </li>
    `
    return template
  }

  createList(data = []) {
    const listElement = document.createElement('ol')
    listElement.classList.add('list')

    this.listWrapElement.innerHTML = ''
    data.forEach((item, index) => {
      listElement.innerHTML = listElement.innerHTML + this.createListItem(item, index)
    })

    listElement.addEventListener('click', this.handleClickRemoveButton.bind(this))

    this.listWrapElement.append(listElement)
  }

  renderDischarge(counter) {
    const template = `
      <svg width="1em" height="1em">
        <use xlink:href="#award"></use>
      </svg>
    `
    let result = ''

    for (let i = 0; i < counter; i++) {
      result += template
    }
    return result
  }

  buildTime() {
    const date = new Date()

    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()

    const timeNow = `${hours}:${minutes}:${seconds}`
    return timeNow
  }

  buildDate() {
    const date = new Date()

    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    const year = date.getFullYear()

    const dateNow = `${day}.${month}.${year}`
    return dateNow
  }
}

new App()
