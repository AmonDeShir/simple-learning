import { userReducer, setUserData } from './user';

describe(`users`, () => {
  describe(`setUserData`, () => {
    it(`should set user data`, async () => {
      const response = userReducer(
        { name: '', sync: false,}, 
        setUserData({
          sync: true,
          name: 'John Doe',
      }));

      expect(response).toEqual({
        name: 'John Doe',
        sync: true,
      });
    });
  })
})