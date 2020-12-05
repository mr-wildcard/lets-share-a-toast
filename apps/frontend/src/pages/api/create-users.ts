import 'isomorphic-unfetch';
import faker from 'faker';

export default async (req, res) => {
  const users = new Array(10).fill(0).map(() => ({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
  }));

  try {
    await Promise.all(
      users.map((user) => {
        fetch('http://localhost:8080/users', {
          headers: {
            'content-type': 'application/json',
            Cookie: '',
          },
          body: JSON.stringify(user),
          method: 'POST',
        });
      })
    );
  } catch (error) {
    console.log(error);
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(users));
};
