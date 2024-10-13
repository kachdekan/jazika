import firestore from '@react-native-firebase/firestore';

export async function addUserData(user) {
  console.log('Adding User Data');
  if (!user.id || !user.phone) {
    throw new Error('User Data is incomplete');
  }
  try {
    const userData = await firestore().collection('USERS').doc(user.phone).get();
    if (userData.exists) {
      return;
    }
    await firestore()
      .collection('USERS')
      .doc(user.phone)
      .set({ ...user, token: null });
  } catch (error) {
    console.log('Error adding user data', error);
  }
}

export async function addUserToken(userToken, userPhone) {
  console.log('Adding User Token');
  if (!userToken) {
    throw new Error('User Token is missing');
  }
  try {
    await firestore().collection('USERS').doc(userPhone).update({ token: userToken });
  } catch (error) {
    console.log('Error adding user token', error);
  }
}

export async function getUserData(userPhone) {
  console.log('Getting User Data');
  try {
    const user = await firestore().collection('USERS').doc(userPhone).get();
    return user.data();
  } catch (error) {
    console.log('Error getting user data', error);
  }
}
