// @flow

import pool from './mysql-pool';

export type NameList = {
  name: string,
  phone: number,
  time_created: number,
};

class NameService {
  /**
   * Get name with given id.
   */
  get(id: number) {
    return new Promise<?NameList>((resolve, reject) => {
      pool.query('SELECT * FROM NameList WHERE id = ?', [id], (error, results: NameList[]) => {
        if (error) return reject(error);

        resolve(results[0]);
      });
    });
  }

  /**
   * Get all names.
   */
  getAll() {
    return new Promise<NameList[]>((resolve, reject) => {
      pool.query('SELECT * FROM NameList', (error, results) => {
        if (error) return reject(error);

        resolve(results);
      });
    });
  }

  /* SQL Query for create row: 
    INSERT INTO NameList SET name='Anne', phone=56565656, time_created=NOW()
 */

  /**
   * Create new name with phone and timestamp for when created.
   */
  create(name: string, phone: number, time_created: number) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        'INSERT INTO NameList SET name=?, phone=?, time_created=NOW()',
        [name, phone, time_created],
        (error, results) => {
          if (error) return reject(error);
          if (!results.insertId) return reject(new Error('No row inserted'));

          resolve(Number(results.insertId));
        }
      );
    });
  }

  /**
   * Delete name with given id.
   */
  delete(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query('DELETE FROM NameList WHERE id = ?', [id], (error, results) => {
        if (error) return reject(error);
        if (!results.affectedRows) reject(new Error('No row deleted'));

        resolve();
      });
    });
  }
}

const nameService = new NameService();
export default nameService;
