export class Animal {
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

class Dog extends Animal {
  breed = ''
  bark() {}
}