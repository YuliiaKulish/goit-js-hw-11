import axios from 'axios';
const API_KEY = '30230166-d77a5ca1fbfdccb59d50824e5';
const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}&q=`;
const options = {
  params: {
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: '40',
  },
};
export const fetchImages = async (inputValue,pageNr) =>
 await axios
    .get(`${BASE_URL}${inputValue}&page=${pageNr}`, options)
    .then(response => {
      return response.data;
    })
    .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
        console.log(error.config);
      });