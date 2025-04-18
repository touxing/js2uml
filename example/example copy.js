import Animal from './example.js'
class Person extends Animal {
  name = ''
  /**
   * @private
   */
  _age = 1

  constructor(name) {
    this.name = name
  }
  speak() {}
  protected eat() {}
  protected move() {}
}

class Teacher extends Person {
  breed = ''
  bark() {}
  teach() {}
}