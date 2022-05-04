import { userReducer, hideLoginPage, openLoginPage, setUserData } from './user';

describe(`users`, () => {
  describe(`setUserData`, () => {
    it(`should set user data`, async () => {
      const response = userReducer(
        { name: '', sync: false, loginPage: false }, 
        setUserData({
          sync: true,
          name: 'John Doe',
      }));

      expect(response).toEqual({
        name: 'John Doe',
        sync: true,
        loginPage: false
      });
    });

    it(`should set loginPage to true`, () => {
      const response = userReducer(
        { sync: false, name: '', loginPage: false }, 
        openLoginPage()
      );

      expect(response).toEqual({
        sync: false,
        name: '',
        loginPage: true
      });
    });

    it(`should set loginPage to false`, () => {
      const response = userReducer(
        { sync: false, name: '', loginPage: true }, 
        hideLoginPage()
      );

      expect(response).toEqual({
        sync: false,
        name: '',
        loginPage: false
      });
    });
  })
})