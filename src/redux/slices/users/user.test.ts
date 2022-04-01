import userReducer, { hideLoginPage, openLoginPage, setUserData } from './user';

describe(`users`, () => {
  describe(`setUserData`, () => {
    it(`should set user data`, async () => {
      const response = userReducer(
        { email: '', name: '', synchronize: false, loginPage: false }, 
        setUserData({
          email: '123',
          name: 'John Doe',
          synchronize: true,
      }));

      expect(response).toEqual({
        email: '123',
        name: 'John Doe',
        synchronize: true,
        loginPage: false
      });
    });

    it(`should set loginPage to true`, () => {
      const response = userReducer(
        { email: '', name: '', synchronize: false, loginPage: false }, 
        openLoginPage()
      );

      expect(response).toEqual({
        email: '',
        name: '',
        synchronize: false,
        loginPage: true
      });
    });

    it(`should set loginPage to false`, () => {
      const response = userReducer(
        { email: '', name: '', synchronize: false, loginPage: true }, 
        hideLoginPage()
      );

      expect(response).toEqual({
        email: '',
        name: '',
        synchronize: false,
        loginPage: false
      });
    });
  })
})