// @flow
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Name = {
  id: number,
  name: string,
  phone: string,
};

class NameService {
  /* The functions for get(), getAll() and delete() will not be used in this application so they are commented out. However, they can be used in case there is need for a  "Show all names on list" page later so they are left in the file. If they are used later, it would also require authentication.

  // Get specific name
  get(id: number) {
    return axios.get<Name>('/names/' + id).then((response) => response.data);
  }
  // Get all names
  getAll() {
    return axios.get<Name[]>('/names').then((response) => response.data);
  } */

  /**
   * Create new name.
   */
  create(name: string, phone: string) {
    return axios
      .post<{}, { id: number }>('/names', {
        name: name,
        phone: phone,
      })
      .then((response) => response.data.id);
  }

  /*
  // Delete name
  delete(id: number) {
    return axios.delete<void>('/names/' + id).then((response) => response.data);
  } */
}

const nameService = new NameService();
export default nameService;
