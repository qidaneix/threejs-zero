/**
 * @description localstorage当数据库用
 */
export class DataBase {
  private static readonly KEY = 'objects';

  private static connect(): Record<string, unknown>[] {
    try {
      const str = localStorage.getItem(this.KEY);
      if (!str) throw new Error('no str');

      const arr = JSON.parse(str);
      if (!Array.isArray(arr)) throw new Error('not arr');

      return arr;
    } catch {
      const arr: Record<string, unknown>[] = [];
      localStorage.setItem(this.KEY, JSON.stringify(arr));

      return arr;
    }
  }

  static getList() {
    return this.connect();
  }

  static query(id: string) {
    const arr = this.connect();

    return arr.find((item) => item.id === id);
  }

  static insert(object: Record<string, unknown>) {
    const arr = this.connect();
    arr.push(object);
    localStorage.setItem(this.KEY, JSON.stringify(arr));
  }

  static update(id: string, object: Record<string, unknown>) {
    const arr = this.connect();

    const index = arr.findIndex((item) => item.id === id);
    arr[index] = { ...object, id };
    localStorage.setItem(this.KEY, JSON.stringify(arr));
  }

  static delete(id: string) {
    const arr = this.connect();

    const index = arr.findIndex((item) => item.id === id);
    arr.splice(index, 1);
    localStorage.setItem(this.KEY, JSON.stringify(arr));
  }
}
